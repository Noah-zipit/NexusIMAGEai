import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import anime from 'animejs';
import { FaCode, FaGithub, FaReact, FaPalette, FaBrain, FaServer } from 'react-icons/fa';
import { media, card, flexCenter } from '../styles/mixins';

const Developer = () => {
  const pageRef = useRef(null);
  
  useEffect(() => {
    if (pageRef.current) {
      anime({
        targets: pageRef.current,
        opacity: [0, 1],
        easing: 'easeOutQuad',
        duration: 500
      });
      
      anime({
        targets: '.dev-section',
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(150),
        easing: 'easeOutQuad',
        duration: 800
      });
    }
  }, []);
  
  return (
    <PageContainer ref={pageRef}>
      <PageHeader>
        <HeaderIcon>
          <FaCode />
        </HeaderIcon>
        <HeaderText>
          <h1>Developer Information</h1>
          <p>Technical details about Nexus Image Gen</p>
        </HeaderText>
      </PageHeader>
      
      <DevSection className="dev-section">
        <SectionTitle>made with love by ours truly NOAH</SectionTitle>
        <SectionContent>
          <p>
            Nexus Image Gen is built using modern web technologies with a focus on performance, 
            user experience, and maintainability.
          </p>
          
          <TechGrid>
            <TechItem>
              <TechIcon>
                <FaReact />
              </TechIcon>
              <TechName>React.js</TechName>
              <TechDescription>
                Frontend UI library for building the user interface with reusable components
              </TechDescription>
            </TechItem>
            
            <TechItem>
              <TechIcon>
                <FaPalette />
              </TechIcon>
              <TechName>Styled Components</TechName>
              <TechDescription>
                CSS-in-JS library for component-scoped styling with theming support
              </TechDescription>
            </TechItem>
            
            <TechItem>
              <TechIcon>
                <FaBrain />
              </TechIcon>
              <TechName>Anime.js</TechName>
              <TechDescription>
                Lightweight JavaScript animation library for smooth UI animations
              </TechDescription>
            </TechItem>
            
            <TechItem>
              <TechIcon>
                <FaServer />
              </TechIcon>
              <TechName>Node.js/Express</TechName>
              <TechDescription>
                Backend server for API proxying and authentication handling
              </TechDescription>
            </TechItem>
          </TechGrid>
        </SectionContent>
      </DevSection>
      
      <DevSection className="dev-section">
        <SectionTitle>Architecture</SectionTitle>
        <SectionContent>
          <p>
            The application follows a modern frontend architecture with a focus on component reusability,
            state management, and performance optimizations.
          </p>
          
          <ArchitectureList>
            <ArchItem>
              <ArchTitle>Component-Based Structure</ArchTitle>
              <ArchDescription>
                The UI is broken down into small, reusable components that are composed together to build
                complex interfaces. This improves maintainability and code organization.
              </ArchDescription>
            </ArchItem>
            
            <ArchItem>
              <ArchTitle>Context-Based State Management</ArchTitle>
              <ArchDescription>
                React Context API is used for state management, providing a centralized store for app data
                without the complexity of external state libraries.
              </ArchDescription>
            </ArchItem>
            
            <ArchItem>
              <ArchTitle>Responsive Design</ArchTitle>
              <ArchDescription>
                Mobile-first approach ensures the application works seamlessly across devices of all sizes,
                with special optimizations for touch interfaces.
              </ArchDescription>
            </ArchItem>
            
            <ArchItem>
              <ArchTitle>Progressive Web App</ArchTitle>
              <ArchDescription>
                Implemented as a PWA with service workers for offline capabilities, caching, and
                "Add to Home Screen" functionality on mobile devices.
              </ArchDescription>
            </ArchItem>
          </ArchitectureList>
        </SectionContent>
      </DevSection>
      
      <DevSection className="dev-section">
        <SectionTitle>API Integration</SectionTitle>
        <SectionContent>
          <p>
            Nexus Image Gen integrates with a powerful AI image generation API to transform text prompts
            into images. The integration is designed with error handling, rate limiting, and caching
            for optimal performance.
          </p>
          
          <ApiExample>
            <ApiHeader>Example API Request</ApiHeader>
            <CodeBlock>
              {`POST /api/generate-image
{
  "model": "img4",
  "prompt": "A majestic lion in a field of wildflowers",
  "n": 1,
  "size": "1024x1024"
}`}
            </CodeBlock>
          </ApiExample>
          
          <p>
            For security reasons, API calls are proxied through our backend server to protect API keys
            and implement rate limiting.
          </p>
        </SectionContent>
      </DevSection>
      
      <DevSection className="dev-section">
        <SectionTitle>Contributing</SectionTitle>
        <SectionContent>
          <p>
            Nexus Image Gen is an open-source project and welcomes contributions from the community.
            If you're interested in contributing, please check out our GitHub repository.
          </p>
          
          <GitHubButton href="https://github.com/nexus-image-gen" target="_blank">
            <FaGithub />
            <span>View on GitHub</span>
          </GitHubButton>
          
          <ContributionAreas>
            <ContributionTitle>Areas for Contribution:</ContributionTitle>
            <ul>
              <li>UI/UX improvements</li>
              <li>Performance optimizations</li>
              <li>New features and capabilities</li>
              <li>Documentation and tutorials</li>
              <li>Bug fixes and issue resolution</li>
            </ul>
          </ContributionAreas>
        </SectionContent>
      </DevSection>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  opacity: 0;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 3rem;
  
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
  background: ${({ theme }) => theme.colors.secondary}20;
  color: ${({ theme }) => theme.colors.secondary};
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

const DevSection = styled.section`
  ${card};
  margin-bottom: 2rem;
  opacity: 0;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 1.5rem;
  
  ${media.down('sm')} {
    font-size: 1.25rem;
  }
`;

const SectionContent = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
  
  p {
    margin-bottom: 1.25rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const TechGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin: 1.5rem 0;
  
  ${media.up('md')} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const TechItem = styled.div`
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const TechIcon = styled.div`
  ${flexCenter};
  width: 48px;
  height: 48px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const TechName = styled.h3`
  font-size: 1.125rem;
  margin: 0 0 0.75rem;
`;

const TechDescription = styled.p`
  font-size: 0.875rem;
  margin: 0;
`;

const ArchitectureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 1.5rem 0;
`;

const ArchItem = styled.div`
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-radius: 12px;
`;

const ArchTitle = styled.h3`
  font-size: 1.125rem;
  margin: 0 0 0.75rem;
`;

const ArchDescription = styled.p`
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.5;
`;

const ApiExample = styled.div`
  margin: 1.5rem 0;
`;

const ApiHeader = styled.h3`
  font-size: 1.125rem;
  margin: 0 0 0.75rem;
`;

const CodeBlock = styled.pre`
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text};
  padding: 1.25rem;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const GitHubButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  margin: 1rem 0;
  transition: all 0.2s ease;
  
  svg {
    font-size: 1.25rem;
  }
  
  &:hover {
    background: ${({ theme }) => theme.colors.highlight};
    transform: translateY(-2px);
  }
`;

const ContributionAreas = styled.div`
  margin-top: 1.5rem;
  
  ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    
    li {
      margin-bottom: 0.5rem;
    }
  }
`;

const ContributionTitle = styled.h3`
  font-size: 1.125rem;
  margin: 0 0 0.75rem;
`;

export default Developer;