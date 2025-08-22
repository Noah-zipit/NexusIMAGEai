const axios = require('axios');
const config = require('../config/config');
const logger = require('../utils/logger');
const ApiError = require('../utils/apiError');
const { validateGenerationParams } = require('../utils/validators');
const Image = require('../models/Image');

/**
 * Generate images from text prompt
 * @route POST /api/images/generate
 * @access Public
 */
const generateImage = async (req, res, next) => {
  try {
    const { model, prompt, n = 1, size = '1024x1024' } = req.body;
    
    logger.info(`Generating image with prompt: "${prompt}", model: ${model}, size: ${size}, n: ${n}`);
    
    // Validate request parameters
    const validation = validateGenerationParams({ model, prompt, n, size });
    if (!validation.isValid) {
      return next(new ApiError(400, validation.errors[Object.keys(validation.errors)[0]]));
    }
    
    // Check if API key is configured
    if (!config.apiKeys.infip) {
      logger.error('API key not configured in environment variables');
      return next(new ApiError(500, 'API key not configured'));
    }

    // Log the API URL and key (masked)
    const apiUrl = `${config.imageGeneration.baseUrl}/v1/images/generations`;
    const maskedKey = config.apiKeys.infip.substring(0, 4) + '...' + config.apiKeys.infip.slice(-4);
    logger.info(`Making request to InfIP API: ${apiUrl} with key: ${maskedKey}`);
    
    // Make request to external API
    const response = await axios.post(apiUrl, {
      model,
      prompt,
      n: parseInt(n),
      size
    }, {
      headers: {
        'Authorization': `Bearer ${config.apiKeys.infip}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    // Log the response for debugging
    logger.info(`InfIP API response status: ${response.status}`);
    
    // More detailed debug information
    console.log("Response structure:", JSON.stringify(response.data, null, 2));
    console.log("Has 'data' property:", response.data && typeof response.data.data !== 'undefined');
    if (response.data && response.data.data) {
      console.log("Data is array:", Array.isArray(response.data.data));
      console.log("Data length:", response.data.data.length);
      console.log("First item:", response.data.data[0]);
    }

    // Flexible validation that handles the actual response format
    if (!response.data) {
      logger.error("No data in response");
      return next(new ApiError(500, 'Empty response from image generation service'));
    }
    
    // Check for data array
    if (!response.data.data || !Array.isArray(response.data.data) || response.data.data.length === 0) {
      logger.error(`No data array in response: ${JSON.stringify(response.data)}`);
      return next(new ApiError(500, 'No images in response from service'));
    }

    // Check for URL in first data item
    if (!response.data.data[0].url) {
      logger.error(`No URL in data item: ${JSON.stringify(response.data.data[0])}`);
      return next(new ApiError(500, 'Invalid image data in response'));
    }

    // Extract image URLs from the response
    const images = response.data.data.map(item => item.url);
    const created = response.data.created || Date.now();

    logger.info(`Successfully generated ${images.length} images`);
    logger.info(`First image URL: ${images[0]}`);
    
    // Save to database if user is authenticated
    if (req.user) {
      try {
        const newImage = new Image({
          user: req.user.id,
          prompt,
          model,
          size,
          urls: images,
          timestamp: created
        });
        
        await newImage.save();
        logger.info(`Saved image generation to database with ID: ${newImage._id}`);
      } catch (dbError) {
        // Log the error but don't fail the request
        logger.error(`Failed to save image to database: ${dbError.message}`);
      }
    }
    
    // Return response with the extracted data
    res.status(200).json({
      success: true,
      data: {
        images,
        created
      }
    });
  } catch (error) {
    // Detailed error logging for API issues
    if (error.response) {
      logger.error(`InfIP API error: Status ${error.response.status}, Response: ${JSON.stringify(error.response.data)}`);
      
      // Common error cases
      if (error.response.status === 401) {
        return next(new ApiError(500, 'Invalid API key or authentication error'));
      } else if (error.response.status === 429) {
        return next(new ApiError(429, 'Rate limit exceeded for image generation API'));
      }
      
      return next(new ApiError(
        error.response.status || 500,
        error.response.data?.error || error.response.data?.message || 'Error from image generation service'
      ));
    } else if (error.request) {
      // Network error
      logger.error(`Network error when connecting to InfIP API: ${error.message}`);
      return next(new ApiError(500, 'Unable to connect to image generation service. Please try again later.'));
    }
    
    logger.error(`Unexpected error in image generation: ${error.message}`);
    next(new ApiError(500, 'Failed to generate image'));
  }
};

/**
 * Generate image from another image and text prompt
 * @route POST /api/images/edit
 * @access Public
 */
const editImage = async (req, res, next) => {
  try {
    // Debug logging to see what's being received
    console.log("Edit Image Request body:", req.body);
    console.log("Edit Image Request files:", req.files ? Object.keys(req.files) : 'No files');
    
    if (!req.files || !req.files.image) {
      console.log("No image file found in request");
      return next(new ApiError(400, 'No image file uploaded'));
    }

    const { model = 'img4', prompt, size = '1024x1024' } = req.body;
    const imageFile = req.files.image;
    
    console.log("Received file:", imageFile.name, imageFile.mimetype, imageFile.size);
    
    // Validate parameters
    if (!prompt) {
      return next(new ApiError(400, 'Prompt is required'));
    }
    
    if (!['img3', 'img4'].includes(model)) {
      return next(new ApiError(400, 'Invalid model. Available models: img3, img4'));
    }
    
    logger.info(`Editing image with prompt: "${prompt}", model: ${model}, size: ${size}`);
    
    // Check if API key is configured
    if (!config.apiKeys.infip) {
      logger.error('API key not configured in environment variables');
      return next(new ApiError(500, 'API key not configured'));
    }

    // Create FormData for the API request
    const FormData = require('form-data');
    const form = new FormData();
    form.append('model', model);
    form.append('prompt', prompt);
    form.append('size', size);
    
    // Correctly append the image file - key point of the fix
    form.append('image', imageFile.data, {
      filename: imageFile.name,
      contentType: imageFile.mimetype,
      knownLength: imageFile.size
    });
    
    // Log the API URL and key (masked)
    const apiUrl = `${config.imageGeneration.baseUrl}/v1/images/edits`;
    const maskedKey = config.apiKeys.infip.substring(0, 4) + '...' + config.apiKeys.infip.slice(-4);
    logger.info(`Making request to InfIP API image edit: ${apiUrl} with key: ${maskedKey}`);
    
    // Make request to external API
    const response = await axios.post(apiUrl, form, {
      headers: {
        'Authorization': `Bearer ${config.apiKeys.infip}`,
        ...form.getHeaders()
      },
      timeout: 60000, // Longer timeout for image processing
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    // Process response
    console.log("InfIP Edit response status:", response.status);
    console.log("InfIP Edit response structure:", JSON.stringify(response.data, null, 2));
    
    // Extract image URLs from the response (using the same format as before)
    if (!response.data || !response.data.data || !Array.isArray(response.data.data) || !response.data.data[0].url) {
      logger.error(`Unexpected API response structure: ${JSON.stringify(response.data)}`);
      return next(new ApiError(500, 'Invalid response from image generation service'));
    }

    const images = response.data.data.map(item => item.url);
    const created = response.data.created || Date.now();

    logger.info(`Successfully edited image, generated ${images.length} images`);
    
    // Save to database if user is authenticated
    if (req.user) {
      try {
        const newImage = new Image({
          user: req.user.id,
          prompt,
          model,
          size,
          isEdit: true,
          urls: images,
          timestamp: created
        });
        
        await newImage.save();
        logger.info(`Saved edited image to database with ID: ${newImage._id}`);
      } catch (dbError) {
        logger.error(`Failed to save edited image to database: ${dbError.message}`);
      }
    }
    
    // Return response
    res.status(200).json({
      success: true,
      data: {
        images,
        created
      }
    });
  } catch (error) {
    // Error handling
    console.error("Full error:", error);
    
    if (error.response) {
      logger.error(`InfIP API error: Status ${error.response.status}, Response: ${JSON.stringify(error.response.data)}`);
      return next(new ApiError(
        error.response.status || 500,
        error.response.data?.error || error.response.data?.message || 'Error from image generation service'
      ));
    } else if (error.request) {
      logger.error(`Network error when connecting to InfIP API: ${error.message}`);
      return next(new ApiError(500, 'Unable to connect to image generation service'));
    }
    
    logger.error(`Unexpected error in image editing: ${error.message}`);
    next(new ApiError(500, 'Failed to edit image'));
  }
};

/**
 * Get user's image history
 * @route GET /api/images/history
 * @access Private
 */
const getImageHistory = async (req, res, next) => {
  try {
    // Fetch user's images from database
    const images = await Image.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.status(200).json({
      success: true,
      count: images.length,
      data: images
    });
  } catch (error) {
    logger.error(`Error fetching image history: ${error.message}`);
    next(new ApiError(500, 'Failed to fetch image history'));
  }
};

/**
 * Get a single image by ID
 * @route GET /api/images/:id
 * @access Private
 */
const getImage = async (req, res, next) => {
  try {
    const image = await Image.findById(req.params.id);
    
    // Check if image exists
    if (!image) {
      return next(new ApiError(404, 'Image not found'));
    }
    
    // Check if user owns the image
    if (image.user.toString() !== req.user.id) {
      return next(new ApiError(403, 'Not authorized to access this image'));
    }
    
    res.status(200).json({
      success: true,
      data: image
    });
  } catch (error) {
    logger.error(`Error fetching image: ${error.message}`);
    next(new ApiError(500, 'Failed to fetch image'));
  }
};

/**
 * Delete an image
 * @route DELETE /api/images/:id
 * @access Private
 */
const deleteImage = async (req, res, next) => {
  try {
    const image = await Image.findById(req.params.id);
    
    // Check if image exists
    if (!image) {
      return next(new ApiError(404, 'Image not found'));
    }
    
    // Check if user owns the image
    if (image.user.toString() !== req.user.id) {
      return next(new ApiError(403, 'Not authorized to delete this image'));
    }
    
    await image.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    logger.error(`Error deleting image: ${error.message}`);
    next(new ApiError(500, 'Failed to delete image'));
  }
};

/**
 * Add image to favorites
 * @route PUT /api/images/:id/favorite
 * @access Private
 */
const toggleFavorite = async (req, res, next) => {
  try {
    const image = await Image.findById(req.params.id);
    
    // Check if image exists
    if (!image) {
      return next(new ApiError(404, 'Image not found'));
    }
    
    // Check if user owns the image
    if (image.user.toString() !== req.user.id) {
      return next(new ApiError(403, 'Not authorized to modify this image'));
    }
    
    // Toggle favorite status
    image.isFavorite = !image.isFavorite;
    await image.save();
    
    res.status(200).json({
      success: true,
      data: image
    });
  } catch (error) {
    logger.error(`Error toggling favorite: ${error.message}`);
    next(new ApiError(500, 'Failed to update favorite status'));
  }
};

module.exports = {
  generateImage,
  editImage,
  getImageHistory,
  getImage,
  deleteImage,
  toggleFavorite
};