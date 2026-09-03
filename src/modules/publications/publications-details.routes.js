import { Router } from 'express';

import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validateMiddleware } from '../../middlewares/validate.middleware.js';
import upload from '../../middlewares/upload.middleware.js';

import { updatePublicationSchema } from './publications.schema.js';

import {
  getPublicationByIdController,
  updatePublicationByIdController,
  deletePublicationByIdController,
} from './publications-details.controller.js';

const router = Router();

router.get(
  '/publications/:id',
  getPublicationByIdController,
);

router.patch(
  '/publications/:id',
  authMiddleware,
  upload.single('image'),
  validateMiddleware(updatePublicationSchema),
  updatePublicationByIdController,
);

router.delete(
  '/publications/:id',
  authMiddleware,
  deletePublicationByIdController,
);

export default router;