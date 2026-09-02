// Entrypoint serverless para Vercel.
// Vercel detecta cualquier archivo bajo /api como una función; exportar la
// app de Express directamente funciona porque Express es, en esencia,
// un handler (req, res) compatible con el runtime de Node de Vercel.
import app from '../src/app.js';

export default app;
