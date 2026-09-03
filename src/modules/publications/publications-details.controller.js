import {
  getPublicationById,
  updatePublicationById,
  deletePublicationById,
} from './publications-details.service.js';

export async function getPublicationByIdController(
  req,
  res,
  next,
) {
  try {
    const publication = await getPublicationById(
      req.params.id,
    );

    return res.status(200).json({
      data: publication,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updatePublicationByIdController(
  req,
  res,
  next,
) {
  try {
    const publication = await updatePublicationById(
      req.user.userId,
      req.params.id,
      req.body,
      req.file,
    );

    return res.status(200).json({
      data: publication,
      message: 'Publicación actualizada correctamente',
    });
  } catch (error) {
    return next(error);
  }
}

export async function deletePublicationByIdController(
  req,
  res,
  next,
) {
  try {
    await deletePublicationById(
      req.user.userId,
      req.params.id,
    );

    return res.status(200).json({
      message: 'Publicación eliminada correctamente',
    });
  } catch (error) {
    return next(error);
  }
}