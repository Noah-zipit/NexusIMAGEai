import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import anime from 'animejs';
import { FaCog } from 'react-icons/fa';
import ThemeSelector from '../components/settings/ThemeSelector';
import ModelSettings from '../components/settings/ModelSettings';
import AspectRatioSelector from '../components/settings/AspectRatioSelector';
import AppSettings from '../components/settings/AppSettings';
import { media } from '../styles/mixins';

const Settings = () => {
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
  
  return (
    <PageContainer ref={pageRef}>
      <PageHeader>
        <HeaderIcon>
          <FaCog />
        </HeaderIcon>
        <HeaderText>
          <h1>Settings</h1>
          <p>Customize your experience with Nexus Image Gen</p>
        </HeaderText>
      </PageHeader>
      
      <SettingsGrid>
        <ThemeSelector />
        <ModelSettings />
        <AspectRatioSelector />
        <AppSettings />
      </SettingsGrid>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  opacity: 0;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  
  ${media.down('sm')} {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const HeaderIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 16px;
  font-size: 2rem;
  
  ${media.down('sm')} {
    width: 48px;
    height: 48px;
    font-size: 1.5rem;
  }
`;

const HeaderText = styled.div`
  h1 {
    margin: 0 0 0.5rem;
    font-size: 2rem;
    
    ${media.down('sm')} {
      font-size: 1.75rem;
    }
  }
  
  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  ${media.up('lg')} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export default Settings;