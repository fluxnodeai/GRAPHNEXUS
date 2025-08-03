'use client';

import React, { useState, useEffect, forwardRef } from 'react';
import { ValidationResult } from '@/lib/utils/validation';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  /**
   * Label for the input
   */
  label?: string;
  
  /**
   * Helper text to display below the input
   */
  helperText?: string;
  
  /**
   * Whether to display the input as a textarea
   */
  multiline?: boolean;
  
  /**
   * Number of rows for textarea (only applies if multiline is true)
   */
  rows?: number;
  
  /**
   * Validation result for the input
   */
  validation?: ValidationResult;
  
  /**
   * Whether to show validation errors
   */
  showValidation?: boolean;
  
  /**
   * Icon to display at the start of the input
   */
  startIcon?: React.ReactNode;
  
  /**
   * Icon to display at the end of the input
   */
  endIcon?: React.ReactNode;
  
  /**
   * Additional class names for the input container
   */
  containerClassName?: string;
  
  /**
   * Additional class names for the input element
   */
  inputClassName?: string;
  
  /**
   * Additional class names for the label
   */
  labelClassName?: string;
}

/**
 * FormInput component for form inputs with validation
 */
const FormInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormInputProps>(
  (
    {
      label,
      helperText,
      multiline = false,
      rows = 3,
      validation,
      showValidation = true,
      startIcon,
      endIcon,
      containerClassName = '',
      inputClassName = '',
      labelClassName = '',
      id,
      name,
      required,
      disabled,
      readOnly,
      className,
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    
    // Generate a unique ID if none is provided
    const inputId = id || `input-${name || Math.random().toString(36).substring(2, 9)}`;
    
    // Determine if the input has an error
    const hasError = showValidation && validation && !validation.isValid && isTouched;
    
    // Handle focus event
    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(true);
      if (rest.onFocus) {
        rest.onFocus(e);
      }
    };
    
    // Handle blur event
    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(false);
      setIsTouched(true);
      if (rest.onBlur) {
        rest.onBlur(e);
      }
    };
    
    // Reset touched state when name changes
    useEffect(() => {
      setIsTouched(false);
    }, [name]);
    
    // Base input classes
    const baseInputClasses = `
      form-input
      w-full
      ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
      ${startIcon ? 'pl-10' : ''}
      ${endIcon ? 'pr-10' : ''}
      ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
      ${inputClassName}
    `;
    
    // Render the input element
    const renderInputElement = () => {
      if (multiline) {
        return (
          <textarea
            id={inputId}
            name={name}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={`${baseInputClasses} form-textarea`}
            rows={rows}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${inputId}-error` : undefined}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...rest}
          />
        );
      }
      
      return (
        <input
          id={inputId}
          name={name}
          ref={ref as React.Ref<HTMLInputElement>}
          className={baseInputClasses}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
      );
    };
    
    return (
      <div className={`form-group ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className={`form-label ${required ? 'required' : ''} ${labelClassName}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary">
              {startIcon}
            </div>
          )}
          
          {renderInputElement()}
          
          {endIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary">
              {endIcon}
            </div>
          )}
        </div>
        
        {hasError && validation && validation.errors.length > 0 && (
          <div
            id={`${inputId}-error`}
            className="text-red-500 text-xs mt-1"
            role="alert"
          >
            {validation.errors[0]}
          </div>
        )}
        
        {helperText && !hasError && (
          <div className="text-secondary text-xs mt-1">{helperText}</div>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
