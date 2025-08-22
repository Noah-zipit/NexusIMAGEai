import React, { createContext, useState, useCallback, useReducer } from 'react';
import { generateImage, editImage } from '../services/api';
import imageProcessor from '../utils/imageProcessor';

// Initial state for the generator
const initialState = {
  model: 'img3',
  size: '1024x1024',
  aspectRatio: '1:1',
  numImages: 1,
  lastPrompt: '',
  history: [],
  favorites: []
};

// Reducer for handling state updates
function generationReducer(state, action) {
  switch (action.type) {
    case 'SET_MODEL':
      return { ...state, model: action.payload };
    case 'SET_SIZE':
      return { ...state, size: action.payload };
    case 'SET_ASPECT_RATIO':
      return { ...state, aspectRatio: action.payload };
    case 'SET_NUM_IMAGES':
      return { ...state, numImages: action.payload };
    case 'SET_LAST_PROMPT':
      return { ...state, lastPrompt: action.payload };
    case 'ADD_TO_HISTORY':
      // Add to beginning and maintain max 20 items
      return { 
        ...state, 
        history: [action.payload, ...state.history].slice(0, 20) 
      };
    case 'TOGGLE_FAVORITE':
      const imageId = action.payload;
      const isFavorite = state.favorites.includes(imageId);
      return {
        ...state,
        favorites: isFavorite
          ? state.favorites.filter(id => id !== imageId)
          : [...state.favorites, imageId]
      };
    case 'CLEAR_HISTORY':
      return { ...state, history: [] };
    default:
      return state;
  }
}

const GenerationContext = createContext();

