const prisma = require('../config/database');
const { AppError } = require('../utils/errors');
const { getSkip, normalizePagination, getPaginationMeta } = require('../utils/pagination');

/**
 * Get paginated list of articles
 * @param {Object} filters - Filter options
 * @param {number} filters.page - Page number
 * @param {number} filters.limit - Items per page
 * @param {string} filters.status - Filter by status
 * @param {string} filters.authorId - Filter by author ID
 * @param {string} filters.search - Search query
 * @param {Object} user - Current user (optional)
 * @returns {Promise<Object>} Articles and pagination metadata
 */
const getArticles = async (filters, user = null) => {
  const { page, limit } = normalizePagination(filters.page, filters.limit);
  const skip = getSkip(page, limit);

  // Build where clause
  const where = {};

  // Status filter: unauthenticated users can only see published articles
  if (filters.status) {
    where.status = filters.status;
  } else if (!user) {
    // Unauthenticated users only see published articles
    where.status = 'PUBLISHED';
  } else if (user.role !== 'ADMIN') {
    // Non-admin authenticated users see published + their own drafts
    where.OR = [
      { status: 'PUBLISHED' },
      { authorId: user.id, status: 'DRAFT' },
    ];
  }
  // Admin sees all articles (no status filter)

  // Author filter
  if (filters.authorId) {
    where.authorId = filters.authorId;
  }

  // Search filter - combine with AND logic
  if (filters.search) {
    // Use case-insensitive search with Prisma's string filters
    // For PostgreSQL, we'll use a workaround with toLowerCase comparison
    const searchTerm = filters.search;
    const searchConditions = {
      OR: [
        { 
          title: {
            contains: searchTerm,
          }
        },
        { 
          content: {
            contains: searchTerm,
          }
        },
      ],
    };

    // If we already have OR conditions, wrap everything in AND
    if (where.OR) {
      where.AND = [
        { OR: where.OR },
        searchConditions,
      ];
      delete where.OR;
    } else {
      Object.assign(where, searchConditions);
    }
  }

  // Get articles and total count
  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.article.count({ where }),
  ]);

  return {
    articles,
    pagination: getPaginationMeta(page, limit, total),
  };
};

/**
 * Get single article by ID
 * @param {string} articleId - Article ID
 * @param {Object} user - Current user (optional)
 * @returns {Promise<Object>} Article data
 */
const getArticleById = async (articleId, user = null) => {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!article) {
    throw new AppError('Article not found', 404, 'NOT_FOUND');
  }

  // Check access permissions
  // Published articles: accessible to everyone
  // Draft articles: only accessible to author or admin
  if (article.status === 'DRAFT') {
    if (!user) {
      throw new AppError('Article not found', 404, 'NOT_FOUND');
    }
    if (user.role !== 'ADMIN' && article.authorId !== user.id) {
      throw new AppError('Article not found', 404, 'NOT_FOUND');
    }
  }

  return article;
};

/**
 * Create a new article
 * @param {Object} articleData - Article data
 * @param {string} articleData.title - Article title
 * @param {string} articleData.content - Article content
 * @param {string} articleData.status - Article status
 * @param {string} authorId - Author ID
 * @returns {Promise<Object>} Created article
 */
const createArticle = async (articleData, authorId) => {
  const { title, content, status = 'DRAFT' } = articleData;

  const article = await prisma.article.create({
    data: {
      title,
      content,
      status,
      authorId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return article;
};

/**
 * Update an article
 * @param {string} articleId - Article ID
 * @param {Object} updateData - Update data
 * @param {string} userId - Current user ID
 * @param {string} userRole - Current user role
 * @returns {Promise<Object>} Updated article
 */
const updateArticle = async (articleId, updateData, userId, userRole) => {
  // Check if article exists
  const existingArticle = await prisma.article.findUnique({
    where: { id: articleId },
  });

  if (!existingArticle) {
    throw new AppError('Article not found', 404, 'NOT_FOUND');
  }

  // Check permissions: owner or admin
  if (userRole !== 'ADMIN' && existingArticle.authorId !== userId) {
    throw new AppError('You do not have permission to edit this article', 403, 'FORBIDDEN');
  }

  // Update article
  const article = await prisma.article.update({
    where: { id: articleId },
    data: updateData,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return article;
};

/**
 * Delete an article
 * @param {string} articleId - Article ID
 * @param {string} userRole - Current user role
 * @returns {Promise<void>}
 */
const deleteArticle = async (articleId, userRole) => {
  // Only admin can delete articles
  if (userRole !== 'ADMIN') {
    throw new AppError('Only administrators can delete articles', 403, 'FORBIDDEN');
  }

  // Check if article exists
  const article = await prisma.article.findUnique({
    where: { id: articleId },
  });

  if (!article) {
    throw new AppError('Article not found', 404, 'NOT_FOUND');
  }

  // Delete article
  await prisma.article.delete({
    where: { id: articleId },
  });
};

module.exports = {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};

