/**
 * Utility functions for device and browser detection
 */
const deviceDetection = {
  /**
   * Check if the device is a mobile device
   * @returns {boolean} - Whether the device is mobile
   */
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 768);
  },
  
  /**
   * Check if the device is a tablet
   * @returns {boolean} - Whether the device is a tablet
   */
  isTablet() {
    return /(iPad|Android(?!.*Mobile)|Tablet)/i.test(navigator.userAgent) ||
           (window.innerWidth > 768 && window.innerWidth <= 1024);
  },
  
  /**
   * Check if the device is a desktop
   * @returns {boolean} - Whether the device is a desktop
   */
  isDesktop() {
    return !this.isMobile() && !this.isTablet();
  },
  
  /**
   * Get the device type
   * @returns {string} - 'mobile', 'tablet', or 'desktop'
   */
  getDeviceType() {
    if (this.isMobile()) return 'mobile';
    if (this.isTablet()) return 'tablet';
    return 'desktop';
  },
  
  /**
   * Check if the browser is Safari
   * @returns {boolean} - Whether the browser is Safari
   */
  isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  },
  
  /**
   * Check if the browser is Chrome
   * @returns {boolean} - Whether the browser is Chrome
   */
  isChrome() {
    return /chrome/i.test(navigator.userAgent) && !/edge|opr|opera/i.test(navigator.userAgent);
  },
  
  /**
   * Check if the browser is Firefox
   * @returns {boolean} - Whether the browser is Firefox
   */
  isFirefox() {
    return /firefox/i.test(navigator.userAgent);
  },
  
  /**
   * Check if the browser is Edge
   * @returns {boolean} - Whether the browser is Edge
   */
  isEdge() {
    return /edg/i.test(navigator.userAgent);
  },
  
  /**
   * Get the browser name
   * @returns {string} - The browser name
   */
  getBrowserName() {
    if (this.isEdge()) return 'Edge';
    if (this.isChrome()) return 'Chrome';
    if (this.isFirefox()) return 'Firefox';
    if (this.isSafari()) return 'Safari';
    return 'Unknown';
  },
  
  /**
   * Check if the device supports touch events
   * @returns {boolean} - Whether touch is supported
   */
  supportsTouch() {
    return ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0) || 
           (navigator.msMaxTouchPoints > 0);
  },
  
  /**
   * Check if the device has a high-density (retina) display
   * @returns {boolean} - Whether the device has a high-density display
   */
  isHighDensityDisplay() {
    return (window.devicePixelRatio > 1) || 
           (window.matchMedia && window.matchMedia("(-webkit-min-device-pixel-ratio: 1.5),(-moz-min-device-pixel-ratio: 1.5),(min-device-pixel-ratio: 1.5)").matches);
  },
  
  /**
   * Get the operating system name
   * @returns {string} - The OS name
   */
  getOSName() {
    const userAgent = navigator.userAgent;
    
    if (/Windows/i.test(userAgent)) return 'Windows';
    if (/Macintosh|Mac OS X/i.test(userAgent)) return 'macOS';
    if (/Linux/i.test(userAgent)) return 'Linux';
    if (/Android/i.test(userAgent)) return 'Android';
    if (/iPhone|iPad|iPod/i.test(userAgent)) return 'iOS';
    
    return 'Unknown';
  }
};

export default deviceDetection;