import prisma from '../../lib/prisma.js';

export async function createOrder(payload) {
  const { buyerName, buyerEmail, items } = payload;

  const normalizedItems = [];
  let total = 0;

  for (const item of items) {
    const publication = await prisma.publication.findUnique({ where: { id: Number(item.publicationId) } });

    if (!publication || !publication.isActive) {
      const error = new Error('Una publicación no existe o está inactiva');
      error.code = 'INVALID_ITEM';
      error.statusCode = 400;
      throw error;
    }

    if (publication.type !== 'music' && publication.type !== 'digital_product') {
      const error = new Error('Solo se permiten música o productos digitales');
      error.code = 'INVALID_TYPE';
      error.statusCode = 400;
      throw error;
    }

    if (publication.price === null) {
      const error = new Error('La publicación no tiene precio válido');
      error.code = 'INVALID_PRICE';
      error.statusCode = 400;
      throw error;
    }

    const quantity = Number(item.quantity) || 1;
    const lineTotal = publication.price * quantity;
    total += lineTotal;

    normalizedItems.push({
      publicationId: publication.id,
      quantity,
      unitPrice: publication.price,
      lineTotal,
    });
  }

  const firstPublicationId = normalizedItems[0].publicationId;
  const firstPublication = await prisma.publication.findUnique({ where: { id: firstPublicationId } });

  const order = await prisma.order.create({
    data: {
      artistProfileId: firstPublication.artistProfileId,
      buyerName: String(buyerName).trim(),
      buyerEmail: String(buyerEmail).trim(),
      total,
      items: {
        create: normalizedItems.map(({ publicationId, quantity, unitPrice, lineTotal }) => ({
          publicationId,
          quantity,
          unitPrice,
          lineTotal,
        })),
      },
    },
    include: { items: true },
  });

  return order;
}

export async function getOrdersByArtist(userId) {
  const profile = await prisma.artistProfile.findUnique({ where: { userId } });

  if (!profile) {
    const error = new Error('Perfil no encontrado');
    error.code = 'NOT_FOUND';
    error.statusCode = 404;
    throw error;
  }

  return prisma.order.findMany({
    where: { artistProfileId: profile.id },
    include: { items: { include: { publication: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getOrderById(userId, orderId) {
  const profile = await prisma.artistProfile.findUnique({ where: { userId } });

  if (!profile) {
    const error = new Error('Perfil no encontrado');
    error.code = 'NOT_FOUND';
    error.statusCode = 404;
    throw error;
  }

  const order = await prisma.order.findUnique({
    where: { id: Number(orderId) },
    include: { items: { include: { publication: true } } },
  });

  if (!order || order.artistProfileId !== profile.id) {
    const error = new Error('Orden no encontrada');
    error.code = 'NOT_FOUND';
    error.statusCode = 404;
    throw error;
  }

  return order;
}
