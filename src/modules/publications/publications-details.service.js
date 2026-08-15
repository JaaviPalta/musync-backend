import prisma from '../../lib/prisma.js';

export async function getPublicationById(publicationId) {
  const publication = await prisma.publication.findUnique({
    where: { id: Number(publicationId) },
    include: {
      artistProfile: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
  });

  if (!publication || !publication.isActive) {
    const error = new Error('Publicación no encontrada');
    error.code = 'NOT_FOUND';
    error.statusCode = 404;
    throw error;
  }

  return publication;
}

export async function updatePublicationById(userId, publicationId, payload) {
  const userProfile = await prisma.artistProfile.findUnique({ where: { userId } });

  const publication = await prisma.publication.findUnique({ where: { id: Number(publicationId) } });

  if (!publication || !userProfile || publication.artistProfileId !== userProfile.id) {
    const error = new Error('No tienes permisos para editar esta publicación');
    error.code = 'FORBIDDEN';
    error.statusCode = 403;
    throw error;
  }

  return prisma.publication.update({
    where: { id: Number(publicationId) },
    data: {
      type: payload.type ?? publication.type,
      title: payload.title ? String(payload.title).trim() : publication.title,
      description: payload.description !== undefined ? payload.description : publication.description,
      price: payload.price !== undefined ? (payload.price !== null ? Number(payload.price) : null) : publication.price,
      imageUrl: payload.imageUrl !== undefined ? payload.imageUrl : publication.imageUrl,
      externalUrl: payload.externalUrl !== undefined ? payload.externalUrl : publication.externalUrl,
      isActive: payload.isActive !== undefined ? Boolean(payload.isActive) : publication.isActive,
    },
  });
}

export async function deletePublicationById(userId, publicationId) {
  const userProfile = await prisma.artistProfile.findUnique({ where: { userId } });

  const publication = await prisma.publication.findUnique({ where: { id: Number(publicationId) } });

  if (!publication || !userProfile || publication.artistProfileId !== userProfile.id) {
    const error = new Error('No tienes permisos para eliminar esta publicación');
    error.code = 'FORBIDDEN';
    error.statusCode = 403;
    throw error;
  }

  await prisma.publication.update({
    where: { id: Number(publicationId) },
    data: { isActive: false },
  });

  return true;
}
