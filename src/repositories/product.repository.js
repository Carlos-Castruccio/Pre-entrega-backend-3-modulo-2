import { Product } from '../models/product.model.js';

const fields = 'name description price stock status createdAt updatedAt';

export function getAll(status) {
  const filter = {};
  if (status) filter.status = status;
  return Product.find(filter).select(fields).sort({ _id: 1 }).lean();
}

export function getById(id) {
  return Product.findById(id).select(fields).lean();
}

export async function create(data) {
  const product = await Product.create(data);
  return product.toObject();
}

export function update(id, data) {
  return Product.findByIdAndUpdate(id, { $set: data }, {
    returnDocument: 'after',
    runValidators: true
  }).select(fields).lean();
}

export function remove(id) {
  return Product.findByIdAndDelete(id).select(fields).lean();
}
