import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import { Delivery } from '../models/delivery.model.js';

export async function connectDatabase(uri) {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  // Esperamos al índice único de email antes de aceptar altas.
  await User.init();
  await Delivery.init();
  console.log('MongoDB conectado');
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
