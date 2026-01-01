/**
 * Calculate pagination metadata
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} total - Total number of items
 * @returns {Object} Pagination metadata
 */
const getPaginationMeta = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

/**
 * Get skip value for database query
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {number} Skip value
 */
const getSkip = (page, limit) => {
  return (page - 1) * limit;
};

/**
 * Normalize pagination parameters
 * @param {number|string} page - Page number
 * @param {number|string} limit - Items per page
 * @param {number} maxLimit - Maximum allowed limit
 * @returns {Object} Normalized page and limit
 */
const normalizePagination = (page = 1, limit = 10, maxLimit = 100) => {
  const normalizedPage = Math.max(1, parseInt(page) || 1);
  const normalizedLimit = Math.min(maxLimit, Math.max(1, parseInt(limit) || 10));
  
  return {
    page: normalizedPage,
    limit: normalizedLimit,
  };
};

module.exports = {
  getPaginationMeta,
  getSkip,
  normalizePagination,
};

