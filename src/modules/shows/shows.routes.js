import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateMiddleware } from '../../middlewares/validate.middleware.js';
import { createShowSchema } from './shows.schema.js';
import { getMyShowsController, createShowController } from './shows.controller.js';

const router = Router();

router.get('/shows', authMiddleware, getMyShowsController);
router.post('/shows', authMiddleware, validateMiddleware(createShowSchema), createShowController);

export default router;
