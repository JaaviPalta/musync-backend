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

export async function getArtistShows(username) {
  const profile = await prisma.artistProfile.findUnique({
    where: { username },
    include: { shows: { orderBy: { showDate: 'desc' } } },
  });

  if (!profile) {
    const error = new Error('Perfil artístico no encontrado');
    error.code = 'NOT_FOUND';
    error.statusCode = 404;
    throw error;
  }

  return profile.shows;
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

export async function updateShowById(userId, showId, payload) {
  const profile = await prisma.artistProfile.findUnique({ where: { userId } });

  if (!profile) {
    const error = new Error('Perfil no encontrado');
    error.code = 'NOT_FOUND';
    error.statusCode = 404;
    throw error;
  }

  const show = await prisma.show.findUnique({ where: { id: Number(showId) } });

  if (!show || show.artistProfileId !== profile.id) {
    const error = new Error('No tienes permisos para editar este show');
    error.code = 'FORBIDDEN';
    error.statusCode = 403;
    throw error;
  }

  return prisma.show.update({
    where: { id: Number(showId) },
    data: {
      ...(payload.name !== undefined ? { name: String(payload.name).trim() } : {}),
      ...(payload.venue !== undefined ? { venue: payload.venue ? String(payload.venue).trim() : null } : {}),
      ...(payload.city !== undefined ? { city: payload.city ? String(payload.city).trim() : null } : {}),
      ...(payload.showDate !== undefined ? { showDate: new Date(payload.showDate) } : {}),
    },
  });
}

export async function deleteShowById(userId, showId) {
  const profile = await prisma.artistProfile.findUnique({ where: { userId } });

  if (!profile) {
    const error = new Error('Perfil no encontrado');
    error.code = 'NOT_FOUND';
    error.statusCode = 404;
    throw error;
  }

  const show = await prisma.show.findUnique({ where: { id: Number(showId) } });

  if (!show || show.artistProfileId !== profile.id) {
    const error = new Error('No tienes permisos para eliminar este show');
    error.code = 'FORBIDDEN';
    error.statusCode = 403;
    throw error;
  }

  await prisma.show.delete({ where: { id: Number(showId) } });
  return true;
}
