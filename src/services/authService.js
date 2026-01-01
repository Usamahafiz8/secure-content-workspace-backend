const prisma = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const { AppError } = require('../utils/errors');

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User email
 * @param {string} userData.password - Plain text password
 * @param {string} userData.name - User name
 * @returns {Promise<Object>} User data and token
 */
const register = async (userData) => {
  const { email, password, name } = userData;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    throw new AppError('Email already registered', 400, 'DUPLICATE_EMAIL');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role: 'VIEWER', // Default role
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  // Generate token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user,
    token,
  };
};

/**
 * Login user
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - Plain text password
 * @returns {Promise<Object>} User data and token
 */
const login = async (credentials) => {
  const { email, password } = credentials;

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  // Generate token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  // Return user data (excluding password)
  const userData = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  return {
    user: userData,
    token,
  };
};

module.exports = {
  register,
  login,
};

