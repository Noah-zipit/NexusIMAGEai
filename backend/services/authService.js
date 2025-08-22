const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const config = require('../config/config');
const logger = require('../utils/logger');

/**
 * Service for handling authentication and user management
 */
const authService = {
  /**
   * Register a new user
   * @param {object} userData - User registration data
   * @returns {Promise<object>} - New user and token
   */
  async registerUser(userData) {
    try {
      const { username, email, password } = userData;
      
      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
      });
      
      if (existingUser) {
        throw new Error('User already exists with that email or username');
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
      const token = this.generateToken(user._id);
      
      return {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      };
    } catch (error) {
      logger.error(`Error registering user: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Authenticate user login
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} - User and token
   */
  async loginUser(email, password) {
    try {
      // Find user by email
      const user = await User.findOne({ email }).select('+password');
      
      // Check if user exists
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      // Check if password matches
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }
      
      // Generate JWT token
      const token = this.generateToken(user._id);
      
      return {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      };
    } catch (error) {
      logger.error(`Error logging in user: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Generate JWT token
   * @param {string} id - User ID
   * @returns {string} - JWT token
   */
  generateToken(id) {
    return jwt.sign({ id }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });
  },
  
  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {Promise<object>} - Decoded token payload
   */
  async verifyToken(token) {
    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret);
      
      // Find user by ID
      const user = await User.findById(decoded.id);
      
      // Check if user exists
      if (!user) {
        throw new Error('User not found');
      }
      
      return {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      };
    } catch (error) {
      logger.error(`Token verification failed: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Change user password
   * @param {string} userId - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} - Success status
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      // Find user
      const user = await User.findById(userId).select('+password');
      
      // Check if current password is correct
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        throw new Error('Current password is incorrect');
      }
      
      // Update password
      user.password = newPassword;
      await user.save();
      
      return true;
    } catch (error) {
      logger.error(`Password change failed: ${error.message}`);
      throw error;
    }
  }
};

module.exports = authService;