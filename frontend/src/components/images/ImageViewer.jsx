import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import anime from 'animejs';
import { FaDownload, FaShare, FaHeart } from 'react-icons/fa';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { flexBetween, flexCenter, media } from '../../styles/mixins';
import { useGeneration } from '../../contexts/GenerationContext';

const ImageViewer = ({ image, isOpen, onClose, onDownload }) => {
  const { toggleFavorite, favorites } = useGeneration();
  const imageRef = useRef(null);
  
  const isFavorite = favorites.includes(image.id);
  
  useEffect(() => {
    if (isOpen && imageRef.current) {
      anime({
        targets: imageRef.current,
        scale: [0.9, 1],
        opacity: [0, 1],
        easing: 'easeOutQuad',
        duration: 400
      });
    }
  }, [isOpen]);
  
  const handleFavoriteToggle = () => {
    toggleFavorite(image.id);
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Nexus Image Generation',
        text: `Check out this AI-generated image with prompt: "${image.prompt}"`,
        url: image.url
      }).catch(console.error);
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Image Preview"
      size="lg"
    >
      <ViewerContent>
        <ImageContainer ref={imageRef}>
          <FullImage 
            src={image.url} 
            alt={image.prompt || 'Generated image'}
          />
        </ImageContainer>
        
        <ImageDetails>
          <PromptText>{image.prompt}</PromptText>
          
          <ImageMeta>
            <MetaItem>
              <MetaLabel>Model:</MetaLabel>
              <MetaValue>{image.model || 'Standard'}</MetaValue>
            </MetaItem>
            
            <MetaItem>
              <MetaLabel>Size:</MetaLabel>
              <MetaValue>{image.size || '1024x1024'}</MetaValue>
            </MetaItem>
            
            {image.timestamp && (
              <MetaItem>
                <MetaLabel>Created:</MetaLabel>
                <MetaValue>
                  {new Date(image.timestamp).toLocaleString()}
                </MetaValue>
              </MetaItem>
            )}
          </ImageMeta>
        </ImageDetails>
        
        <ActionBar>
          <ActionButton 
            variant="outline"
            icon={<FaHeart color={isFavorite ? '#ff00bf' : 'currentColor'} />}
            onClick={handleFavoriteToggle}
          >
            {isFavorite ? 'Favorited' : 'Favorite'}
          </ActionButton>
          
          <ActionButton 
            variant="outline"
            icon={<FaShare />}
            onClick={handleShare}
          >
            Share
          </ActionButton>
          
          <ActionButton 
            variant="primary"
            icon={<FaDownload />}
            onClick={onDownload}
          >
            Download
          </ActionButton>
        </ActionBar>
      </ViewerContent>
    </Modal>
  );
};

const ViewerContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ImageContainer = styled.div`
  ${flexCenter};
  opacity: 0;
  border-radius: 12px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  max-height: 70vh;
`;

const FullImage = styled.img`
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
`;

const ImageDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PromptText = styled.p`
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
  
  ${media.up('md')} {
    font-size: 1.125rem;
  }
`;

const ImageMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  padding: 1rem;
  border-radius: 8px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${media.down('sm')} {
    width: 100%;
  }
`;

const MetaLabel = styled.span`
  font-weight: 600;
  font-size: 0.875rem;
`;

const MetaValue = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ActionBar = styled.div`
  ${flexBetween};
  
  ${media.down('sm')} {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const ActionButton = styled(Button)`
  ${media.down('sm')} {
    width: 100%;
  }
`;

export default ImageViewer;