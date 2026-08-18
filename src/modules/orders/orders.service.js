import prisma from '../../lib/prisma.js';

function createHttpError(message, code, statusCode) {
  const error = new Error(message);
  error.code = code;
  error.statusCode = statusCode;
  return error;
}

function parseOrderId(orderId) {
  const parsedId = Number(orderId);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw createHttpError(
      'El id de la orden no es válido',
      'VALIDATION_ERROR',
      400,
    );
  }

  return parsedId;
}

export async function createOrder(payload) {
  const {
    buyerName,
    buyerEmail,
    items,
  } = payload;

  const requestedItems = items.map((item) => ({
    publicationId: item.publicationId,
    quantity: item.quantity,
  }));

  const publicationIds = [
    ...new Set(
      requestedItems.map((item) => item.publicationId),
    ),
  ];

  return prisma.$transaction(async (tx) => {
    const publications = await tx.publication.findMany({
      where: {
        id: {
          in: publicationIds,
        },
      },
      select: {
        id: true,
        type: true,
        price: true,
        isActive: true,
        artistProfileId: true,
      },
    });

    const publicationsById = new Map(
      publications.map((publication) => [
        publication.id,
        publication,
      ]),
    );

    for (const item of requestedItems) {
      const publication = publicationsById.get(
        item.publicationId,
      );

      if (!publication || !publication.isActive) {
        throw createHttpError(
          'Una publicación no existe o está inactiva',
          'INVALID_ITEM',
          400,
        );
      }

      if (
        publication.type !== 'music' &&
        publication.type !== 'digital_product'
      ) {
        throw createHttpError(
          'Solo se permiten publicaciones de música o productos digitales',
          'INVALID_TYPE',
          400,
        );
      }

      if (
        publication.price === null ||
        publication.price === undefined ||
        !Number.isInteger(publication.price) ||
        publication.price < 0
      ) {
        throw createHttpError(
          'La publicación no tiene un precio válido',
          'INVALID_PRICE',
          400,
        );
      }
    }

    const artistProfileIds = new Set(
      requestedItems.map((item) => {
        const publication = publicationsById.get(
          item.publicationId,
        );

        return publication.artistProfileId;
      }),
    );

    if (artistProfileIds.size !== 1) {
      throw createHttpError(
        'Una orden solo puede contener publicaciones del mismo artista',
        'INVALID_ORDER',
        400,
      );
    }

    let total = 0;

    const normalizedItems = requestedItems.map((item) => {
      const publication = publicationsById.get(
        item.publicationId,
      );

      const unitPrice = publication.price;
      const lineTotal = unitPrice * item.quantity;

      total += lineTotal;

      return {
        publicationId: publication.id,
        quantity: item.quantity,
        unitPrice,
        lineTotal,
      };
    });

    if (!Number.isSafeInteger(total)) {
      throw createHttpError(
        'El total de la orden excede el límite permitido',
        'INVALID_TOTAL',
        400,
      );
    }

    const artistProfileId = [...artistProfileIds][0];

    return tx.order.create({
      data: {
        artistProfileId,
        buyerName,
        buyerEmail,
        total,

        items: {
          create: normalizedItems,
        },
      },

      include: {
        items: {
          include: {
            publication: {
              select: {
                id: true,
                title: true,
                type: true,
              },
            },
          },
        },
      },
    });
  });
}

export async function getOrdersByArtist(userId) {
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

  return prisma.order.findMany({
    where: {
      artistProfileId: profile.id,
    },
    include: {
      items: {
        include: {
          publication: {
            select: {
              id: true,
              title: true,
              type: true,
              price: true,
              imageUrl: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getOrderById(userId, orderId) {
  const parsedOrderId = parseOrderId(orderId);

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

  const order = await prisma.order.findFirst({
    where: {
      id: parsedOrderId,
      artistProfileId: profile.id,
    },
    include: {
      items: {
        include: {
          publication: {
            select: {
              id: true,
              title: true,
              type: true,
              price: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw createHttpError(
      'Orden no encontrada',
      'NOT_FOUND',
      404,
    );
  }

  return order;
}