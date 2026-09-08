function forbiddenResponse(res, message) {
  return res.status(403).json({
    error: {
      code: 'FORBIDDEN',
      message,
    },
  });
}

export function requireArtist(req, res, next) {
  if (req.user?.role !== 'artist') {
    return forbiddenResponse(
      res,
      'Solo los artistas pueden acceder a este recurso',
    );
  }

  return next();
}