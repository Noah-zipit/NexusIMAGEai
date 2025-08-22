import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import anime from 'animejs';
import { FaSun, FaMoon, FaPalette } from 'react-icons/fa';
import { flexCenter, media, card } from '../../styles/mixins';
import { useTheme } from '../../contexts/ThemeContext';
import Toggle from '../ui/Toggle';

const ThemeSelector = () => {
  const { theme, toggleTheme } = useTheme();
  const containerRef = useRef(null);
  const sunRef = useRef(null);
  const moonRef = useRef(null);
  
  useEffect(() => {
    if (containerRef.current) {
      anime({
        targets: containerRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        easing: 'easeOutQuad',
        duration: 500
      });
    }
  }, []);
  
  useEffect(() => {
    if (theme.id === 'dark' && moonRef.current) {
      anime({
        targets: moonRef.current,
        rotate: ['-45deg', '0deg'],
        scale: [0.5, 1],
        opacity: [0, 1],
        easing: 'easeOutElastic(1, .6)',
        duration: 800
      });
    } else if (theme.id === 'light' && sunRef.current) {
      anime({
        targets: sunRef.current,
        rotate: ['45deg', '0deg'],
        scale: [0.5, 1],
        opacity: [0, 1],
        easing: 'easeOutElastic(1, .6)',
        duration: 800
      });
    }
  }, [theme.id]);
  
  return (
    <ThemeContainer ref={containerRef}>
      <ThemeHeader>
        <SectionTitle>
          <FaPalette />
          <span>Theme</span>
        </SectionTitle>
      </ThemeHeader>
      
      <ThemeContent>
        <ThemeToggleContainer>
          <ThemeIcon ref={sunRef} isVisible={theme.id === 'light'}>
            <FaSun />
          </ThemeIcon>
          
          <Toggle
            id="theme-toggle"
            checked={theme.id === 'dark'}
            onChange={toggleTheme}
            label={`${theme.id === 'dark' ? 'Dark' : 'Light'} Mode`}
          />
          
          <ThemeIcon ref={moonRef} isVisible={theme.id === 'dark'}>
            <FaMoon />
          </ThemeIcon>
        </ThemeToggleContainer>
        
        <ThemeDescription>
          {theme.id === 'dark' 
            ? "Dark mode reduces eye strain in low light and saves battery life on OLED screens."
            : "Light mode provides better readability in bright environments."}
        </ThemeDescription>
      </ThemeContent>
    </ThemeContainer>
  );
};

const ThemeContainer = styled.div`
  ${card};
  margin-bottom: 2rem;
  opacity: 0;
`;

const ThemeHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ThemeContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ThemeToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ThemeIcon = styled.div`
  ${flexCenter};
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme, isVisible }) => 
    isVisible 
      ? theme.id === 'dark' ? theme.colors.secondary : theme.colors.accent
      : 'transparent'};
  font-size: 1.1rem;
  opacity: ${({ isVisible }) => isVisible ? 1 : 0};
  
  ${media.down('sm')} {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }
`;

const ThemeDescription = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

export default ThemeSelector;