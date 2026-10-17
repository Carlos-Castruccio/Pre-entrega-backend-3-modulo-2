import { AppError } from '../utils/AppError.js';

export function validateId(id) {
  if (typeof id !== 'string' || !/^[a-f\d]{24}$/i.test(id)) {
    throw new AppError('El ID debe tener 24 caracteres hexadecimales');
  }
}

export function validateBody(body, allowedFields) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new AppError('El cuerpo debe ser un objeto JSON');
  }
  const keys = Object.keys(body);
  if (keys.length === 0) throw new AppError('Debes enviar al menos un campo');
  for (const key of keys) {
    if (!allowedFields.includes(key)) {
      throw new AppError(`El campo ${key} no está permitido`);
    }
  }
}

export function validateText(value, field) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new AppError(`${field} debe ser un texto no vacío`);
  }
  return value.trim();
}
