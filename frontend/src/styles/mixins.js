import { css } from 'styled-components';
import { breakpoints } from './variables';

// Media queries
export const media = {
  up: (breakpoint) => `@media (min-width: ${breakpoints[breakpoint]})`,
  down: (breakpoint) => `@media (max-width: ${breakpoints[breakpoint]})`,
  between: (min, max) => 
    `@media (min-width: ${breakpoints[min]}) and (max-width: ${breakpoints[max]})`,
  touch: () => `@media (hover: none) and (pointer: coarse)`,
  mouse: () => `@media (hover: hover) and (pointer: fine)`
};

// Common layout patterns
export const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const flexBetween = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const flexColumn = css`
  display: flex;
  flex-direction: column;
`;

export const absoluteFill = css`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const fixedFill = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const gridCenter = css`
  display: grid;
  place-items: center;
`;

// Typography helpers
export const ellipsis = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const multilineEllipsis = (lines) => css`
  display: -webkit-box;
  -webkit-line-clamp: ${lines};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const hideText = css`
  font: 0/0 a;
  color: transparent;
  text-shadow: none;
  background-color: transparent;
  border: 0;
`;

// Element styling
export const resetButton = css`
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
  outline: none;
`;

export const glassMorphism = (opacity = 0.7) => css`
  background: ${({ theme }) => `rgba(${theme.id === 'dark' ? '30, 30, 30' : '255, 255, 255'}, ${opacity})`};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
`;

export const neoMorphism = (color, size = 10) => css`
  box-shadow: ${size}px ${size}px ${size * 2}px ${({ theme }) => theme.colors.shadow},
              -${size}px -${size}px ${size * 2}px ${({ theme }) => theme.id === 'dark' ? 'rgba(40, 40, 40, 0.5)' : 'rgba(255, 255, 255, 0.5)'};
  background: ${color};
  border-radius: 12px;
`;

export const glowEffect = (color, intensity = 0.5) => css`
  box-shadow: 0 0 10px rgba(${color}, ${intensity}),
              0 0 20px rgba(${color}, ${intensity * 0.6});
`;

// Animation helpers
export const transition = (properties = ['all'], duration = '0.3s', timingFunction = 'ease') => {
  return css`
    transition: ${properties.map(prop => `${prop} ${duration} ${timingFunction}`).join(', ')};
  `;
};

export const transitionAll = (duration = '0.3s', timingFunction = 'ease') => css`
  transition: all ${duration} ${timingFunction};
`;

// Layout containers
export const container = css`
  width: 100%;
  max-width: var(--max-content-width, 1400px);
  margin: 0 auto;
  padding: 0 1rem;
  
  ${media.up('sm')} {
    padding: 0 1.5rem;
  }
  
  ${media.up('md')} {
    padding: 0 2rem;
  }
`;

export const card = css`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px ${({ theme }) => theme.colors.shadow};
`;

export const pageSection = css`
  padding: 2rem 0;
  
  ${media.up('md')} {
    padding: 3rem 0;
  }
  
  ${media.up('lg')} {
    padding: 4rem 0;
  }
`;

// Touch-specific helpers
export const touchFriendly = css`
  min-height: 44px;
  min-width: 44px;
`;

export const noTapHighlight = css`
  -webkit-tap-highlight-color: transparent;
`;

// Responsive helpers
export const hideOnMobile = css`
  ${media.down('md')} {
    display: none;
  }
`;

export const showOnlyOnMobile = css`
  display: none;
  
  ${media.down('md')} {
    display: block;
  }
`;

// Focus states
export const focusOutline = css`
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;