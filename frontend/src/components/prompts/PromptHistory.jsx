import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import anime from 'animejs';
import { FaHistory, FaTrash } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { media, card, ellipsis, flexBetween } from '../../styles/mixins';
import { useGeneration } from '../../contexts/GenerationContext';

const PromptHistory = ({ onSelectPrompt }) => {
  const { history, clearHistory } = useGeneration();
  const containerRef = useRef(null);
  const historyItemsRef = useRef([]);
  
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
    if (historyItemsRef.current.length) {
      anime({
        targets: historyItemsRef.current,
        opacity: [0, 1],
        translateY: [10, 0],
        delay: anime.stagger(50),
        easing: 'easeOutQuad',
        duration: 400
      });
    }
  }, [history]);
  
  const handleSelectPrompt = (prompt) => {
    if (onSelectPrompt) {
      onSelectPrompt(prompt);
    }
  };
  
  const getTimeAgo = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };
  
  return (
    <HistoryContainer ref={containerRef}>
      <HistoryHeader>
        <SectionTitle>
          <FaHistory />
          <span>Your Prompt History</span>
        </SectionTitle>
        
        <ClearButton onClick={clearHistory}>
          <FaTrash />
          <span>Clear</span>
        </ClearButton>
      </HistoryHeader>
      
      {history.length > 0 ? (
        <HistoryItems>
          {history.map((item, index) => (
            <HistoryItem 
              key={item.id || index}
              ref={el => historyItemsRef.current[index] = el}
              onClick={() => handleSelectPrompt(item.prompt)}
            >
              <HistoryItemContent>
                <PromptText>{item.prompt}</PromptText>
                <HistoryMeta>
                  <ModelTag>{item.model}</ModelTag>
                  <TimeAgo>{getTimeAgo(item.timestamp)}</TimeAgo>
                </HistoryMeta>
              </HistoryItemContent>
              
              {item.images && item.images.length > 0 && (
                <ThumbnailPreview>
                  <ThumbnailImage 
                    src={item.images[0]} 
                    alt={item.prompt}
                    loading="lazy"
                  />
                </ThumbnailPreview>
              )}
            </HistoryItem>
          ))}
        </HistoryItems>
      ) : (
        <EmptyHistory>
          <p>Your prompt history will appear here</p>
        </EmptyHistory>
      )}
    </HistoryContainer>
  );
};

const HistoryContainer = styled.div`
  ${card};
  opacity: 0;
`;

const HistoryHeader = styled.div`
  ${flexBetween};
  margin-bottom: 1rem;
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

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.error};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.error}15;
  }
  
  svg {
    font-size: 0.875rem;
  }
`;

const HistoryItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const HistoryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0;
  
  &:hover {
    background: ${({ theme }) => theme.colors.highlight};
    transform: translateY(-2px);
  }
`;

const HistoryItemContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const PromptText = styled.p`
  ${ellipsis};
  margin: 0 0 0.25rem;
  font-size: 0.9375rem;
  font-weight: 500;
  
  ${media.down('sm')} {
    font-size: 0.875rem;
  }
`;

const HistoryMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ModelTag = styled.span`
  padding: 0.25rem 0.5rem;
  background: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const TimeAgo = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ThumbnailPreview = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
  
  ${media.up('md')} {
    width: 60px;
    height: 60px;
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const EmptyHistory = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9375rem;
  font-style: italic;
`;

export default PromptHistory;