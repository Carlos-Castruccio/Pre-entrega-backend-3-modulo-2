import * as service from '../services/mock.service.js';
import { AppError } from '../utils/AppError.js';

function validateQuery(query, allowed) {
  if (Object.keys(query).some(key => !allowed.includes(key))) {
    throw new AppError('Parámetro de consulta no permitido');
  }
}

export function preview(entity) {
  return (req, res, next) => {
    try {
      validateQuery(req.query, ['qty']);
      res.status(200).json(service.preview(entity, service.validateQty(req.query.qty)));
    } catch (error) { next(error); }
  };
}

export async function seed(req, res, next) {
  try {
    validateQuery(req.query, ['qty', 'collection']);
    if (req.body && Object.keys(req.body).length) throw new AppError('Usá qty y collection en la URL, sin body');
    const result = await service.seed(service.validateQty(req.query.qty), req.query.collection);
    res.status(201).json(result);
  } catch (error) { next(error); }
}
