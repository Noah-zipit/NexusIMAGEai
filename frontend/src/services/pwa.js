/**
 * Service for handling Progressive Web App functionality
 */
const pwaService = {
  /**
   * Check if the app can be installed (is not already installed and supports installation)
   * @returns {Promise<boolean>} - Whether the app can be installed
   */
  async canInstall() {
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return false;
    }
    
    // Check if installation is supported
    return !!window.BeforeInstallPromptEvent;
  },
  
  /**
   * Listen for the beforeinstallprompt event and store it
   * @param {Function} callback - Callback to run when install prompt is available
   * @returns {Function} - Function to remove the event listener
   */
  listenForInstallPrompt(callback) {
    const handleBeforeInstallPrompt = (event) => {
      // Prevent default to prevent automatic prompt
      event.preventDefault();
      
      // Store the event for later use
      window.deferredInstallPrompt = event;
      
      // Run callback if provided
      if (callback && typeof callback === 'function') {
        callback(true);
      }
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Return function to remove listener
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  },
  
  /**
   * Show the install prompt if available
   * @returns {Promise<boolean>} - Whether the user accepted the installation
   */
  async promptInstall() {
    if (!window.deferredInstallPrompt) {
      return false;
    }
    
    // Show the install prompt
    window.deferredInstallPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await window.deferredInstallPrompt.userChoice;
    
    // Clear the saved prompt
    window.deferredInstallPrompt = null;
    
    // Return true if the user accepted
    return choiceResult.outcome === 'accepted';
  },
  
  /**
   * Check if the app is running in standalone mode (installed)
   * @returns {boolean} - Whether the app is in standalone mode
   */
  isInStandaloneMode() {
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.navigator.standalone || 
           document.referrer.includes('android-app://');
  },
  
  /**
   * Check if the service worker is registered
   * @returns {Promise<boolean>} - Whether a service worker is active
   */
  async hasServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      return false;
    }
    
    const registrations = await navigator.serviceWorker.getRegistrations();
    return registrations.length > 0;
  },
  
  /**
   * Check if the app is capable of working offline
   * @returns {Promise<boolean>} - Whether the app has offline capability
   */
  async hasOfflineCapability() {
    const hasServiceWorker = await this.hasServiceWorker();
    
    // Check if the app is in the user's cache
    try {
      const cacheKeys = await caches.keys();
      const appCaches = cacheKeys.filter(key => key.includes('nexus'));
      return hasServiceWorker && appCaches.length > 0;
    } catch (e) {
      return hasServiceWorker;
    }
  }
};

export default pwaService;