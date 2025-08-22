import { keyframes } from 'styled-components';

// General animations
export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

export const slideInFromRight = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

export const slideOutToRight = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
`;

export const slideInFromLeft = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

export const slideOutToLeft = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
`;

export const slideInFromTop = keyframes`
  from { transform: translateY(-100%); }
  to { transform: translateY(0); }
`;

export const slideOutToTop = keyframes`
  from { transform: translateY(0); }
  to { transform: translateY(-100%); }
`;

export const slideInFromBottom = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

export const slideOutToBottom = keyframes`
  from { transform: translateY(0); }
  to { transform: translateY(100%); }
`;

export const scaleIn = keyframes`
  from { transform: scale(0); }
  to { transform: scale(1); }
`;

export const scaleOut = keyframes`
  from { transform: scale(1); }
  to { transform: scale(0); }
`;

// Specific animations
export const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export const breathe = keyframes`
  0% { box-shadow: 0 0 10px rgba(106, 0, 255, 0.5); }
  50% { box-shadow: 0 0 20px rgba(106, 0, 255, 0.8); }
  100% { box-shadow: 0 0 10px rgba(106, 0, 255, 0.5); }
`;

export const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

export const glowPulse = keyframes`
  0% { text-shadow: 0 0 5px rgba(106, 0, 255, 0.5), 0 0 10px rgba(106, 0, 255, 0.3); }
  50% { text-shadow: 0 0 10px rgba(106, 0, 255, 0.8), 0 0 20px rgba(106, 0, 255, 0.5); }
  100% { text-shadow: 0 0 5px rgba(106, 0, 255, 0.5), 0 0 10px rgba(106, 0, 255, 0.3); }
`;

export const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

export const typing = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

export const blink = keyframes`
  50% { border-color: transparent; }
`;

// Loading animations
export const loadingDots = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
`;

export const loadingRing = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const loadingPulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

// Notification animations
export const toastIn = keyframes`
  from { 
    transform: translateY(20px);
    opacity: 0;
  }
  to { 
    transform: translateY(0);
    opacity: 1;
  }
`;

export const toastOut = keyframes`
  from { 
    transform: translateY(0);
    opacity: 1;
  }
  to { 
    transform: translateY(-20px);
    opacity: 0;
  }
`;

// Button animations
export const buttonPressDown = keyframes`
  0% { transform: scale(1); }
  100% { transform: scale(0.95); }
`;

export const buttonRelease = keyframes`
  0% { transform: scale(0.95); }
  100% { transform: scale(1); }
`;

// Menu animations
export const menuExpandHeight = keyframes`
  from { max-height: 0; opacity: 0; }
  to { max-height: 500px; opacity: 1; }
`;

export const menuCollapseHeight = keyframes`
  from { max-height: 500px; opacity: 1; }
  to { max-height: 0; opacity: 0; }
`;