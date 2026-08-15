import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateMiddleware } from '../../middlewares/validate.middleware.js';
import { createQuoteSchema } from './quotes.schema.js';
import { createQuoteController, getQuotesController } from './quotes.controller.js';

const router = Router();

router.post('/quotes', validateMiddleware(createQuoteSchema), createQuoteController);
router.get('/quotes', authMiddleware, getQuotesController);

export default router;
