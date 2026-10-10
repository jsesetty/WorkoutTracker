import express from 'express';
import path from 'node:path';
import fsSync from 'node:fs';
import { corsMiddleware } from './middleware/cors.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRouter from './routes/index.js';
import { distPath, publicPath, staticPath } from './config/environment.js';

const app = express();

// Core middlewares
app.use(express.json());
app.use(corsMiddleware);

// API router mounted under /api
app.use('/api', apiRouter);

// Static asset serving (dist or public)
app.use(express.static(staticPath));

// SPA fallback handler (for client-side routing)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  const indexHtml = fsSync.existsSync(path.join(distPath, 'index.html'))
    ? path.join(distPath, 'index.html')
    : path.join(publicPath, 'index.html');
  res.sendFile(indexHtml);
});

// Centralized error handling middleware
app.use(errorHandler);

export default app;
