/**
 * Service for handling image processing operations
 */
const imageProcessor = {
  /**
   * Convert a URL to a Blob object
   * @param {string} url - The image URL
   * @returns {Promise<Blob>} - The image blob
   */
  async urlToBlob(url) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error converting URL to Blob:', error);
      throw error;
    }
  },
  
  /**
   * Generate a unique filename for downloading
   * @param {object} image - The image object containing metadata
   * @returns {string} - A unique filename
   */
  generateFilename(image) {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const shortPrompt = image.prompt
      ? image.prompt.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_')
      : 'nexus_image';
    return `nexus_${shortPrompt}_${timestamp}.png`;
  },
  
  /**
   * Create a download link for the image
   * @param {string} url - The image URL
   * @param {string} filename - The desired filename
   */
  async downloadImage(url, filename) {
    try {
      const blob = await this.urlToBlob(url);
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
      throw error;
    }
  },
  
  /**
   * Resize an image to specified dimensions
   * @param {Blob} imageBlob - The image blob
   * @param {number} maxWidth - Maximum width
   * @param {number} maxHeight - Maximum height
   * @returns {Promise<Blob>} - The resized image blob
   */
  async resizeImage(imageBlob, maxWidth, maxHeight) {
    return new Promise((resolve, reject) => {
      try {
        const img = new Image();
        img.onload = () => {
          // Calculate new dimensions while maintaining aspect ratio
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
          
          // Create canvas for resizing
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          // Draw and export
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(resolve, 'image/png', 0.9);
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        
        img.src = URL.createObjectURL(imageBlob);
      } catch (error) {
        reject(error);
      }
    });
  },
  
  /**
   * Create a data URL from an image blob
   * @param {Blob} blob - The image blob
   * @returns {Promise<string>} - The data URL
   */
  blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
};

export default imageProcessor;