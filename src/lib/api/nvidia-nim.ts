import axios, { AxiosError } from 'axios';
import config from '@/lib/config';
import { analyzeTextHF, HFEntity, HFRelation } from './huggingface';

// Create axios instance with configuration
const nimClient = axios.create({
  baseURL: config.nim.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${config.nim.apiKey}`
  },
  timeout: 30000, // 30 second timeout
});

// Add request interceptor for logging in development
nimClient.interceptors.request.use(
  (config) => {
    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.info(`[NIM API] Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('[NIM API] Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
nimClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`[NIM API] Error ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('[NIM API] No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('[NIM API] Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Entity types
export interface NimEntity {
  id: string;
  text: string;
  type: string;
  startIndex: number;
  endIndex: number;
  confidence?: number;
}

// Relation types
export interface NimRelation {
  id: string;
  type: string;
  sourceId: string; // ID of source entity
  targetId: string; // ID of target entity
  text: string;
  confidence?: number;
}

// Response types
export interface NerResponse {
  entities: NimEntity[];
}

export interface RelationExtractionResponse {
  relations: NimRelation[];
  entities: NimEntity[];
}

// Analyze text to extract entities and relations
export const analyzeText = async (text: string): Promise<{
  entities: NimEntity[];
  relations: NimRelation[];
}> => {
  try {
    console.info('[NIM API] Starting text analysis...');
    
    // Check if NVIDIA NIM is enabled and properly configured
    const isNimConfigured = config.features.enableNimIntegration && 
                           config.nim.apiKey && 
                           config.nim.apiKey !== 'your-nim-api-key';

    if (isNimConfigured) {
      console.info('[NIM API] NVIDIA NIM is configured, attempting API call...');
      try {
        // Try NVIDIA NIM API first
        const response = await nimClient.post('/v1/process-text', {
          text,
          parameters: {
            max_tokens: 1000,
            temperature: 0.1,
          }
        });
        
        console.info('[NIM API] Successfully processed text with NVIDIA NIM');
        return response.data;
      } catch (nimError) {
        console.warn('[NIM API] NVIDIA NIM failed, falling back to Hugging Face:', nimError);
        // Fall back to Hugging Face
        const hfResult = await analyzeTextHF(text);
        return {
          entities: hfResult.entities.map(e => ({
            id: e.id,
            text: e.text,
            type: e.type,
            startIndex: e.startIndex,
            endIndex: e.endIndex,
            confidence: e.confidence
          })),
          relations: hfResult.relations.map(r => ({
            id: r.id,
            type: r.type,
            sourceId: r.sourceId,
            targetId: r.targetId,
            text: r.text,
            confidence: r.confidence
          }))
        };
      }
    } else {
      console.info('[NIM API] NVIDIA NIM not configured, using Hugging Face as primary...');
      // Use Hugging Face as primary
      const hfResult = await analyzeTextHF(text);
      return {
        entities: hfResult.entities.map(e => ({
          id: e.id,
          text: e.text,
          type: e.type,
          startIndex: e.startIndex,
          endIndex: e.endIndex,
          confidence: e.confidence
        })),
        relations: hfResult.relations.map(r => ({
          id: r.id,
          type: r.type,
          sourceId: r.sourceId,
          targetId: r.targetId,
          text: r.text,
          confidence: r.confidence
        }))
      };
    }
  } catch (error) {
    console.error('[NIM API] All AI analysis methods failed, falling back to regex:', error);
    // Final fallback to simple regex analysis
    return await simulateNimAnalysis(text);
  }
};

// NVIDIA NIM API operations
export const nimOperations = {
  // Named Entity Recognition
  extractEntities: async (text: string): Promise<NerResponse> => {
    try {
      // This is a mock endpoint - replace with actual NVIDIA NIM endpoint
      const response = await nimClient.post('/v1/ner', {
        text
      });
      return response.data;
    } catch (error) {
      console.error('Error calling NVIDIA NIM NER API:', error);
      throw error;
    }
  },
  
  // Relation Extraction
  extractRelations: async (text: string): Promise<RelationExtractionResponse> => {
    try {
      // This is a mock endpoint - replace with actual NVIDIA NIM endpoint
      const response = await nimClient.post('/v1/relation-extraction', {
        text
      });
      return response.data;
    } catch (error) {
      console.error('Error calling NVIDIA NIM Relation Extraction API:', error);
      throw error;
    }
  },
  
  // Process text to extract entities and relations
  processText: async (text: string): Promise<{
    entities: NimEntity[];
    relations: NimRelation[];
  }> => {
    try {
      // In a real implementation, you might call separate endpoints
      // Here we're simulating a combined call
      const response = await nimClient.post('/v1/process-text', {
        text
      });
      return response.data;
    } catch (error) {
      console.error('Error processing text with NVIDIA NIM:', error);
      
      // For demo purposes, return mock data if API is not available
      return simulateNimAnalysis(text);
    }
  }
};

// Simulate NVIDIA NIM API call
export const simulateNimAnalysis = async (text: string): Promise<{ 
  entities: NimEntity[], 
  relations: NimRelation[] 
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple entity extraction logic
  const entities: NimEntity[] = [];
  const relations: NimRelation[] = [];
  
  // Common entity types to look for
  const personPatterns = [
    /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, // Simple name pattern
    /\bDr\. [A-Z][a-z]+\b/g,
    /\bMr\. [A-Z][a-z]+\b/g,
    /\bMs\. [A-Z][a-z]+\b/g,
    /\bMrs\. [A-Z][a-z]+\b/g
  ];
  
  const organizationPatterns = [
    /\b[A-Z][a-zA-Z]+ (Inc|Corp|Corporation|Company|Co|Ltd)\b/g,
    /\b[A-Z][A-Z]+\b/g // Acronyms like NASA, FBI
  ];
  
  const locationPatterns = [
    /\b[A-Z][a-z]+ (City|Town|Village|County|State|Province|Country)\b/g,
    /\b(North|South|East|West) [A-Z][a-z]+\b/g
  ];
  
  // Extract entities
  let entityId = 0;
  
  // Extract persons
  personPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        if (!entities.some(e => e.text === match)) {
          entities.push({
            id: (entityId++).toString(),
            text: match,
            type: 'Person',
            startIndex: text.indexOf(match),
            endIndex: text.indexOf(match) + match.length
          });
        }
      });
    }
  });
  
  // Extract organizations
  organizationPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        // Skip if already found as a person
        if (!entities.some(e => e.text === match)) {
          entities.push({
            id: (entityId++).toString(),
            text: match,
            type: 'Organization',
            startIndex: text.indexOf(match),
            endIndex: text.indexOf(match) + match.length
          });
        }
      });
    }
  });
  
  // Extract locations
  locationPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        // Skip if already found as a person or organization
        if (!entities.some(e => e.text === match)) {
          entities.push({
            id: (entityId++).toString(),
            text: match,
            type: 'Location',
            startIndex: text.indexOf(match),
            endIndex: text.indexOf(match) + match.length
          });
        }
      });
    }
  });
  
  // Simple relation extraction logic
  const relationPatterns = [
    { pattern: /([A-Z][a-z]+ [A-Z][a-z]+) works for ([A-Z][a-zA-Z]+ (Inc|Corp|Corporation|Company|Co|Ltd))/g, type: 'WORKS_FOR' },
    { pattern: /([A-Z][a-z]+ [A-Z][a-z]+) founded ([A-Z][a-zA-Z]+ (Inc|Corp|Corporation|Company|Co|Ltd))/g, type: 'FOUNDED' },
    { pattern: /([A-Z][a-z]+ [A-Z][a-z]+) lives in ([A-Z][a-z]+ (City|Town|Village|County|State|Province|Country))/g, type: 'LIVES_IN' },
    { pattern: /([A-Z][a-zA-Z]+ (Inc|Corp|Corporation|Company|Co|Ltd)) is located in ([A-Z][a-z]+ (City|Town|Village|County|State|Province|Country))/g, type: 'LOCATED_IN' }
  ];
  
  // Extract relations
  let relationId = 0;
  
  relationPatterns.forEach(({ pattern, type }) => {
    const regex = new RegExp(pattern);
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      const sourceText = match[1];
      const targetText = match[2];
      
      const sourceEntity = entities.find(e => e.text === sourceText);
      const targetEntity = entities.find(e => e.text === targetText);
      
      if (sourceEntity && targetEntity) {
        relations.push({
          id: (relationId++).toString(),
          type,
          sourceId: sourceEntity.id,
          targetId: targetEntity.id,
          text: match[0]
        });
      }
    }
  });
  
  return { entities, relations };
};
