import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import anime from 'animejs';
import { FaImage, FaRocket, FaMagic, FaArrowRight } from 'react-icons/fa';
import Button from '../components/ui/Button';
import { media, flexCenter, card } from '../styles/mixins';

const Home = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const featuresRef = useRef(null);
  
  useEffect(() => {
    if (containerRef.current) {
      // Animate title
      anime({
        targets: titleRef.current,
        opacity: [0, 1],
        translateY: [-30, 0],
        easing: 'easeOutElastic(1, .8)',
        duration: 1200
      });
      
      // Animate subtitle
      anime({
        targets: subtitleRef.current,
        opacity: [0, 1],
        translateY: [-20, 0],
        easing: 'easeOutQuad',
        duration: 800,
        delay: 300
      });
      
      // Animate features
      anime({
        targets: featuresRef.current.querySelectorAll('.feature-item'),
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(150, { start: 600 }),
        easing: 'easeOutQuad',
        duration: 800
      });
    }
  }, []);
  
  return (
    <Container ref={containerRef}>
      <HeroSection>
        <Title ref={titleRef}>
          Create Amazing Images with <GradientText>Nexus AI</GradientText>
        </Title>
        <Subtitle ref={subtitleRef}>
          Transform your ideas into stunning visuals using state-of-the-art AI image generation
        </Subtitle>
        
        <ButtonGroup>
          <GetStartedButton 
            as={Link} 
            to="/generate"
            variant="primary"
            size="lg"
            icon={<FaRocket />}
          >
            Get Started
          </GetStartedButton>
        </ButtonGroup>
      </HeroSection>
      
      <FeaturesSection ref={featuresRef}>
        <FeatureItem className="feature-item">
          <FeatureIcon>
            <FaMagic />
          </FeatureIcon>
          <FeatureContent>
            <FeatureTitle>Powerful AI Models</FeatureTitle>
            <FeatureDescription>
              Choose from multiple state-of-the-art image generation models optimized for different creative styles.
            </FeatureDescription>
          </FeatureContent>
        </FeatureItem>
        
        <FeatureItem className="feature-item">
          <FeatureIcon>
            <FaImage />
          </FeatureIcon>
          <FeatureContent>
            <FeatureTitle>Multiple Aspect Ratios</FeatureTitle>
            <FeatureDescription>
              Create images in different formats including square, landscape, and portrait to suit your needs.
            </FeatureDescription>
          </FeatureContent>
        </FeatureItem>
        
        <FeatureItem className="feature-item">
          <FeatureIcon>
            <FaMagic />
          </FeatureIcon>
          <FeatureContent>
            <FeatureTitle>Easy to Use</FeatureTitle>
            <FeatureDescription>
              Simple interface that makes it easy to describe your vision and generate amazing results.
            </FeatureDescription>
          </FeatureContent>
        </FeatureItem>
      </FeaturesSection>
      
      <CTASection>
        <CTAContent>
          <CTATitle>Ready to Create?</CTATitle>
          <CTAText>Start generating amazing images with just a text description</CTAText>
        </CTAContent>
        
        <CTAButton 
          as={Link} 
          to="/generate"
          variant="primary"
          size="lg"
          icon={<FaArrowRight />}
        >
          Create Now
        </CTAButton>
      </CTASection>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 2rem 1rem 3rem;
  
  ${media.up('md')} {
    padding: 3rem 2rem 4rem;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  
  ${media.up('md')} {
    font-size: 3.5rem;
  }
`;

const GradientText = styled.span`
  background: ${({ theme }) => theme.gradients.primary};
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 700px;
  margin: 0 auto 2rem;
  line-height: 1.5;
  
  ${media.up('md')} {
    font-size: 1.25rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const GetStartedButton = styled(Button)`
  min-width: 180px;
`;

const FeaturesSection = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 1rem;
  
  ${media.up('md')} {
    grid-template-columns: repeat(3, 1fr);
    padding: 2rem;
  }
`;

const FeatureItem = styled.div`
  ${card};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px ${({ theme }) => theme.colors.shadow};
  }
  
  ${media.up('md')} {
    min-height: 250px;
  }
`;

const FeatureIcon = styled.div`
  ${flexCenter};
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
`;

const FeatureContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9375rem;
  line-height: 1.5;
  margin: 0;
  flex: 1;
`;

const CTASection = styled.section`
  ${card};
  margin: 2rem 1rem;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.gradients.primary};
  
  ${media.down('md')} {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
`;

const CTAContent = styled.div`
  color: white;
`;

const CTATitle = styled.h2`
  font-size: 1.75rem;
  margin: 0 0 0.5rem;
  color: white;
  
  ${media.up('md')} {
    font-size: 2rem;
  }
`;

const CTAText = styled.p`
  font-size: 1rem;
  margin: 0;
  opacity: 0.9;
`;

const CTAButton = styled(Button)`
  background: ${({ theme }) => theme.colors.accent};
  color: white;
  border: 2px solid white;
  
  &:hover {
    background: ${({ theme }) => theme.colors.accentLight};
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  }
`;

export default Home;