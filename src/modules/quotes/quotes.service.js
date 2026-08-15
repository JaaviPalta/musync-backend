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

export async function getQuotes() {
  return prisma.quote.findMany({
    orderBy: { createdAt: 'desc' },
  });
}
