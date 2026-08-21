import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { loggerMiddleware } from './middlewares/logger.middleware.js';
import { notFoundMiddleware } from './middlewares/notFound.middleware.js';
import { errorHandlerMiddleware } from './middlewares/errorHandler.middleware.js';

import authRoutes from './modules/auth/auth.routes.js';
import profileRoutes from './modules/profile/profile.routes.js';
import publicationRoutes from './modules/publications/publications.routes.js';
import publicationDetailsRoutes from './modules/publications/publications-details.routes.js';
import showRoutes from './modules/shows/shows.routes.js';
import quoteRoutes from './modules/quotes/quotes.routes.js';
import orderRoutes from './modules/orders/orders.routes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

app.get('/health', (req, res) => {
  return res.status(200).json({
    ok: true,
    message: 'MUSYNC backend funcionando',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', publicationRoutes);
app.use('/api', publicationDetailsRoutes);
app.use('/api', showRoutes);
app.use('/api', quoteRoutes);
app.use('/api', orderRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;