import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import anime from 'animejs';
import { FaCog, FaDownload, FaHistory, FaTrash, FaInfoCircle } from 'react-icons/fa';
import { flexBetween, media, card } from '../../styles/mixins';
import Toggle from '../ui/Toggle';
import Button from '../ui/Button';
import { useGeneration } from '../../contexts/GenerationContext';
import { useApp } from '../../contexts/AppContext';

const AppSettings = () => {
  const { clearHistory } = useGeneration();
  const { addNotification } = useApp();
  const [autoDownload, setAutoDownload] = useState(
    localStorage.getItem('nexus_auto_download') === 'true'
  );
  const [autoSave, setAutoSave] = useState(
    localStorage.getItem('nexus_auto_save') !== 'false' // Default to true
  );
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (containerRef.current) {
      anime({
        targets: containerRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        easing: 'easeOutQuad',
        duration: 500
      });
    }
  }, []);
  
  const handleAutoDownloadChange = (checked) => {
    setAutoDownload(checked);
    localStorage.setItem('nexus_auto_download', checked);
    
    // Show confirmation notification
    addNotification({
      type: 'success',
      message: `Auto-download ${checked ? 'enabled' : 'disabled'}`,
      duration: 3000
    });
  };
  
  const handleAutoSaveChange = (checked) => {
    setAutoSave(checked);
    localStorage.setItem('nexus_auto_save', checked);
    
    // Show confirmation notification
    addNotification({
      type: 'success',
      message: `Save image history ${checked ? 'enabled' : 'disabled'}`,
      duration: 3000
    });
  };
  
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your generation history? This action cannot be undone.')) {
      clearHistory();
      addNotification({
        type: 'success',
        message: 'Generation history has been cleared',
        duration: 3000
      });
    }
  };
  
  const handleClearCache = () => {
    if (window.confirm('Are you sure you want to clear the application cache? This will reset all settings.')) {
      localStorage.clear();
      addNotification({
        type: 'success',
        message: 'Application cache has been cleared. Some settings will take effect after reload.',
        duration: 5000
      });
      
      // Reset state
      setAutoDownload(false);
      setAutoSave(true); // Default is true
    }
  };
  
  return (
    <SettingsContainer ref={containerRef}>
      <SettingsHeader>
        <SectionTitle>
          <FaCog />
          <span>Application Settings</span>
        </SectionTitle>
      </SettingsHeader>
      
      <SettingsContent>
        <SettingItem>
          <SettingInfo>
            <SettingLabel>
              <FaDownload />
              <span>Auto-Download Images</span>
            </SettingLabel>
            <SettingDescription>
              Automatically download images after generation
            </SettingDescription>
          </SettingInfo>
          <Toggle 
            id="auto-download"
            checked={autoDownload}
            onChange={handleAutoDownloadChange}
          />
        </SettingItem>
        
        <SettingItem>
          <SettingInfo>
            <SettingLabel>
              <FaHistory />
              <span>Save Image History</span>
            </SettingLabel>
            <SettingDescription>
              Keep a record of your generated images and prompts
            </SettingDescription>
          </SettingInfo>
          <Toggle 
            id="auto-save"
            checked={autoSave}
            onChange={handleAutoSaveChange}
          />
        </SettingItem>
        
        <SettingsDivider />
        
        <SettingItem>
          <SettingInfo>
            <SettingLabel>
              <FaTrash />
              <span>Clear Generation History</span>
            </SettingLabel>
            <SettingDescription>
              Remove all your previously generated images and prompts
            </SettingDescription>
          </SettingInfo>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleClearHistory}
          >
            Clear
          </Button>
        </SettingItem>
        
        <SettingItem>
          <SettingInfo>
            <SettingLabel>
              <FaTrash />
              <span>Clear Application Cache</span>
            </SettingLabel>
            <SettingDescription>
              Reset all settings and cached data
            </SettingDescription>
          </SettingInfo>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleClearCache}
          >
            Reset
          </Button>
        </SettingItem>
        
        <AppInfoContainer>
          <InfoIcon>
            <FaInfoCircle />
          </InfoIcon>
          <InfoText>
            Nexus Image Gen v1.0.0<br />
            <InfoLink href="https://example.com/privacy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </InfoLink>
            {' • '}
            <InfoLink href="https://example.com/terms" target="_blank" rel="noopener noreferrer">
              Terms of Use
            </InfoLink>
          </InfoText>
        </AppInfoContainer>
      </SettingsContent>
    </SettingsContainer>
  );
};

const SettingsContainer = styled.div`
  ${card};
  margin-bottom: 2rem;
  opacity: 0;
`;

const SettingsHeader = styled.div`
  ${flexBetween};
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
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

const SettingsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const SettingItem = styled.div`
  ${flexBetween};
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-radius: 10px;
  
  ${media.down('sm')} {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const SettingInfo = styled.div`
  flex: 1;
`;

const SettingLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SettingDescription = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SettingsDivider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 0.5rem 0;
`;

const AppInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-radius: 10px;
  margin-top: 0.5rem;
`;

const InfoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.info}20;
  color: ${({ theme }) => theme.colors.info};
  font-size: 1.25rem;
`;

const InfoText = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

const InfoLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default AppSettings;