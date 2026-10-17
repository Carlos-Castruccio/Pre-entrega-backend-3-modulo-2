import { randomBytes, randomInt, randomUUID } from 'node:crypto';
import { USER_ROLES, ORDER_STATUS, ORDER_PRIORITY, DELIVERY_STATUS } from '../constants/index.js';
import { AppError } from '../utils/AppError.js';
import { hashPassword } from '../utils/password.js';
import * as repository from '../repositories/mock.repository.js';

const firstNames = ['Ana', 'Luis', 'Camila', 'Mateo', 'Sofía', 'Tomás'];
const lastNames = ['Pérez', 'Gómez', 'López', 'Díaz', 'Romero', 'Torres'];
const id = () => randomBytes(12).toString('hex');
const pick = values => values[randomInt(values.length)];
const publicUser = ({ password, ...user }) => user;

export function validateQty(value = '10') {
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value) || Number(value) > 100) {
    throw new AppError('qty debe ser un entero entre 1 y 100');
  }
  return Number(value);
}

function users(qty, role) {
  const lote = randomUUID();
  return Array.from({ length: qty }, (_, index) => ({
    _id: id(), firstName: pick(firstNames), lastName: pick(lastNames),
    email: `mock.${lote}.${index}@test.com`,
    role: role ?? pick(Object.values(USER_ROLES))
  }));
}

// Todos los IDs se crean antes de guardar y se reutilizan en las referencias.
export function generateLote(qty) {
  const customers = users(qty, USER_ROLES.USER);
  const drivers = users(qty, USER_ROLES.DELIVERY_DRIVER);
  const orders = customers.map((customer, index) => ({
    _id: id(), user: customer._id, address: `Av. de Prueba ${100 + index}`,
    description: `Paquete de prueba ${index + 1}`,
    status: pick(Object.values(ORDER_STATUS)), priority: pick(Object.values(ORDER_PRIORITY))
  }));
  const deliveries = orders.map((order, index) => {
    const status = {
      [ORDER_STATUS.PENDING]: DELIVERY_STATUS.PENDING,
      [ORDER_STATUS.IN_TRANSIT]: DELIVERY_STATUS.ASSIGNED,
      [ORDER_STATUS.DELIVERED]: DELIVERY_STATUS.DELIVERED,
      [ORDER_STATUS.CANCELLED]: DELIVERY_STATUS.CANCELLED
    }[order.status];
    const assigned = status === DELIVERY_STATUS.ASSIGNED || status === DELIVERY_STATUS.DELIVERED;
    return { _id: id(), order: order._id, driver: assigned ? drivers[index]._id : null, status };
  });
  return { users: [...customers, ...drivers], orders, deliveries };
}

export function preview(entity, qty) {
  if (entity === 'users') return users(qty);
  if (entity === 'drivers') return users(qty, USER_ROLES.DELIVERY_DRIVER);
  const lote = generateLote(qty);
  // Incluir las entidades relacionadas para poder comprobar los vínculos sin MongoDB.
  if (entity === 'orders') return { users: lote.users.filter(user => user.role === USER_ROLES.USER), orders: lote.orders };
  return lote;
}

export async function seed(qty, collection = 'users') {
  if (!['users', 'all'].includes(collection)) {
    throw new AppError('collection debe ser users o all');
  }
  const lote = collection === 'users'
    ? { users: users(qty), orders: [], deliveries: [] }
    : generateLote(qty);
  // Una contraseña aleatoria por usuario, conservando el hash del módulo 1.
  for (const user of lote.users) user.password = await hashPassword(randomUUID());
  await repository.insertLote(lote);
  if (collection === 'users') return { insertados: lote.users.length, coleccion: 'usuarios' };
  return {
    insertados: lote.users.length + lote.orders.length + lote.deliveries.length,
    colecciones: { usuarios: lote.users.length, pedidos: lote.orders.length, entregas: lote.deliveries.length },
    datos: { ...lote, users: lote.users.map(publicUser) }
  };
}
