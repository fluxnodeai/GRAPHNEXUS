'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logError } from '@/lib/utils/error-handler';

interface ErrorBoundaryProps {
  /**
   * The children to render
   */
  children: ReactNode;
  
  /**
   * Optional custom fallback component or render function
   */
  fallback?: ReactNode | ((error: Error, reset: () => void) => React.ReactElement);
  
  /**
   * Optional callback when an error occurs
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component to catch JavaScript errors in child component tree
 * and display a fallback UI instead of crashing the whole application
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    logError(error);
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Render custom fallback if provided
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function' && this.state.error) {
          return this.props.fallback(this.state.error, this.resetErrorBoundary);
        }
        return this.props.fallback as React.ReactElement;
      }

      // Default fallback UI
      return (
        <div className="card bg-red-900 border-red-800 p-4">
          <div className="flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold text-red-500">Something went wrong</h2>
          </div>
          
          <div className="mb-4">
            <p className="text-red-300 mb-2">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <pre className="bg-red-950 p-3 rounded overflow-auto text-xs text-red-300 max-h-40">
                {this.state.error.stack}
              </pre>
            )}
          </div>
          
          <button
            onClick={this.resetErrorBoundary}
            className="btn bg-red-800 hover:bg-red-700 text-white border-red-700"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
