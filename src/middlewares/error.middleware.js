export function errorHandler(error, req, res, next) {
  if (error.code === 11000) {
    return res.status(409).json({ status: 'error', message: 'El email ya está registrado' });
  }
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ status: 'error', message: 'El JSON enviado no es válido' });
  }
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ status: 'error', message: 'El cuerpo de la solicitud es demasiado grande' });
  }
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ status: 'error', message: 'Los datos enviados no son válidos' });
  }
  const statusCode = error.statusCode || 500;
  if (statusCode === 500) console.error('Error interno:', error.message);
  res.status(statusCode).json({
    status: 'error',
    message: statusCode === 500 ? 'Error interno del servidor' : error.message
  });
}
