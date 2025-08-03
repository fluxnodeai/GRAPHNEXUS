/**
 * Error handling utilities for consistent error management across the application
 */

// Custom application error class
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context?: Record<string, any>;

  constructor({
    message,
    code = 'INTERNAL_ERROR',
    statusCode = 500,
    isOperational = true,
    context = {},
  }: {
    message: string;
    code?: string;
    statusCode?: number;
    isOperational?: boolean;
    context?: Record<string, any>;
  }) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

// Database error
export class DatabaseError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super({
      message,
      code: 'DATABASE_ERROR',
      statusCode: 500,
      isOperational: true,
      context,
    });
  }
}

// API error
export class ApiError extends AppError {
  constructor(message: string, statusCode = 500, context?: Record<string, any>) {
    super({
      message,
      code: 'API_ERROR',
      statusCode,
      isOperational: true,
      context,
    });
  }
}

// Not found error
export class NotFoundError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super({
      message,
      code: 'NOT_FOUND',
      statusCode: 404,
      isOperational: true,
      context,
    });
  }
}

// Validation error
export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super({
      message,
      code: 'VALIDATION_ERROR',
      statusCode: 400,
      isOperational: true,
      context,
    });
  }
}

// Authentication error
export class AuthenticationError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super({
      message,
      code: 'AUTHENTICATION_ERROR',
      statusCode: 401,
      isOperational: true,
      context,
    });
  }
}

// Authorization error
export class AuthorizationError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super({
      message,
      code: 'AUTHORIZATION_ERROR',
      statusCode: 403,
      isOperational: true,
      context,
    });
  }
}

// Function to handle errors in async functions
export const handleAsyncError = <T>(
  fn: (...args: any[]) => Promise<T>
) => {
  return async (...args: any[]): Promise<T> => {
    try {
      return await fn(...args);
    } catch (error) {
      // If it's already an AppError, rethrow it
      if (error instanceof AppError) {
        throw error;
      }
      
      // Otherwise, convert to AppError
      if (error instanceof Error) {
        throw new AppError({
          message: error.message,
          isOperational: false,
          context: { originalError: error },
        });
      }
      
      // For unknown errors
      throw new AppError({
        message: 'An unknown error occurred',
        isOperational: false,
        context: { originalError: error },
      });
    }
  };
};

// Function to format error for client response
export const formatErrorResponse = (error: Error): Record<string, any> => {
  // For AppErrors, return structured error
  if (error instanceof AppError) {
    return {
      error: {
        message: error.message,
        code: error.code,
        ...(error.isOperational ? {} : { type: 'UnexpectedError' }),
      },
    };
  }
  
  // For other errors, return generic error
  return {
    error: {
      message: 'An unexpected error occurred',
      code: 'INTERNAL_ERROR',
      type: 'UnexpectedError',
    },
  };
};

// Global error logger
export const logError = (error: Error): void => {
  // In production, you might want to log to a service like Sentry
  if (process.env.NODE_ENV === 'production') {
    // TODO: Add production error logging
    console.error('[ERROR]', error);
  } else {
    // In development, log to console with stack trace
    console.error('[ERROR]', error);
    if (error.stack) {
      console.error(error.stack);
    }
    
    // Log additional context for AppErrors
    if (error instanceof AppError && error.context) {
      console.error('Error Context:', error.context);
    }
  }
};

// Export default object with all error utilities
export default {
  AppError,
  DatabaseError,
  ApiError,
  NotFoundError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  handleAsyncError,
  formatErrorResponse,
  logError,
};
