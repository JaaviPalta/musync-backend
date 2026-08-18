import {
  getProfileByUserId,
  upsertProfile,
  getPublicProfile,
} from './profile.service.js';

export async function getMyProfileController(req, res, next) {
  try {
    const profile = await getProfileByUserId(req.user.userId);

    return res.status(200).json({
      data: profile,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateProfileController(req, res, next) {
  try {
    // req.body ya fue validado y normalizado por validateMiddleware
    const profile = await upsertProfile(
      req.user.userId,
      req.body,
    );

    return res.status(200).json({
      data: profile,
      message: 'Perfil actualizado correctamente',
    });
  } catch (error) {
    return next(error);
  }
}

export async function getArtistProfileController(req, res, next) {
  try {
    const profile = await getPublicProfile(req.params.username);

    return res.status(200).json({
      data: profile,
    });
  } catch (error) {
    return next(error);
  }
}