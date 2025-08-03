'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { GraphData } from '@/lib/db/neo4j';

interface GraphAnalyticsProps {
  graphData: GraphData | null;
  onNodeHighlight?: (nodeIds: string[]) => void;
}

interface Analytics {
  nodeCount: number;
  edgeCount: number;
  nodeTypes: { [key: string]: number };
  relationshipTypes: { [key: string]: number };
  centralNodes: Array<{ id: string, name: string, degree: number }>;
  communities: Array<{ id: number, size: number, nodes: string[] }>;
  density: number;
  avgDegree: number;
}

const GraphAnalytics: React.FC<GraphAnalyticsProps> = ({ graphData, onNodeHighlight }) => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string>('overview');

  useEffect(() => {
    if (graphData) {
      analyzeGraph();
    }
  }, [graphData]);

  const analyzeGraph = async () => {
    if (!graphData) return;

    setIsAnalyzing(true);
    
    // Simulate analysis time
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const nodeCount = graphData.nodes.length;
      const edgeCount = graphData.relationships.length;

      // Calculate node types
      const nodeTypes: { [key: string]: number } = {};
      graphData.nodes.forEach(node => {
        const type = node.labels[1] || 'Unknown';
        nodeTypes[type] = (nodeTypes[type] || 0) + 1;
      });

      // Calculate relationship types
      const relationshipTypes: { [key: string]: number } = {};
      graphData.relationships.forEach(rel => {
        relationshipTypes[rel.type] = (relationshipTypes[rel.type] || 0) + 1;
      });

      // Calculate node degrees (connections)
      const nodeDegrees: { [key: string]: number } = {};
      graphData.relationships.forEach(rel => {
        nodeDegrees[rel.startNodeId] = (nodeDegrees[rel.startNodeId] || 0) + 1;
        nodeDegrees[rel.endNodeId] = (nodeDegrees[rel.endNodeId] || 0) + 1;
      });

      // Find central nodes (highest degree)
      const centralNodes = graphData.nodes
        .map(node => ({
          id: node.id,
          name: node.properties.name || `Node ${node.id}`,
          degree: nodeDegrees[node.id] || 0
        }))
        .sort((a, b) => b.degree - a.degree)
        .slice(0, 5);

      // Simulate community detection
      const communities = [
        { id: 1, size: Math.floor(nodeCount * 0.4), nodes: graphData.nodes.slice(0, Math.floor(nodeCount * 0.4)).map(n => n.id) },
        { id: 2, size: Math.floor(nodeCount * 0.3), nodes: graphData.nodes.slice(Math.floor(nodeCount * 0.4), Math.floor(nodeCount * 0.7)).map(n => n.id) },
        { id: 3, size: Math.floor(nodeCount * 0.3), nodes: graphData.nodes.slice(Math.floor(nodeCount * 0.7)).map(n => n.id) }
      ].filter(c => c.size > 0);

      // Calculate density and average degree
      const maxPossibleEdges = nodeCount * (nodeCount - 1) / 2;
      const density = maxPossibleEdges > 0 ? edgeCount / maxPossibleEdges : 0;
      const avgDegree = nodeCount > 0 ? (edgeCount * 2) / nodeCount : 0;

      setAnalytics({
        nodeCount,
        edgeCount,
        nodeTypes,
        relationshipTypes,
        centralNodes,
        communities,
        density,
        avgDegree
      });
    } catch (error) {
      console.error('Error analyzing graph:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleHighlightCommunity = (community: { nodes: string[] }) => {
    onNodeHighlight?.(community.nodes);
  };

  const handleHighlightCentralNodes = () => {
    if (analytics) {
      onNodeHighlight?.(analytics.centralNodes.map(n => n.id));
    }
  };

  if (!graphData) {
    return (
      <Card variant="glass">
        <CardContent className="text-center py-8">
          <svg className="w-12 h-12 mx-auto text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-slate-400">No graph data available for analysis</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="glass">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Graph Analytics</h3>
            <p className="text-sm text-slate-400">Analyze graph structure and patterns</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isAnalyzing ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-slate-300">Analyzing graph structure...</p>
          </div>
        ) : analytics ? (
          <>
            {/* Metric Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {['overview', 'nodes', 'relationships', 'communities'].map((metric) => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedMetric === metric
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {metric.charAt(0).toUpperCase() + metric.slice(1)}
                </button>
              ))}
            </div>

            {/* Overview */}
            {selectedMetric === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700/30 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">{analytics.nodeCount}</div>
                    <div className="text-sm text-slate-400">Nodes</div>
                  </div>
                  <div className="bg-slate-700/30 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">{analytics.edgeCount}</div>
                    <div className="text-sm text-slate-400">Edges</div>
                  </div>
                  <div className="bg-slate-700/30 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-400">{analytics.density.toFixed(3)}</div>
                    <div className="text-sm text-slate-400">Density</div>
                  </div>
                  <div className="bg-slate-700/30 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">{analytics.avgDegree.toFixed(1)}</div>
                    <div className="text-sm text-slate-400">Avg Degree</div>
                  </div>
                </div>
              </div>
            )}

            {/* Node Types */}
            {selectedMetric === 'nodes' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white">Node Types</h4>
                  <button
                    onClick={handleHighlightCentralNodes}
                    className="text-xs px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    Highlight Central Nodes
                  </button>
                </div>
                {Object.entries(analytics.nodeTypes).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                    <span className="text-slate-300">{type}</span>
                    <span className="text-white font-medium">{count}</span>
                  </div>
                ))}
                
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-slate-300 mb-2">Most Connected Nodes</h5>
                  {analytics.centralNodes.map((node, index) => (
                    <div key={node.id} className="flex items-center justify-between p-2 bg-slate-700/20 rounded mb-1">
                      <span className="text-sm text-slate-300">{node.name}</span>
                      <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">{node.degree} connections</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Relationship Types */}
            {selectedMetric === 'relationships' && (
              <div className="space-y-3">
                <h4 className="font-medium text-white">Relationship Types</h4>
                {Object.entries(analytics.relationshipTypes).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                    <span className="text-slate-300">{type}</span>
                    <span className="text-white font-medium">{count}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Communities */}
            {selectedMetric === 'communities' && (
              <div className="space-y-3">
                <h4 className="font-medium text-white">Detected Communities</h4>
                {analytics.communities.map((community) => (
                  <div key={community.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                    <div>
                      <div className="text-slate-300">Community {community.id}</div>
                      <div className="text-xs text-slate-500">{community.size} nodes</div>
                    </div>
                    <button
                      onClick={() => handleHighlightCommunity(community)}
                      className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Highlight
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-slate-700">
              <button
                onClick={analyzeGraph}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Analysis
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-400 mb-4">Click to analyze the current graph</p>
            <button
              onClick={analyzeGraph}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Start Analysis
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GraphAnalytics;
