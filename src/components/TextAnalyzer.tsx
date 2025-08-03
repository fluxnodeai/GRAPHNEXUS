'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { NimEntity, NimRelation } from '@/lib/api/nvidia-nim';

interface TextAnalyzerProps {
  onEntitiesExtracted?: (entities: NimEntity[]) => void;
  onRelationsExtracted?: (relations: NimRelation[], entities: NimEntity[]) => void;
}

const TextAnalyzer: React.FC<TextAnalyzerProps> = ({
  onEntitiesExtracted,
  onRelationsExtracted
}) => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedEntities, setExtractedEntities] = useState<NimEntity[]>([]);

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    
    try {
      // Simulate AI entity extraction
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock extracted entities
      const mockEntities: NimEntity[] = [
        {
          id: 'entity_1',
          text: 'OpenAI',
          type: 'Organization',
          startIndex: 0,
          endIndex: 6,
          confidence: 0.95
        },
        {
          id: 'entity_2',
          text: 'GPT-4',
          type: 'Product',
          startIndex: 20,
          endIndex: 25,
          confidence: 0.92
        },
        {
          id: 'entity_3',
          text: 'San Francisco',
          type: 'Location',
          startIndex: 50,
          endIndex: 63,
          confidence: 0.88
        }
      ];

      const mockRelations: NimRelation[] = [
        {
          id: 'relation_1',
          sourceId: 'entity_1',
          targetId: 'entity_2',
          type: 'DEVELOPS',
          text: 'OpenAI develops GPT-4',
          confidence: 0.90
        },
        {
          id: 'relation_2',
          sourceId: 'entity_1',
          targetId: 'entity_3',
          type: 'LOCATED_IN',
          text: 'OpenAI is located in San Francisco',
          confidence: 0.85
        }
      ];

      setExtractedEntities(mockEntities);
      onEntitiesExtracted?.(mockEntities);
      onRelationsExtracted?.(mockRelations, mockEntities);
    } catch (error) {
      console.error('Error analyzing text:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card variant="glass">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">AI Text Analysis</h3>
            <p className="text-sm text-slate-400">Extract entities and relationships from text</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="text-input" className="block text-sm font-medium text-slate-300 mb-2">
            Input Text
          </label>
          <textarea
            id="text-input"
            rows={6}
            className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            placeholder="Enter text to analyze for entities and relationships..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!text.trim() || isAnalyzing}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Analyzing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Analyze Text
            </>
          )}
        </button>

        {extractedEntities.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-slate-300 mb-3">Extracted Entities</h4>
            <div className="space-y-2">
              {extractedEntities.map((entity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      entity.type === 'Organization' ? 'bg-red-500/20 text-red-300' :
                      entity.type === 'Product' ? 'bg-purple-500/20 text-purple-300' :
                      entity.type === 'Location' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {entity.type}
                    </span>
                    <span className="text-white font-medium">{entity.text}</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {Math.round((entity.confidence || 0) * 100)}% confidence
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TextAnalyzer;
