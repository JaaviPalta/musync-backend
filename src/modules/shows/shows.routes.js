import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateMiddleware } from '../../middlewares/validate.middleware.js';
import { createShowSchema, updateShowSchema } from './shows.schema.js';
import {
  getMyShowsController,
  createShowController,
  getArtistShowsController,
  updateShowController,
  deleteShowController,
} from './shows.controller.js';

const router = Router();

router.get('/shows', authMiddleware, getMyShowsController);
router.post('/shows', authMiddleware, validateMiddleware(createShowSchema), createShowController);
router.get('/artists/:username/shows', getArtistShowsController);
router.put('/shows/:id', authMiddleware, validateMiddleware(updateShowSchema), updateShowController);
router.delete('/shows/:id', authMiddleware, deleteShowController);

export default router;
