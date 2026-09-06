import { Router } from 'express';

import { validateMiddleware } from '../../middlewares/validate.middleware.js';
import { createTrackedMessageSchema } from './tracking.schema.js';
import {
  getTrackedQuoteController,
  createTrackedMessageController,
} from './tracking.controller.js';

const router = Router();

// Rutas públicas a propósito: el cliente no tiene cuenta, el token en la URL
// es lo único que autoriza el acceso a esta cotización puntual.
router.get('/track/:token', getTrackedQuoteController);

router.post(
  '/track/:token/messages',
  validateMiddleware(createTrackedMessageSchema),
  createTrackedMessageController,
);

export default router;
