import React, { useState } from 'react';
import styled from 'styled-components';
import { useGeneration } from '../contexts/GenerationContext';
import PromptInput from '../components/prompts/PromptInput';
import ImageUploader from '../components/prompts/ImageUploader';
import ImageGrid from '../components/images/ImageGrid';
import Loader from '../components/ui/Loader';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  color: ${props => props.theme.colors.text};
`;

const GenerationArea = styled.div`
  margin-bottom: 30px;
`;

const ResultsArea = styled.div`
  position: relative;
  min-height: 200px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: ${props => props.theme.colors.textDim};
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.backgroundOverlay};
  z-index: 10;
`;

const ErrorMessage = styled.div`
  padding: 15px;
  margin-bottom: 20px;
  background-color: ${props => props.theme.colors.dangerBg};
  color: ${props => props.theme.colors.danger};
  border-radius: 6px;
`;

const ModeToggle = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.border};
`;

const ModeButton = styled.button`
  flex: 1;
  padding: 10px;
  border: none;
  background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.backgroundAlt};
  color: ${props => props.active ? props.theme.colors.buttonText : props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  }
`;

const ImageGeneration = () => {
  const { 
    generateImages, 
    editImageWithPrompt,
    currentResults, 
    isGenerating, 
    error,
    generationMode,
    setGenerationMode,
    selectedImage,
    setSelectedImage
  } = useGeneration();

  const handleSubmit = (prompt) => {
    if (generationMode === 'text') {
      generateImages(prompt);
    } else {
      editImageWithPrompt(prompt);
    }
  };

  return (
    <Container>
      <Title>Image Generation</Title>
      
      <GenerationArea>
        <ModeToggle>
          <ModeButton 
            active={generationMode === 'text'} 
            onClick={() => setGenerationMode('text')}
          >
            Text to Image
          </ModeButton>
          <ModeButton 
            active={generationMode === 'image'} 
            onClick={() => setGenerationMode('image')}
          >
            Edit Image
          </ModeButton>
        </ModeToggle>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {generationMode === 'image' && (
          <ImageUploader 
            selectedImage={selectedImage} 
            setSelectedImage={setSelectedImage} 
          />
        )}
        
        <PromptInput 
          onSubmit={handleSubmit}
          placeholder={generationMode === 'text' ? 
            "Describe the image you want to create..." : 
            "Describe how you want to modify this image..."}
          isDisabled={isGenerating || (generationMode === 'image' && !selectedImage)}
          helpText={generationMode === 'image' && !selectedImage ? 
            "Please upload an image first" : ""}
        />
      </GenerationArea>
      
      <ResultsArea>
        {isGenerating && (
          <LoadingOverlay>
            <Loader size="large" />
            <p>Generating your {generationMode === 'text' ? 'image' : 'edited image'}...</p>
          </LoadingOverlay>
        )}
        
        {currentResults && currentResults.length > 0 ? (
          <ImageGrid 
            images={currentResults}
            emptyMessage="Your generated images will appear here"
          />
        ) : (
          !isGenerating && (
            <EmptyState>
              <p>Your generated images will appear here</p>
            </EmptyState>
          )
        )}
      </ResultsArea>
    </Container>
  );
};

export default ImageGeneration;