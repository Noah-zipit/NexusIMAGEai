import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import anime from 'animejs';
import { FaTimes, FaHome, FaImage, FaHistory, FaCog, FaInfoCircle, FaCode, FaMoon, FaSun } from 'react-icons/fa';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { absoluteFill, flexCenter, media } from '../../styles/mixins';

const Sidebar = () => {
  const { isSidebarOpen, closeSidebar } = useApp();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const sidebarRef = useRef(null);
  
  useEffect(() => {
    // Close sidebar on location change (mobile)
    closeSidebar();
  }, [location, closeSidebar]);
  
  useEffect(() => {
    if (isSidebarOpen) {
      // Animate sidebar in
      anime({
        targets: sidebarRef.current,
        translateX: ['-100%', '0'],
        opacity: [0, 1],
        easing: 'easeOutQuad',
        duration: 300
      });
    }
  }, [isSidebarOpen]);
  
  if (!isSidebarOpen) return null;
  
  return (
    <>
      <SidebarOverlay onClick={closeSidebar} />
      <SidebarContainer ref={sidebarRef}>
        <SidebarHeader>
          <CloseButton onClick={closeSidebar} aria-label="Close sidebar">
            <FaTimes />
          </CloseButton>
          <SidebarTitle>Nexus Image Gen</SidebarTitle>
        </SidebarHeader>
        
        <SidebarContent>
          <NavSection>
            <NavItem to="/" active={location.pathname === '/'}>
              <FaHome />
              <span>Home</span>
            </NavItem>
            <NavItem to="/generate" active={location.pathname === '/generate'}>
              <FaImage />
              <span>Generate Images</span>
            </NavItem>
            <NavItem to="/gallery" active={location.pathname === '/gallery'}>
              <FaHistory />
              <span>Gallery</span>
            </NavItem>
          </NavSection>
          
          <NavSection>
            <SectionTitle>App</SectionTitle>
            <NavItem to="/settings" active={location.pathname === '/settings'}>
              <FaCog />
              <span>Settings</span>
            </NavItem>
            <NavItem to="/about" active={location.pathname === '/about'}>
              <FaInfoCircle />
              <span>About</span>
            </NavItem>
            <NavItem to="/developer" active={location.pathname === '/developer'}>
              <FaCode />
              <span>Developer</span>
            </NavItem>
          </NavSection>
          
          <ThemeToggleButton onClick={toggleTheme} aria-label={`Switch to ${theme.id === 'dark' ? 'light' : 'dark'} mode`}>
            {theme.id === 'dark' ? <FaSun /> : <FaMoon />}
            <span>Switch to {theme.id === 'dark' ? 'Light' : 'Dark'} Mode</span>
          </ThemeToggleButton>
        </SidebarContent>
      </SidebarContainer>
    </>
  );
};

const SidebarOverlay = styled.div`
  ${absoluteFill};
  background: ${({ theme }) => theme.colors.overlay};
  backdrop-filter: blur(3px);
  z-index: 200;
`;

const SidebarContainer = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 0 20px ${({ theme }) => theme.colors.shadow};
  z-index: 300;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const CloseButton = styled.button`
  ${flexCenter};
  width: 36px;
  height: 36px;
  border-radius: 8px;
  margin-right: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all 0.2s ease;
  
  &:hover, &:focus {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.highlight};
  }
  
  ${media.up('lg')} {
    display: none;
  }
`;

const SidebarTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
`;

const SidebarContent = styled.div`
  flex: 1;
  padding: 1.25rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const NavSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.text};
  background: ${({ theme, active }) => active ? theme.colors.highlight : 'transparent'};
  font-weight: ${({ active }) => active ? 600 : 400};
  transition: all 0.2s ease;
  
  svg {
    margin-right: 1rem;
    font-size: 1.1rem;
  }
  
  &:hover, &:focus {
    background: ${({ theme }) => theme.colors.highlight};
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ThemeToggleButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  margin-top: auto;
  transition: all 0.2s ease;
  
  svg {
    margin-right: 1rem;
    font-size: 1.1rem;
    color: ${({ theme }) => theme.id === 'dark' ? theme.colors.secondary : theme.colors.accent};
  }
  
  &:hover, &:focus {
    background: ${({ theme }) => theme.colors.highlight};
  }
`;

export default Sidebar;