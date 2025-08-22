const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');
const ApiError = require('../utils/apiError');

/**
 * Middleware to protect routes - verifies JWT token
 */
const protect = async (req, res, next) => {
  try {
    let token;
    
    // Check if authorization header exists and starts with Bearer
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Check if token exists
    if (!token) {
      return next(new ApiError(401, 'Not authorized to access this route'));
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret);
      
      // Find user by ID
      const user = await User.findById(decoded.id);
      
      // Check if user exists
      if (!user) {
        return next(new ApiError(401, 'User not found'));
      }
      
      // Add user to request object
      req.user = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      };
      
      next();
    } catch (error) {
      return next(new ApiError(401, 'Not authorized to access this route'));
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to authorize admin access
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Not authorized to perform this action'));
    }
    next();
  };
};

module.exports = {
  protect,
  authorize
};