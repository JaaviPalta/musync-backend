import { Prisma } from '@prisma/client';

export function errorHandlerMiddleware(error, req, res, next) {
  console.error('[ERROR]', {
    method: req.method,
    url: req.originalUrl,
    code: error.code,
    message: error.message,
    stack: error.stack,
  });

  if (res.headersSent) {
    return next(error);
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError
  ) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: {
          code: 'CONFLICT',
          message: 'El recurso ya existe o contiene un valor duplicado',
          details: [],
        },
      });
    }

    if (error.code === 'P2025') {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'El recurso solicitado no fue encontrado',
          details: [],
        },
      });
    }
  }

  const requestedStatus = Number(error.statusCode);

  const statusCode =
    Number.isInteger(requestedStatus) &&
    requestedStatus >= 400 &&
    requestedStatus <= 599
      ? requestedStatus
      : 500;

  const isProduction = process.env.NODE_ENV === 'production';

  return res.status(statusCode).json({
    error: {
      code:
        statusCode === 500
          ? 'INTERNAL_SERVER_ERROR'
          : error.code || 'APPLICATION_ERROR',

      message:
        statusCode === 500 && isProduction
          ? 'Error interno del servidor'
          : error.message || 'Error interno del servidor',

      ...(error.details ? { details: error.details } : {}),
    },
  });
}