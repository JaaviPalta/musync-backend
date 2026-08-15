import { ZodError } from 'zod';

export function validateMiddleware(schema) {
  return (req, res, next) => {
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
