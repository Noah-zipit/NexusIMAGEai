import React, { createContext, useState, useEffect, useCallback } from 'react';
import darkTheme from '../styles/themes/dark';
import lightTheme from '../styles/themes/light';

const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useState(darkTheme);
  
  // Load theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('nexus_theme');
    if (savedTheme === 'light') {
      setTheme(lightTheme);
    }
  }, []);
  
  // Toggle between light and dark themes
  const toggleTheme = useCallback(() => {
    const newTheme = theme.id === 'dark' ? lightTheme : darkTheme;
    setTheme(newTheme);
    localStorage.setItem('nexus_theme', newTheme.id);
  }, [theme.id]);
  
  // Set a specific theme by ID
  const setThemeById = useCallback((themeId) => {
    if (themeId === 'dark' || themeId === 'light') {
      const newTheme = themeId === 'dark' ? darkTheme : lightTheme;
      setTheme(newTheme);
      localStorage.setItem('nexus_theme', themeId);
    }
  }, []);
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setThemeById }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;