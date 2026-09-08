import { Router } from 'express';

import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { requireArtist } from '../../middlewares/role.middleware.js';
import { validateMiddleware } from '../../middlewares/validate.middleware.js';
import upload from "../../middlewares/upload.middleware.js";

import { updateProfileSchema } from './profile.schema.js';

import {
  getMyProfileController,
  updateProfileController,
  getArtistsListController,
  getArtistProfileController,
} from './profile.controller.js';

const router = Router();

router.get(
  '/profile',
  authMiddleware,
  requireArtist,
  getMyProfileController,
);

router.patch(
  '/profile',
  authMiddleware,
  requireArtist,
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ]),
  validateMiddleware(updateProfileSchema),
  updateProfileController,
);

router.get(
  '/artists',
  getArtistsListController,
);

router.get(
  '/artists/:username',
  getArtistProfileController,
);

export default router;