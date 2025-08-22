import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import anime from 'animejs';
import { FaHistory, FaLightbulb } from 'react-icons/fa';
import { media, card, ellipsis } from '../../styles/mixins';

const SuggestionList = ({ 
  title = 'Suggestions',
  suggestions = [],
  recent = [],
  onSelect,
  icon = <FaLightbulb />,
  emptyMessage = 'No suggestions available yet',
  maxItems = 5
}) => {
  const containerRef = useRef(null);
  const itemsRef = useRef([]);
  
  useEffect(() => {
    if (containerRef.current) {
      anime({
        targets: containerRef.current,
        opacity: [0, 1],
        translateY: [10, 0],
        easing: 'easeOutQuad',
        duration: 500
      });
    }
  }, []);
  
  useEffect(() => {
    if (itemsRef.current.length) {
      anime({
        targets: itemsRef.current,
        opacity: [0, 1],
        translateX: [-10, 0],
        delay: anime.stagger(50),
        easing: 'easeOutQuad',
        duration: 400
      });
    }
  }, [suggestions, recent]);
  
  const handleSelect = (text) => {
    if (onSelect) {
      onSelect(text);
    }
  };
  
  const displayedSuggestions = suggestions.slice(0, maxItems);
  const displayedRecent = recent.slice(0, maxItems);
  
  return (
    <SuggestionContainer ref={containerRef}>
      <SectionTitle>
        {icon}
        <span>{title}</span>
      </SectionTitle>
      
      {displayedSuggestions.length > 0 ? (
        <SuggestionItems>
          {displayedSuggestions.map((suggestion, index) => (
            <SuggestionItem 
              key={`suggestion-${index}`}
              ref={el => itemsRef.current[index] = el}
              onClick={() => handleSelect(suggestion.text || suggestion)}
            >
              <SuggestionText>
                {suggestion.text || suggestion}
              </SuggestionText>
            </SuggestionItem>
          ))}
        </SuggestionItems>
      ) : (
        <EmptyMessage>{emptyMessage}</EmptyMessage>
      )}
      
      {displayedRecent.length > 0 && (
        <>
          <SectionTitle>
            <FaHistory />
            <span>Recent Prompts</span>
          </SectionTitle>
          
          <SuggestionItems>
            {displayedRecent.map((item, index) => (
              <SuggestionItem 
                key={`recent-${index}`}
                ref={el => itemsRef.current[suggestions.length + index] = el}
                onClick={() => handleSelect(item.prompt || item)}
              >
                <SuggestionText>
                  {item.prompt || item}
                </SuggestionText>
              </SuggestionItem>
            ))}
          </SuggestionItems>
        </>
      )}
    </SuggestionContainer>
  );
};

const SuggestionContainer = styled.div`
  ${card};
  margin-bottom: 2rem;
  opacity: 0;
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SuggestionItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const SuggestionItem = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-radius: 8px;
  text-align: left;
  transition: all 0.2s ease;
  opacity: 0;
  
  &:hover {
    background: ${({ theme }) => theme.colors.highlight};
    transform: translateX(5px);
  }
`;

const SuggestionText = styled.span`
  ${ellipsis};
  font-size: 0.9375rem;
  
  ${media.down('sm')} {
    font-size: 0.875rem;
  }
`;

const EmptyMessage = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9375rem;
  font-style: italic;
  margin: 1rem 0 1.5rem;
`;

export default SuggestionList;