import { Router } from 'express';
import { validateMiddleware } from '../../middlewares/validate.middleware.js';
import { createOrderSchema } from './orders.schema.js';
import { createOrderController } from './orders.controller.js';

const router = Router();

router.post('/orders', validateMiddleware(createOrderSchema), createOrderController);

export default router;
