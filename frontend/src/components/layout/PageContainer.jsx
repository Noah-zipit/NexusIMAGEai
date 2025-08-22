import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNavigation from './MobileNavigation';
import { media } from '../../styles/mixins';

const PageContainer = ({ children }) => {
  return (
    <Container>
      <Header />
      <Sidebar />
      <MainContent>
        {children}
      </MainContent>
      <MobileNavigation />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  margin-top: 60px;
  padding: 1rem;
  padding-bottom: 5rem; /* Space for mobile nav */
  
  ${media.up('md')} {
    margin-top: 70px;
    padding: 2rem;
    padding-bottom: 2rem;
  }
  
  ${media.up('lg')} {
    padding: 2rem 3rem;
  }
`;

export default PageContainer;