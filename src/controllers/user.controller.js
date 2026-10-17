import * as service from '../services/user.service.js';

// Cada catch envía el error al middleware que arma la respuesta HTTP.
export async function getAll(req, res, next) {
  try {
    const result = await service.getAll();
    res.status(200).json({ status: 'success', payload: result });
  } catch (error) {
    next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const result = await service.getById(req.params.uid);
    res.status(200).json({ status: 'success', payload: result });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const result = await service.create(req.body);
    res.status(201).json({ status: 'success', payload: result });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const result = await service.update(req.params.uid, req.body);
    res.status(200).json({ status: 'success', payload: result });
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const result = await service.remove(req.params.uid);
    res.status(200).json({ status: 'success', payload: result });
  } catch (error) {
    next(error);
  }
}

