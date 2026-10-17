import { User } from '../models/user.model.js';

// Las consultas solo devuelven los campos públicos del usuario.
const fields = 'firstName lastName email role createdAt updatedAt';

export function getAll() {
  return User.find().select(fields).sort({ _id: 1 }).lean();
}

export function getById(id) {
  return User.findById(id).select(fields).lean();
}

export async function create(data) {
  const user = await User.create(data);
  const publicUser = user.toObject();
  // select:false no se aplica a la respuesta de create.
  delete publicUser.password;
  return publicUser;
}

export function update(id, data) {
  return User.findByIdAndUpdate(id, { $set: data }, {
    returnDocument: 'after',
    runValidators: true
  }).select(fields).lean();
}

export function remove(id) {
  return User.findByIdAndDelete(id).select(fields).lean();
}
