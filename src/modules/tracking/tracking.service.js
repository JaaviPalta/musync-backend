import prisma from '../../lib/prisma.js';

function createHttpError(message, code, statusCode) {
  const error = new Error(message);
  error.code = code;
  error.statusCode = statusCode;
  return error;
}

// El token es la única forma de identificar la cotización acá — a
// propósito no se acepta el id numérico en ninguna ruta pública, para que
// nadie pueda enumerar /track/1, /track/2... y leer conversaciones ajenas.
async function findQuoteByToken(token) {
  const quote = await prisma.quote.findUnique({
    where: { accessToken: token },
    select: {
      id: true,
      requestType: true,
      category: true,
      subcategory: true,
      clientName: true,
      budget: true,
      message: true,
      status: true,
      createdAt: true,
      artistProfile: {
        select: {
          artistName: true,
          username: true,
        },
      },
      publication: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!quote) {
    throw createHttpError(
      'No encontramos esta conversación. Revisa el link de tu email.',
      'NOT_FOUND',
      404,
    );
  }

  return quote;
}

export async function getQuoteByToken(token) {
  const quote = await findQuoteByToken(token);

  const messages = await prisma.quoteMessage.findMany({
    where: { quoteId: quote.id },
    orderBy: { createdAt: 'asc' },
  });

  return { ...quote, messages };
}

export async function addClientMessage(token, body) {
  const quote = await findQuoteByToken(token);

  const message = await prisma.quoteMessage.create({
    data: {
      quoteId: quote.id,
      sender: 'client',
      body,
    },
  });

  if (quote.status === 'pending') {
    await prisma.quote.update({
      where: { id: quote.id },
      data: { status: 'reviewed' },
    });
  }

  return message;
}
