import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import anime from 'animejs';
import { FaDownload, FaHeart, FaShare, FaEye } from 'react-icons/fa';
import { flexCenter, glassMorphism, media } from '../../styles/mixins';
import { useGeneration } from '../../contexts/GenerationContext';

const ImageCard = ({ image, onView, onDownload, index = 0 }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toggleFavorite, favorites } = useGeneration();
  const cardRef = useRef(null);
  const actionsRef = useRef(null);
  
  const isFavorite = image && image.id ? favorites.includes(image.id) : false;
  
  useEffect(() => {
    if (cardRef.current) {
      // Staggered entry animation
      anime({
        targets: cardRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        delay: index * 100,
        easing: 'easeOutQuad',
        duration: 500
      });
    }
  }, [index]);
  
  useEffect(() => {
    if (actionsRef.current && isHovering) {
      anime({
        targets: actionsRef.current.querySelectorAll('button'),
        opacity: [0, 1],
        translateY: [10, 0],
        delay: anime.stagger(50),
        easing: 'easeOutQuad',
        duration: 200
      });
    }
  }, [isHovering]);
  
  if (!image || !image.url) {
    return null;
  }
  
  const handleDownload = () => {
    if (onDownload) {
      onDownload(image);
    }
  };
  
  const handleView = () => {
    if (onView) {
      onView(image);
    }
  };
  
  const handleToggleFavorite = () => {
    if (image.id) {
      toggleFavorite(image.id);
    }
  };
  
  const handleShare = () => {
    // Implementation for sharing functionality
    if (navigator.share) {
      navigator.share({
        title: 'Nexus Image Generation',
        text: `Check out this AI-generated image with prompt: "${image.prompt}"`,
        url: image.url
      }).catch(console.error);
    }
  };
  
  return (
    <Card 
      ref={cardRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={() => setIsHovering(true)}
      isLoaded={isLoaded}
    >
      <ImageContainer onClick={handleView}>
        {!isLoaded && <LoadingOverlay />}
        <StyledImage 
          src={image.url} 
          alt={image.prompt || 'Generated image'}
          onLoad={() => setIsLoaded(true)}
        />
        <PromptOverlay isVisible={isHovering}>
          <PromptText>{image.prompt}</PromptText>
        </PromptOverlay>
      </ImageContainer>
      
      <ActionsBar ref={actionsRef} isVisible={isHovering}>
        <ActionButton onClick={handleView} aria-label="View image">
          <FaEye />
        </ActionButton>
        <ActionButton onClick={handleDownload} aria-label="Download image">
          <FaDownload />
        </ActionButton>
        <ActionButton 
          onClick={handleToggleFavorite} 
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          isFavorite={isFavorite}
        >
          <FaHeart />
        </ActionButton>
        <ActionButton onClick={handleShare} aria-label="Share image">
          <FaShare />
        </ActionButton>
      </ActionsBar>
    </Card>
  );
};

const Card = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 4px 20px ${({ theme }) => theme.colors.shadow};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  opacity: 0;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px ${({ theme }) => theme.colors.shadow};
  }
  
  ${media.down('md')} {
    &:active {
      transform: scale(0.98);
    }
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%; /* 1:1 Aspect Ratio */
  cursor: pointer;
  overflow: hidden;
`;

const StyledImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  
  &:after {
    content: '';
    width: 30px;
    height: 30px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top-color: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const PromptOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.75rem;
  ${glassMorphism(0.9)};
  transform: translateY(${({ isVisible }) => isVisible ? '0' : '100%'});
  transition: transform 0.3s ease;
`;

const PromptText = styled.p`
  margin: 0;
  font-size: 0.75rem;
  font-weight: 500;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ActionsBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.surface};
  
  ${media.up('md')} {
    ${({ isVisible }) => !isVisible && `
      button {
        opacity: 0;
      }
    `}
  }
`;

const ActionButton = styled.button`
  ${flexCenter};
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme, isFavorite }) => 
    isFavorite ? theme.colors.accent : theme.colors.textSecondary};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.highlight};
    color: ${({ theme, isFavorite }) => 
      isFavorite ? theme.colors.accent : theme.colors.primary};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export default ImageCard;