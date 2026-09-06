import { getQuoteByToken, addClientMessage } from './tracking.service.js';

export async function getTrackedQuoteController(req, res, next) {
  try {
    const quote = await getQuoteByToken(req.params.token);

    return res.status(200).json({
      data: quote,
    });
  } catch (error) {
    return next(error);
  }
}

export async function createTrackedMessageController(req, res, next) {
  try {
    const message = await addClientMessage(req.params.token, req.body.body);

    return res.status(201).json({
      data: message,
      message: 'Mensaje enviado correctamente',
    });
  } catch (error) {
    return next(error);
  }
}
