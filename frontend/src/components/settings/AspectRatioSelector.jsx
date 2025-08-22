import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import anime from 'animejs';
import { FaSquare, FaTable, FaMobile } from 'react-icons/fa';
import { flexBetween, media, card } from '../../styles/mixins';
import { useGeneration } from '../../contexts/GenerationContext';

const aspectRatioOptions = [
  {
    value: '1:1',
    label: 'Square',
    icon: <FaSquare />,
    size: '1024×1024',
    description: 'Perfect for social media profiles and general use'
  },
  {
    value: '16:9',
    label: 'Landscape',
    icon: <FaTable />,
    size: '1792×1024',
    description: 'Ideal for desktop wallpapers and wide displays'
  },
  {
    value: '9:16',
    label: 'Portrait',
    icon: <FaMobile />,
    size: '1024×1792',
    description: 'Best for mobile screens and vertical content'
  }
];

const AspectRatioSelector = () => {
  const { aspectRatio, setAspectRatio } = useGeneration();
  const containerRef = useRef(null);
  const optionsRef = useRef([]);
  
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
    if (optionsRef.current.length) {
      anime({
        targets: optionsRef.current,
        opacity: [0, 1],
        scale: [0.95, 1],
        delay: anime.stagger(100),
        easing: 'easeOutQuad',
        duration: 400
      });
    }
  }, []);
  
  return (
    <SelectorContainer ref={containerRef}>
      <SelectorHeader>
        <SectionTitle>Aspect Ratio</SectionTitle>
        <SizeText>Output size in pixels</SizeText>
      </SelectorHeader>
      
      <RatioOptions>
        {aspectRatioOptions.map((option, index) => (
          <RatioOption 
            key={option.value}
            ref={el => optionsRef.current[index] = el}
            isSelected={option.value === aspectRatio}
            onClick={() => setAspectRatio(option.value)}
          >
            <OptionIcon isSelected={option.value === aspectRatio}>
              {option.icon}
            </OptionIcon>
            
            <OptionContent>
              <OptionTitle>{option.label}</OptionTitle>
              <OptionSize>{option.size}</OptionSize>
              <OptionDescription>{option.description}</OptionDescription>
            </OptionContent>
          </RatioOption>
        ))}
      </RatioOptions>
    </SelectorContainer>
  );
};

const SelectorContainer = styled.div`
  ${card};
  margin-bottom: 2rem;
  opacity: 0;
`;

const SelectorHeader = styled.div`
  ${flexBetween};
  margin-bottom: 1.5rem;
  
  ${media.down('sm')} {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
`;

const SizeText = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const RatioOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  
  ${media.down('sm')} {
    grid-template-columns: 1fr;
  }
`;

const RatioOption = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${({ theme, isSelected }) => 
    isSelected ? theme.colors.highlight : theme.colors.surfaceAlt};
  border: 2px solid ${({ theme, isSelected }) => 
    isSelected ? theme.colors.primary : 'transparent'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme, isSelected }) => 
      isSelected ? theme.colors.highlight : theme.colors.surfaceAlt};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.colors.shadow};
  }
`;

const OptionIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: ${({ theme, isSelected }) => 
    isSelected ? theme.colors.primary : theme.colors.surface};
  color: ${({ theme, isSelected }) => 
    isSelected ? '#fff' : theme.colors.textSecondary};
  border-radius: 8px;
  font-size: 1.25rem;
  transition: all 0.2s ease;
`;

const OptionContent = styled.div`
  flex: 1;
`;

const OptionTitle = styled.h4`
  margin: 0 0 0.25rem;
  font-size: 1rem;
  font-weight: 600;
`;

const OptionSize = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.25rem;
`;

const OptionDescription = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.4;
`;

export default AspectRatioSelector;