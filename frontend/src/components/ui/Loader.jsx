import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import anime from 'animejs';

const Loader = ({ size = 'md', text = null, fullPage = false }) => {
  const loaderRef = useRef(null);
  const dotsRefs = useRef([]);
  
  useEffect(() => {
    if (!loaderRef.current) return;
    
    // Animation for the loading dots
    anime({
      targets: dotsRefs.current,
      scale: [0, 1],
      opacity: [0, 1],
      delay: anime.stagger(120),
      easing: 'easeInOutQuad',
      direction: 'alternate',
      loop: true,
      duration: 600
    });
    
    // Animation for the container
    anime({
      targets: loaderRef.current,
      opacity: [0, 1],
      easing: 'easeOutQuad',
      duration: 300
    });
  }, []);
  
  return (
    <LoaderContainer ref={loaderRef} fullPage={fullPage}>
      <LoadingDots size={size}>
        {[...Array(3)].map((_, index) => (
          <Dot 
            key={index} 
            ref={el => dotsRefs.current[index] = el} 
            index={index}
            size={size}
          />
        ))}
      </LoadingDots>
      
      {text && <LoadingText size={size}>{text}</LoadingText>}
    </LoaderContainer>
  );
};

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  
  ${({ fullPage }) => fullPage && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ theme }) => theme.colors.overlay};
    backdrop-filter: blur(5px);
    z-index: 1000;
  `}
`;

const LoadingDots = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ size }) => 
    size === 'sm' ? '0.5rem' : 
    size === 'lg' ? '1rem' : 
    '0.75rem'};
`;

const dotColors = [
  'primary',
  'secondary',
  'accent'
];

const Dot = styled.div`
  border-radius: 50%;
  opacity: 0;
  transform: scale(0);
  
  width: ${({ size }) => 
    size === 'sm' ? '0.5rem' : 
    size === 'lg' ? '1rem' : 
    '0.75rem'};
    
  height: ${({ size }) => 
    size === 'sm' ? '0.5rem' : 
    size === 'lg' ? '1rem' : 
    '0.75rem'};
    
  background-color: ${({ theme, index }) => theme.colors[dotColors[index % dotColors.length]]};
  box-shadow: ${({ theme, index }) => theme.glows[dotColors[index % dotColors.length]]};
`;

const LoadingText = styled.div`
  margin-top: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
  
  font-size: ${({ size }) => 
    size === 'sm' ? '0.75rem' : 
    size === 'lg' ? '1rem' : 
    '0.875rem'};
`;

export default Loader;