import { Router } from 'express';

import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { requireArtist } from '../../middlewares/role.middleware.js';
import { validateMiddleware } from '../../middlewares/validate.middleware.js';
import upload from '../../middlewares/upload.middleware.js';

import { createPublicationSchema } from './publications.schema.js';

import {
  getMyPublicationsController,
  createPublicationController,
  getArtistPublicationsController,
} from './publications.controller.js';

const router = Router();

router.get(
  '/publications',
  authMiddleware,
  requireArtist,
  getMyPublicationsController,
);

router.post(
  '/publications',
  authMiddleware,
  requireArtist,
  upload.single('image'),
  validateMiddleware(createPublicationSchema),
  createPublicationController,
);

router.get(
  '/artists/:username/publications',
  getArtistPublicationsController,
);

export default router;