/**
 * Custom error class for application errors
 */
class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Create error response object
 * @param {Error} error - Error object
 * @returns {Object} Formatted error response
 */
const formatError = (error) => {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
      },
    };
  }

  // Handle Prisma errors
  if (error.code === 'P2002') {
    return {
      success: false,
      error: {
        message: 'A record with this value already exists',
        code: 'DUPLICATE_ENTRY',
      },
    };
  }

  if (error.code === 'P2025') {
    return {
      success: false,
      error: {
        message: 'Record not found',
        code: 'NOT_FOUND',
      },
    };
  }

  // Default error
  return {
    success: false,
    error: {
      message: process.env.NODE_ENV === 'production' 
        ? 'An error occurred' 
        : error.message,
      code: 'INTERNAL_ERROR',
    },
  };
};

module.exports = {
  AppError,
  formatError,
};

