import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled, { keyframes } from 'styled-components';
import anime from 'animejs';
import { FaTimes, FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import { flexBetween, media } from '../../styles/mixins';

const Toast = ({
  id,
  type = 'info',
  message,
  title,
  duration = 5000,
  onClose
}) => {
  const toastRef = useRef(null);
  const timerRef = useRef(null);
  
  useEffect(() => {
    if (!toastRef.current) return;
    
    // Animate toast in
    anime({
      targets: toastRef.current,
      translateX: [50, 0],
      opacity: [0, 1],
      easing: 'easeOutQuad',
      duration: 300
    });
    
    // Auto close after duration
    if (duration > 0) {
      timerRef.current = setTimeout(() => {
        closeToast();
      }, duration);
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [duration]);
  
  const closeToast = () => {
    // Animate toast out
    anime({
      targets: toastRef.current,
      translateX: [0, 50],
      opacity: [1, 0],
      easing: 'easeInQuad',
      duration: 300,
      complete: () => {
        if (onClose) onClose(id);
      }
    });
  };
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle />;
      case 'error':
        return <FaExclamationCircle />;
      case 'warning':
        return <FaExclamationCircle />;
      case 'info':
      default:
        return <FaInfoCircle />;
    }
  };
  
  return createPortal(
    <ToastContainer ref={toastRef} type={type}>
      <ToastContent>
        <IconWrapper type={type}>
          {getIcon()}
        </IconWrapper>
        
        <MessageWrapper>
          {title && <ToastTitle>{title}</ToastTitle>}
          <ToastMessage>{message}</ToastMessage>
        </MessageWrapper>
        
        <CloseButton onClick={closeToast} aria-label="Close notification">
          <FaTimes />
        </CloseButton>
      </ToastContent>
      
      {duration > 0 && <ProgressBar duration={duration} type={type} />}
    </ToastContainer>,
    document.getElementById('toast-container') || document.body
  );
};

const slideIn = keyframes`
  from { transform: translateX(50px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const progress = keyframes`
  from { width: 100%; }
  to { width: 0%; }
`;

const getToastColors = (type, theme) => {
  const types = {
    success: {
      bg: theme.colors.success + '15',
      border: theme.colors.success,
      color: theme.colors.success
    },
    error: {
      bg: theme.colors.error + '15',
      border: theme.colors.error,
      color: theme.colors.error
    },
    warning: {
      bg: theme.colors.warning + '15',
      border: theme.colors.warning,
      color: theme.colors.warning
    },
    info: {
      bg: theme.colors.info + '15',
      border: theme.colors.info,
      color: theme.colors.info
    }
  };
  
  return types[type] || types.info;
};

const ToastContainer = styled.div`
  position: relative;
  min-width: 300px;
  max-width: 100%;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px ${({ theme }) => theme.colors.shadow};
  animation: ${slideIn} 0.3s ease forwards;
  overflow: hidden;
  
  ${({ type, theme }) => {
    const colors = getToastColors(type, theme);
    return `
      background: ${colors.bg};
      border-left: 4px solid ${colors.border};
    `;
  }}
  
  ${media.up('md')} {
    max-width: 400px;
  }
`;

const ToastContent = styled.div`
  ${flexBetween};
  padding: 1rem;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-size: 1.25rem;
  
  ${({ type, theme }) => {
    const colors = getToastColors(type, theme);
    return `color: ${colors.color};`;
  }}
`;

const MessageWrapper = styled.div`
  flex: 1;
`;

const ToastTitle = styled.h4`
  margin: 0 0 0.25rem;
  font-size: 1rem;
  font-weight: 600;
`;

const ToastMessage = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.4;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  margin-left: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all 0.2s ease;
  
  &:hover, &:focus {
    color: ${({ theme }) => theme.colors.text};
    background: rgba(0, 0, 0, 0.1);
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: ${({ type, theme }) => {
    const colors = getToastColors(type, theme);
    return colors.border;
  }};
  animation: ${progress} ${({ duration }) => `${duration}ms`} linear forwards;
`;

export default Toast;