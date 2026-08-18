import { Router } from 'express';

import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateMiddleware } from '../../middlewares/validate.middleware.js';

import { updateProfileSchema } from './profile.schema.js';

import {
  getMyProfileController,
  updateProfileController,
  getArtistProfileController,
} from './profile.controller.js';

const router = Router();

router.get(
  '/profile',
  authMiddleware,
  getMyProfileController,
);

router.patch(
  '/profile',
  authMiddleware,
  validateMiddleware(updateProfileSchema),
  updateProfileController,
);

router.get(
  '/artists/:username',
  getArtistProfileController,
);

export default router;