const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const config = require('../config/config');
const logger = require('../utils/logger');
const ApiError = require('../utils/apiError');
const { validateUser } = require('../utils/validators');

/**
 * Register a new user
 * @route POST /api/users/register
 * @access Public
 */
const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    // Validate user input
    const validation = validateUser({ username, email, password });
    if (!validation.isValid) {
      return next(new ApiError(400, validation.errors[Object.keys(validation.errors)[0]]));
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return next(new ApiError(400, 'User already exists with that email or username'));
    }
    
    // Create new user
    const user = new User({
      username,
      email,
      password
    });
    
    // Save user to database
    await user.save();
    
    // Generate JWT token
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        token
      }
    });
  } catch (error) {
    logger.error(`Error registering user: ${error.message}`);
    next(new ApiError(500, 'Failed to register user'));
  }
};

/**
 * Login user
 * @route POST /api/users/login
 * @access Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Check for email and password
    if (!email || !password) {
      return next(new ApiError(400, 'Please provide email and password'));
    }
    
    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    
    // Check if user exists
    if (!user) {
      return next(new ApiError(401, 'Invalid credentials'));
    }
    
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ApiError(401, 'Invalid credentials'));
    }
    
    // Generate JWT token
    const token = generateToken(user._id);
    
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        token
      }
    });
  } catch (error) {
    logger.error(`Error logging in user: ${error.message}`);
    next(new ApiError(500, 'Failed to login'));
  }
};

/**
 * Get current user profile
 * @route GET /api/users/profile
 * @access Private
 */
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    logger.error(`Error fetching user profile: ${error.message}`);
    next(new ApiError(500, 'Failed to fetch user profile'));
  }
};

/**
 * Update user profile
 * @route PUT /api/users/profile
 * @access Private
 */
const updateUserProfile = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    // Find user
    const user = await User.findById(req.user.id);
    
    // Update fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;
    
    // Save updated user
    await user.save();
    
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    logger.error(`Error updating user profile: ${error.message}`);
    next(new ApiError(500, 'Failed to update profile'));
  }
};

/**
 * Delete user account
 * @route DELETE /api/users/profile
 * @access Private
 */
const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    logger.error(`Error deleting user: ${error.message}`);
    next(new ApiError(500, 'Failed to delete account'));
  }
};

/**
 * Generate JWT token
 * @param {string} id - User ID
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser
};