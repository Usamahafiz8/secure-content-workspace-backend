const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwt');

/**
 * Generate JWT token for user
 * @param {Object} payload - User data to encode in token
 * @param {string} payload.userId - User ID
 * @param {string} payload.email - User email
 * @param {string} payload.role - User role
 * @returns {string} JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verify and decode JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
