import { getShowsByUser, createShow } from './shows.service.js';

export async function getMyShowsController(req, res, next) {
  try {
    const shows = await getShowsByUser(req.user.userId);
    return res.status(200).json({ data: shows });
  } catch (error) {
    return next(error);
  }
}

export async function createShowController(req, res, next) {
  try {
    const show = await createShow(req.user.userId, req.body);
    return res.status(201).json({ data: show, message: 'Show creado correctamente' });
  } catch (error) {
    return next(error);
  }
}
