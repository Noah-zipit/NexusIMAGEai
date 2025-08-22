import { format, formatDistanceToNow, formatRelative } from 'date-fns';

/**
 * Utility functions for formatting various data types
 */
const formatters = {
  /**
   * Format a date to a readable string
   * @param {Date|number|string} date - The date to format
   * @param {string} formatStr - The format string (default: 'MMM d, yyyy')
   * @returns {string} - Formatted date string
   */
  formatDate(date, formatStr = 'MMM d, yyyy') {
    if (!date) return '';
    
    try {
      const dateObj = typeof date === 'string' || typeof date === 'number' 
        ? new Date(date) 
        : date;
        
      return format(dateObj, formatStr);
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  },
  
  /**
   * Format a date to a relative time string (e.g., "5 minutes ago")
   * @param {Date|number|string} date - The date to format
   * @returns {string} - Relative time string
   */
  formatRelativeTime(date) {
    if (!date) return '';
    
    try {
      const dateObj = typeof date === 'string' || typeof date === 'number' 
        ? new Date(date) 
        : date;
        
      return formatDistanceToNow(dateObj, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting relative time:', error);
      return '';
    }
  },
  
  /**
   * Format a date relative to another date (e.g., "yesterday at 2:30 PM")
   * @param {Date|number|string} date - The date to format
   * @param {Date} baseDate - The base date to compare against (default: now)
   * @returns {string} - Formatted relative date
   */
  formatRelativeDate(date, baseDate = new Date()) {
    if (!date) return '';
    
    try {
      const dateObj = typeof date === 'string' || typeof date === 'number' 
        ? new Date(date) 
        : date;
        
      return formatRelative(dateObj, baseDate);
    } catch (error) {
      console.error('Error formatting relative date:', error);
      return '';
    }
  },
  
  /**
   * Format a file size in bytes to a human-readable string
   * @param {number} bytes - The file size in bytes
   * @param {number} decimals - Number of decimal places (default: 2)
   * @returns {string} - Formatted file size
   */
  formatFileSize(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
  },
  
  /**
   * Format a number with thousands separators
   * @param {number} num - The number to format
   * @returns {string} - Formatted number
   */
  formatNumber(num) {
    return new Intl.NumberFormat().format(num);
  },
  
  /**
   * Truncate a string to a maximum length with ellipsis
   * @param {string} str - The string to truncate
   * @param {number} maxLength - Maximum length (default: 50)
   * @returns {string} - Truncated string
   */
  truncateString(str, maxLength = 50) {
    if (!str || str.length <= maxLength) return str;
    return `${str.substring(0, maxLength)}...`;
  },
  
  /**
   * Format a prompt for display (capitalize first letter, add period if needed)
   * @param {string} prompt - The prompt to format
   * @returns {string} - Formatted prompt
   */
  formatPrompt(prompt) {
    if (!prompt) return '';
    
    // Capitalize first letter
    let formatted = prompt.charAt(0).toUpperCase() + prompt.slice(1);
    
    // Add period if not present
    if (!/[.!?]$/.test(formatted)) {
      formatted += '.';
    }
    
    return formatted;
  }
};

export default formatters;