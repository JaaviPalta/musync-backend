export function errorHandlerMiddleware(error, req, res, next) {
  console.error('[ERROR]', error);

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Error interno del servidor';

  res.status(statusCode).json({
    error: {
      code: error.code || 'INTERNAL_SERVER_ERROR',
      message,
    },
  });
}