export const GenerationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(generationReducer, initialState);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentResults, setCurrentResults] = useState([]);
  const [error, setError] = useState(null);
  const [generationMode, setGenerationMode] = useState('text'); // 'text' or 'image'
  const [selectedImage, setSelectedImage] = useState(null);

  // Load saved state from localStorage on init
  React.useEffect(() => {
    try {
      const savedState = localStorage.getItem('nexus_generator_state');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        Object.keys(initialState).forEach(key => {
          if (key in parsedState) {
            dispatch({ type: `SET_${key.toUpperCase()}`, payload: parsedState[key] });
          }
        });
      }
    } catch (err) {
      console.error('Failed to load generator state:', err);
    }
  }, []);

  // Save state to localStorage when it changes
  React.useEffect(() => {
    try {
      localStorage.setItem('nexus_generator_state', JSON.stringify(state));
    } catch (err) {
      console.error('Failed to save generator state:', err);
    }
  }, [state]);

  // Set generation parameters
  const setModel = useCallback((model) => {
    dispatch({ type: 'SET_MODEL', payload: model });
  }, []);

  const setSize = useCallback((size) => {
    dispatch({ type: 'SET_SIZE', payload: size });
  }, []);

  const setAspectRatio = useCallback((ratio) => {
    dispatch({ type: 'SET_ASPECT_RATIO', payload: ratio });
    
    // Update size based on aspect ratio
    if (ratio === '1:1') {
      dispatch({ type: 'SET_SIZE', payload: '1024x1024' });
    } else if (ratio === '16:9') {
      dispatch({ type: 'SET_SIZE', payload: '1792x1024' });
    } else if (ratio === '9:16') {
      dispatch({ type: 'SET_SIZE', payload: '1024x1792' });
    }
  }, []);

  const setNumImages = useCallback((num) => {
    dispatch({ type: 'SET_NUM_IMAGES', payload: num });
  }, []);

  // Handle image generation
  const generateImages = useCallback(async (prompt) => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // Store the current prompt
      dispatch({ type: 'SET_LAST_PROMPT', payload: prompt });
      
      // Make API request
      console.log("Sending text-to-image request with params:", {
        model: state.model,
        prompt,
        n: state.numImages,
        size: state.size
      });
      
      const response = await generateImage({
        model: state.model,
        prompt,
        n: state.numImages,
        size: state.size
      });
      
      console.log("API Response:", response);
      
      // Extract images from the response
      let imageUrls = [];
      
      if (response.data && Array.isArray(response.data.images)) {
        imageUrls = response.data.images;
      }
      
      if (imageUrls.length === 0) {
        throw new Error('No images found in API response');
      }
      
      // Process the images
      const resultImages = imageUrls.map((url, index) => ({
        id: `${Date.now()}-${index}`,
        url,
        prompt,
        model: state.model,
        size: state.size,
        timestamp: Date.now()
      }));
      
      setCurrentResults(resultImages);
      
      // Auto download if enabled
      const autoDownload = localStorage.getItem('nexus_auto_download') === 'true';
      if (autoDownload && resultImages.length > 0) {
        resultImages.forEach(image => {
          const filename = imageProcessor.generateFilename({
            prompt: image.prompt,
            index: image.id
          });
          
          imageProcessor.downloadImage(image.url, filename)
            .catch(err => console.error('Auto-download failed:', err));
        });
      }
      
      // Only add to history if history saving is enabled
      const autoSave = localStorage.getItem('nexus_auto_save') !== 'false'; // Default to true
      if (autoSave) {
        dispatch({
          type: 'ADD_TO_HISTORY',
          payload: {
            id: Date.now().toString(),
            prompt,
            model: state.model,
            size: state.size,
            images: imageUrls,
            timestamp: Date.now()
          }
        });
      }
      
      return response;
    } catch (err) {
      console.error('Error generating images:', err);
      setError(err.message || 'Failed to generate images. Please try again.');
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [state.model, state.numImages, state.size]);
  
  // Handle image-to-image generation - FIXED VERSION
  const editImageWithPrompt = useCallback(async (prompt) => {
    if (!prompt.trim() || !selectedImage) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // Store the current prompt
      dispatch({ type: 'SET_LAST_PROMPT', payload: prompt });
      
      // Make sure we're accessing the actual file object correctly
      if (!selectedImage.file) {
        throw new Error('No image file found. Please upload an image and try again.');
      }
      
      // Add more logging to debug
      console.log("Sending image edit request with:", {
        model: state.model,
        prompt,
        size: state.size,
        image: selectedImage.file,
        imageType: selectedImage.file.type,
        imageSize: selectedImage.file.size,
        imageName: selectedImage.file.name
      });
      
      const response = await editImage({
        model: state.model,
        prompt,
        size: state.size,
        image: selectedImage.file  // Send the actual File object
      });
      
      console.log("Image edit API Response:", response);
      
      // Extract images from the response
      let imageUrls = [];
      
      if (response.data && Array.isArray(response.data.images)) {
        imageUrls = response.data.images;
      }
      
      if (imageUrls.length === 0) {
        throw new Error('No images found in API response');
      }
      
      // Process the images
      const resultImages = imageUrls.map((url, index) => ({
        id: `${Date.now()}-${index}`,
        url,
        prompt,
        model: state.model,
        size: state.size,
        isEdit: true,
        timestamp: Date.now()
      }));
      
      setCurrentResults(resultImages);
      
      // Auto download if enabled
      const autoDownload = localStorage.getItem('nexus_auto_download') === 'true';
      if (autoDownload && resultImages.length > 0) {
        resultImages.forEach(image => {
          const filename = imageProcessor.generateFilename({
            prompt: image.prompt,
            index: image.id,
            isEdit: true
          });
          
          imageProcessor.downloadImage(image.url, filename)
            .catch(err => console.error('Auto-download failed:', err));
        });
      }
      
      // Add to history
      const autoSave = localStorage.getItem('nexus_auto_save') !== 'false';
      if (autoSave) {
        dispatch({
          type: 'ADD_TO_HISTORY',
          payload: {
            id: Date.now().toString(),
            prompt,
            model: state.model,
            size: state.size,
            isEdit: true,
            images: imageUrls,
            timestamp: Date.now()
          }
        });
      }
      
      return response;
    } catch (err) {
      console.error('Error editing image:', err);
      setError(err.message || 'Failed to edit image. Please try again.');
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [state.model, state.size, selectedImage]);
  
  // Toggle image as favorite
  const toggleFavorite = useCallback((imageId) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: imageId });
  }, []);
  
  // Clear generation history
  const clearHistory = useCallback(() => {
    dispatch({ type: 'CLEAR_HISTORY' });
  }, []);
  
  return (
    <GenerationContext.Provider 
      value={{
        ...state,
        isGenerating,
        currentResults,
        error,
        setModel,
        setSize,
        setAspectRatio,
        setNumImages,
        generateImages,
        editImageWithPrompt,
        generationMode,
        setGenerationMode,
        selectedImage,
        setSelectedImage,
        toggleFavorite,
        clearHistory
      }}
    >
      {children}
    </GenerationContext.Provider>
  );
};

export const useGeneration = () => {
  const context = React.useContext(GenerationContext);
  if (context === undefined) {
    throw new Error('useGeneration must be used within a GenerationProvider');
  }
  return context;
};

export default GenerationContext;