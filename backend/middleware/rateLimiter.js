const rateLimit = require('express-rate-limit');
const config = require('../config/config');

/**
 * Rate limiting middleware to prevent abuse
 */
const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: `Too many requests, please try again after ${Math.round(config.rateLimit.windowMs / 60000)} minutes`
  },
  // Store used to track request counts
  // Default is memory store - for production, use Redis or another distributed store
  // store: new RedisStore({...})
});

/**
 * More strict rate limiter for sensitive routes like authentication
 */
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many login attempts, please try again after 15 minutes'
  }
});

/**
 * Rate limiter specifically for image generation
 */
const generationRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 image generations per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Generation limit reached, please try again later'
  }
});

module.exports = rateLimiter;
module.exports.authRateLimiter = authRateLimiter;
module.exports.generationRateLimiter = generationRateLimiter;