const authService = require('../services/authService');

/**
 * Register a new user
 */
const register = async (req, res, next) => {
  try {
    const { user, token } = await authService.register(req.body);

    res.status(201).json({
      success: true,
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 */
const login = async (req, res, next) => {
  try {
    const { user, token } = await authService.login(req.body);

    res.status(200).json({
      success: true,
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
