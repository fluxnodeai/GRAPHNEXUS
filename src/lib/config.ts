/**
 * Application configuration with environment variable validation
 * 
 * This module centralizes all environment variable access and provides
 * validation to ensure required variables are present in production.
 */

// Environment detection
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';

// Function to get a required environment variable
const getRequiredEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  
  // In production, throw an error if the variable is missing
  if (isProduction && !value) {
    throw new Error(`Environment variable ${key} is required in production mode`);
  }
  
  // In development, warn but provide a fallback
  if (isDevelopment && !value && !defaultValue) {
    console.warn(`Environment variable ${key} is missing, using fallback value`);
  }
  
  return value || '';
};

// Function to validate database connections
const validateDatabaseConfig = () => {
  const errors: string[] = [];
  
  // Validate Supabase config
  if (!config.supabase.url || config.supabase.url.includes('your-supabase-url')) {
    errors.push('Supabase URL is not configured. Please set NEXT_PUBLIC_SUPABASE_URL');
  }
  
  if (!config.supabase.anonKey || config.supabase.anonKey.includes('your-supabase-anon-key')) {
    errors.push('Supabase anon key is not configured. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  
  // Validate Neo4j config
  if (!config.neo4j.uri || config.neo4j.uri.includes('localhost') && isProduction) {
    errors.push('Neo4j URI is not configured for production. Please set NEO4J_URI');
  }
  
  if (!config.neo4j.password || config.neo4j.password === 'password') {
    errors.push('Neo4j password is not configured. Please set NEO4J_PASSWORD');
  }
  
  return errors;
};

// Application configuration object
export const config = {
  app: {
    name: 'GraphNexus',
    version: '0.1.0',
    description: 'Knowledge Graph Visualization Platform',
  },
  
  // Supabase configuration
  supabase: {
    url: getRequiredEnvVar('NEXT_PUBLIC_SUPABASE_URL', 'https://your-supabase-url.supabase.co'),
    anonKey: getRequiredEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'your-supabase-anon-key'),
  },
  
  // Neo4j configuration
  neo4j: {
    uri: getRequiredEnvVar('NEO4J_URI', 'neo4j+s://b111ef49.databases.neo4j.io'),
    user: getRequiredEnvVar('NEO4J_USERNAME', 'neo4j'),
    password: getRequiredEnvVar('NEO4J_PASSWORD', 'ZYfmAP4JE90SQSCv6ku0qZCfZcAK2-_jh1v0Ddnjl4E'),
  },
  
  // NVIDIA NIM configuration
  nim: {
    apiBaseUrl: getRequiredEnvVar('NEXT_PUBLIC_NIM_API_BASE_URL', 'https://api.nim.nvidia.com'),
    apiKey: getRequiredEnvVar('NIM_API_KEY', 'your-nim-api-key'),
  },
  
  // Feature flags
  features: {
    useSyntheticData: getRequiredEnvVar('USE_SYNTHETIC_DATA', 'true') === 'true',
    enableNimIntegration: getRequiredEnvVar('ENABLE_NIM_INTEGRATION', 'false') === 'true',
  },
};

// Validate configuration on startup
export const configValidation = validateDatabaseConfig();

// Log configuration validation results
if (isDevelopment && configValidation.length > 0) {
  console.warn('Configuration issues detected:');
  configValidation.forEach(error => console.warn(`- ${error}`));
}

// Export validation function for external use
export { validateDatabaseConfig };

// Export default config
export default config;
