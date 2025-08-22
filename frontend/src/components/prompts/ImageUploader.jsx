import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import Button from '../ui/Button';

const ImageUploadContainer = styled.div`
  margin-bottom: 20px;
  width: 100%;
`;

const UploadArea = styled.div`
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.backgroundAlt};
  }
`;

const ImagePreview = styled.div`
  margin-top: 15px;
  position: relative;
  
  img {
    max-width: 100%;
    max-height: 300px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: ${props => props.theme.colors.danger};
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    
    &:hover {
      background: ${props => props.theme.colors.dangerHover};
    }
  }
`;

const FileInput = styled.input`
  display: none;
`;

const UploadText = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.text};
  font-size: 16px;
`;

const HelpText = styled.p`
  margin: 10px 0 0;
  color: ${props => props.theme.colors.textDim};
  font-size: 14px;
`;

const ImageUploader = ({ onImageSelect, selectedImage, setSelectedImage }) => {
  const fileInputRef = useRef(null);
  
  const handleAreaClick = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      console.log("Selected file:", file.name, file.type, file.size);
      
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage({
          file,         // Store the actual file object
          preview: reader.result
        });
        
        if (onImageSelect) {
          onImageSelect(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    setSelectedImage(null);
    fileInputRef.current.value = '';
  };
  
  return (
    <ImageUploadContainer>
      {!selectedImage ? (
        <UploadArea onClick={handleAreaClick}>
          <UploadText>Click to upload an image or drag and drop</UploadText>
          <HelpText>Supported formats: JPG, PNG, WEBP (Max: 5MB)</HelpText>
        </UploadArea>
      ) : (
        <ImagePreview>
          <img src={selectedImage.preview} alt="Preview" />
          <button onClick={handleRemoveImage}>×</button>
        </ImagePreview>
      )}
      <FileInput 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/jpeg,image/png,image/webp" 
      />
    </ImageUploadContainer>
  );
};

export default ImageUploader;