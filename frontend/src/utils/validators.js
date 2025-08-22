/**
 * Utility functions for validation
 */
const validators = {
  /**
   * Validate an email address
   * @param {string} email - The email to validate
   * @returns {boolean} - Whether the email is valid
   */
  isValidEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  },
  
  /**
   * Validate a password (min 8 chars, at least one letter and number)
   * @param {string} password - The password to validate
   * @returns {boolean} - Whether the password is valid
   */
  isValidPassword(password) {
    return password && password.length >= 8 && 
           /[A-Za-z]/.test(password) && 
           /[0-9]/.test(password);
  },
  
  /**
   * Validate a username (alphanumeric with underscores, 3-20 chars)
   * @param {string} username - The username to validate
   * @returns {boolean} - Whether the username is valid
   */
  isValidUsername(username) {
    const pattern = /^[a-zA-Z0-9_]{3,20}$/;
    return pattern.test(username);
  },
  
  /**
   * Check if a string is empty or only whitespace
   * @param {string} str - The string to check
   * @returns {boolean} - Whether the string is empty
   */
  isEmpty(str) {
    return !str || str.trim() === '';
  },
  
  /**
   * Check if a value is a valid number
   * @param {any} value - The value to check
   * @returns {boolean} - Whether the value is a valid number
   */
  isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  },
  
  /**
   * Validate a URL
   * @param {string} url - The URL to validate
   * @returns {boolean} - Whether the URL is valid
   */
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  },
  
  /**
   * Validate a prompt (not empty and has a minimum length)
   * @param {string} prompt - The prompt to validate
   * @param {number} minLength - Minimum required length (default: 3)
   * @returns {boolean} - Whether the prompt is valid
   */
  isValidPrompt(prompt, minLength = 3) {
    return prompt && prompt.trim().length >= minLength;
  },
  
  /**
   * Validate image generation parameters
   * @param {object} params - The parameters to validate
   * @returns {object} - Validation result {isValid, errors}
   */
  validateGenerationParams(params) {
    const errors = {};
    
    // Check prompt
    if (!params.prompt || !this.isValidPrompt(params.prompt)) {
      errors.prompt = 'Please enter a valid prompt with at least 3 characters';
    }
    
    // Check model
    const validModels = ['img3', 'img4', 'qwen', 'uncen'];
    if (!params.model || !validModels.includes(params.model)) {
      errors.model = 'Please select a valid model';
    }
    
    // Check size
    const validSizes = ['1024x1024', '1792x1024', '1024x1792'];
    if (!params.size || !validSizes.includes(params.size)) {
      errors.size = 'Please select a valid image size';
    }
    
    // Check number of images
    if (!this.isNumber(params.n) || params.n < 1 || params.n > 4) {
      errors.n = 'Number of images must be between 1 and 4';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

export default validators;