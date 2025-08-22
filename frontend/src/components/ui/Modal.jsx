import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import anime from 'animejs';
import { FaTimes } from 'react-icons/fa';
import { flexCenter, media } from '../../styles/mixins';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  className
}) => {
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.classList.add('no-scroll');
      
      // Animate modal in
      anime({
        targets: modalRef.current,
        opacity: [0, 1],
        easing: 'easeOutQuad',
        duration: 200
      });
      
      anime({
        targets: contentRef.current,
        scale: [0.9, 1],
        opacity: [0, 1],
        easing: 'easeOutQuad',
        duration: 300
      });
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen, onClose]);
  
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === modalRef.current) {
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return createPortal(
    <ModalOverlay 
      ref={modalRef}
      onClick={handleOverlayClick}
      className={className}
    >
      <ModalContent 
        ref={contentRef}
        size={size}
        role="dialog"
        aria-modal="true"
      >
        <ModalHeader>
          {title && <ModalTitle>{title}</ModalTitle>}
          {showCloseButton && (
            <CloseButton onClick={onClose} aria-label="Close modal">
              <FaTimes />
            </CloseButton>
          )}
        </ModalHeader>
        
        <ModalBody>
          {children}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>,
    document.body
  );
};

const getModalWidth = (size) => {
  const sizes = {
    sm: '400px',
    md: '600px',
    lg: '800px',
    xl: '1000px',
    full: '95%'
  };
  
  return sizes[size] || sizes.md;
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => theme.colors.overlay};
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  box-shadow: 0 10px 40px ${({ theme }) => theme.colors.shadow};
  width: 100%;
  max-width: ${({ size }) => getModalWidth(size)};
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  opacity: 0;
  transform: scale(0.9);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  ${media.up('md')} {
    padding: 1.25rem 2rem;
  }
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  
  ${media.up('md')} {
    font-size: 1.5rem;
  }
`;

const CloseButton = styled.button`
  ${flexCenter};
  width: 36px;
  height: 36px;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all 0.2s ease;
  
  &:hover, &:focus {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.highlight};
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  max-height: calc(90vh - 80px);
  
  ${media.up('md')} {
    padding: 2rem;
  }
`;

export default Modal;