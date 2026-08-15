export function notFoundMiddleware(req, res) {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Ruta no encontrada: ${req.originalUrl}`,
    },
  });
}
