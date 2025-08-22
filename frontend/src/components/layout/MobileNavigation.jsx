import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FaHome, FaImage, FaHistory, FaCog } from 'react-icons/fa';
import { flexCenter, media } from '../../styles/mixins';

const MobileNavigation = () => {
  return (
    <NavContainer>
      <NavItem to="/">
        <FaHome />
        <NavLabel>Home</NavLabel>
      </NavItem>
      <NavItem to="/generate">
        <FaImage />
        <NavLabel>Create</NavLabel>
      </NavItem>
      <NavItem to="/gallery">
        <FaHistory />
        <NavLabel>Gallery</NavLabel>
      </NavItem>
      <NavItem to="/settings">
        <FaCog />
        <NavLabel>Settings</NavLabel>
      </NavItem>
    </NavContainer>
  );
};

const NavContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.gradients.glass};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-around;
  padding: 0.5rem 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  z-index: 100;
  
  ${media.up('md')} {
    display: none;
  }
`;

const NavItem = styled(NavLink)`
  ${flexCenter};
  flex-direction: column;
  flex: 1;
  padding: 0.5rem 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all 0.2s ease;
  
  svg {
    font-size: 1.25rem;
    margin-bottom: 0.25rem;
  }
  
  &.active {
    color: ${({ theme }) => theme.colors.primary};
    text-shadow: ${({ theme }) => theme.glows.primary};
  }
  
  &:hover, &:focus {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const NavLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 500;
`;

export default MobileNavigation;