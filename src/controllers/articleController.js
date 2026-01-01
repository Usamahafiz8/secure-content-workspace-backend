const articleService = require('../services/articleService');

/**
 * Get paginated list of articles
 */
const getArticles = async (req, res, next) => {
  try {
    const { articles, pagination } = await articleService.getArticles(
      req.query,
      req.user || null
    );

    res.status(200).json({
      success: true,
      data: {
        articles,
        pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single article by ID
 */
const getArticleById = async (req, res, next) => {
  try {
    const article = await articleService.getArticleById(
      req.params.id,
      req.user || null
    );

    res.status(200).json({
      success: true,
      data: {
        article,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new article
 */
const createArticle = async (req, res, next) => {
  try {
    const article = await articleService.createArticle(req.body, req.user.id);

    res.status(201).json({
      success: true,
      data: {
        article,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an article
 */
const updateArticle = async (req, res, next) => {
  try {
    const article = await articleService.updateArticle(
      req.params.id,
      req.body,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      data: {
        article,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an article
 */
const deleteArticle = async (req, res, next) => {
  try {
    await articleService.deleteArticle(req.params.id, req.user.role);

    res.status(200).json({
      success: true,
      message: 'Article deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};
