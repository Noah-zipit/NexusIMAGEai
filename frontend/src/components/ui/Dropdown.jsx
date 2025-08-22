import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import anime from 'animejs';
import { FaChevronDown } from 'react-icons/fa';
import { focusOutline, flexBetween } from '../../styles/mixins';

const Dropdown = ({
  id,
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  required = false,
  error,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const optionsRef = useRef(null);
  
  const selectedOption = options.find(option => option.value === value);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    if (!optionsRef.current) return;
    
    if (isOpen) {
      anime({
        targets: optionsRef.current,
        opacity: [0, 1],
        translateY: ['10px', '0px'],
        easing: 'easeOutQuad',
        duration: 200
      });
    }
  }, [isOpen]);
  
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };
  
  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };
  
  return (
    <DropdownContainer className={className}>
      {label && (
        <DropdownLabel htmlFor={id}>
          {label} {required && <RequiredAsterisk>*</RequiredAsterisk>}
        </DropdownLabel>
      )}
      
      <DropdownWrapper 
        ref={dropdownRef} 
        isOpen={isOpen} 
        hasError={!!error} 
        disabled={disabled}
      >
        <DropdownTrigger
          id={id}
          onClick={toggleDropdown}
          disabled={disabled}
        >
          <TriggerText hasValue={!!selectedOption}>
            {selectedOption ? selectedOption.label : placeholder}
          </TriggerText>
          <ChevronIcon isOpen={isOpen}>
            <FaChevronDown />
          </ChevronIcon>
        </DropdownTrigger>
        
        {isOpen && (
          <OptionsContainer ref={optionsRef}>
            {options.map(option => (
              <OptionItem
                key={option.value}
                isSelected={option.value === value}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </OptionItem>
            ))}
          </OptionsContainer>
        )}
      </DropdownWrapper>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </DropdownContainer>
  );
};

const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.25rem;
  width: 100%;
`;

const DropdownLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const RequiredAsterisk = styled.span`
  color: ${({ theme }) => theme.colors.error};
`;

const DropdownWrapper = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-radius: 8px;
  border: 1px solid ${({ theme, isOpen, hasError }) => 
    hasError ? theme.colors.error :
    isOpen ? theme.colors.primary : 
    theme.colors.border};
  transition: all 0.2s ease;
  
  ${({ isOpen, theme, hasError }) => isOpen && !hasError && css`
    box-shadow: 0 0 0 3px ${theme.colors.highlight};
  `}
  
  ${({ hasError, theme }) => hasError && css`
    box-shadow: 0 0 0 3px ${theme.colors.error}20;
  `}
  
  ${({ disabled, theme }) => disabled && css`
    background: ${theme.colors.surfaceAlt};
    opacity: 0.6;
    cursor: not-allowed;
  `}
`;

const DropdownTrigger = styled.button`
  ${focusOutline};
  ${flexBetween};
  width: 100%;
  height: 40px;
  padding: 0 0.75rem;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9375rem;
  text-align: left;
  outline: none;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
`;

const TriggerText = styled.span`
  color: ${({ theme, hasValue }) => 
    hasValue ? theme.colors.text : theme.colors.textSecondary};
  opacity: ${({ hasValue }) => hasValue ? 1 : 0.7};
`;

const ChevronIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: transform 0.2s ease;
  
  ${({ isOpen }) => isOpen && css`
    transform: rotate(180deg);
  `}
`;

const OptionsContainer = styled.div`
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  box-shadow: 0 4px 20px ${({ theme }) => theme.colors.shadow};
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  opacity: 0;
`;

const OptionItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${({ theme, isSelected }) => isSelected && css`
    background: ${theme.colors.highlight};
    color: ${theme.colors.primary};
    font-weight: 500;
  `}
  
  &:hover {
    background: ${({ theme, isSelected }) => 
      isSelected ? theme.colors.highlight : theme.colors.hoverOverlay};
  }
  
  &:first-child {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  
  &:last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

const ErrorMessage = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.error};
  margin-top: 0.5rem;
  animation: fadeIn 0.2s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default Dropdown;