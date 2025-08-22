const apiWrapper = require('../utils/apiWrapper');
const logger = require('../utils/logger');
const Image = require('../models/Image');
const config = require('../config/config');

/**
 * Service for handling image generation and management
 */
const imageService = {
  /**
   * Generate images from text prompt
   * @param {object} params - Generation parameters
   * @param {string} userId - Optional user ID for saving to database
   * @returns {Promise<object>} - Generated images data
   */
  async generateImages(params, userId = null) {
    try {
      // Generate images via API
      const result = await apiWrapper.generateImages({
        model: params.model || config.imageGeneration.defaultModel,
        prompt: params.prompt,
        n: params.n || 1,
        size: params.size || config.imageGeneration.defaultSize
      });
      
      // If user is authenticated, save to database
      if (userId) {
        const newImage = new Image({
          user: userId,
          prompt: params.prompt,
          model: params.model || config.imageGeneration.defaultModel,
          size: params.size || config.imageGeneration.defaultSize,
          urls: result.images,
          seed: result.seed
        });
        
        await newImage.save();
        
        // Update user generation count
        if (params.updateUserStats) {
          const User = require('../models/User');
          const user = await User.findById(userId);
          if (user) {
            await user.incrementGenerateCount();
          }
        }
      }
      
      return result;
    } catch (error) {
      logger.error(`Image generation failed: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Get user's image history
   * @param {string} userId - User ID
   * @param {object} options - Query options (limit, skip, filter)
   * @returns {Promise<Array>} - User's images
   */
  async getUserImages(userId, options = {}) {
    try {
      const { limit = 20, skip = 0, favorites = false, sortBy = 'createdAt', sortOrder = -1 } = options;
      
      // Build query
      const query = { user: userId };
      
      // Filter by favorites if requested
      if (favorites) {
        query.isFavorite = true;
      }
      
      // Execute query
      const images = await Image.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit);
      
      return images;
    } catch (error) {
      logger.error(`Error fetching user images: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Search user's images by prompt text
   * @param {string} userId - User ID
   * @param {string} searchText - Text to search for
   * @param {object} options - Query options
   * @returns {Promise<Array>} - Matching images
   */
  async searchUserImages(userId, searchText, options = {}) {
    try {
      const { limit = 20, skip = 0 } = options;
      
      // Build search query
      const query = {
        user: userId,
        prompt: { $regex: searchText, $options: 'i' }
      };
      
      // Execute query
      const images = await Image.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      return images;
    } catch (error) {
      logger.error(`Error searching images: ${error.message}`);
      throw error;
    }
  },
  
  /**
   * Get image statistics for a user
   * @param {string} userId - User ID
   * @returns {Promise<object>} - Image statistics
   */
  async getUserImageStats(userId) {
    try {
      // Aggregate image stats
      const stats = await Image.aggregate([
        { $match: { user: userId } },
        { $group: {
          _id: null,
          totalImages: { $sum: { $size: '$urls' } },
          totalPrompts: { $sum: 1 },
          favoriteCount: { 
            $sum: { $cond: [{ $eq: ['$isFavorite', true] }, 1, 0] }
          },
          modelUsage: { $push: '$model' }
        }}
      ]);
      
      // Calculate model usage distribution
      let modelDistribution = {};
      if (stats.length > 0 && stats[0].modelUsage) {
        modelDistribution = stats[0].modelUsage.reduce((acc, model) => {
          acc[model] = (acc[model] || 0) + 1;
          return acc;
        }, {});
      }
      
      return {
        totalImages: stats.length > 0 ? stats[0].totalImages : 0,
        totalPrompts: stats.length > 0 ? stats[0].totalPrompts : 0,
        favoriteCount: stats.length > 0 ? stats[0].favoriteCount : 0,
        modelDistribution
      };
    } catch (error) {
      logger.error(`Error fetching image stats: ${error.message}`);
      throw error;
    }
  }
};

module.exports = imageService;