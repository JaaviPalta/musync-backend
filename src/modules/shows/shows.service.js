import prisma from '../../lib/prisma.js';

export async function getShowsByUser(userId) {
  const profile = await prisma.artistProfile.findUnique({ where: { userId } });

  if (!profile) {
    const error = new Error('Perfil no encontrado');
    error.code = 'NOT_FOUND';
    error.statusCode = 404;
    throw error;
  }

  return prisma.show.findMany({
    where: { artistProfileId: profile.id },
    orderBy: { showDate: 'desc' },
  });
}

export async function createShow(userId, payload) {
  const profile = await prisma.artistProfile.findUnique({ where: { userId } });

  if (!profile) {
    const error = new Error('Perfil no encontrado');
    error.code = 'NOT_FOUND';
    error.statusCode = 404;
    throw error;
  }

  return prisma.show.create({
    data: {
      artistProfileId: profile.id,
      name: String(payload.name).trim(),
      venue: payload.venue ?? null,
      city: payload.city ?? null,
      showDate: new Date(payload.showDate),
    },
  });
}
