'use client';

import React from 'react';

export interface LoadingStateProps {
  /**
   * The type of loading indicator to display
   */
  type?: 'spinner' | 'skeleton' | 'dots';
  
  /**
   * The size of the loading indicator
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Optional text to display with the loading indicator
   */
  text?: string;
  
  /**
   * Whether to show a full-page overlay
   */
  fullPage?: boolean;
  
  /**
   * Optional custom class names
   */
  className?: string;
  
  /**
   * Optional height for the container
   */
  height?: string;
}

/**
 * LoadingState component for displaying various loading indicators
 */
const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'spinner',
  size = 'medium',
  text,
  fullPage = false,
  className = '',
  height,
}) => {
  // Determine size classes
  const sizeClasses = {
    small: {
      spinner: 'w-4 h-4',
      container: 'p-2',
      text: 'text-xs',
    },
    medium: {
      spinner: 'w-6 h-6',
      container: 'p-4',
      text: 'text-sm',
    },
    large: {
      spinner: 'w-8 h-8',
      container: 'p-6',
      text: 'text-base',
    },
  };
  
  // Container classes
  const containerClasses = `
    flex flex-col items-center justify-center
    ${fullPage ? 'fixed inset-0 z-50 bg-opacity-75 bg-bg-primary' : ''}
    ${sizeClasses[size].container}
    ${className}
  `;
  
  // Render loading spinner
  const renderSpinner = () => (
    <div className={`loading-spinner ${sizeClasses[size].spinner}`}></div>
  );
  
  // Render loading dots
  const renderDots = () => (
    <div className="loading-dots">
      <span className="dot"></span>
      <span className="dot"></span>
      <span className="dot"></span>
    </div>
  );
  
  // Render skeleton loader
  const renderSkeleton = () => (
    <div className="skeleton-loader" style={{ height: height || '100%', width: '100%' }}>
      <div className="skeleton-shimmer"></div>
    </div>
  );
  
  return (
    <div 
      className={containerClasses}
      style={{ height: fullPage ? '100%' : height }}
      role="status"
      aria-live="polite"
    >
      {type === 'spinner' && renderSpinner()}
      {type === 'dots' && renderDots()}
      {type === 'skeleton' && renderSkeleton()}
      
      {text && (
        <p className={`mt-2 text-secondary ${sizeClasses[size].text}`}>
          {text}
        </p>
      )}
      
      {/* Accessibility: Screen reader text */}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingState;
