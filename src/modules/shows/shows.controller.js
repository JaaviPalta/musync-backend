import {
  getShowsByUser,
  createShow,
  getArtistShows,
  updateShowById,
  deleteShowById,
} from './shows.service.js';

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

export async function getArtistShowsController(req, res, next) {
  try {
    const shows = await getArtistShows(req.params.username);
    return res.status(200).json({ data: shows });
  } catch (error) {
    return next(error);
  }
}

export async function updateShowController(req, res, next) {
  try {
    const show = await updateShowById(req.user.userId, req.params.id, req.body);
    return res.status(200).json({ data: show, message: 'Show actualizado correctamente' });
  } catch (error) {
    return next(error);
  }
}

export async function deleteShowController(req, res, next) {
  try {
    await deleteShowById(req.user.userId, req.params.id);
    return res.status(200).json({ message: 'Show eliminado correctamente' });
  } catch (error) {
    return next(error);
  }
}
