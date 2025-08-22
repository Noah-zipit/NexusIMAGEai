const lightTheme = {
  id: 'light',
  name: 'Light Mode',
  colors: {
    background: '#f5f5f5',
    surface: '#ffffff',
    surfaceAlt: '#f0f0f0',
    primary: '#6a00ff',
    primaryDark: '#5300cc',
    primaryLight: '#8c33ff',
    secondary: '#00bfff',
    secondaryDark: '#0095cc',
    secondaryLight: '#33d1ff',
    accent: '#ff00bf',
    accentDark: '#cc0099',
    accentLight: '#ff33cc',
    success: '#00c853',
    warning: '#ff9100',
    error: '#f44336',
    info: '#0091ea',
    text: '#212121',
    textSecondary: '#666666',
    textDisabled: '#aaaaaa',
    border: '#e0e0e0',
    divider: '#e0e0e0',
    shadow: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    highlight: 'rgba(106, 0, 255, 0.1)',
    selection: 'rgba(106, 0, 255, 0.2)',
    hoverOverlay: 'rgba(0, 0, 0, 0.03)'
  },
  glows: {
    primary: '0 0 8px rgba(106, 0, 255, 0.4), 0 0 16px rgba(106, 0, 255, 0.2)',
    secondary: '0 0 8px rgba(0, 191, 255, 0.4), 0 0 16px rgba(0, 191, 255, 0.2)',
    accent: '0 0 8px rgba(255, 0, 191, 0.4), 0 0 16px rgba(255, 0, 191, 0.2)',
    error: '0 0 8px rgba(244, 67, 54, 0.4), 0 0 16px rgba(244, 67, 54, 0.2)',
    success: '0 0 8px rgba(0, 200, 83, 0.4), 0 0 16px rgba(0, 200, 83, 0.2)'
  },
  gradients: {
    primary: 'linear-gradient(135deg, #6a00ff 0%, #9500ff 100%)',
    secondary: 'linear-gradient(135deg, #00bfff 0%, #00ffff 100%)',
    accent: 'linear-gradient(135deg, #ff00bf 0%, #ff00ff 100%)',
    glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%)',
    glassAlt: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
    card: 'linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%)'
  },
  animations: {
    fast: '0.2s',
    normal: '0.3s',
    slow: '0.5s',
    curve: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
  }
};

export default lightTheme;