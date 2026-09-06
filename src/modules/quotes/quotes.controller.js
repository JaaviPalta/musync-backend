import {
  createQuote,
  getQuotes,
  updateQuoteStatus,
  getQuoteMessages,
  createQuoteMessage,
} from './quotes.service.js';

export async function createQuoteController(
  req,
  res,
  next,
) {
  try {
    const quote = await createQuote(req.body);

    return res.status(201).json({
      data: quote,
      message: 'Cotización enviada correctamente',
    });
  } catch (error) {
    return next(error);
  }
}

export async function getQuotesController(
  req,
  res,
  next,
) {
  try {
    const quotes = await getQuotes(req.user.userId);

    return res.status(200).json({
      data: quotes,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getQuoteMessagesController(
  req,
  res,
  next,
) {
  try {
    const messages = await getQuoteMessages(req.user.userId, req.params.id);

    return res.status(200).json({
      data: messages,
    });
  } catch (error) {
    return next(error);
  }
}

export async function createQuoteMessageController(
  req,
  res,
  next,
) {
  try {
    const message = await createQuoteMessage(
      req.user.userId,
      req.params.id,
      req.body.body,
    );

    return res.status(201).json({
      data: message,
      message: 'Mensaje enviado correctamente',
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateQuoteStatusController(
  req,
  res,
  next,
) {
  try {
    const quote = await updateQuoteStatus(
      req.user.userId,
      req.params.id,
      req.body.status,
    );

    return res.status(200).json({
      data: quote,
      message: 'Estado de la cotización actualizado correctamente',
    });
  } catch (error) {
    return next(error);
  }
}
