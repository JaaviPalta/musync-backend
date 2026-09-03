import {
  getPublicationsByUser,
  createPublication,
  getArtistPublications,
} from './publications.service.js';

export async function getMyPublicationsController(
  req,
  res,
  next,
) {
  try {
    const publications = await getPublicationsByUser(
      req.user.userId,
    );

    return res.status(200).json({
      data: publications,
    });
  } catch (error) {
    return next(error);
  }
}

export async function createPublicationController(
  req,
  res,
  next,
) {
  try {
    const publication = await createPublication(
      req.user.userId,
      req.body,
      req.file,
    );

    return res.status(201).json({
      data: publication,
      message: 'Publicación creada correctamente',
    });
  } catch (error) {
    return next(error);
  }
}

export async function getArtistPublicationsController(
  req,
  res,
  next,
) {
  try {
    const publications = await getArtistPublications(
      req.params.username,
    );

    return res.status(200).json({
      data: publications,
    });
  } catch (error) {
    return next(error);
  }
}