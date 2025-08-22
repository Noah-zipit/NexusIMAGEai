import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import anime from 'animejs';

const Toggle = ({ 
  id,
  label,
  checked = false,
  onChange,
  disabled = false,
  className
}) => {
  const toggleRef = useRef(null);
  const knobRef = useRef(null);
  
  useEffect(() => {
    if (!knobRef.current) return;
    
    anime({
      targets: knobRef.current,
      translateX: checked ? '18px' : '2px',
      easing: 'easeOutElastic(1, .5)',
      duration: 600
    });
  }, [checked]);
  
  const handleChange = (e) => {
    if (!disabled && onChange) {
      onChange(e.target.checked);
    }
  };
  
  return (
    <ToggleContainer className={className}>
      <ToggleWrapper>
        <ToggleInput
          id={id}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
        />
        <ToggleControl 
          ref={toggleRef}
          checked={checked}
          disabled={disabled}
        >
          <ToggleKnob ref={knobRef} />
        </ToggleControl>
      </ToggleWrapper>
      
      {label && (
        <ToggleLabel htmlFor={id} disabled={disabled}>
          {label}
        </ToggleLabel>
      )}
    </ToggleContainer>
  );
};

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
`;

const ToggleWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const ToggleInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const ToggleControl = styled.div`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background-color: ${({ theme, checked, disabled }) => 
    disabled ? theme.colors.border :
    checked ? theme.colors.primary : theme.colors.surfaceAlt};
  transition: all 0.3s ease;
  box-shadow: ${({ theme, checked, disabled }) => 
    disabled ? 'none' :
    checked ? theme.glows.primary : 'none'};
  opacity: ${({ disabled }) => disabled ? 0.6 : 1};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
`;

const ToggleKnob = styled.div`
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const ToggleLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ disabled }) => disabled ? 0.6 : 1};
`;

export default Toggle;