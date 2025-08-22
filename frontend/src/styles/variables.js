// Breakpoints
export const breakpoints = {
  xs: '320px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1400px'
};

// Spacing
export const spacing = {
  xxs: '0.25rem', // 4px
  xs: '0.5rem',   // 8px
  sm: '0.75rem',  // 12px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  xxl: '3rem',    // 48px
  xxxl: '4rem'    // 64px
};

// Font Sizes
export const fontSizes = {
  xs: '0.75rem',  // 12px
  sm: '0.875rem', // 14px
  md: '1rem',     // 16px
  lg: '1.125rem', // 18px
  xl: '1.25rem',  // 20px
  xxl: '1.5rem',  // 24px
  h1: '2.5rem',   // 40px
  h2: '2rem',     // 32px
  h3: '1.75rem',  // 28px
  h4: '1.5rem',   // 24px
  h5: '1.25rem',  // 20px
  h6: '1rem'      // 16px
};

// Font Weights
export const fontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800
};

// Border Radii
export const borderRadii = {
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  xxl: '24px',
  round: '50%',
  pill: '9999px'
};

// Z-indices
export const zIndices = {
  hide: -1,
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
  toast: 800
};

// Animation durations
export const animationDurations = {
  instant: '0s',
  fastest: '0.1s',
  fast: '0.2s',
  normal: '0.3s',
  slow: '0.5s',
  slowest: '0.8s'
};

// Animation curves
export const animationCurves = {
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  linear: 'linear',
  // Custom bezier curves
  smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  bouncy: 'cubic-bezier(0.2, -0.4, 0.2, 1.4)',
  gentle: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  swift: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
};

// Shadows
export const shadows = {
  xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
  xxl: '0 25px 50px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
  outline: '0 0 0 3px rgba(66, 153, 225, 0.5)',
  none: 'none'
};

// App-specific
export const appConstants = {
  headerHeight: '64px',
  sidebarWidth: '280px',
  mobileNavHeight: '56px',
  modalWidth: {
    sm: '400px',
    md: '600px',
    lg: '800px',
    xl: '1000px',
    full: '100%'
  },
  maxContentWidth: '1400px'
};