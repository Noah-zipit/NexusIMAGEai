import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import anime from 'animejs';

const KeyboardReactiveLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [lastKeystroke, setLastKeystroke] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(0);
  
  const backgroundRef = useRef(null);
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const particleContainerRef = useRef(null);
  
  // Track typing rhythm and speed
  useEffect(() => {
    const now = Date.now();
    if (lastKeystroke > 0) {
      const timeDiff = now - lastKeystroke;
      // Calculate typing speed (lower = faster)
      setTypingSpeed(timeDiff < 1000 ? timeDiff : 500);
    }
    setLastKeystroke(now);
    
    // Shift background based on typing
    if (backgroundRef.current) {
      anime({
        targets: backgroundRef.current,
        backgroundPosition: `${Math.random() * 105}% ${Math.random() * 105}%`,
        duration: 3000,
        easing: 'easeOutQuad'
      });
    }
  }, [username, password, lastKeystroke]);
  
  // Create particle burst effect
  const createParticleBurst = (x, y, inputEl) => {
    // Get input position and dimensions
    const rect = inputEl.getBoundingClientRect();
    
    // Create particles
    const particleCount = 10 + Math.floor(Math.random() * 5);
    const particleElements = [];
    
    // Calculate position relative to input field
    const relativeX = x - rect.left;
    
    // Get color based on typing speed (faster = warmer colors)
    const getHue = () => {
      // Map typing speed to color (faster typing = warmer colors)
      const baseHue = typingSpeed < 150 ? 330 : // Fast = magenta/red
                     typingSpeed < 300 ? 270 : // Medium = purple
                     230; // Slow = blue
      return baseHue + Math.random() * 40 - 20;
    };
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${relativeX}px`;
      particle.style.top = '50%';
      particle.style.backgroundColor = `hsl(${getHue()}, 80%, 60%)`;
      particle.style.width = `${Math.random() * 10 + 5}px`;
      particle.style.height = particle.style.width;
      
      particleContainerRef.current.appendChild(particle);
      particleElements.push(particle);
    }
    
    // Animate particles
    anime({
      targets: particleElements,
      translateX: () => anime.random(-70, 70),
      translateY: () => anime.random(-70, 70),
      opacity: [1, 0],
      scale: [1, 0],
      easing: 'easeOutExpo',
      duration: () => anime.random(700, 1500),
      complete: () => {
        // Remove particles after animation
        particleElements.forEach(el => {
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
        });
      }
    });
    
    // Add input field glow effect
    anime({
      targets: inputEl,
      boxShadow: [
        `0 0 10px rgba(${typingSpeed < 200 ? '255, 0, 191' : '106, 0, 255'}, 0.7)`,
        `0 0 20px rgba(${typingSpeed < 200 ? '255, 0, 191' : '106, 0, 255'}, 0.3)`
      ],
      duration: 600,
      easing: 'easeOutQuad',
      direction: 'alternate'
    });
  };
  
  // Handle input change for username
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    const cursorPosition = e.target.selectionStart;
    const approxXPosition = cursorPosition * 10; // Rough estimation of cursor X position
    createParticleBurst(approxXPosition, 0, usernameInputRef.current);
  };
  
  // Handle input change for password
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    const cursorPosition = e.target.selectionStart;
    const approxXPosition = cursorPosition * 10; // Rough estimation of cursor X position
    createParticleBurst(approxXPosition, 0, passwordInputRef.current);
  };
  
  // Handle login form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a burst of particles on the button
    const buttonRect = e.target.getBoundingClientRect();
    const centerX = buttonRect.width / 2;
    
    // More particles for submission
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        createParticleBurst(centerX, 0, e.target);
      }, i * 20);
    }
    
    // Form submission logic would go here
    console.log('Login with:', username, password);
  };
  
  return (
    <LoginContainer>
      <ReactiveBackground ref={backgroundRef} typingSpeed={typingSpeed} />
      
      <LoginForm onSubmit={handleSubmit}>
        <LogoContainer>
          <Logo>Nexus</Logo>
          <Tagline>Image Gen</Tagline>
        </LogoContainer>
        
        <InputContainer>
          <ParticleContainer ref={particleContainerRef} />
          
          <InputWrapper>
            <StyledInput
              ref={usernameInputRef}
              type="text"
              placeholder="Username"
              value={username}
              onChange={handleUsernameChange}
              required
            />
          </InputWrapper>
          
          <InputWrapper>
            <StyledInput
              ref={passwordInputRef}
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </InputWrapper>
          
          <LoginButton type="submit">
            Login
          </LoginButton>
        </InputContainer>
        
        <ForgotPassword>Forgot your password?</ForgotPassword>
        
        <SignupPrompt>
          Don't have an account? <SignupLink>Sign Up</SignupLink>
        </SignupPrompt>
      </LoginForm>
    </LoginContainer>
  );
};

// Styled Components
const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

const ReactiveBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    #0f0f1a,
    #1f1f3a,
    #2a1a4a,
    #1f1f3a,
    #0f0f1a
  );
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
  z-index: 0;
  transition: background-position 3s ease;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at ${props => props.typingSpeed < 200 ? '30% 30%' : '70% 70%'},
      rgba(106, 0, 255, 0.2) 0%,
      rgba(0, 0, 0, 0) 70%
    );
    z-index: 1;
    transition: all 2s ease;
  }
`;

const LoginForm = styled.form`
  position: relative;
  z-index: 2;
  width: 90%;
  max-width: 420px;
  padding: 2.5rem 2rem;
  background: rgba(25, 25, 35, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow: hidden;
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

const Logo = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(to right, #6a00ff, #b15dff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 0.25rem;
  text-shadow: 0 0 20px rgba(106, 0, 255, 0.5);
`;

const Tagline = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const ParticleContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
  
  .particle {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    z-index: 10;
  }
`;

const InputWrapper = styled.div`
  position: relative;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 1rem 1.25rem;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(106, 0, 255, 0.3);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #6a00ff;
    box-shadow: 0 0 15px rgba(106, 0, 255, 0.5);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const LoginButton = styled.button`
  padding: 1rem;
  margin-top: 0.5rem;
  background: linear-gradient(135deg, #6a00ff, #9500ff);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(106, 0, 255, 0.6);
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.7s ease;
  }
  
  &:hover:before {
    left: 100%;
  }
`;

const ForgotPassword = styled.a`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  margin-top: -0.5rem;
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: #6a00ff;
  }
`;

const SignupPrompt = styled.p`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin-top: 0.5rem;
`;

const SignupLink = styled.span`
  color: #6a00ff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    text-shadow: 0 0 8px rgba(106, 0, 255, 0.7);
  }
`;

export default KeyboardReactiveLogin;