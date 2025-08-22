import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import anime from 'animejs';
import { FaHistory, FaHeart, FaSearch, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import ImageGrid from '../components/images/ImageGrid';
import InputField from '../components/ui/InputField';
import { flexBetween, media } from '../styles/mixins';
import { useGeneration } from '../contexts/GenerationContext';

const Gallery = () => {
  const { history, favorites } = useGeneration();
  const [activeTab, setActiveTab] = useState('history');
  const [searchQuery, setSearchQuery] = useState('');
  const pageRef = useRef(null);
  
  useEffect(() => {
    if (pageRef.current) {
      anime({
        targets: pageRef.current,
        opacity: [0, 1],
        easing: 'easeOutQuad',
        duration: 500
      });
    }
  }, []);
  
  // Flatten history items into individual images
  const historyImages = history.reduce((acc, item) => {
    if (item.images && item.images.length) {
      const itemImages = item.images.map((url, index) => ({
        id: `${item.id}-${index}`,
        url,
        prompt: item.prompt,
        model: item.model,
        size: item.size,
        timestamp: item.timestamp
      }));
      return [...acc, ...itemImages];
    }
    return acc;
  }, []);
  
  // Filter images based on search query
  const filteredHistoryImages = searchQuery
    ? historyImages.filter(img => 
        img.prompt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : historyImages;
  
  const filteredFavoriteImages = searchQuery
    ? historyImages.filter(img => 
        favorites.includes(img.id) && 
        img.prompt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : historyImages.filter(img => favorites.includes(img.id));
  
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  return (
    <PageContainer ref={pageRef}>
      <PageHeader>
        <h1>Your Gallery</h1>
        
        <SearchContainer>
          <SearchInput 
            id="gallery-search"
            placeholder="Search by prompt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<FaSearch />}
          />
          
          {searchQuery && (
            <ClearSearchButton onClick={clearSearch}>
              <FaTimes />
            </ClearSearchButton>
          )}
        </SearchContainer>
      </PageHeader>
      
      <TabsContainer>
        <TabButton 
          isActive={activeTab === 'history'}
          onClick={() => setActiveTab('history')}
        >
          <FaHistory />
          <span>History</span>
          <TabCount>{filteredHistoryImages.length}</TabCount>
        </TabButton>
        
        <TabButton 
          isActive={activeTab === 'favorites'}
          onClick={() => setActiveTab('favorites')}
        >
          <FaHeart />
          <span>Favorites</span>
          <TabCount>{filteredFavoriteImages.length}</TabCount>
        </TabButton>
      </TabsContainer>
      
      {activeTab === 'history' && (
        filteredHistoryImages.length > 0 ? (
          <ImageGrid 
            images={filteredHistoryImages}
            emptyMessage={
              searchQuery 
                ? "No images match your search" 
                : "Your generation history is empty"
            }
          />
        ) : (
          <EmptyState>
            <EmptyMessage>
              {searchQuery 
                ? "No images match your search" 
                : "Your gallery is empty. Generate some images to see them here!"}
            </EmptyMessage>
            <Button 
              as={Link} 
              to="/generate" 
              variant="primary"
            >
              Create Images
            </Button>
          </EmptyState>
        )
      )}
      
      {activeTab === 'favorites' && (
        filteredFavoriteImages.length > 0 ? (
          <ImageGrid 
            images={filteredFavoriteImages}
            emptyMessage={
              searchQuery 
                ? "No favorites match your search" 
                : "You haven't favorited any images yet"
            }
          />
        ) : (
          <EmptyState>
            <EmptyMessage>
              {searchQuery 
                ? "No favorites match your search" 
                : "You haven't favorited any images yet. Click the heart icon on images you love!"}
            </EmptyMessage>
            <Button 
              as={Link} 
              to="/generate" 
              variant="primary"
            >
              Create Images
            </Button>
          </EmptyState>
        )
      )}
    </PageContainer>
  );
};

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  opacity: 0;
`;

const PageHeader = styled.div`
  ${flexBetween};
  margin-bottom: 2rem;
  
  h1 {
    margin: 0;
  }
  
  ${media.down('md')} {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
  
  ${media.down('md')} {
    width: 100%;
  }
`;

const SearchInput = styled(InputField)`
  margin-bottom: 0;
`;

const ClearSearchButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  ${media.down('sm')} {
    gap: 0.5rem;
  }
`;

const TabButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: ${({ theme, isActive }) => 
    isActive ? theme.colors.primary : theme.colors.surfaceAlt};
  color: ${({ theme, isActive }) => 
    isActive ? 'white' : theme.colors.text};
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme, isActive }) => 
      isActive ? theme.colors.primaryLight : theme.colors.highlight};
    transform: translateY(-2px);
  }
  
  ${media.down('sm')} {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
`;

const TabCount = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 0.5rem;
  background: ${({ theme }) => 'rgba(255, 255, 255, 0.2)'};
  border-radius: 12px;
  font-size: 0.75rem;
  
  ${media.down('sm')} {
    min-width: 20px;
    height: 20px;
    font-size: 0.7rem;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-radius: 12px;
  text-align: center;
`;

const EmptyMessage = styled.p`
  margin: 0 0 2rem;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 400px;
`;

export default Gallery;