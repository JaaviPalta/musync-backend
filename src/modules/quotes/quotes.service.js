import prisma from '../../lib/prisma.js';

function createHttpError(message, code, statusCode) {
  const error = new Error(message);
  error.code = code;
  error.statusCode = statusCode;
  return error;
}

function parseQuoteId(quoteId) {
  const parsedId = Number(quoteId);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw createHttpError(
      'El id de la cotización no es válido',
      'VALIDATION_ERROR',
      400,
    );
  }

  return parsedId;
}

function toDateOnly(value) {
  if (value === undefined || value === null) {
    return null;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    throw createHttpError(
      'La fecha del evento no es válida',
      'VALIDATION_ERROR',
      400,
    );
  }

  return date;
}

const quoteSelect = {
  id: true,
  requestType: true,
  category: true,
  subcategory: true,
  clientName: true,
  clientEmail: true,
  budget: true,
  eventDate: true,
  message: true,
  status: true,
  createdAt: true,
  updatedAt: true,

  publication: {
    select: {
      id: true,
      title: true,
      type: true,
    },
  },

  artistProfile: {
    select: {
      id: true,
      artistName: true,
      username: true,
    },
  },
};

export async function createQuote(payload) {
  const {
    artistId,
    publicationId,
    requestType,
    category,
    subcategory,
    clientName,
    clientEmail,
    budget,
    eventDate,
    message,
  } = payload;

  let artistProfileId;
  let resolvedPublicationId = null;

  if (publicationId) {
    const publication = await prisma.publication.findFirst({
      where: {
        id: publicationId,
        isActive: true,
      },
      select: {
        id: true,
        artistProfileId: true,
      },
    });

    if (!publication) {
      throw createHttpError(
        'Publicación no encontrada',
        'NOT_FOUND',
        404,
      );
    }

    artistProfileId = publication.artistProfileId;
    resolvedPublicationId = publication.id;
  } else {
    const profile = await prisma.artistProfile.findUnique({
      where: {
        id: artistId,
      },
      select: {
        id: true,
      },
    });

    if (!profile) {
      throw createHttpError(
        'Artista no encontrado',
        'NOT_FOUND',
        404,
      );
    }

    artistProfileId = profile.id;
  }

  const quote = await prisma.quote.create({
    data: {
      artistProfileId,
      publicationId: resolvedPublicationId,
      requestType,
      category: category ?? null,
      subcategory: subcategory ?? null,
      clientName,
      clientEmail,
      budget: budget ?? null,
      eventDate: toDateOnly(eventDate),
      message,
    },
    select: quoteSelect,
  });

  return quote;
}

export async function getQuotes(userId) {
  const profile = await prisma.artistProfile.findUnique({
    where: {
      userId,
    },
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

  return prisma.quote.findMany({
    where: {
      artistProfileId: profile.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: quoteSelect,
  });
}

export async function updateQuoteStatus(
  userId,
  quoteId,
  status,
) {
  const id = parseQuoteId(quoteId);

  const profile = await prisma.artistProfile.findUnique({
    where: {
      userId,
    },
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

  const quote = await prisma.quote.findFirst({
    where: {
      id,
      artistProfileId: profile.id,
    },
    select: {
      id: true,
    },
  });

  if (!quote) {
    throw createHttpError(
      'Cotización no encontrada',
      'NOT_FOUND',
      404,
    );
  }

  return prisma.quote.update({
    where: {
      id,
    },
    data: {
      status,
    },
    select: quoteSelect,
  });
}