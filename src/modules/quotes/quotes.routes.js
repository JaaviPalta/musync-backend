import { Router } from 'express';

import { authMiddleware } from '../../middlewares/auth.middleware.js';
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
  getQuotesController,
);

router.patch(
  '/quotes/:id/status',
  authMiddleware,
  validateMiddleware(updateQuoteStatusSchema),
  updateQuoteStatusController,
);

router.get(
  '/quotes/:id/messages',
  authMiddleware,
  getQuoteMessagesController,
);

router.post(
  '/quotes/:id/messages',
  authMiddleware,
  validateMiddleware(createMessageSchema),
  createQuoteMessageController,
);

export default router;