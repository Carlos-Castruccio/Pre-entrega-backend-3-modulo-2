import * as productRepository from '../repositories/product.repository.js';
import { PRODUCT_STATUS } from '../constants/index.js';
import { AppError } from '../utils/AppError.js';
import { validateBody, validateId, validateText } from './validation.js';

function prepareProduct(body, isUpdate = false) {
  validateBody(body, ['name', 'description', 'price', 'stock']);
  const data = { ...body };

  if (!isUpdate || 'name' in data) data.name = validateText(data.name, 'name');
  if ('description' in data) {
    if (typeof data.description !== 'string') {
      throw new AppError('description debe ser texto');
    }
    data.description = data.description.trim();
  }
  if (!isUpdate || 'price' in data) {
    if (typeof data.price !== 'number' || !Number.isFinite(data.price) || data.price < 0) {
      throw new AppError('price debe ser un número mayor o igual a cero');
    }
  }
  if (!isUpdate || 'stock' in data) {
    if (!Number.isSafeInteger(data.stock) || data.stock < 0) {
      throw new AppError('stock debe ser un entero mayor o igual a cero');
    }
    // Esta regla de negocio pertenece al Service, no a la base de datos.
    data.status = data.stock > 0 ? PRODUCT_STATUS.AVAILABLE : PRODUCT_STATUS.OUT_OF_STOCK;
  }
  return data;
}

export function getAll(status) {
  if (status !== undefined && !Object.values(PRODUCT_STATUS).includes(status)) {
    throw new AppError('Estado de producto inválido');
  }
  return productRepository.getAll(status);
}

export async function getById(id) {
  validateId(id);
  const product = await productRepository.getById(id);
  if (!product) throw new AppError('Producto no encontrado', 404);
  return product;
}

export function create(body) {
  return productRepository.create(prepareProduct(body));
}

export async function update(id, body) {
  validateId(id);
  const product = await productRepository.update(id, prepareProduct(body, true));
  if (!product) throw new AppError('Producto no encontrado', 404);
  return product;
}

export async function remove(id) {
  validateId(id);
  const product = await productRepository.remove(id);
  if (!product) throw new AppError('Producto no encontrado', 404);
  return product;
}
