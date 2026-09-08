import { Router } from 'express';

import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { requireArtist } from '../../middlewares/role.middleware.js';
import { validateMiddleware } from '../../middlewares/validate.middleware.js';

import {
  createShowSchema,
  updateShowSchema,
} from './shows.schema.js';

import {
  getMyShowsController,
  createShowController,
  getArtistShowsController,
  updateShowController,
  deleteShowController,
} from './shows.controller.js';

const router = Router();

router.get(
  '/shows',
  authMiddleware,
  requireArtist,
  getMyShowsController,
);

router.post(
  '/shows',
  authMiddleware,
  requireArtist,
  validateMiddleware(createShowSchema),
  createShowController,
);

router.get(
  '/artists/:username/shows',
  getArtistShowsController,
);

router.patch(
  '/shows/:id',
  authMiddleware,
  requireArtist,
  validateMiddleware(updateShowSchema),
  updateShowController,
);

router.delete(
  '/shows/:id',
  authMiddleware,
  requireArtist,
  deleteShowController,
);

export default router;