import { createGlobalStyle } from 'styled-components';
import { fadeIn } from './animations';

const GlobalStyles = createGlobalStyle`
  /* Base styles and resets */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body {
    height: 100%;
    width: 100%;
    font-size: 16px;
    scroll-behavior: smooth;
    overscroll-behavior: none;
  }
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    transition: background-color ${({ theme }) => theme.animations.normal} ${({ theme }) => theme.animations.curve};
    line-height: 1.5;
    animation: ${fadeIn} 0.3s ease-in-out;
  }
  
  #root {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 0.5em;
  }
  
  h1 {
    font-size: 2.5rem;
  }
  
  h2 {
    font-size: 2rem;
  }
  
  h3 {
    font-size: 1.75rem;
  }
  
  h4 {
    font-size: 1.5rem;
  }
  
  h5 {
    font-size: 1.25rem;
  }
  
  h6 {
    font-size: 1rem;
  }
  
  p {
    margin-bottom: 1rem;
  }
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: all ${({ theme }) => theme.animations.fast} ${({ theme }) => theme.animations.curve};
    
    &:hover {
      color: ${({ theme }) => theme.colors.primaryLight};
      text-decoration: underline;
    }
    
    &:active {
      color: ${({ theme }) => theme.colors.primaryDark};
    }
  }
  
  /* Form elements */
  input, button, textarea, select {
    font-family: inherit;
    font-size: inherit;
    color: inherit;
  }
  
  button {
    cursor: pointer;
    border: none;
    background: none;
    
    &:disabled {
      cursor: not-allowed;
    }
  }
  
  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.surfaceAlt};
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 4px;
    
    &:hover {
      background: ${({ theme }) => theme.colors.primaryLight};
    }
  }
  
  /* Selection styling */
  ::selection {
    background-color: ${({ theme }) => theme.colors.selection};
    color: ${({ theme }) => theme.colors.text};
  }
  
  /* Mobile optimizations */
  @media (max-width: 768px) {
    html, body {
      font-size: 14px;
    }
    
    h1 {
      font-size: 2rem;
    }
    
    h2 {
      font-size: 1.75rem;
    }
    
    h3 {
      font-size: 1.5rem;
    }
    
    h4 {
      font-size: 1.25rem;
    }
    
    h5 {
      font-size: 1.1rem;
    }
    
    h6 {
      font-size: 1rem;
    }
  }
  
  /* Fix for iOS overflow issues */
  body.no-scroll {
    position: fixed;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  /* Utility classes */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  
  .no-select {
    user-select: none;
  }
  
  .text-center {
    text-align: center;
  }
  
  .text-right {
    text-align: right;
  }
  
  .flex {
    display: flex;
  }
  
  .flex-column {
    display: flex;
    flex-direction: column;
  }
  
  .align-center {
    align-items: center;
  }
  
  .justify-center {
    justify-content: center;
  }
  
  .space-between {
    justify-content: space-between;
  }
`;

export default GlobalStyles;