import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import anime from 'animejs';
import { focusOutline } from '../../styles/mixins';

const InputField = ({
  id,
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  disabled = false,
  required = false,
  icon = null,
  className,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const underlineRef = useRef(null);
  
  useEffect(() => {
    if (!underlineRef.current) return;
    
    if (isFocused) {
      anime({
        targets: underlineRef.current,
        width: '100%',
        easing: 'easeOutQuad',
        duration: 300
      });
    } else {
      anime({
        targets: underlineRef.current,
        width: '0%',
        easing: 'easeOutQuad',
        duration: 300
      });
    }
  }, [isFocused]);
  
  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };
  
  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };
  
  const handleChange = (e) => {
    if (onChange) onChange(e);
  };
  
  return (
    <InputContainer className={className}>
      {label && (
        <InputLabel htmlFor={id} isFocused={isFocused} hasValue={!!value}>
          {label} {required && <RequiredAsterisk>*</RequiredAsterisk>}
        </InputLabel>
      )}
      
      <InputWrapper isFocused={isFocused} hasError={!!error} disabled={disabled}>
        {icon && <IconWrapper>{icon}</IconWrapper>}
        
        <StyledInput
          ref={inputRef}
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          hasIcon={!!icon}
          {...props}
        />
        
        <InputUnderline ref={underlineRef} />
      </InputWrapper>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
};

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.25rem;
  width: 100%;
`;

const InputLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: ${({ theme, isFocused }) => 
    isFocused ? theme.colors.primary : theme.colors.textSecondary};
  transition: color 0.2s ease;
`;

const RequiredAsterisk = styled.span`
  color: ${({ theme }) => theme.colors.error};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-radius: 8px;
  border: 1px solid ${({ theme, isFocused, hasError }) => 
    hasError ? theme.colors.error :
    isFocused ? theme.colors.primary : 
    theme.colors.border};
  transition: all 0.2s ease;
  
  ${({ disabled, theme }) => disabled && css`
    background: ${theme.colors.surfaceAlt};
    opacity: 0.6;
    cursor: not-allowed;
  `}
  
  ${({ isFocused, theme, hasError }) => isFocused && !hasError && css`
    box-shadow: 0 0 0 3px ${theme.colors.highlight};
  `}
  
  ${({ hasError, theme }) => hasError && css`
    box-shadow: 0 0 0 3px ${theme.colors.error}20;
  `}
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StyledInput = styled.input`
  ${focusOutline};
  width: 100%;
  height: 40px;
  padding: 0 0.75rem;
  padding-left: ${({ hasIcon }) => hasIcon ? '0.5rem' : '0.75rem'};
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9375rem;
  outline: none;
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.7;
  }
  
  &:disabled {
    cursor: not-allowed;
  }
`;

const InputUnderline = styled.div`
  position: absolute;
  bottom: -1px;
  left: 0;
  height: 2px;
  width: 0;
  background: ${({ theme }) => theme.colors.primary};
  transition: width 0.2s ease;
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

export default InputField;