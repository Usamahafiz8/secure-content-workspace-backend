const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

/**
 * Hash a plain text password
 * @param {string} plainPassword - Plain text password
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (plainPassword) => {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
};

/**
 * Compare plain password with hashed password
 * @param {string} plainPassword - Plain text password
 * @param {string} hashedPassword - Hashed password
 * @returns {Promise<boolean>} True if passwords match
 */
const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};

