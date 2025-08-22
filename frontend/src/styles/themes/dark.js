const darkTheme = {
  id: 'dark',
  name: 'Dark Mode',
  colors: {
    background: '#121212',
    surface: '#1e1e1e',
    surfaceAlt: '#2d2d2d',
    primary: '#6a00ff',
    primaryDark: '#5300cc',
    primaryLight: '#8c33ff',
    secondary: '#00bfff',
    secondaryDark: '#0095cc',
    secondaryLight: '#33d1ff',
    accent: '#ff00bf',
    accentDark: '#cc0099',
    accentLight: '#ff33cc',
    success: '#00e676',
    warning: '#ffab00',
    error: '#ff5252',
    info: '#00b0ff',
    text: '#ffffff',
    textSecondary: '#b3b3b3',
    textDisabled: '#666666',
    border: '#333333',
    divider: '#333333',
    shadow: 'rgba(0, 0, 0, 0.5)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    highlight: 'rgba(106, 0, 255, 0.15)',
    selection: 'rgba(106, 0, 255, 0.25)',
    hoverOverlay: 'rgba(255, 255, 255, 0.05)'
  },
  glows: {
    primary: '0 0 10px rgba(106, 0, 255, 0.5), 0 0 20px rgba(106, 0, 255, 0.3)',
    secondary: '0 0 10px rgba(0, 191, 255, 0.5), 0 0 20px rgba(0, 191, 255, 0.3)',
    accent: '0 0 10px rgba(255, 0, 191, 0.5), 0 0 20px rgba(255, 0, 191, 0.3)',
    error: '0 0 10px rgba(255, 82, 82, 0.5), 0 0 20px rgba(255, 82, 82, 0.3)',
    success: '0 0 10px rgba(0, 230, 118, 0.5), 0 0 20px rgba(0, 230, 118, 0.3)'
  },
  gradients: {
    primary: 'linear-gradient(135deg, #6a00ff 0%, #9500ff 100%)',
    secondary: 'linear-gradient(135deg, #00bfff 0%, #00ffff 100%)',
    accent: 'linear-gradient(135deg, #ff00bf 0%, #ff00ff 100%)',
    glass: 'linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(45, 45, 45, 0.7) 100%)',
    glassAlt: 'linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(45, 45, 45, 0.8) 100%)',
    card: 'linear-gradient(135deg, #1e1e1e 0%, #252525 100%)'
  },
  animations: {
    fast: '0.2s',
    normal: '0.3s',
    slow: '0.5s',
    curve: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
  }
};

export default darkTheme;