const prisma = require('../config/database');
const { AppError } = require('../utils/errors');

/**
 * Middleware to check if user is the owner of an article or is an admin
 * @param {string} articleIdParam - Name of the route parameter containing article ID
 * @returns {Function} Express middleware
 */
const checkArticleOwner = (articleIdParam = 'id') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
      }

      const articleId = req.params[articleIdParam];

      // Admin can access any article
      if (req.user.role === 'ADMIN') {
        return next();
      }

      // Check if article exists and get author
      const article = await prisma.article.findUnique({
        where: { id: articleId },
        select: { authorId: true },
      });

      if (!article) {
        throw new AppError('Article not found', 404, 'NOT_FOUND');
      }

      // Check if user is the owner
      if (article.authorId !== req.user.id) {
        throw new AppError('You do not have permission to access this article', 403, 'FORBIDDEN');
      }

      next();
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          error: {
            message: error.message,
            code: error.code,
          },
        });
      }

      next(error);
    }
  };
};

module.exports = checkArticleOwner;

