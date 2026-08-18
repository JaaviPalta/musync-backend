import prisma from '../../lib/prisma.js';

function createHttpError(message, code, statusCode) {
  const error = new Error(message);
  error.code = code;
  error.statusCode = statusCode;
  return error;
}

function parseShowId(showId) {
  const parsedId = Number(showId);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw createHttpError(
      'El id del show no es válido',
      'VALIDATION_ERROR',
      400,
    );
  }

  return parsedId;
}

const showSelect = {
  id: true,
  name: true,
  venue: true,
  city: true,
  showDate: true,
  createdAt: true,
  updatedAt: true,
};

const publicShowSelect = {
  id: true,
  name: true,
  venue: true,
  city: true,
  showDate: true,
};

export async function getShowsByUser(userId) {
  const profile = await prisma.artistProfile.findUnique({
    where: { userId },
    select: {
      id: true,
    },
  });

  if (!profile) {
    throw createHttpError(
      'Perfil no encontrado',
      'NOT_FOUND',
      404,
    );
  }

  return prisma.show.findMany({
    where: {
      artistProfileId: profile.id,
    },
    select: showSelect,
    orderBy: {
      showDate: 'asc',
    },
  });
}

export async function getArtistShows(username) {
  const profile = await prisma.artistProfile.findUnique({
    where: { username },
    select: {
      id: true,
      shows: {
        select: publicShowSelect,
        orderBy: {
          showDate: 'asc',
        },
      },
    },
  });

  if (!profile) {
    throw createHttpError(
      'Perfil artístico no encontrado',
      'NOT_FOUND',
      404,
    );
  }

  return profile.shows;
}

export async function createShow(userId, payload) {
  const profile = await prisma.artistProfile.findUnique({
    where: { userId },
    select: {
      id: true,
    },
  });

  if (!profile) {
    throw createHttpError(
      'Perfil no encontrado',
      'NOT_FOUND',
      404,
    );
  }

  return prisma.show.create({
    data: {
      artistProfileId: profile.id,
      name: payload.name,
      venue: payload.venue ?? null,
      city: payload.city ?? null,
      showDate: payload.showDate,
    },
    select: showSelect,
  });
}

export async function updateShowById(
  userId,
  showId,
  payload,
) {
  const id = parseShowId(showId);

  const profile = await prisma.artistProfile.findUnique({
    where: { userId },
    select: {
      id: true,
    },
  });

  if (!profile) {
    throw createHttpError(
      'Perfil no encontrado',
      'NOT_FOUND',
      404,
    );
  }

  const show = await prisma.show.findFirst({
    where: {
      id,
      artistProfileId: profile.id,
    },
    select: {
      id: true,
    },
  });

  if (!show) {
    throw createHttpError(
      'Show no encontrado',
      'NOT_FOUND',
      404,
    );
  }

  const allowedFields = [
    'name',
    'venue',
    'city',
    'showDate',
  ];

  const updateData = Object.fromEntries(
    allowedFields
      .filter((field) => payload[field] !== undefined)
      .map((field) => [field, payload[field]]),
  );

  return prisma.show.update({
    where: {
      id,
    },
    data: updateData,
    select: showSelect,
  });
}

export async function deleteShowById(userId, showId) {
  const id = parseShowId(showId);

  const profile = await prisma.artistProfile.findUnique({
    where: { userId },
    select: {
      id: true,
    },
  });

  if (!profile) {
    throw createHttpError(
      'Perfil no encontrado',
      'NOT_FOUND',
      404,
    );
  }

  const show = await prisma.show.findFirst({
    where: {
      id,
      artistProfileId: profile.id,
    },
    select: {
      id: true,
    },
  });

  if (!show) {
    throw createHttpError(
      'Show no encontrado',
      'NOT_FOUND',
      404,
    );
  }

  await prisma.show.delete({
    where: {
      id,
    },
  });
}