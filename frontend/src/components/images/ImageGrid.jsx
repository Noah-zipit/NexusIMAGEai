import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import anime from 'animejs';
import { saveAs } from 'file-saver';
import { FaDownload } from 'react-icons/fa';
import ImageCard from '../ui/ImageCard';
import ImageViewer from './ImageViewer';
import { media } from '../../styles/mixins';
import { useApp } from '../../contexts/AppContext';

const ImageGrid = ({ images = [], title = null, emptyMessage = 'No images to display' }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const gridRef = useRef(null);
  const { addNotification } = useApp();
  
  useEffect(() => {
    if (gridRef.current) {
      anime({
        targets: gridRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        easing: 'easeOutQuad',
        duration: 500
      });
    }
  }, []);
  
  const handleViewImage = (image) => {
    setSelectedImage(image);
    setViewerOpen(true);
  };
  
  const handleCloseViewer = () => {
    setViewerOpen(false);
  };
  
  const handleDownloadImage = async (image) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      
      // Generate a filename
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      const shortPrompt = image.prompt
        ? image.prompt.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_')
        : 'nexus_image';
      const filename = `nexus_${shortPrompt}_${timestamp}.png`;
      
      saveAs(blob, filename);
      
      addNotification({
        type: 'success',
        message: 'Image downloaded successfully',
        duration: 3000
      });
    } catch (error) {
      console.error('Download failed:', error);
      addNotification({
        type: 'error',
        message: 'Failed to download image',
        duration: 5000
      });
    }
  };
  
  return (
    <GridContainer ref={gridRef}>
      {title && <GridTitle>{title}</GridTitle>}
      
      {images.length > 0 ? (
        <Grid>
          {images.map((image, index) => (
            <ImageCard 
              key={image.id || index}
              image={image}
              onView={() => handleViewImage(image)}
              onDownload={() => handleDownloadImage(image)}
              index={index}
            />
          ))}
        </Grid>
      ) : (
        <EmptyState>
          <EmptyIcon>
            <FaDownload />
          </EmptyIcon>
          <EmptyText>{emptyMessage}</EmptyText>
        </EmptyState>
      )}
      
      {viewerOpen && selectedImage && (
        <ImageViewer 
          image={selectedImage}
          isOpen={viewerOpen}
          onClose={handleCloseViewer}
          onDownload={() => handleDownloadImage(selectedImage)}
        />
      )}
    </GridContainer>
  );
};

const GridContainer = styled.div`
  margin-bottom: 2rem;
  opacity: 0;
`;

const GridTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  
  ${media.down('sm')} {
    font-size: 1.25rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  
  ${media.down('sm')} {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-radius: 12px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 50%;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 300px;
  margin: 0 auto;
`;

export default ImageGrid;