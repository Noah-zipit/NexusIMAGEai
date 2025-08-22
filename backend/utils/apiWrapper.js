const axios = require('axios');
const config = require('../config/config');
const logger = require('./logger');

/**
 * API Wrapper for making calls to external image generation API
 */
const apiWrapper = {
  /**
   * Create axios instance with default configuration
   */
  client: axios.create({
    baseURL: config.imageGeneration.baseUrl,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKeys.infip}`
    },
    timeout: 60000 // 60 seconds
  }),
  
  /**
   * Generate images using text prompt
   * @param {object} params - Generation parameters
   * @returns {Promise<object>} - API response
   */
  async generateImages(params) {
    try {
      const response = await this.client.post('/v1/images/generations', {
        model: params.model || config.imageGeneration.defaultModel,
        prompt: params.prompt,
        n: params.n || 1,
        size: params.size || config.imageGeneration.defaultSize
      });
      
      return response.data;
    } catch (error) {
      logger.error(`API Error: ${error.message}`);
      
      // Enhance error with more details
      if (error.response) {
        error.status = error.response.status;
        error.data = error.response.data;
      }
      
      throw error;
    }
  },
  
  /**
   * Get available models
   * @returns {Promise<object>} - API response
   */
  async getModels() {
    try {
      const response = await this.client.get('/v1/models');
      return response.data;
    } catch (error) {
      logger.error(`API Error: ${error.message}`);
      
      if (error.response) {
        error.status = error.response.status;
        error.data = error.response.data;
      }
      
      throw error;
    }
  },
  
  /**
   * Check API health
   * @returns {Promise<boolean>} - Whether API is healthy
   */
  async checkHealth() {
    try {
      await this.getModels();
      return true;
    } catch (error) {
      logger.error(`API Health Check Failed: ${error.message}`);
      return false;
    }
  }
};

module.exports = apiWrapper;