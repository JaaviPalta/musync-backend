import prisma from '../../lib/prisma.js';

export async function createQuote(payload) {
  const { artistId, publicationId, requestType, clientName, clientEmail, budget, eventDate, message } = payload;

  let profile = null;

  if (artistId) {
    profile = await prisma.artistProfile.findUnique({ where: { id: Number(artistId) } });
  } else if (publicationId) {
    const publication = await prisma.publication.findUnique({ where: { id: Number(publicationId) } });
    if (!publication) {
      const error = new Error('Publicación no encontrada');
      error.code = 'NOT_FOUND';
      error.statusCode = 404;
      throw error;
    }
    profile = await prisma.artistProfile.findUnique({ where: { id: publication.artistProfileId } });
  }

  if (!profile) {
    const error = new Error('Artista o publicación no encontrada');
    error.code = 'NOT_FOUND';
    error.statusCode = 404;
    throw error;
  }

  return prisma.quote.create({
    data: {
      artistProfileId: profile.id,
      publicationId: publicationId ? Number(publicationId) : null,
      requestType: requestType || 'quote',
      clientName: String(clientName).trim(),
      clientEmail: String(clientEmail).trim(),
      budget: budget !== undefined && budget !== null ? Number(budget) : null,
      eventDate: eventDate ? new Date(eventDate) : null,
      message: String(message),
    },
  });
}

export async function getQuotes(userId) {
  if (!userId) {
    return prisma.quote.findMany({
      orderBy: { createdAt: 'desc' },
      include: { publication: true },
    });
  }

  const profile = await prisma.artistProfile.findUnique({ where: { userId } });

  if (!profile) {
    const error = new Error('Perfil no encontrado');
    error.code = 'NOT_FOUND';
    error.statusCode = 404;
    throw error;
  }

  return prisma.quote.findMany({
    where: { artistProfileId: profile.id },
    orderBy: { createdAt: 'desc' },
    include: { publication: true },
  });
}

export async function updateQuoteStatus(userId, quoteId, payload) {
  const profile = await prisma.artistProfile.findUnique({ where: { userId } });

  if (!profile) {
    const error = new Error('Perfil no encontrado');
    error.code = 'NOT_FOUND';
    error.statusCode = 404;
    throw error;
  }

  const quote = await prisma.quote.findUnique({ where: { id: Number(quoteId) } });

  if (!quote) {
    const error = new Error('Cotización no encontrada');
    error.code = 'NOT_FOUND';
    error.statusCode = 404;
    throw error;
  }

  if (quote.artistProfileId !== profile.id) {
    const error = new Error('No tienes permisos para actualizar esta cotización');
    error.code = 'FORBIDDEN';
    error.statusCode = 403;
    throw error;
  }

  const status = payload.status;
  const validStatuses = ['pending', 'reviewed', 'accepted', 'rejected'];

  if (!status || !validStatuses.includes(status)) {
    const error = new Error('El estado de la cotización es inválido');
    error.code = 'INVALID_STATUS';
    error.statusCode = 400;
    throw error;
  }

  return prisma.quote.update({
    where: { id: Number(quoteId) },
    data: { status },
  });
}
