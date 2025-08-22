import React, { useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import anime from 'animejs';
import { touchFriendly, focusOutline } from '../../styles/mixins';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon = null,
  onClick,
  type = 'button',
  ...props 
}) => {
  const buttonRef = useRef(null);
  
  useEffect(() => {
    if (!buttonRef.current) return;
    
    const button = buttonRef.current;
    
    // Setup ripple effect
    const handleClick = (e) => {
      if (disabled || loading) return;
      
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      button.appendChild(ripple);
      
      anime({
        targets: ripple,
        scale: [0, 3],
        opacity: [1, 0],
        easing: 'easeOutExpo',
        duration: 900,
        complete: () => {
          ripple.remove();
        }
      });
    };
    
    button.addEventListener('click', handleClick);
    
    return () => {
      button.removeEventListener('click', handleClick);
    };
  }, [disabled, loading]);
  
  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    
    if (onClick) onClick(e);
  };
  
  return (
    <StyledButton
      ref={buttonRef}
      variant={variant}
      size={size}
      $fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={handleClick}
      type={type}
      $hasIcon={!!icon}
      {...props}
    >
      {loading && <Spinner />}
      {icon && !loading && <IconWrapper>{icon}</IconWrapper>}
      <span>{children}</span>
    </StyledButton>
  );
};

const getButtonColors = (variant, theme) => {
  const variants = {
    primary: {
      bg: theme.colors.primary,
      bgHover: theme.colors.primaryLight,
      text: '#ffffff',
      border: 'none',
      glow: theme.glows.primary
    },
    secondary: {
      bg: theme.colors.secondary,
      bgHover: theme.colors.secondaryLight,
      text: '#ffffff',
      border: 'none',
      glow: theme.glows.secondary
    },
    accent: {
      bg: theme.colors.accent,
      bgHover: theme.colors.accentLight,
      text: '#ffffff',
      border: 'none',
      glow: theme.glows.accent
    },
    outline: {
      bg: 'transparent',
      bgHover: theme.colors.highlight,
      text: theme.colors.primary,
      border: `1px solid ${theme.colors.primary}`,
      glow: 'none'
    },
    ghost: {
      bg: 'transparent',
      bgHover: theme.colors.highlight,
      text: theme.colors.text,
      border: 'none',
      glow: 'none'
    }
  };
  
  return variants[variant] || variants.primary;
};

const getButtonSize = (size) => {
  const sizes = {
    sm: css`
      height: 32px;
      padding: 0 0.75rem;
      font-size: 0.875rem;
    `,
    md: css`
      height: 40px;
      padding: 0 1rem;
      font-size: 0.9375rem;
    `,
    lg: css`
      height: 48px;
      padding: 0 1.5rem;
      font-size: 1rem;
    `
  };
  
  return sizes[size] || sizes.md;
};

const StyledButton = styled.button`
  ${touchFriendly};
  ${focusOutline};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 0.01em;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  width: ${({ $fullWidth }) => $fullWidth ? '100%' : 'auto'};
  
  ${({ size }) => getButtonSize(size)};
  
  ${({ variant, theme }) => {
    const colors = getButtonColors(variant, theme);
    return css`
      background: ${colors.bg};
      color: ${colors.text};
      border: ${colors.border};
      box-shadow: ${variant === 'primary' || variant === 'secondary' || variant === 'accent' 
        ? colors.glow : 'none'};
      
      &:hover:not(:disabled) {
        background: ${colors.bgHover};
        transform: translateY(-1px);
        box-shadow: ${variant === 'primary' || variant === 'secondary' || variant === 'accent' 
          ? `${colors.glow}, 0 4px 8px rgba(0, 0, 0, 0.1)` : '0 2px 4px rgba(0, 0, 0, 0.05)'};
      }
      
      &:active:not(:disabled) {
        transform: translateY(0);
      }
    `;
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .ripple {
    position: absolute;
    border-radius: 50%;
    transform: scale(0);
    background: rgba(255, 255, 255, 0.4);
    pointer-events: none;
    width: 100px;
    height: 100px;
    margin: -50px;
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  margin-right: ${({ $hasIcon }) => $hasIcon ? '0.5rem' : '0'};
  font-size: 1.1em;
`;

const Spinner = styled.span`
  width: 1.1em;
  height: 1.1em;
  margin-right: 0.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default Button;