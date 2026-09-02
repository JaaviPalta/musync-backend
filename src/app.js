import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import prisma from './lib/prisma.js';
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

// Ruta temporal de diagnóstico — muestra el error real de conexión a la
// base de datos sin importar NODE_ENV. Borrar una vez resuelto el 500 en
// producción (ver conversación sobre el deploy de Vercel).
app.get('/api/_debug/db', async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT 1 as ok`;
    return res.status(200).json({ ok: true, result });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      name: error.name,
      code: error.code,
      message: error.message,
      cause: error.cause ? String(error.cause) : undefined,
    });
  }
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