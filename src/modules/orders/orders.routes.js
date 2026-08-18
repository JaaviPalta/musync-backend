import { Router } from 'express';

import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateMiddleware } from '../../middlewares/validate.middleware.js';

import { createOrderSchema } from './orders.schema.js';

import {
  createOrderController,
  getOrdersController,
  getOrderByIdController,
} from './orders.controller.js';

const router = Router();

router.post(
  '/orders',
  validateMiddleware(createOrderSchema),
  createOrderController,
);

router.get(
  '/orders',
  authMiddleware,
  getOrdersController,
);

router.get(
  '/orders/:id',
  authMiddleware,
  getOrderByIdController,
);

export default router;