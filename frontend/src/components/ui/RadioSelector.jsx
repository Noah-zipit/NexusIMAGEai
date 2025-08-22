import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import anime from 'animejs';
import { flexCenter, media } from '../../styles/mixins';

const RadioSelector = ({
  options,
  value,
  onChange,
  name,
  disabled = false,
  orientation = 'horizontal',
  className
}) => {
  const highlightRef = useRef(null);
  const radioRefs = useRef([]);
  
  useEffect(() => {
    if (!highlightRef.current || !radioRefs.current.length) return;
    
    const selectedIndex = options.findIndex(option => option.value === value);
    if (selectedIndex === -1) return;
    
    const selectedEl = radioRefs.current[selectedIndex];
    if (!selectedEl) return;
    
    const rect = selectedEl.getBoundingClientRect();
    const containerRect = selectedEl.parentElement.getBoundingClientRect();
    
    anime({
      targets: highlightRef.current,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      left: `${rect.left - containerRect.left}px`,
      top: `${rect.top - containerRect.top}px`,
      easing: 'easeOutQuart',
      duration: 350
    });
  }, [options, value]);
  
  return (
    <RadioContainer 
      orientation={orientation}
      className={className}
    >
      <RadioHighlight ref={highlightRef} />
      
      {options.map((option, index) => (
        <RadioOption
          key={option.value}
          ref={el => radioRefs.current[index] = el}
          isSelected={option.value === value}
          disabled={disabled}
          onClick={() => !disabled && onChange(option.value)}
        >
          <RadioInput
            type="radio"
            name={name}
            value={option.value}
            checked={option.value === value}
            onChange={() => {}}
            disabled={disabled}
          />
          {option.icon && <OptionIcon>{option.icon}</OptionIcon>}
          <OptionLabel>{option.label}</OptionLabel>
        </RadioOption>
      ))}
    </RadioContainer>
  );
};

const RadioContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: ${({ orientation }) => orientation === 'vertical' ? 'column' : 'row'};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-radius: 8px;
  padding: ${({ orientation }) => orientation === 'vertical' ? '0.25rem' : '0.25rem'};
  gap: ${({ orientation }) => orientation === 'vertical' ? '0.25rem' : '0'};
  
  ${media.down('sm')} {
    flex-direction: ${({ orientation }) => orientation === 'vertical' ? 'column' : 'column'};
    gap: 0.25rem;
  }
`;

const RadioHighlight = styled.div`
  position: absolute;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 6px;
  box-shadow: 0 2px 8px ${({ theme }) => theme.colors.shadow};
  z-index: 0;
  transition: background-color 0.2s ease;
`;

const RadioOption = styled.label`
  ${flexCenter};
  position: relative;
  padding: 0.5rem 1rem;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ disabled }) => disabled ? 0.6 : 1};
  transition: color 0.2s ease;
  z-index: 1;
  white-space: nowrap;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme, isSelected }) => 
    isSelected ? theme.colors.primary : theme.colors.textSecondary};
  
  ${media.down('sm')} {
    width: 100%;
    justify-content: center;
  }
`;

const RadioInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const OptionIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1em;
`;

const OptionLabel = styled.span`
  position: relative;
  z-index: 1;
`;

export default RadioSelector;