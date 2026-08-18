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

const publicationResponseSelect = {
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
  artistProfile: {
    select: {
      id: true,
      artistName: true,
      username: true,
      avatarUrl: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
};

export async function getPublicationById(publicationId) {
  const id = parsePublicationId(publicationId);

  const publication = await prisma.publication.findFirst({
    where: {
      id,
      isActive: true,
    },
    select: publicationResponseSelect,
  });

  if (!publication) {
    throw createHttpError(
      'Publicación no encontrada',
      'NOT_FOUND',
      404,
    );
  }

  return publication;
}

export async function updatePublicationById(
  userId,
  publicationId,
  payload,
) {
  const id = parsePublicationId(publicationId);

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

  const publication = await prisma.publication.findFirst({
    where: {
      id,
      artistProfileId: profile.id,
    },
    select: {
      id: true,
    },
  });

  if (!publication) {
    throw createHttpError(
      'Publicación no encontrada',
      'NOT_FOUND',
      404,
    );
  }

  const updateData = Object.fromEntries(
    Object.entries(payload).filter(
      ([, value]) => value !== undefined,
    ),
  );

  return prisma.publication.update({
    where: { id },
    data: updateData,
    select: publicationResponseSelect,
  });
}

export async function deletePublicationById(
  userId,
  publicationId,
) {
  const id = parsePublicationId(publicationId);

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

  const publication = await prisma.publication.findFirst({
    where: {
      id,
      artistProfileId: profile.id,
    },
    select: {
      id: true,
      isActive: true,
    },
  });

  if (!publication) {
    throw createHttpError(
      'Publicación no encontrada',
      'NOT_FOUND',
      404,
    );
  }

  if (!publication.isActive) {
    return;
  }

  await prisma.publication.update({
    where: { id },
    data: {
      isActive: false,
    },
  });
}