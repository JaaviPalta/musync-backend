import { verifyToken } from '../lib/auth.js';

function unauthorizedResponse(res, message) {
  return res.status(401).json({
    error: {
      code: 'UNAUTHORIZED',
      message,
    },
  });
}

export function authMiddleware(req, res, next) {
  const authorization = req.get('authorization');

  if (!authorization?.startsWith('Bearer ')) {
    return unauthorizedResponse(
      res,
      'Token faltante o inválido',
    );
  }

  const token = authorization
    .slice('Bearer '.length)
    .trim();

  if (!token) {
    return unauthorizedResponse(
      res,
      'Token faltante o inválido',
    );
  }

  try {
    const decoded = verifyToken(token);

    if (
      typeof decoded !== 'object' ||
      decoded === null
    ) {
      return unauthorizedResponse(
        res,
        'El token no contiene un usuario válido',
      );
    }

    const userId = Number(decoded.userId);

    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      return unauthorizedResponse(
        res,
        'El token no contiene un usuario válido',
      );
    }

    req.user = {
      userId,
      email:
        typeof decoded.email === 'string'
          ? decoded.email
          : undefined,
      role:
        decoded.role === 'artist' || decoded.role === 'client'
          ? decoded.role
          : undefined,
    };

    return next();
  } catch {
    return unauthorizedResponse(
      res,
      'Token inválido o expirado',
    );
  }
}