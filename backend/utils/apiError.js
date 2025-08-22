/**
 * Custom API Error class
 */
class ApiError extends Error {
  /**
   * Create a new API error
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   */
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;