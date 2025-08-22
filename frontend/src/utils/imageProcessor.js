/**
 * Utility functions for working with images
 */
const imageProcessor = {
  /**
   * Generate a unique filename for downloading
   * @param {object} imageInfo - The image metadata
   * @returns {string} - A unique filename
   */
  generateFilename(imageInfo) {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const shortPrompt = imageInfo.prompt
      ? imageInfo.prompt.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_')
      : 'nexus_image';
    const suffix = imageInfo.index !== undefined ? `_${imageInfo.index}` : '';
    return `nexus_${shortPrompt}${suffix}_${timestamp}.png`;
  },
  
  /**
   * Download an image from a URL
   * @param {string} url - The image URL
   * @param {string} filename - The desired filename
   * @returns {Promise} - Download promise
   */
  async downloadImage(url, filename) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || 'nexus_image.png';
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 100);
      
      return true;
    } catch (error) {
      console.error('Error downloading image:', error);
      throw error;
    }
  },
  
  /**
   * Create a thumbnail from an image URL
   * @param {string} url - The image URL
   * @param {number} size - The thumbnail size
   * @returns {Promise<string>} - The thumbnail data URL
   */
  async createThumbnail(url, size = 100) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate dimensions
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions
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
        
        // Set canvas size and draw image
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get data URL
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      
      img.crossOrigin = 'Anonymous';
      img.src = url;
    });
  },
  
  /**
   * Compress an image
   * @param {Blob} imageBlob - The image blob
   * @param {number} quality - Compression quality (0-1)
   * @returns {Promise<Blob>} - Compressed image blob
   */
  async compressImage(imageBlob, quality = 0.8) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob conversion failed'));
              return;
            }
            resolve(blob);
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      
      img.src = URL.createObjectURL(imageBlob);
    });
  }
};

export default imageProcessor;