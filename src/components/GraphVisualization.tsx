'use client';

import React, { useState, useEffect } from 'react';
import { GraphData } from '@/lib/db/neo4j';
import dynamic from 'next/dynamic';

// Dynamically import CytoscapeComponent with no SSR
const CytoscapeComponent = dynamic(
  () => import('react-cytoscapejs'),
  { ssr: false }
);

// Interface for component props
interface GraphVisualizationProps {
  graphData: GraphData;
  onNodeClick?: (nodeId: string) => void;
}

const GraphVisualization: React.FC<GraphVisualizationProps> = ({ 
  graphData, 
  onNodeClick 
}) => {
  // Loading state
  const [loading, setLoading] = useState(true);
  // Error state
  const [error, setError] = useState<string | null>(null);
  // Selected node state
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  // Layout state
  const [layout, setLayout] = useState('cose');
  // Elements state
  const [elements, setElements] = useState<any[]>([]);
  // Cytoscape instance
  const [cy, setCy] = useState<any>(null);

  // Convert graph data to cytoscape elements
  useEffect(() => {
    try {
      if (!graphData) {
        setLoading(false);
        return;
      }

      console.log('Converting graph data to cytoscape elements');
      
      const newElements: any[] = [];

      // Add nodes
      graphData.nodes.forEach(node => {
        newElements.push({
          data: {
            id: node.id,
            label: node.properties.name || `Node ${node.id}`,
            type: node.labels[1] || 'Entity',
            ...node.properties
          }
        });
      });

      // Add edges
      graphData.relationships.forEach((rel, index) => {
        newElements.push({
          data: {
            id: `edge-${index}`,
            source: rel.startNodeId,
            target: rel.endNodeId,
            label: rel.type,
            ...rel.properties
          }
        });
      });

      console.log(`Created ${newElements.length} elements`);
      setElements(newElements);
      setLoading(false);
    } catch (err) {
      console.error('Error converting graph data:', err);
      setError(`Failed to convert graph data: ${err instanceof Error ? err.message : String(err)}`);
      setLoading(false);
    }
  }, [graphData]);

  // Get layout configuration
  const getLayoutConfig = () => {
    switch (layout) {
      case 'cose':
        return {
          name: 'cose',
          animate: true,
          nodeDimensionsIncludeLabels: true,
          randomize: true,
          idealEdgeLength: () => 100,
          nodeOverlap: 20,
          refresh: 20,
          fit: true,
          padding: 30,
          componentSpacing: 100
        };
      case 'circle':
        return {
          name: 'circle',
          animate: true,
          padding: 30
        };
      case 'grid':
        return {
          name: 'grid',
          animate: true,
          padding: 30
        };
      case 'concentric':
        return {
          name: 'concentric',
          animate: true,
          padding: 30,
          minNodeSpacing: 50
        };
      default:
        return {
          name: 'cose',
          animate: true,
          nodeDimensionsIncludeLabels: true,
          randomize: true,
          idealEdgeLength: () => 100,
          nodeOverlap: 20,
          refresh: 20,
          fit: true,
          padding: 30,
          componentSpacing: 100
        };
    }
  };

  // Handle layout change
  const handleLayoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLayout(e.target.value);
    
    if (cy && !cy.destroyed()) {
      try {
        const layoutConfig = getLayoutConfig();
        const layout = cy.layout(layoutConfig);
        if (layout && typeof layout.run === 'function') {
          layout.run();
        }
      } catch (layoutError) {
        console.warn('Layout change failed:', layoutError);
      }
    }
  };

  // Handle cytoscape initialization with better error handling
  const handleCytoscapeInit = (cyInstance: any) => {
    try {
      if (!cyInstance || cyInstance.destroyed()) {
        console.warn('Cytoscape instance is null or destroyed');
        return;
      }
      
      setCy(cyInstance);
      
      // Add node click event with error handling
      if (onNodeClick) {
        cyInstance.on('tap', 'node', (event: any) => {
          try {
            const nodeId = event.target.id();
            setSelectedNode(nodeId);
            onNodeClick(nodeId);
          } catch (clickError) {
            console.warn('Node click handler error:', clickError);
          }
        });
      }
      
      // Add background click event to deselect
      cyInstance.on('tap', (event: any) => {
        try {
          if (event.target === cyInstance) {
            setSelectedNode(null);
          }
        } catch (bgClickError) {
          console.warn('Background click handler error:', bgClickError);
        }
      });
      
      // Run initial layout with comprehensive error handling
      const runInitialLayout = () => {
        try {
          if (cyInstance && !cyInstance.destroyed() && typeof cyInstance.layout === 'function') {
            const layoutConfig = getLayoutConfig();
            const layout = cyInstance.layout(layoutConfig);
            if (layout && typeof layout.run === 'function') {
              layout.run();
            } else {
              console.warn('Layout run method not available');
            }
          }
        } catch (layoutError) {
          console.warn('Layout initialization failed:', layoutError);
          // Try a simpler layout as fallback
          try {
            if (cyInstance && !cyInstance.destroyed()) {
              const simpleLayout = cyInstance.layout({ name: 'grid' });
              if (simpleLayout && typeof simpleLayout.run === 'function') {
                simpleLayout.run();
              }
            }
          } catch (fallbackError) {
            console.warn('Fallback layout also failed:', fallbackError);
          }
        }
      };
      
      // Delay initial layout to ensure DOM is ready
      setTimeout(runInitialLayout, 300);
      
      // Add error event listener to cytoscape instance
      cyInstance.on('layoutstart layoutstop', (event: any) => {
        try {
          console.log('Cytoscape layout event:', event.type);
        } catch (eventError) {
          console.warn('Layout event handler error:', eventError);
        }
      });
      
    } catch (initError) {
      console.error('Cytoscape initialization error:', initError);
      setError(`Graph initialization failed: ${initError instanceof Error ? initError.message : String(initError)}`);
    }
  };

  // Cytoscape style
  const cytoscapeStyle = [
    {
      selector: 'node',
      style: {
        'background-color': '#666',
        'label': 'data(label)',
        'color': '#fff',
        'text-outline-width': 2,
        'text-outline-color': '#222',
        'text-valign': 'center',
        'text-halign': 'center',
        'font-size': '14px',
        'width': '50px',
        'height': '50px',
        'text-wrap': 'wrap',
        'text-max-width': '100px',
        'text-margin-y': 6,
        'transition-property': 'background-color, border-color, border-width',
        'transition-duration': '0.2s'
      }
    },
    {
      selector: 'node[type="Person"]',
      style: {
        'background-color': '#3b82f6',
        'shape': 'ellipse',
        'border-width': 2,
        'border-color': '#2563eb'
      }
    },
    {
      selector: 'node[type="Organization"]',
      style: {
        'background-color': '#ef4444',
        'shape': 'rectangle',
        'border-width': 2,
        'border-color': '#dc2626'
      }
    },
    {
      selector: 'node[type="Location"]',
      style: {
        'background-color': '#f59e0b',
        'shape': 'diamond',
        'border-width': 2,
        'border-color': '#d97706'
      }
    },
    {
      selector: 'node[type="Event"]',
      style: {
        'background-color': '#10b981',
        'shape': 'round-rectangle',
        'border-width': 2,
        'border-color': '#059669'
      }
    },
    {
      selector: 'node[type="Product"]',
      style: {
        'background-color': '#8b5cf6',
        'shape': 'round-triangle',
        'border-width': 2,
        'border-color': '#7c3aed'
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#555',
        'target-arrow-shape': 'triangle',
        'target-arrow-color': '#555',
        'curve-style': 'bezier',
        'label': 'data(label)',
        'font-size': '11px',
        'text-rotation': 'autorotate',
        'text-background-color': '#222',
        'text-background-opacity': 0.7,
        'text-background-padding': '3px',
        'color': '#fff',
        'text-background-shape': 'roundrectangle',
        'text-border-opacity': 0.7,
        'text-border-width': 1,
        'text-border-color': '#333',
        'transition-property': 'line-color, target-arrow-color',
        'transition-duration': '0.2s'
      }
    },
    {
      selector: ':selected',
      style: {
        'background-color': '#60a5fa',
        'border-width': 4,
        'border-color': '#93c5fd',
        'line-color': '#60a5fa',
        'target-arrow-color': '#60a5fa',
        'source-arrow-color': '#60a5fa',
        'z-index': 999,
        'text-outline-color': '#1d4ed8',
        'text-outline-width': 3
      }
    }
  ];

  return (
    <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-xl shadow-lg w-full">
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Knowledge Graph Visualization</h3>
              <p className="text-sm text-slate-400">Interactive graph with {elements.length} elements</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <select
                className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none pr-8"
                value={layout}
                onChange={handleLayoutChange}
                disabled={loading}
                aria-label="Select layout"
              >
                <option value="cose">Force-Directed</option>
                <option value="circle">Circle</option>
                <option value="grid">Grid</option>
                <option value="concentric">Concentric</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <button 
              className="flex items-center justify-center p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              onClick={() => {
                if (cy) {
                  cy.fit();
                }
              }}
              title="Fit to view"
              disabled={loading || !cy}
              aria-label="Fit graph to view"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 pt-0">
        <div className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg overflow-hidden" style={{ height: '500px' }}>
          {error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <svg className="h-12 w-12 mx-auto text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-300 mb-4">{error}</p>
                <button 
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </button>
              </div>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                <p className="text-slate-300">Loading graph visualization...</p>
              </div>
            </div>
          ) : elements.length > 0 ? (
            <CytoscapeComponent
              elements={elements}
              style={{ width: '100%', height: '100%' }}
              stylesheet={cytoscapeStyle}
              layout={getLayoutConfig()}
              cy={handleCytoscapeInit}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <svg className="h-12 w-12 mx-auto text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-slate-400">No graph data available</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6">
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-between">
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-blue-600 mr-2"></div>
                <span className="text-sm text-slate-300">Person</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-red-500 border-2 border-red-600 mr-2"></div>
                <span className="text-sm text-slate-300">Organization</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 transform rotate-45 bg-yellow-500 border-2 border-yellow-600 mr-2"></div>
                <span className="text-sm text-slate-300">Location</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-green-500 border-2 border-green-600 mr-2"></div>
                <span className="text-sm text-slate-300">Event</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 transform rotate-45 bg-purple-500 border-2 border-purple-600 mr-2"></div>
                <span className="text-sm text-slate-300">Product</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-slate-400">
                {selectedNode ? `Selected: Node ${selectedNode}` : 'Click a node to view details'}
              </span>
            </div>
          </div>
          
          <div className="mt-3 text-xs text-slate-500">
            <p>💡 Tip: Use mouse wheel to zoom, drag to pan, and click on nodes to view details.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualization;
