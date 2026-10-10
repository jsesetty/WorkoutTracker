/**
 * Centralized Error Handling Middleware
 */
export function errorHandler(err, req, res, next) {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[API Error] ${req.method} ${req.originalUrl || req.url} - Status ${statusCode}:`, err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}
