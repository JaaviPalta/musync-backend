import {
  getProfileByUserId,
  upsertProfile,
  getArtistsList,
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
    const avatarFile = req.files?.avatar?.[0];
    const coverFile = req.files?.cover?.[0];
    const profile = await upsertProfile(
      req.user.userId,
      req.body,
      {
        avatarFile,
        coverFile,
      }
    );

    return res.status(200).json({
      data: profile,
      message: 'Perfil actualizado correctamente',
    });
  } catch (error) {
    return next(error);
  }
}

export async function getArtistsListController(req, res, next) {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const search = String(req.query.search ?? '');

    const result = await getArtistsList({
      page,
      limit,
      search,
    });

    return res.status(200).json({
      data: result.artists,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
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