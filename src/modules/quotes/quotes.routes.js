import { Router } from 'express';

import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { requireArtist } from '../../middlewares/role.middleware.js';
import { validateMiddleware } from '../../middlewares/validate.middleware.js';

import {
  createQuoteSchema,
  updateQuoteStatusSchema,
  createMessageSchema,
} from './quotes.schema.js';

import {
  createQuoteController,
  getQuotesController,
  updateQuoteStatusController,
  getQuoteMessagesController,
  createQuoteMessageController,
} from './quotes.controller.js';

const router = Router();

router.post(
  '/quotes',
  validateMiddleware(createQuoteSchema),
  createQuoteController,
);

router.get(
  '/quotes',
  authMiddleware,
  requireArtist,
  getQuotesController,
);

router.patch(
  '/quotes/:id/status',
  authMiddleware,
  requireArtist,
  validateMiddleware(updateQuoteStatusSchema),
  updateQuoteStatusController,
);

router.get(
  '/quotes/:id/messages',
  authMiddleware,
  requireArtist,
  getQuoteMessagesController,
);

router.post(
  '/quotes/:id/messages',
  authMiddleware,
  requireArtist,
  validateMiddleware(createMessageSchema),
  createQuoteMessageController,
);

export default router;