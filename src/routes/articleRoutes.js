const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { authenticate, optionalAuth } = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');
const checkArticleOwner = require('../middleware/checkOwner');
const validate = require('../middleware/validate');
const {
  createArticleSchema,
  updateArticleSchema,
  articleQuerySchema,
} = require('../validators/articleValidator');

// Public routes
router.get('/', optionalAuth, validate(articleQuerySchema, 'query'), articleController.getArticles);
router.get('/:id', optionalAuth, articleController.getArticleById);

// Protected routes
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'EDITOR'),
  validate(createArticleSchema),
  articleController.createArticle
);

router.put(
  '/:id',
  authenticate,
  checkArticleOwner(),
  validate(updateArticleSchema),
  articleController.updateArticle
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  articleController.deleteArticle
);

module.exports = router;
