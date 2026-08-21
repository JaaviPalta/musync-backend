export function notFoundMiddleware(req, res, next) {
  const error = new Error(
    `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  );

  error.code = 'NOT_FOUND';
  error.statusCode = 404;

  return next(error);
}