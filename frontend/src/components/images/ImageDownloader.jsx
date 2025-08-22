import React, { useState } from 'react';
import styled from 'styled-components';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { FaDownload, FaCheck, FaSpinner } from 'react-icons/fa';
import Button from '../ui/Button';
import { flexCenter, card, media } from '../../styles/mixins';
import { useApp } from '../../contexts/AppContext';

const ImageDownloader = ({ images = [], zipFilename = 'nexus_images.zip' }) => {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { addNotification } = useApp();
  
  const handleDownloadSingle = async (image) => {
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
  
  const handleDownloadAll = async () => {
    if (images.length === 0 || downloading) return;
    
    setDownloading(true);
    setProgress(0);
    
    try {
      const zip = new JSZip();
      
      // Download each image and add to zip
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const response = await fetch(image.url);
        const blob = await response.blob();
        
        // Generate a filename
        const shortPrompt = image.prompt
          ? image.prompt.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_')
          : 'nexus_image';
        const filename = `nexus_${shortPrompt}_${i}.png`;
        
        zip.file(filename, blob);
        
        // Update progress
        setProgress(Math.floor(((i + 1) / images.length) * 100));
      }
      
      // Generate and download zip
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, zipFilename);
      
      addNotification({
        type: 'success',
        message: `${images.length} images downloaded as ZIP`,
        duration: 3000
      });
    } catch (error) {
      console.error('Batch download failed:', error);
      addNotification({
        type: 'error',
        message: 'Failed to download images',
        duration: 5000
      });
    } finally {
      setDownloading(false);
    }
  };
  
  return (
    <DownloaderContainer>
      <DownloaderHeader>
        <HeaderText>
          <FaDownload />
          <span>{images.length} Images Ready</span>
        </HeaderText>
        
        <Button
          variant="primary"
          onClick={handleDownloadAll}
          disabled={downloading || images.length === 0}
          icon={downloading ? <FaSpinner /> : <FaDownload />}
        >
          {downloading ? `Downloading (${progress}%)` : 'Download All'}
        </Button>
      </DownloaderHeader>
      
      {downloading && (
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>
      )}
      
      <ImagesGrid>
        {images.map((image, index) => (
          <ImageThumbnail key={image.id || index}>
            <ThumbnailImg src={image.url} alt={`Image ${index + 1}`} />
            <DownloadButton onClick={() => handleDownloadSingle(image)}>
              <FaDownload />
            </DownloadButton>
          </ImageThumbnail>
        ))}
      </ImagesGrid>
    </DownloaderContainer>
  );
};

const DownloaderContainer = styled.div`
  ${card};
  margin-bottom: 2rem;
`;

const DownloaderHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  
  ${media.down('sm')} {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const HeaderText = styled.h3`
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

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-radius: 3px;
  margin-bottom: 1.5rem;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.colors.primary};
  width: ${({ progress }) => `${progress}%`};
  transition: width 0.3s ease;
`;

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  
  ${media.up('md')} {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
`;

const ImageThumbnail = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 1;
  
  &:hover button {
    opacity: 1;
  }
`;

const ThumbnailImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DownloadButton = styled.button`
  ${flexCenter};
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  opacity: 0;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    transform: scale(1.1);
  }
  
  ${media.down('md')} {
    opacity: 1;
  }
`;

export default ImageDownloader;