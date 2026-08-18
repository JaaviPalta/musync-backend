import prisma from '../../lib/prisma.js';

function createHttpError(message, code, statusCode) {
  const error = new Error(message);
  error.code = code;
  error.statusCode = statusCode;
  return error;
}

function parsePublicationId(publicationId) {
  const parsedId = Number(publicationId);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw createHttpError(
      'El id de la publicación no es válido',
      'VALIDATION_ERROR',
      400,
    );
  }

  return parsedId;
}

const publicPublicationSelect = {
  id: true,
  type: true,
  title: true,
  description: true,
  price: true,
  imageUrl: true,
  externalUrl: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

export async function getPublicationsByUser(userId) {
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

  return prisma.publication.findMany({
    where: {
      artistProfileId: profile.id,
    },
    select: publicPublicationSelect,
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getArtistPublications(username) {
  const profile = await prisma.artistProfile.findUnique({
    where: { username },
    select: {
      publications: {
        where: {
          isActive: true,
        },
        select: publicPublicationSelect,
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!profile) {
    throw createHttpError(
      'Perfil no encontrado',
      'NOT_FOUND',
      404,
    );
  }

  return profile.publications;
}

export async function createPublication(userId, payload) {
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

  return prisma.publication.create({
    data: {
      artistProfileId: profile.id,
      type: payload.type,
      title: payload.title,
      description: payload.description ?? null,
      price: payload.price ?? null,
      imageUrl: payload.imageUrl ?? null,
      externalUrl: payload.externalUrl ?? null,
      isActive: true,
    },
    select: publicPublicationSelect,
  });
}