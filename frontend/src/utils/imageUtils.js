/**
 * Utility functions for working with images
 */
const imageUtils = {
  /**
   * Extract aspect ratio from dimensions string (e.g., "1024x1024")
   * @param {string} dimensions - Dimensions in WxH format
   * @returns {string} - Aspect ratio in W:H format
   */
  dimensionsToAspectRatio(dimensions) {
    if (!dimensions || !dimensions.includes('x')) {
      return '1:1'; // Default to square
    }
    
    const [width, height] = dimensions.split('x').map(Number);
    
    if (width === height) {
      return '1:1';
    }
    
    if (width === 1792 && height === 1024) {
      return '16:9';
    }
    
    if (width === 1024 && height === 1792) {
      return '9:16';
    }
    
    // Calculate GCD for simplifying the ratio
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(width, height);
    
    return `${width / divisor}:${height / divisor}`;
  },
  
  /**
   * Convert aspect ratio to dimensions string
   * @param {string} ratio - Aspect ratio in W:H format
   * @param {number} baseSize - Base size for the smaller dimension
   * @returns {string} - Dimensions in WxH format
   */
  aspectRatioToDimensions(ratio, baseSize = 1024) {
    if (!ratio || !ratio.includes(':')) {
      return `${baseSize}x${baseSize}`; // Default to square
    }
    
    const [w, h] = ratio.split(':').map(Number);
    
    if (w === h) {
      return `${baseSize}x${baseSize}`;
    }
    
    if (w > h) {
      // Landscape orientation
      const width = Math.round((baseSize * w) / h);
      return `${width}x${baseSize}`;
    } else {
      // Portrait orientation
      const height = Math.round((baseSize * h) / w);
      return `${baseSize}x${height}`;
    }
  },
  
  /**
   * Get model name in a user-friendly format
   * @param {string} modelId - The model ID
   * @returns {string} - User-friendly model name
   */
  getModelName(modelId) {
    const modelNames = {
      'img3': 'Standard',
      'img4': 'High Quality',
      'qwen': 'Qwen',
      'uncen': 'Uncensored'
    };
    
    return modelNames[modelId] || modelId;
  },
  
  /**
   * Check if an image URL is valid
   * @param {string} url - The image URL to check
   * @returns {Promise<boolean>} - Whether the URL is valid
   */
  async isImageUrlValid(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok && response.headers.get('content-type').startsWith('image/');
    } catch (error) {
      return false;
    }
  },
  
  /**
   * Create a compressed thumbnail from an image URL
   * @param {string} url - The original image URL
   * @param {number} size - The maximum dimension of the thumbnail
   * @returns {Promise<string>} - Data URL of the thumbnail
   */
  async createThumbnail(url, size = 100) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > size) {
            height = (height * size) / width;
            width = size;
          }
        } else {
          if (height > size) {
            width = (width * size) / height;
            height = size;
          }
        }
        
        // Create canvas and draw image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to data URL
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      
      img.crossOrigin = 'Anonymous';
      img.src = url;
    });
  }
};

export default imageUtils;