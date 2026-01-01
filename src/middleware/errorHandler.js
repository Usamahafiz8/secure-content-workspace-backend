const { formatError, AppError } = require('../utils/errors');

/**
 * Centralized error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // If response already sent, delegate to default Express error handler
  if (res.headersSent) {
    return next(err);
  }

  // Format error response
  const errorResponse = formatError(err);
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.method} ${req.path} not found`,
      code: 'NOT_FOUND',
    },
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};

