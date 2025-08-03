'use client';

import React, { forwardRef } from 'react';
import Link from 'next/link';
import LoadingState from './LoadingState';

// Button variants
export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'ghost';

// Button sizes
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant
   */
  variant?: ButtonVariant;
  
  /**
   * Button size
   */
  size?: ButtonSize;
  
  /**
   * Whether the button is in a loading state
   */
  loading?: boolean;
  
  /**
   * Icon to display at the start of the button
   */
  startIcon?: React.ReactNode;
  
  /**
   * Icon to display at the end of the button
   */
  endIcon?: React.ReactNode;
  
  /**
   * Whether the button should take up the full width of its container
   */
  fullWidth?: boolean;
  
  /**
   * URL to navigate to when the button is clicked (turns the button into a link)
   */
  href?: string;
  
  /**
   * Whether the link should open in a new tab
   */
  external?: boolean;
  
  /**
   * Additional class names
   */
  className?: string;
}

/**
 * Button component with different variants, sizes, and states
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      loading = false,
      startIcon,
      endIcon,
      fullWidth = false,
      href,
      external = false,
      className = '',
      disabled,
      children,
      ...rest
    },
    ref
  ) => {
    // Get variant classes
    const getVariantClasses = (): string => {
      switch (variant) {
        case 'primary':
          return 'bg-accent-primary hover:bg-accent-secondary text-white border-transparent';
        case 'secondary':
          return 'bg-bg-secondary hover:bg-bg-primary text-text-primary border-border-color';
        case 'success':
          return 'bg-success hover:bg-green-700 text-white border-transparent';
        case 'danger':
          return 'bg-error hover:bg-red-700 text-white border-transparent';
        case 'warning':
          return 'bg-warning hover:bg-yellow-700 text-white border-transparent';
        case 'info':
          return 'bg-blue-600 hover:bg-blue-700 text-white border-transparent';
        case 'ghost':
          return 'bg-transparent hover:bg-bg-secondary text-text-secondary border-transparent';
        default:
          return 'bg-accent-primary hover:bg-accent-secondary text-white border-transparent';
      }
    };
    
    // Get size classes
    const getSizeClasses = (): string => {
      switch (size) {
        case 'small':
          return 'text-xs py-1 px-2';
        case 'medium':
          return 'text-sm py-2 px-4';
        case 'large':
          return 'text-base py-3 px-6';
        default:
          return 'text-sm py-2 px-4';
      }
    };
    
    // Base button classes
    const buttonClasses = `
      inline-flex items-center justify-center
      font-medium
      border
      rounded-md
      transition-colors
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary
      ${getVariantClasses()}
      ${getSizeClasses()}
      ${fullWidth ? 'w-full' : ''}
      ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''}
      ${className}
    `;
    
    // If href is provided, render as a link
    if (href) {
      return (
        <Link
          href={href}
          className={buttonClasses}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          aria-disabled={disabled || loading}
          tabIndex={disabled || loading ? -1 : undefined}
          onClick={(e) => {
            if (disabled || loading) {
              e.preventDefault();
            }
          }}
        >
          {loading && (
            <LoadingState
              type="spinner"
              size="small"
              className="mr-2"
            />
          )}
          {!loading && startIcon && <span className="mr-2">{startIcon}</span>}
          {children}
          {!loading && endIcon && <span className="ml-2">{endIcon}</span>}
        </Link>
      );
    }
    
    // Otherwise, render as a button
    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        {...rest}
      >
        {loading && (
          <LoadingState
            type="spinner"
            size="small"
            className="mr-2"
          />
        )}
        {!loading && startIcon && <span className="mr-2">{startIcon}</span>}
        {children}
        {!loading && endIcon && <span className="ml-2">{endIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
