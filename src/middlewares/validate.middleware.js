
export function validateMiddleware(schema) {
  return (req, res, next) => {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'El cuerpo de la solicitud debe ser un objeto JSON válido',
          details: [],
        },
      });
    }

    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Los datos enviados no son válidos',
            details: error.errors.map((issue) => ({
              field: issue.path.join('.') || 'body',
              message: issue.message,
            })),
          },
        });
      }

      next(error);
    }
  };
}