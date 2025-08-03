/**
 * Hugging Face API integration for free Named Entity Recognition
 * Alternative to NVIDIA NIM for hackathon use
 */

import axios, { AxiosError } from 'axios';
import config from '@/lib/config';

// Create axios instance for Hugging Face API
const hfClient = axios.create({
  baseURL: 'https://api-inference.huggingface.co',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
hfClient.interceptors.request.use(
  (config) => {
    // Add API key if available
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (apiKey && apiKey !== 'your-huggingface-api-key') {
      config.headers.Authorization = `Bearer ${apiKey}`;
    }
    return config;
  },
  (error) => {
    console.error('[HuggingFace] Request error:', error);
    return Promise.reject(error);
  }
);

// Entity and relation types (same as NVIDIA NIM for compatibility)
export interface HFEntity {
  id: string;
  text: string;
  type: string;
  startIndex: number;
  endIndex: number;
  confidence?: number;
}

export interface HFRelation {
  id: string;
  type: string;
  sourceId: string;
  targetId: string;
  text: string;
  confidence?: number;
}

// Hugging Face model endpoints (free)
const MODELS = {
  NER: 'dbmdz/bert-large-cased-finetuned-conll03-english', // Free NER model
  RELATION: 'microsoft/DialoGPT-medium', // Can be used for basic relation extraction
};

// Entity type mapping from Hugging Face labels to our types
const ENTITY_TYPE_MAPPING: Record<string, string> = {
  'PER': 'Person',
  'PERSON': 'Person',
  'ORG': 'Organization',
  'LOC': 'Location',
  'MISC': 'Other',
  'GPE': 'Location', // Geopolitical entity
  'MONEY': 'Product',
  'DATE': 'Event',
  'TIME': 'Event',
};

// Named Entity Recognition using Hugging Face
export async function extractEntitiesHF(text: string): Promise<HFEntity[]> {
  try {
    console.info('[HuggingFace] Extracting entities from text...');
    
    const response = await hfClient.post(`/models/${MODELS.NER}`, {
      inputs: text,
      options: {
        wait_for_model: true,
      },
    });

    const entities: HFEntity[] = [];
    let entityId = 0;

    if (Array.isArray(response.data)) {
      // Group consecutive tokens that belong to the same entity
      const groupedEntities = groupConsecutiveEntities(response.data);
      
      groupedEntities.forEach((group) => {
        const entityType = ENTITY_TYPE_MAPPING[group.entity_group] || 'Other';
        
        entities.push({
          id: (entityId++).toString(),
          text: group.word,
          type: entityType,
          startIndex: group.start,
          endIndex: group.end,
          confidence: group.score,
        });
      });
    }

    console.info(`[HuggingFace] Extracted ${entities.length} entities`);
    return entities;
  } catch (error) {
    console.error('[HuggingFace] Entity extraction failed:', error);
    
    // Fallback to simple regex-based extraction
    console.info('[HuggingFace] Falling back to regex-based extraction...');
    return extractEntitiesRegex(text);
  }
}

// Group consecutive entity tokens (Hugging Face often splits entities into multiple tokens)
function groupConsecutiveEntities(entities: any[]): any[] {
  const grouped: any[] = [];
  let currentGroup: any = null;

  entities.forEach((entity) => {
    if (entity.entity_group && entity.score > 0.5) { // Filter low confidence
      if (currentGroup && 
          currentGroup.entity_group === entity.entity_group && 
          entity.start <= currentGroup.end + 2) {
        // Extend current group
        currentGroup.word += entity.word.replace('##', ''); // Remove subword markers
        currentGroup.end = entity.end;
        currentGroup.score = Math.max(currentGroup.score, entity.score);
      } else {
        // Start new group
        if (currentGroup) {
          grouped.push(currentGroup);
        }
        currentGroup = {
          entity_group: entity.entity_group,
          word: entity.word.replace('##', ''),
          start: entity.start,
          end: entity.end,
          score: entity.score,
        };
      }
    }
  });

  if (currentGroup) {
    grouped.push(currentGroup);
  }

  return grouped;
}

// Fallback regex-based entity extraction
function extractEntitiesRegex(text: string): HFEntity[] {
  const entities: HFEntity[] = [];
  let entityId = 0;

  // Simple patterns for common entity types
  const patterns = [
    { regex: /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, type: 'Person' },
    { regex: /\b[A-Z][a-zA-Z]+ (Inc|Corp|Corporation|Company|Co|Ltd)\b/g, type: 'Organization' },
    { regex: /\b[A-Z][a-z]+ (City|Town|Village|State|Country)\b/g, type: 'Location' },
    { regex: /\$[0-9,]+(\.[0-9]{2})?\b/g, type: 'Product' },
  ];

  patterns.forEach(({ regex, type }) => {
    let match;
    while ((match = regex.exec(text)) !== null) {
      entities.push({
        id: (entityId++).toString(),
        text: match[0],
        type,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        confidence: 0.8, // Simulated confidence for regex matches
      });
    }
  });

  return entities;
}

// Basic relation extraction using pattern matching
export async function extractRelationsHF(text: string, entities: HFEntity[]): Promise<HFRelation[]> {
  try {
    console.info('[HuggingFace] Extracting relations from text...');
    
    const relations: HFRelation[] = [];
    let relationId = 0;

    // Simple relation patterns
    const relationPatterns = [
      { pattern: /(\w+(?:\s+\w+)*)\s+works?\s+(?:for|at)\s+(\w+(?:\s+\w+)*)/gi, type: 'WORKS_FOR' },
      { pattern: /(\w+(?:\s+\w+)*)\s+founded\s+(\w+(?:\s+\w+)*)/gi, type: 'FOUNDED' },
      { pattern: /(\w+(?:\s+\w+)*)\s+lives?\s+in\s+(\w+(?:\s+\w+)*)/gi, type: 'LIVES_IN' },
      { pattern: /(\w+(?:\s+\w+)*)\s+(?:is\s+)?located\s+in\s+(\w+(?:\s+\w+)*)/gi, type: 'LOCATED_IN' },
      { pattern: /(\w+(?:\s+\w+)*)\s+owns?\s+(\w+(?:\s+\w+)*)/gi, type: 'OWNS' },
      { pattern: /(\w+(?:\s+\w+)*)\s+knows?\s+(\w+(?:\s+\w+)*)/gi, type: 'KNOWS' },
    ];

    relationPatterns.forEach(({ pattern, type }) => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const sourceText = match[1].trim();
        const targetText = match[2].trim();

        // Find corresponding entities
        const sourceEntity = entities.find(e => 
          e.text.toLowerCase().includes(sourceText.toLowerCase()) ||
          sourceText.toLowerCase().includes(e.text.toLowerCase())
        );
        
        const targetEntity = entities.find(e => 
          e.text.toLowerCase().includes(targetText.toLowerCase()) ||
          targetText.toLowerCase().includes(e.text.toLowerCase())
        );

        if (sourceEntity && targetEntity && sourceEntity.id !== targetEntity.id) {
          relations.push({
            id: (relationId++).toString(),
            type,
            sourceId: sourceEntity.id,
            targetId: targetEntity.id,
            text: match[0],
            confidence: 0.7,
          });
        }
      }
    });

    console.info(`[HuggingFace] Extracted ${relations.length} relations`);
    return relations;
  } catch (error) {
    console.error('[HuggingFace] Relation extraction failed:', error);
    return [];
  }
}

// Combined analysis function
export async function analyzeTextHF(text: string): Promise<{
  entities: HFEntity[];
  relations: HFRelation[];
}> {
  try {
    // Extract entities first
    const entities = await extractEntitiesHF(text);
    
    // Then extract relations using the entities
    const relations = await extractRelationsHF(text, entities);
    
    return { entities, relations };
  } catch (error) {
    console.error('[HuggingFace] Text analysis failed:', error);
    throw error;
  }
}

// Health check for Hugging Face API
export async function checkHuggingFaceHealth(): Promise<{
  isAvailable: boolean;
  latency?: number;
  error?: string;
}> {
  try {
    const startTime = Date.now();
    
    // Simple test with a small text
    await hfClient.post(`/models/${MODELS.NER}`, {
      inputs: 'John works at Microsoft.',
      options: { wait_for_model: false },
    });
    
    const latency = Date.now() - startTime;
    
    return {
      isAvailable: true,
      latency,
    };
  } catch (error) {
    return {
      isAvailable: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
