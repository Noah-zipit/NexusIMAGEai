import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AppProvider } from './contexts/AppContext';
import { ThemeContextProvider, useTheme } from './contexts/ThemeContext';
import { GenerationProvider } from './contexts/GenerationContext';
import { AuthProvider } from './contexts/AuthContext';
import GlobalStyles from './styles/globalStyles';
import PageContainer from './components/layout/PageContainer';

// Pages
import Home from './pages/Home';
import ImageGeneration from './pages/ImageGeneration';
import Gallery from './pages/Gallery';
import Settings from './pages/Settings';
import About from './pages/About';
import Developer from './pages/Developer';

// Wrapper to get theme and provide it to styled-components
const ThemedApp = () => {
  // This is a valid hook call within a function component
  const { theme } = useTheme();
  
  // Check if theme is undefined and provide a fallback
  if (!theme) {
    console.error("Theme is undefined! Using fallback theme");
    return null; // Or provide a fallback UI
  }
  
  return (
    <ThemeProvider theme={theme}>
      <AppProvider>
        <GenerationProvider>
          <GlobalStyles />
          <Router>
            <PageContainer>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/generate" element={<ImageGeneration />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/about" element={<About />} />
                <Route path="/developer" element={<Developer />} />
              </Routes>
            </PageContainer>
          </Router>
        </GenerationProvider>
      </AppProvider>
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeContextProvider>
        <ThemedApp />
      </ThemeContextProvider>
    </AuthProvider>
  );
};

export default App;