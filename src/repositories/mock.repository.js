import { User } from '../models/user.model.js';
import { Order } from '../models/order.model.js';
import { Delivery } from '../models/delivery.model.js';

// Validar todo antes de escribir; compensar únicamente los IDs de este lote.
// Funciona también en MongoDB standalone, sin exigir replica set.
export async function insertLote(lote) {
  for (const data of lote.users) await new User(data).validate();
  for (const data of lote.orders) await new Order(data).validate();
  for (const data of lote.deliveries) await new Delivery(data).validate();
  try {
    await User.insertMany(lote.users, { ordered: true });
    if (lote.orders.length) await Order.insertMany(lote.orders, { ordered: true });
    if (lote.deliveries.length) await Delivery.insertMany(lote.deliveries, { ordered: true });
  } catch (error) {
    // Orden inverso a la inserción para no dejar referencias a registros eliminados.
    try {
      await Delivery.deleteMany({ _id: { $in: lote.deliveries.map(item => item._id) } });
      await Order.deleteMany({ _id: { $in: lote.orders.map(item => item._id) } });
      await User.deleteMany({ _id: { $in: lote.users.map(item => item._id) } });
    } catch (cleanupError) {
      console.error('No se pudo limpiar el lote de mocks:', cleanupError.message);
    }
    throw error;
  }
}
