/**
 * Validation middleware factory
 * @param {z.ZodSchema} schema - Zod validation schema
 * @param {string} source - Where to validate from ('body', 'query', 'params')
 * @returns {Function} Express middleware
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const data = req[source];
      const validated = schema.parse(data);
      req[source] = validated;
      next();
    } catch (error) {
      if (error.errors) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          error: {
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: formattedErrors,
          },
        });
      }

      next(error);
    }
  };
};

module.exports = validate;

