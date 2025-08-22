import React from 'react';
import styled from 'styled-components';
import { useGeneration } from '../../contexts/GenerationContext';
import RadioSelector from '../ui/RadioSelector';

const Container = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h3`
  font-size: 18px;
  margin-bottom: 16px;
  color: ${props => props.theme.colors.text};
`;

const ModelDescription = styled.p`
  margin-top: 8px;
  font-size: 14px;
  color: ${props => props.theme.colors.textDim};
`;

// Updated model options to only include the working models
const availableModels = [
  { 
    id: 'img3', 
    name: 'Image Generator v3', 
    description: 'Standard image generation with good balance of speed and quality' 
  },
  { 
    id: 'img4', 
    name: 'Image Generator v4', 
    description: 'Improved image quality and detail with better composition' 
  }
];

const ModelSettings = () => {
  const { model, setModel } = useGeneration();
  
  const handleModelChange = (modelId) => {
    setModel(modelId);
  };
  
  // Find the current model description
  const currentModelDesc = availableModels.find(m => m.id === model)?.description || '';
  
  return (
    <Container>
      <Title>Model Selection</Title>
      
      <RadioSelector
        options={availableModels.map(model => ({
          value: model.id,
          label: model.name
        }))}
        value={model}
        onChange={handleModelChange}
      />
      
      <ModelDescription>{currentModelDesc}</ModelDescription>
    </Container>
  );
};

export default ModelSettings;