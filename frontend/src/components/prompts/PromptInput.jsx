import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import anime from 'animejs';
import { FaPaperPlane, FaRandom, FaLightbulb } from 'react-icons/fa';
import Button from '../ui/Button';
import { flexBetween, media, card } from '../../styles/mixins';
import { useGeneration } from '../../contexts/GenerationContext';

const examplePrompts = [
  "A serene Japanese garden with a koi pond in autumn",
  "Futuristic neon cityscape with flying cars and holographic billboards",
  "A cozy cabin in the woods during a snowstorm at night",
  "Underwater temple ruins with ancient statues and bioluminescent plants",
  "A magical library with floating books and portals to other worlds",
  "A cyberpunk street market with vendors selling exotic technology",
  "A medieval fantasy tavern filled with diverse adventurers",
  "An alien landscape with strange plants and multiple moons in the sky"
];

const PromptInput = () => {
  const [prompt, setPrompt] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);
  const { isGenerating, generateImages } = useGeneration();
  
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
    const handleResize = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [prompt]);
  
  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    
    if (!isExpanded && e.target.value.length > 0) {
      setIsExpanded(true);
    } else if (isExpanded && e.target.value.length === 0) {
      setIsExpanded(false);
    }
  };
  
  const handleSubmit = () => {
    if (prompt.trim() && !isGenerating) {
      generateImages(prompt);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  const getRandomPrompt = () => {
    const randomPrompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
    setPrompt(randomPrompt);
    setIsExpanded(true);
    
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
  return (
    <PromptContainer ref={containerRef}>
      <PromptHeader isExpanded={isExpanded}>
        <PromptTitle>Describe Your Vision</PromptTitle>
        <RandomPromptButton onClick={getRandomPrompt}>
          <FaRandom />
          <span>Random</span>
        </RandomPromptButton>
      </PromptHeader>
      
      <PromptInputWrapper>
        <StyledTextarea
          ref={textareaRef}
          value={prompt}
          onChange={handlePromptChange}
          onKeyPress={handleKeyPress}
          placeholder="Describe the image you want to create..."
          rows={1}
        />
        
        <SubmitButton
          variant="primary"
          icon={<FaPaperPlane />}
          onClick={handleSubmit}
          disabled={!prompt.trim() || isGenerating}
          loading={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate'}
        </SubmitButton>
      </PromptInputWrapper>
      
      <PromptSuggestions>
        <SuggestionTitle>
          <FaLightbulb />
          <span>Need inspiration? Try these prompts:</span>
        </SuggestionTitle>
        
        <SuggestionChips>
          {examplePrompts.slice(0, 4).map((examplePrompt, index) => (
            <SuggestionChip 
              key={index}
              onClick={() => {
                setPrompt(examplePrompt);
                setIsExpanded(true);
              }}
            >
              {examplePrompt.length > 40 
                ? examplePrompt.substring(0, 40) + '...' 
                : examplePrompt}
            </SuggestionChip>
          ))}
        </SuggestionChips>
      </PromptSuggestions>
    </PromptContainer>
  );
};

const PromptContainer = styled.div`
  ${card};
  margin-bottom: 2rem;
  opacity: 0;
`;

const PromptHeader = styled.div`
  ${flexBetween};
  margin-bottom: 1rem;
  
  ${media.down('sm')} {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const PromptTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0;
  
  ${media.down('sm')} {
    font-size: 1.25rem;
  }
`;

const RandomPromptButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.highlight};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const PromptInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  
  ${media.down('sm')} {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const StyledTextarea = styled.textarea`
  flex: 1;
  min-height: 56px;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  resize: none;
  transition: all 0.2s ease;
  overflow: hidden;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.highlight};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.7;
  }
  
  ${media.down('sm')} {
    width: 100%;
  }
`;

const SubmitButton = styled(Button)`
  height: 56px;
  
  ${media.down('sm')} {
    width: 100%;
  }
`;

const PromptSuggestions = styled.div`
  margin-top: 1.5rem;
`;

const SuggestionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  
  svg {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const SuggestionChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SuggestionChip = styled.button`
  padding: 0.5rem 0.75rem;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-radius: 8px;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  
  &:hover {
    background: ${({ theme }) => theme.colors.highlight};
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }
`;

export default PromptInput;