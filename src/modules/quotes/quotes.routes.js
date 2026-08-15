import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateMiddleware } from '../../middlewares/validate.middleware.js';
import { createQuoteSchema, updateQuoteStatusSchema } from './quotes.schema.js';
import {
  createQuoteController,
  getQuotesController,
  updateQuoteStatusController,
} from './quotes.controller.js';

const router = Router();

router.post('/quotes', validateMiddleware(createQuoteSchema), createQuoteController);
router.get('/quotes', authMiddleware, getQuotesController);
router.patch('/quotes/:id/status', authMiddleware, validateMiddleware(updateQuoteStatusSchema), updateQuoteStatusController);

export default router;
