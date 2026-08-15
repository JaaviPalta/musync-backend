import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateMiddleware } from '../../middlewares/validate.middleware.js';
import { registerSchema, loginSchema } from './auth.schema.js';
import { registerController, loginController, meController } from './auth.controller.js';

const router = Router();

router.post('/register', validateMiddleware(registerSchema), registerController);
router.post('/login', validateMiddleware(loginSchema), loginController);
router.get('/me', authMiddleware, meController);

export default router;
