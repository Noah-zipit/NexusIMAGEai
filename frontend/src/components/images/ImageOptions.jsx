import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import anime from 'animejs';
import { FaImage, FaDownload } from 'react-icons/fa';
import { flexBetween, flexCenter, card, media } from '../../styles/mixins';
import { useGeneration } from '../../contexts/GenerationContext';
import RadioSelector from '../ui/RadioSelector';

const optionsData = [
  { value: 1, label: '1 Image' },
  { value: 2, label: '2 Images' },
  { value: 3, label: '3 Images' },
  { value: 4, label: '4 Images' }
];

const ImageOptions = () => {
  const { numImages, setNumImages } = useGeneration();
  const containerRef = useRef(null);
  
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
  
  return (
    <OptionsContainer ref={containerRef}>
      <OptionsHeader>
        <SectionTitle>
          <FaImage />
          <span>Number of Images</span>
        </SectionTitle>
      </OptionsHeader>
      
      <OptionsContent>
        <RadioSelector
          options={optionsData}
          value={numImages}
          onChange={setNumImages}
          name="num-images"
          orientation="horizontal"
        />
        
        <OptionsInfo>
          <InfoIcon>
            <FaDownload />
          </InfoIcon>
          <InfoText>
            Generating multiple images allows you to explore different interpretations of your prompt. More images may take longer to generate.
          </InfoText>
        </OptionsInfo>
      </OptionsContent>
    </OptionsContainer>
  );
};

const OptionsContainer = styled.div`
  ${card};
  margin-bottom: 2rem;
  opacity: 0;
`;

const OptionsHeader = styled.div`
  ${flexBetween};
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

const OptionsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const OptionsInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-radius: 10px;
  
  ${media.down('sm')} {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
`;

const InfoIcon = styled.div`
  ${flexCenter};
  width: 48px;
  height: 48px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textSecondary};
  border-radius: 10px;
  font-size: 1.25rem;
  
  ${media.down('sm')} {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }
`;

const InfoText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

export default ImageOptions;