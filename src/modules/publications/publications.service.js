import prisma from '../../lib/prisma.js';

export async function getPublicationsByUser(userId) {
  const profile = await prisma.artistProfile.findUnique({ where: { userId } });

  if (!profile) {
    const error = new Error('Perfil no encontrado');
    error.code = 'NOT_FOUND';
    error.statusCode = 404;
    throw error;
  }

  return prisma.publication.findMany({
    where: { artistProfileId: profile.id },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getArtistPublications(username) {
  const profile = await prisma.artistProfile.findUnique({
    where: { username },
    include: { publications: { where: { isActive: true }, orderBy: { createdAt: 'desc' } } },
  });

  if (!profile) {
    const error = new Error('Perfil no encontrado');
    error.code = 'NOT_FOUND';
    error.statusCode = 404;
    throw error;
  }

  return profile.publications;
}

export async function createPublication(userId, payload) {
  const profile = await prisma.artistProfile.findUnique({ where: { userId } });

  if (!profile) {
    const error = new Error('Perfil no encontrado');
    error.code = 'NOT_FOUND';
    error.statusCode = 404;
    throw error;
  }

  return prisma.publication.create({
    data: {
      artistProfileId: profile.id,
      type: payload.type,
      title: String(payload.title).trim(),
      description: payload.description ?? null,
      price: payload.price !== undefined && payload.price !== null ? Number(payload.price) : null,
      imageUrl: payload.imageUrl ?? null,
      externalUrl: payload.externalUrl ?? null,
      isActive: payload.isActive !== undefined ? Boolean(payload.isActive) : true,
    },
  });
}
