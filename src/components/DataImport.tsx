'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { GraphNode, GraphRelationship } from '@/lib/db/neo4j';

interface DataImportProps {
  onDataImported?: (data: { nodes: GraphNode[], relationships: GraphRelationship[] }) => void;
}

const DataImport: React.FC<DataImportProps> = ({ onDataImported }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportResult(null);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // Validate data structure
      if (!data.nodes || !data.relationships) {
        throw new Error('Invalid file format. Expected nodes and relationships arrays.');
      }

      onDataImported?.(data);
      setImportResult(`Successfully imported ${data.nodes.length} nodes and ${data.relationships.length} relationships`);
    } catch (error) {
      console.error('Error importing data:', error);
      setImportResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsImporting(false);
    }
  };

  const generateSampleData = () => {
    const sampleData = {
      nodes: [
        {
          id: 'sample_1',
          labels: ['Entity', 'Person'],
          properties: { name: 'John Doe', occupation: 'Engineer' }
        },
        {
          id: 'sample_2',
          labels: ['Entity', 'Organization'],
          properties: { name: 'TechCorp', industry: 'Technology' }
        }
      ],
      relationships: [
        {
          id: 'rel_1',
          type: 'WORKS_FOR',
          startNodeId: 'sample_1',
          endNodeId: 'sample_2',
          properties: { since: '2020' }
        }
      ]
    };

    const blob = new Blob([JSON.stringify(sampleData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_graph_data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card variant="glass">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Data Import</h3>
            <p className="text-sm text-slate-400">Import graph data from JSON files</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-slate-300 mb-2">
            Upload JSON File
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            disabled={isImporting}
            className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-green-600 file:text-white hover:file:bg-green-700 disabled:opacity-50"
          />
        </div>

        {isImporting && (
          <div className="flex items-center gap-2 text-slate-300">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
            Importing data...
          </div>
        )}

        {importResult && (
          <div className={`p-3 rounded-lg ${
            importResult.startsWith('Error') 
              ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
              : 'bg-green-500/20 text-green-300 border border-green-500/30'
          }`}>
            {importResult}
          </div>
        )}

        <div className="border-t border-slate-700 pt-4">
          <p className="text-sm text-slate-400 mb-3">
            Need a sample file? Download our example format:
          </p>
          <button
            onClick={generateSampleData}
            className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Sample
          </button>
        </div>

        <div className="text-xs text-slate-500 space-y-1">
          <p><strong>Expected Format:</strong></p>
          <pre className="bg-slate-800/50 p-2 rounded text-xs overflow-x-auto">
{`{
  "nodes": [
    {
      "id": "unique_id",
      "labels": ["Entity", "Type"],
      "properties": { "name": "..." }
    }
  ],
  "relationships": [
    {
      "id": "rel_id",
      "type": "RELATIONSHIP_TYPE",
      "startNodeId": "node_id",
      "endNodeId": "node_id",
      "properties": {}
    }
  ]
}`}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataImport;
