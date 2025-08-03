/**
 * Form validation utilities
 * 
 * This module provides utilities for validating form inputs with a simple, flexible API.
 */

// Validation rule type
export type ValidationRule = {
  test: (value: any) => boolean;
  message: string;
};

// Validation result type
export type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

/**
 * Validate a single value against a set of rules
 * 
 * @param value - The value to validate
 * @param rules - Array of validation rules to apply
 * @returns Validation result with isValid flag and array of error messages
 */
export const validateValue = (value: any, rules: ValidationRule[]): ValidationResult => {
  const errors: string[] = [];
  
  for (const rule of rules) {
    if (!rule.test(value)) {
      errors.push(rule.message);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate an object against a schema of rules
 * 
 * @param values - Object containing values to validate
 * @param schema - Object mapping field names to validation rules
 * @returns Object mapping field names to validation results
 */
export const validateForm = <T extends Record<string, any>>(
  values: T,
  schema: Record<keyof T, ValidationRule[]>
): Record<keyof T, ValidationResult> => {
  const results: Record<string, ValidationResult> = {};
  
  for (const field in schema) {
    if (Object.prototype.hasOwnProperty.call(schema, field)) {
      results[field] = validateValue(values[field], schema[field]);
    }
  }
  
  return results as Record<keyof T, ValidationResult>;
};

/**
 * Check if an entire form is valid
 * 
 * @param validationResults - Object mapping field names to validation results
 * @returns True if all fields are valid, false otherwise
 */
export const isFormValid = (
  validationResults: Record<string, ValidationResult>
): boolean => {
  return Object.values(validationResults).every((result) => result.isValid);
};

// Common validation rules
export const rules = {
  required: (message = 'This field is required'): ValidationRule => ({
    test: (value) => {
      if (value === undefined || value === null) return false;
      if (typeof value === 'string') return value.trim() !== '';
      if (Array.isArray(value)) return value.length > 0;
      return true;
    },
    message,
  }),
  
  minLength: (min: number, message = `Must be at least ${min} characters`): ValidationRule => ({
    test: (value) => {
      if (typeof value !== 'string') return false;
      return value.length >= min;
    },
    message,
  }),
  
  maxLength: (max: number, message = `Must be at most ${max} characters`): ValidationRule => ({
    test: (value) => {
      if (typeof value !== 'string') return false;
      return value.length <= max;
    },
    message,
  }),
  
  email: (message = 'Must be a valid email address'): ValidationRule => ({
    test: (value) => {
      if (typeof value !== 'string') return false;
      // Simple email regex - could be more comprehensive in production
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },
    message,
  }),
  
  url: (message = 'Must be a valid URL'): ValidationRule => ({
    test: (value) => {
      if (typeof value !== 'string') return false;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message,
  }),
  
  numeric: (message = 'Must be a number'): ValidationRule => ({
    test: (value) => {
      if (typeof value === 'number') return !isNaN(value);
      if (typeof value !== 'string') return false;
      return !isNaN(Number(value));
    },
    message,
  }),
  
  integer: (message = 'Must be an integer'): ValidationRule => ({
    test: (value) => {
      if (typeof value === 'number') return Number.isInteger(value);
      if (typeof value !== 'string') return false;
      const num = Number(value);
      return !isNaN(num) && Number.isInteger(num);
    },
    message,
  }),
  
  min: (min: number, message = `Must be at least ${min}`): ValidationRule => ({
    test: (value) => {
      const num = Number(value);
      return !isNaN(num) && num >= min;
    },
    message,
  }),
  
  max: (max: number, message = `Must be at most ${max}`): ValidationRule => ({
    test: (value) => {
      const num = Number(value);
      return !isNaN(num) && num <= max;
    },
    message,
  }),
  
  pattern: (regex: RegExp, message = 'Invalid format'): ValidationRule => ({
    test: (value) => {
      if (typeof value !== 'string') return false;
      return regex.test(value);
    },
    message,
  }),
  
  custom: (testFn: (value: any) => boolean, message: string): ValidationRule => ({
    test: testFn,
    message,
  }),
};

export default {
  validateValue,
  validateForm,
  isFormValid,
  rules,
};
