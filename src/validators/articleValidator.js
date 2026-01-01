const { z } = require('zod');

const createArticleSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters'),
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters'),
  status: z
    .enum(['DRAFT', 'PUBLISHED'], {
      errorMap: () => ({ message: 'Status must be either DRAFT or PUBLISHED' }),
    })
    .optional()
    .default('DRAFT'),
});

const updateArticleSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters')
    .optional(),
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters')
    .optional(),
  status: z
    .enum(['DRAFT', 'PUBLISHED'], {
      errorMap: () => ({ message: 'Status must be either DRAFT or PUBLISHED' }),
    })
    .optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

const articleQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, 'Page must be a positive integer')
    .optional()
    .transform((val) => (val ? parseInt(val) : 1)),
  limit: z
    .string()
    .regex(/^\d+$/, 'Limit must be a positive integer')
    .optional()
    .transform((val) => (val ? parseInt(val) : 10)),
  status: z
    .enum(['DRAFT', 'PUBLISHED'])
    .optional(),
  authorId: z
    .string()
    .uuid('Invalid author ID format')
    .optional(),
  search: z
    .string()
    .max(100, 'Search query must not exceed 100 characters')
    .optional(),
});

module.exports = {
  createArticleSchema,
  updateArticleSchema,
  articleQuerySchema,
};

