/**
 * Validation functions for API requests
 */
const validators = {
  /**
   * Validate image generation parameters
   * @param {object} params - The parameters to validate
   * @returns {object} - Validation result with isValid flag and errors
   */
  validateGenerationParams(params) {
    const errors = {};
    
    // Validate prompt
    if (!params.prompt || params.prompt.trim() === '') {
      errors.prompt = 'Prompt is required';
    } else if (params.prompt.length < 3) {
      errors.prompt = 'Prompt must be at least 3 characters';
    } else if (params.prompt.length > 1000) {
      errors.prompt = 'Prompt cannot exceed 1000 characters';
    }
    
    // Validate model
    const validModels = ['img3', 'img4', 'qwen', 'uncen'];
    if (params.model && !validModels.includes(params.model)) {
      errors.model = 'Invalid model. Supported models: ' + validModels.join(', ');
    }
    
    // Validate image count
    if (params.n !== undefined) {
      const n = parseInt(params.n);
      if (isNaN(n) || n < 1 || n > 4) {
        errors.n = 'Number of images must be between 1 and 4';
      }
    }
    
    // Validate size
    const validSizes = ['1024x1024', '1792x1024', '1024x1792'];
    if (params.size && !validSizes.includes(params.size)) {
      errors.size = 'Invalid size. Supported sizes: ' + validSizes.join(', ');
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },
  
  /**
   * Validate user registration/update data
   * @param {object} userData - User data to validate
   * @returns {object} - Validation result with isValid flag and errors
   */
  validateUser(userData) {
    const errors = {};
    
    // Validate username
    if (userData.username !== undefined) {
      if (!userData.username || userData.username.trim() === '') {
        errors.username = 'Username is required';
      } else if (userData.username.length < 3) {
        errors.username = 'Username must be at least 3 characters';
      } else if (userData.username.length > 20) {
        errors.username = 'Username cannot exceed 20 characters';
      } else if (!/^[a-zA-Z0-9_]+$/.test(userData.username)) {
        errors.username = 'Username can only contain letters, numbers, and underscores';
      }
    }
    
    // Validate email
    if (userData.email !== undefined) {
      if (!userData.email || userData.email.trim() === '') {
        errors.email = 'Email is required';
      } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(userData.email)) {
        errors.email = 'Please provide a valid email';
      }
    }
    
    // Validate password
    if (userData.password !== undefined) {
      if (!userData.password) {
        errors.password = 'Password is required';
      } else if (userData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      } else if (!/[A-Za-z]/.test(userData.password) || !/[0-9]/.test(userData.password)) {
        errors.password = 'Password must contain at least one letter and one number';
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },
  
  /**
   * Sanitize user input to prevent XSS attacks
   * @param {string} input - Text to sanitize
   * @returns {string} - Sanitized text
   */
  sanitizeInput(input) {
    if (!input) return input;
    
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
};

module.exports = validators;