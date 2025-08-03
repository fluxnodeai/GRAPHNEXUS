'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import SimpleGraphVisualization from '@/components/SimpleGraphVisualization';
import EntityDetail from '@/components/EntityDetail';
import TextAnalyzer from '@/components/TextAnalyzer';
import DataImport from '@/components/DataImport';
import GraphAnalytics from '@/components/GraphAnalytics';
import { graphOperations, GraphData, GraphNode, GraphRelationship } from '@/lib/db/neo4j';
import { entityOperations, Entity } from '@/lib/db/supabase';
import { generateSyntheticDataset } from '@/lib/utils/synthetic-data';
import { NimEntity, NimRelation } from '@/lib/api/nvidia-nim';
import { useWebSocket } from '@/hooks/useWebSocket';

export default function GraphPage() {
  // Core state
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // Configuration
  const [nodeCount, setNodeCount] = useState(50);
  const [graphId, setGraphId] = useState<string | null>(null);
  
  // UI state
  const [activeTab, setActiveTab] = useState<'graph' | 'analyzer' | 'import' | 'analytics'>('graph');
  
  // Collaboration (simplified)
  const { isConnected, connectedUsers } = useWebSocket(mounted ? `ws://localhost:3001/graph/${graphId || 'default'}` : '');

  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize graph session
  useEffect(() => {
    if (!mounted) return;
    
    const sessionGraphId = localStorage.getItem('currentGraphId') || 
      `graph_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    setGraphId(sessionGraphId);
    localStorage.setItem('currentGraphId', sessionGraphId);
    
    loadGraphData();
  }, [mounted]);

  // Load graph data
  const loadGraphData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to load from Neo4j first
      try {
        const realGraphData = await graphOperations.getGraphData();
        if (realGraphData.nodes.length > 0) {
          console.log(`Loaded ${realGraphData.nodes.length} nodes from Neo4j database`);
          setGraphData(realGraphData);
          setLoading(false);
          return;
        } else {
          console.log('Neo4j database is empty, populating with synthetic data...');
        }
      } catch (neo4jError) {
        console.log('Neo4j error:', neo4jError);
        console.log('Falling back to synthetic data');
      }
      
      // Generate and populate Neo4j with synthetic data
      const syntheticData = generateSyntheticDataset(nodeCount);
      
      const enhancedGraphData: GraphData = {
        nodes: syntheticData.nodes.map(node => ({
          ...node,
          properties: {
            ...node.properties,
            lastModified: new Date().toISOString(),
            createdBy: 'system',
            confidence: Math.random() * 0.3 + 0.7,
            community: Math.floor(Math.random() * 5) + 1
          }
        })),
        relationships: syntheticData.relationships.map((rel, index) => ({
          id: index.toString(),
          type: rel.type,
          startNodeId: rel.startNodeId,
          endNodeId: rel.endNodeId,
          properties: {
            ...rel.properties,
            weight: Math.random() * 0.5 + 0.5,
            lastModified: new Date().toISOString(),
            confidence: Math.random() * 0.3 + 0.7
          }
        }))
      };
      
      // Try to import data into Neo4j
      try {
        console.log('Importing synthetic data to Neo4j...');
        await graphOperations.bulkImportData({
          nodes: enhancedGraphData.nodes,
          relationships: enhancedGraphData.relationships.map(rel => ({
            type: rel.type,
            startNodeId: rel.startNodeId,
            endNodeId: rel.endNodeId,
            properties: rel.properties
          }))
        });
        console.log('Successfully imported data to Neo4j database!');
        
        // Now load the data back from Neo4j to confirm
        const importedData = await graphOperations.getGraphData();
        setGraphData(importedData);
      } catch (importError) {
        console.error('Failed to import to Neo4j:', importError);
        console.log('Using local synthetic data instead');
        setGraphData(enhancedGraphData);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading graph data:', err);
      setError(`Failed to load graph data: ${err instanceof Error ? err.message : String(err)}`);
      setLoading(false);
    }
  };

  // Handle node click
  const handleNodeClick = async (nodeId: string) => {
    if (!graphData) return;
    
    try {
      const node = graphData.nodes.find(n => n.id === nodeId);
      
      if (node) {
        try {
          const entity = await entityOperations.getEntityById(nodeId);
          if (entity) {
            setSelectedEntity(entity);
          } else {
            throw new Error('Entity not found');
          }
        } catch {
          // Fallback to creating entity from node data
          const entity: Entity = {
            id: node.id,
            name: node.properties.name || `Node ${node.id}`,
            type: node.labels[1] || 'Entity',
            description: `${node.labels[1] || 'Entity'} node with ${Object.keys(node.properties).length} properties.`,
            properties: {
              ...node.properties,
              community: node.properties.community,
              confidence: node.properties.confidence,
              lastModified: node.properties.lastModified
            },
            created_at: node.properties.lastModified || new Date().toISOString()
          };
          
          setSelectedEntity(entity);
        }
      }
    } catch (err) {
      console.error('Error handling node click:', err);
    }
  };

  // Handle AI entity extraction
  const handleEntitiesExtracted = useCallback(async (entities: NimEntity[]) => {
    if (!graphData) return;
    
    const newNodes: GraphNode[] = entities.map((entity, index) => ({
      id: `ai_entity_${Date.now()}_${index}`,
      labels: ['Entity', entity.type || 'Concept'],
      properties: {
        name: entity.text,
        type: entity.type,
        confidence: entity.confidence || 0.8,
        source: 'ai_extraction',
        createdBy: 'ai',
        lastModified: new Date().toISOString(),
        extractedAt: new Date().toISOString()
      }
    }));
    
    setGraphData(prev => prev ? {
      ...prev,
      nodes: [...prev.nodes, ...newNodes]
    } : null);
  }, [graphData]);

  // Handle AI relationship extraction
  const handleRelationsExtracted = useCallback(async (relations: NimRelation[], entities: NimEntity[]) => {
    if (!graphData) return;
    
    const entityMap = new Map(entities.map((entity, index) => [
      entity.text,
      `ai_entity_${Date.now()}_${index}`
    ]));
    
    const newRelationships: GraphRelationship[] = relations.map((relation, index) => ({
      id: `ai_relation_${Date.now()}_${index}`,
      type: relation.type || 'RELATED_TO',
      startNodeId: entityMap.get(relation.sourceId) || '',
      endNodeId: entityMap.get(relation.targetId) || '',
      properties: {
        confidence: relation.confidence || 0.8,
        source: 'ai_extraction',
        createdBy: 'ai',
        lastModified: new Date().toISOString(),
        weight: relation.confidence || 0.8
      }
    })).filter(rel => rel.startNodeId && rel.endNodeId);
    
    setGraphData(prev => prev ? {
      ...prev,
      relationships: [...prev.relationships, ...newRelationships]
    } : null);
  }, [graphData]);

  // Handle data import
  const handleDataImported = useCallback(async (data: { nodes: GraphNode[], relationships: GraphRelationship[] }) => {
    const enhancedNodes = data.nodes.map(node => ({
      ...node,
      properties: {
        ...node.properties,
        imported: true,
        importedAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      }
    }));
    
    const enhancedRelationships = data.relationships.map((rel, index) => ({
      ...rel,
      id: rel.id || `imported_${index}`,
      properties: {
        ...rel.properties,
        imported: true,
        importedAt: new Date().toISOString(),
        weight: rel.properties?.weight || 1.0
      }
    }));
    
    setGraphData({
      nodes: enhancedNodes,
      relationships: enhancedRelationships
    });
  }, []);

  const handleNodeHighlight = useCallback((nodeIds: string[]) => {
    console.log('Highlighting nodes:', nodeIds);
  }, []);

  const handleRegenerateGraph = () => {
    setLoading(true);
    const newNodeCount = Math.max(10, Math.min(200, nodeCount));
    setNodeCount(newNodeCount);
    loadGraphData();
  };

  const handleExportGraph = () => {
    if (!graphData) return;
    
    const exportData = {
      metadata: {
        graphId,
        exportedAt: new Date().toISOString(),
        nodeCount: graphData.nodes.length,
        edgeCount: graphData.relationships.length,
        version: '1.0'
      },
      graph: graphData
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `graphnexus_export_${graphId}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Knowledge Graph Studio
                </h1>
                <p className="text-blue-200/80 mt-1">
                  Interactive graph visualization and analysis platform
                </p>
              </div>
            </div>
            
            {/* Connection Status */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-400/30 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-sm text-green-200">
                  {isConnected ? `${connectedUsers} connected` : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Control Panel */}
        <Card variant="glass" className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Node Count Control */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-300">Nodes:</label>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={nodeCount}
                  onChange={(e) => setNodeCount(parseInt(e.target.value))}
                  className="w-20 accent-blue-500"
                />
                <span className="text-sm text-slate-400 w-8">{nodeCount}</span>
              </div>
              
              {/* Action Buttons */}
              <button
                onClick={handleRegenerateGraph}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {loading ? 'Loading...' : 'Regenerate'}
              </button>
              
              <button
                onClick={handleExportGraph}
                disabled={!graphData}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 text-white rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export
              </button>
              
              {/* Tab Navigation */}
              <div className="flex gap-2 ml-auto">
                {[
                  { id: 'graph', label: 'Graph', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                  { id: 'analyzer', label: 'AI Analysis', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
                  { id: 'import', label: 'Import', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' },
                  { id: 'analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                    </svg>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Area */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="xl:col-span-3">
            {error && (
              <Card variant="glass" className="mb-6">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-bold text-red-400">Error</h3>
                      <p className="text-red-300">{error}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tab Content */}
            {activeTab === 'graph' && (
              loading ? (
                <Card variant="glass">
                  <CardContent className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p className="text-slate-300">Loading graph data...</p>
                      <p className="text-sm text-slate-500 mt-2">Generating {nodeCount} nodes and relationships</p>
                    </div>
                  </CardContent>
                </Card>
              ) : graphData ? (
                <SimpleGraphVisualization 
                  graphData={graphData} 
                  onNodeClick={handleNodeClick}
                />
              ) : (
                <Card variant="glass">
                  <CardContent className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <svg className="h-16 w-16 mx-auto text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-slate-400 mb-4">No graph data available</p>
                      <button
                        onClick={handleRegenerateGraph}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                      >
                        Generate Graph Data
                      </button>
                    </div>
                  </CardContent>
                </Card>
              )
            )}

            {activeTab === 'analyzer' && (
              <TextAnalyzer 
                onEntitiesExtracted={handleEntitiesExtracted}
                onRelationsExtracted={handleRelationsExtracted}
              />
            )}
            
            {activeTab === 'import' && (
              <DataImport onDataImported={handleDataImported} />
            )}
            
            {activeTab === 'analytics' && (
              <GraphAnalytics 
                graphData={graphData}
                onNodeHighlight={handleNodeHighlight}
              />
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <EntityDetail 
              entity={selectedEntity} 
              loading={loading && !selectedEntity}
            />
            
            {/* Graph Stats */}
            {graphData && !loading && (
              <Card variant="glass">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-white">Graph Statistics</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{graphData.nodes.length}</div>
                      <div className="text-sm text-slate-400">Nodes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{graphData.relationships.length}</div>
                      <div className="text-sm text-slate-400">Edges</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-300">Entity Types</h4>
                    {Array.from(new Set(graphData.nodes.map(node => node.labels[1]) || [])).map((type, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">{type}</span>
                        <span className="text-white font-medium">
                          {graphData.nodes.filter(node => node.labels[1] === type).length}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
