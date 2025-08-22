const STORAGE_PREFIX = process.env.REACT_APP_STORAGE_PREFIX || 'nexus_image_gen_';

/**
 * A service for handling local storage operations with consistent prefixing
 */
const storageService = {
  // Set an item in localStorage with the app prefix
  setItem(key, value) {
    try {
      const serializedValue = typeof value === 'object' 
        ? JSON.stringify(value)
        : String(value);
        
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, serializedValue);
      return true;
    } catch (error) {
      console.error('Error storing data:', error);
      return false;
    }
  },
  
  // Get an item from localStorage with automatic parsing for JSON
  getItem(key) {
    try {
      const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      
      if (item === null) return null;
      
      // Try to parse as JSON, return as is if not valid JSON
      try {
        return JSON.parse(item);
      } catch (e) {
        return item;
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  },
  
  // Remove an item from localStorage
  removeItem(key) {
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
      return true;
    } catch (error) {
      console.error('Error removing data:', error);
      return false;
    }
  },
  
  // Clear all app-specific items from localStorage
  clearAppStorage() {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(STORAGE_PREFIX))
        .forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Error clearing app storage:', error);
      return false;
    }
  },
  
  // Get all app-specific items from localStorage
  getAllItems() {
    try {
      const items = {};
      
      Object.keys(localStorage)
        .filter(key => key.startsWith(STORAGE_PREFIX))
        .forEach(key => {
          const itemKey = key.replace(STORAGE_PREFIX, '');
          items[itemKey] = this.getItem(itemKey);
        });
        
      return items;
    } catch (error) {
      console.error('Error getting all items:', error);
      return {};
    }
  }
};

export default storageService;