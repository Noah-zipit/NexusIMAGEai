import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import anime from 'animejs';
import { FaBars, FaCog, FaImage, FaHistory } from 'react-icons/fa';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { flexBetween, media } from '../../styles/mixins';

const Header = () => {
  const { toggleSidebar } = useApp();
  const { theme } = useTheme();
  const logoRef = useRef(null);
  
  useEffect(() => {
    // Logo animation on mount
    anime({
      targets: logoRef.current,
      opacity: [0, 1],
      translateY: [-20, 0],
      scale: [0.9, 1],
      easing: 'easeOutElastic(1, .8)',
      duration: 1200
    });
  }, []);
  
  return (
    <HeaderContainer>
      <HeaderContent>
        <LeftSection>
          <MenuButton onClick={toggleSidebar} aria-label="Open menu">
            <FaBars />
          </MenuButton>
          <LogoContainer to="/" ref={logoRef}>
            <LogoText>Nexus</LogoText>
            <SubLogoText>Image Gen</SubLogoText>
          </LogoContainer>
        </LeftSection>
        
        <RightSection>
          <NavAction to="/generate" aria-label="Generate images">
            <FaImage />
            <ActionLabel>Create</ActionLabel>
          </NavAction>
          <NavAction to="/gallery" aria-label="View gallery">
            <FaHistory />
            <ActionLabel>Gallery</ActionLabel>
          </NavAction>
          <NavAction to="/settings" aria-label="Settings">
            <FaCog />
            <ActionLabel>Settings</ActionLabel>
          </NavAction>
        </RightSection>
      </HeaderContent>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  width: 100%;
  background: ${({ theme }) => theme.gradients.glassAlt};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 4px 20px ${({ theme }) => theme.colors.shadow};
`;

const HeaderContent = styled.div`
  ${flexBetween};
  height: 60px;
  padding: 0 1rem;
  max-width: 1400px;
  margin: 0 auto;
  
  ${media.up('md')} {
    height: 70px;
    padding: 0 2rem;
  }
`;

const LeftSection = styled.div`
  ${flexBetween};
  gap: 1rem;
`;

const RightSection = styled.div`
  ${flexBetween};
  gap: 0.5rem;
  
  ${media.up('md')} {
    gap: 1.5rem;
  }
`;

const MenuButton = styled.button`
  ${flexBetween};
  width: 40px;
  height: 40px;
  color: ${({ theme }) => theme.colors.textSecondary};
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover, &:focus {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.highlight};
  }
  
  svg {
    font-size: 1.2rem;
  }
  
  ${media.up('lg')} {
    display: none;
  }
`;

const LogoContainer = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-decoration: none;
  
  ${media.up('sm')} {
    flex-direction: row;
    align-items: baseline;
    gap: 0.5rem;
  }
`;

const LogoText = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  text-shadow: ${({ theme }) => theme.glows.primary};
  margin: 0;
  line-height: 1;
  letter-spacing: -0.03em;
  
  ${media.up('sm')} {
    font-size: 1.8rem;
  }
`;

const SubLogoText = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  letter-spacing: 0.05em;
  text-transform: uppercase;
  
  ${media.up('sm')} {
    font-size: 0.85rem;
  }
`;

const NavAction = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.2rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover, &:focus {
    color: ${({ theme }) => theme.colors.primary};
    text-shadow: ${({ theme }) => theme.glows.primary};
    text-decoration: none;
  }
  
  &.active {
    color: ${({ theme }) => theme.colors.primary};
  }
  
  ${media.up('md')} {
    font-size: 1.4rem;
    padding: 0.5rem 1rem;
  }
`;

const ActionLabel = styled.span`
  font-size: 0.65rem;
  font-weight: 500;
  margin-top: 0.25rem;
  
  ${media.up('md')} {
    font-size: 0.75rem;
  }
`;

export default Header;