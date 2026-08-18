import {
  createQuote,
  getQuotes,
  updateQuoteStatus,
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
