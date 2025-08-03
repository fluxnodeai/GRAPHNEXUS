'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GraphData } from '@/lib/db/neo4j';
import styles from './SimpleGraphVisualization.module.css';

interface SimpleGraphVisualizationProps {
  graphData: GraphData;
  onNodeClick?: (nodeId: string) => void;
}

interface Node {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  label: string;
  type: string;
  color: string;
  radius: number;
  fx?: number;
  fy?: number;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  label: string;
}

const SimpleGraphVisualization: React.FC<SimpleGraphVisualizationProps> = ({ 
  graphData, 
  onNodeClick 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const edgesRef = useRef<Edge[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragNode, setDragNode] = useState<string | null>(null);
  const [showContextPanel, setShowContextPanel] = useState(false);
  const [contextMessages, setContextMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const width = 800;
  const height = 500;

  // Optimized force simulation parameters for better performance
  const forceStrength = 0.008; // Reduced for less computation
  const linkDistance = 120; // Balanced spacing vs performance
  const repelStrength = 400; // Reduced computational load
  const minDistance = 60; // Reduced for efficiency
  const maxIterations = 100; // Limit animation iterations

  // Type colors and gradients
  const typeColors: { [key: string]: string } = {
    'Person': '#3b82f6',
    'Organization': '#ef4444', 
    'Location': '#f59e0b',
    'Event': '#10b981',
    'Product': '#8b5cf6',
    'Entity': '#6b7280'
  };

  // Force-directed layout simulation
  const applyForces = useCallback((nodeList: Node[], edgeList: Edge[]) => {
    const alpha = 0.3;
    const centerX = width / 2;
    const centerY = height / 2;

    nodeList.forEach(node => {
      if (node.fx !== undefined) {
        node.x = node.fx;
        node.vx = 0;
      }
      if (node.fy !== undefined) {
        node.y = node.fy;
        node.vy = 0;
      }

      // Center force
      const centerForceX = (centerX - node.x) * forceStrength;
      const centerForceY = (centerY - node.y) * forceStrength;
      
      node.vx += centerForceX;
      node.vy += centerForceY;
    });

    // Optimized repulsion with distance culling for better performance
    const maxRepulsionDistance = 200; // Skip calculations for distant nodes
    
    for (let i = 0; i < nodeList.length; i++) {
      for (let j = i + 1; j < nodeList.length; j++) {
        const nodeA = nodeList[i];
        const nodeB = nodeList[j];
        
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const distanceSquared = dx * dx + dy * dy;
        
        // Skip distant nodes to improve performance
        if (distanceSquared > maxRepulsionDistance * maxRepulsionDistance) continue;
        
        const distance = Math.sqrt(distanceSquared);
        
        if (distance > 0 && distance < maxRepulsionDistance) {
          const targetDistance = Math.max(minDistance, nodeA.radius + nodeB.radius + 15);
          let force = repelStrength / distanceSquared; // Use squared distance directly
          
          // Stronger repulsion for close nodes
          if (distance < targetDistance) {
            force *= 2; // Reduced from 3 to 2 for performance
          }
          
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          
          nodeA.vx -= fx;
          nodeA.vy -= fy;
          nodeB.vx += fx;
          nodeB.vy += fy;
        }
      }
    }

    // Link forces
    edgeList.forEach(edge => {
      const source = nodeList.find(n => n.id === edge.source);
      const target = nodeList.find(n => n.id === edge.target);
      
      if (source && target) {
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
          const force = (distance - linkDistance) * 0.1;
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          
          source.vx += fx;
          source.vy += fy;
          target.vx -= fx;
          target.vy -= fy;
        }
      }
    });

    // Apply velocity and damping
    nodeList.forEach(node => {
      if (node.fx === undefined) {
        node.vx *= 0.9; // damping
        node.x += node.vx * alpha;
        
        // Boundary constraints
        node.x = Math.max(node.radius + 10, Math.min(width - node.radius - 10, node.x));
      }
      
      if (node.fy === undefined) {
        node.vy *= 0.9; // damping
        node.y += node.vy * alpha;
        
        // Boundary constraints
        node.y = Math.max(node.radius + 10, Math.min(height - node.radius - 10, node.y));
      }
    });

    return nodeList;
  }, [width, height, forceStrength, linkDistance, repelStrength]);

  // High-performance animation loop with throttling and limits
  const iterationCountRef = useRef(0);
  const lastFrameTime = useRef(0);
  const targetFPS = 30; // Limit to 30 FPS for better performance
  const frameInterval = 1000 / targetFPS;

  const animate = useCallback(() => {
    const currentTime = performance.now();
    
    // Throttle animation to target FPS
    if (currentTime - lastFrameTime.current < frameInterval) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }
    
    lastFrameTime.current = currentTime;
    iterationCountRef.current++;

    setNodes(prevNodes => {
      if (prevNodes.length === 0) return prevNodes;
      
      const currentEdges = edgesRef.current;
      const updatedNodes = applyForces([...prevNodes], currentEdges);
      
      // Check if simulation has stabilized with stricter conditions
      const totalVelocity = updatedNodes.reduce((sum, node) => 
        sum + Math.abs(node.vx) + Math.abs(node.vy), 0
      );
      
      // Stop animation with multiple conditions for better performance
      const shouldStop = 
        totalVelocity < 0.03 || // Lower threshold
        iterationCountRef.current > maxIterations || // Iteration limit
        updatedNodes.length === 0;
      
      if (!shouldStop) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation stopped, clean up
        if (animationRef.current !== undefined) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = undefined;
        }
        iterationCountRef.current = 0; // Reset counter
      }
      
      return updatedNodes;
    });
  }, [applyForces, maxIterations]);

  // Add node functionality
  const addNode = useCallback((label: string, type: string = 'Entity') => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      x: width / 2 + (Math.random() - 0.5) * 100,
      y: height / 2 + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 5,
      vy: (Math.random() - 0.5) * 5,
      label,
      type,
      color: typeColors[type] || typeColors['Entity'],
      radius: 20
    };

    setNodes(prev => [...prev, newNode]);
    
    // Restart animation
    if (animationRef.current === undefined) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [width, height, typeColors, animate]);

  // Remove node functionality
  const removeNode = useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setEdges(prev => prev.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
    
    if (selectedNode === nodeId) {
      setSelectedNode(null);
    }
    
    // Restart animation if there are still nodes
    if (animationRef.current === undefined) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [selectedNode, animate]);

  // Initialize nodes and edges
  useEffect(() => {
    if (!graphData) return;

    // Create nodes with initial positions spread across the canvas
    const newNodes: Node[] = graphData.nodes.map((node, index) => {
      // Use multiple layout strategies for better distribution
      const totalNodes = graphData.nodes.length;
      const padding = 80;
      
      let x, y;
      
      if (totalNodes <= 10) {
        // For small graphs, use a grid layout
        const cols = Math.ceil(Math.sqrt(totalNodes));
        const rows = Math.ceil(totalNodes / cols);
        const colIndex = index % cols;
        const rowIndex = Math.floor(index / cols);
        
        x = padding + (colIndex * (width - 2 * padding)) / Math.max(1, cols - 1);
        y = padding + (rowIndex * (height - 2 * padding)) / Math.max(1, rows - 1);
      } else {
        // For larger graphs, use multiple concentric circles
        const angle = (2 * Math.PI * index) / totalNodes;
        const ringIndex = Math.floor(index / Math.ceil(totalNodes / 3)); // 3 rings
        const baseRadius = Math.min(width, height) * 0.15;
        const radius = baseRadius + (ringIndex * baseRadius * 0.8);
        const centerX = width / 2;
        const centerY = height / 2;
        
        x = centerX + radius * Math.cos(angle);
        y = centerY + radius * Math.sin(angle);
      }
      
      // Add some randomness but keep within bounds
      x += (Math.random() - 0.5) * 40;
      y += (Math.random() - 0.5) * 40;
      
      // Ensure nodes stay within canvas bounds
      x = Math.max(padding, Math.min(width - padding, x));
      y = Math.max(padding, Math.min(height - padding, y));
      
      return {
        id: node.id,
        x,
        y,
        vx: (Math.random() - 0.5) * 5, // Reduced initial velocity
        vy: (Math.random() - 0.5) * 5,
        label: node.properties.name || `Node ${node.id}`,
        type: node.labels[1] || 'Entity',
        color: typeColors[node.labels[1]] || typeColors['Entity'],
        radius: 18 + Math.random() * 8 // Slightly smaller nodes
      };
    });

    // Create edges
    const newEdges: Edge[] = graphData.relationships.map((rel) => ({
      id: rel.id,
      source: rel.startNodeId,
      target: rel.endNodeId,
      label: rel.type
    }));

    setNodes(newNodes);
    setEdges(newEdges);
    edgesRef.current = newEdges; // Keep ref in sync

    // Start animation
    if (animationRef.current !== undefined) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [graphData, animate]);

  // Keep edgesRef in sync with edges state
  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  // Get node by ID
  const getNode = (id: string) => nodes.find(n => n.id === id);

  // AI Analysis function
  const analyzeNode = useCallback(async (nodeId: string) => {
    const node = getNode(nodeId);
    if (!node) return;

    setIsAnalyzing(true);
    
    // Get connected nodes and relationships
    const connectedEdges = edges.filter(edge => edge.source === nodeId || edge.target === nodeId);
    const connectedNodes = connectedEdges.map(edge => {
      const connectedNodeId = edge.source === nodeId ? edge.target : edge.source;
      return getNode(connectedNodeId);
    }).filter((node): node is Node => node !== undefined);

    // Create context for the AI
    const nodeContext = {
      node: {
        label: node.label,
        type: node.type,
        id: node.id
      },
      connections: connectedNodes.map(connectedNode => ({
        label: connectedNode!.label,
        type: connectedNode!.type,
        relationship: connectedEdges.find(edge => 
          (edge.source === nodeId && edge.target === connectedNode!.id) ||
          (edge.target === nodeId && edge.source === connectedNode!.id)
        )?.label
      })),
      totalConnections: connectedNodes.length,
      graphStats: {
        totalNodes: nodes.length,
        totalEdges: edges.length
      }
    };

    try {
      // Simulate AI analysis (in production, this would call an actual LLM API)
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      const analysisResponse = generateNodeAnalysis(nodeContext);
      
      setContextMessages(prev => [
        ...prev,
        { role: 'user', content: `Analyze node: ${node.label} (${node.type})` },
        { role: 'assistant', content: analysisResponse }
      ]);
    } catch (error) {
      setContextMessages(prev => [
        ...prev,
        { role: 'user', content: `Analyze node: ${node.label} (${node.type})` },
        { role: 'assistant', content: 'Sorry, I encountered an error analyzing this node. Please try again.' }
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  }, [nodes, edges, getNode]);

  // Generate AI analysis response
  const generateNodeAnalysis = (context: any) => {
    const { node, connections, totalConnections, graphStats } = context;
    
    let analysis = `🔍 **Analysis of ${node.label}**\n\n`;
    analysis += `**Type:** ${node.type}\n`;
    analysis += `**Connections:** ${totalConnections} direct relationships\n\n`;
    
    if (totalConnections > 0) {
      analysis += `**Key Relationships:**\n`;
      connections.slice(0, 3).forEach((conn: any, index: number) => {
        analysis += `${index + 1}. Connected to "${conn.label}" (${conn.type}) via "${conn.relationship}"\n`;
      });
      
      if (connections.length > 3) {
        analysis += `... and ${connections.length - 3} more connections\n`;
      }
      analysis += `\n`;
    }
    
    // Add insights based on node type and connections
    switch (node.type) {
      case 'Person':
        analysis += `**Insights:** This person appears to be ${totalConnections > 5 ? 'highly connected' : totalConnections > 2 ? 'moderately connected' : 'relatively isolated'} within the network. `;
        if (totalConnections > 5) {
          analysis += `They may play a central role as a connector or influencer.`;
        }
        break;
      case 'Organization':
        analysis += `**Insights:** This organization has ${totalConnections} relationships, suggesting it's ${totalConnections > 8 ? 'a major institutional player' : totalConnections > 3 ? 'an active entity' : 'a smaller organization'} in this network.`;
        break;
      case 'Location':
        analysis += `**Insights:** This location serves as a ${totalConnections > 6 ? 'major hub' : 'connection point'} with ${totalConnections} associated entities.`;
        break;
      case 'Event':
        analysis += `**Insights:** This event connects ${totalConnections} different entities, indicating its ${totalConnections > 4 ? 'significant' : 'moderate'} impact on the network.`;
        break;
      case 'Product':
        analysis += `**Insights:** This product is associated with ${totalConnections} entities, suggesting ${totalConnections > 3 ? 'broad market relevance' : 'focused application'}.`;
        break;
      default:
        analysis += `**Insights:** This entity has ${totalConnections} connections within the broader network of ${graphStats.totalNodes} nodes.`;
    }
    
    analysis += `\n\n**Network Context:** This node represents ${((totalConnections / Math.max(graphStats.totalNodes - 1, 1)) * 100).toFixed(1)}% connectivity within the visible graph.`;
    
    return analysis;
  };

  // Handle node click - show context panel instead of popup
  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    setShowContextPanel(true);
    analyzeNode(nodeId);
    onNodeClick?.(nodeId);
  };

  // Send chat message
  const sendChatMessage = useCallback(async (message: string) => {
    if (!message.trim() || isAnalyzing) return;

    const userMessage = { role: 'user' as const, content: message };
    setContextMessages(prev => [...prev, userMessage]);
    setIsAnalyzing(true);

    try {
      // Simulate AI response (in production, this would call an actual LLM API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const selectedNodeData = selectedNode ? getNode(selectedNode) || null : null;
      const response = generateChatResponse(message, selectedNodeData, { nodes, edges });
      
      setContextMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setContextMessages(prev => [...prev, { role: 'assistant', content: 'I apologize, but I encountered an error. Please try again.' }]);
    } finally {
      setIsAnalyzing(false);
    }
  }, [isAnalyzing, selectedNode, nodes, edges, getNode]);

  // Generate chat response
  const generateChatResponse = (message: string, selectedNode: Node | null, graphData: { nodes: Node[], edges: Edge[] }) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('connection') || lowerMessage.includes('relationship')) {
      if (selectedNode) {
        const connections = edges.filter(edge => edge.source === selectedNode.id || edge.target === selectedNode.id);
        return `"${selectedNode.label}" has ${connections.length} direct connections in the graph. These relationships help establish its role and importance within the network structure.`;
      }
      return `The graph contains ${edges.length} total connections between ${nodes.length} nodes, representing various relationships and interactions.`;
    }
    
    if (lowerMessage.includes('type') || lowerMessage.includes('category')) {
      if (selectedNode) {
        return `"${selectedNode.label}" is classified as a ${selectedNode.type}. This categorization helps understand its role and the types of relationships it might have with other entities.`;
      }
      const typeCounts = nodes.reduce((acc, node) => {
        acc[node.type] = (acc[node.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const typeBreakdown = Object.entries(typeCounts)
        .map(([type, count]) => `${count} ${type}${count !== 1 ? 's' : ''}`)
        .join(', ');
      
      return `The graph contains the following entity types: ${typeBreakdown}.`;
    }
    
    if (lowerMessage.includes('explain') || lowerMessage.includes('what') || lowerMessage.includes('tell me')) {
      if (selectedNode) {
        return `"${selectedNode.label}" is a ${selectedNode.type} node in this knowledge graph. It represents a distinct entity with its own characteristics and relationships. Click on connected nodes to explore related entities and understand the broader network structure.`;
      }
      return `This is an interactive knowledge graph visualization showing relationships between different entities. You can click on nodes to analyze them, drag them to reposition, and explore the connections between different elements.`;
    }
    
    if (lowerMessage.includes('how many') || lowerMessage.includes('count')) {
      return `The current graph contains ${nodes.length} nodes and ${edges.length} connections. ${selectedNode ? `The selected node "${selectedNode.label}" has ${edges.filter(edge => edge.source === selectedNode.id || edge.target === selectedNode.id).length} direct connections.` : ''}`;
    }
    
    // Default response
    return `I can help you understand this knowledge graph! Ask me about connections, node types, relationships, or specific entities. ${selectedNode ? `Currently analyzing: "${selectedNode.label}" (${selectedNode.type})` : 'Click on any node to start exploring!'}`;
  };

  // Handle mouse events for dragging
  const handleMouseDown = (nodeId: string, event: React.MouseEvent) => {
    event.preventDefault();
    setIsDragging(true);
    setDragNode(nodeId);
    
    // Pin the node during drag
    setNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, fx: node.x, fy: node.y, vx: 0, vy: 0 }
        : node
    ));
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !dragNode || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (width / rect.width);
    const y = (event.clientY - rect.top) * (height / rect.height);

    setNodes(prev => prev.map(node => 
      node.id === dragNode 
        ? { ...node, x, y, fx: x, fy: y }
        : node
    ));
  };

  const handleMouseUp = () => {
    if (dragNode) {
      // Unpin the node
      setNodes(prev => prev.map(node => 
        node.id === dragNode 
          ? { ...node, fx: undefined, fy: undefined }
          : node
      ));
      
      // Restart animation
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(animate);
    }
    
    setIsDragging(false);
    setDragNode(null);
  };

  return (
    <div className={styles.graphContainer}>
      <div className={styles.graphHeader}>
        <div className={styles.headerIcon}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div className={styles.headerInfo}>
          <h3>Neural Network Visualization</h3>
          <p>Force-directed layout • {nodes.length} nodes • {edges.length} connections</p>
        </div>
      </div>

      <div className={styles.graphContent}>
        <div className={styles.svgContainer}>
          <svg
            ref={svgRef}
            width="100%"
            height="500"
            viewBox={`0 0 ${width} ${height}`}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={styles.graphSvg}
          >
            {/* Enhanced background with gradients */}
            <defs>
              <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(0, 212, 255, 0.3)" />
                <stop offset="100%" stopColor="rgba(0, 212, 255, 0)" />
              </radialGradient>
              
              {Object.entries(typeColors).map(([type, color]) => (
                <radialGradient key={type} id={`gradient-${type}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={color} />
                  <stop offset="100%" stopColor={color} stopOpacity="0.7" />
                </radialGradient>
              ))}
            </defs>
            
            {/* Edges */}
            {edges.map(edge => {
              const sourceNode = getNode(edge.source);
              const targetNode = getNode(edge.target);
              
              if (!sourceNode || !targetNode) return null;

              return (
                <g key={edge.id} className={styles.edge}>
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke="url(#nodeGlow)"
                    strokeWidth="2"
                    strokeDasharray="0"
                  />
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke="#00d4ff"
                    strokeWidth="1"
                    opacity="0.6"
                  />
                  
                  {/* Edge label */}
                  <text
                    x={(sourceNode.x + targetNode.x) / 2}
                    y={(sourceNode.y + targetNode.y) / 2}
                    className={styles.edgeLabel}
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}
            
            {/* Nodes */}
            {nodes.map(node => (
              <g 
                key={node.id} 
                className={`${styles.nodeGroup} ${selectedNode === node.id ? styles.nodeSelected : ''}`}
              >
                {/* Node glow effect */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.radius + 5}
                  fill="url(#nodeGlow)"
                  opacity="0.3"
                />
                
                {/* Node circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.radius}
                  fill={`url(#gradient-${node.type})`}
                  stroke={selectedNode === node.id ? '#00d4ff' : '#1e293b'}
                  strokeWidth={selectedNode === node.id ? 3 : 2}
                  className={styles.nodeCircle}
                  onMouseDown={(e) => handleMouseDown(node.id, e)}
                  onClick={() => handleNodeClick(node.id)}
                />
                
                {/* Node inner highlight */}
                <circle
                  cx={node.x - node.radius * 0.3}
                  cy={node.y - node.radius * 0.3}
                  r={node.radius * 0.3}
                  fill="rgba(255, 255, 255, 0.3)"
                  pointerEvents="none"
                />
                
                {/* Node label */}
                <text
                  x={node.x}
                  y={node.y + 3}
                  className={styles.nodeLabel}
                >
                  {node.label.length > 8 ? node.label.substring(0, 8) + '…' : node.label}
                </text>
                
                {/* Type badge */}
                <text
                  x={node.x}
                  y={node.y - node.radius - 5}
                  className={styles.nodeType}
                >
                  {node.type}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Interactive Controls */}
        <div className={styles.controls}>
          <div className={styles.controlsHeader}>
            <h4>Graph Controls</h4>
          </div>
          
          <div className={styles.controlsGrid}>
            {/* Add Node Controls */}
            <div className={styles.controlGroup}>
              <label htmlFor="nodeLabel">Add Node:</label>
              <div className={styles.addNodeForm}>
                <input
                  id="nodeLabel"
                  type="text"
                  placeholder="Node name..."
                  className={styles.nodeInput}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      addNode(e.currentTarget.value.trim());
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <select 
                  className={styles.nodeTypeSelect}
                  onChange={(e) => {
                    const input = document.getElementById('nodeLabel') as HTMLInputElement;
                    if (input && input.value.trim()) {
                      addNode(input.value.trim(), e.target.value);
                      input.value = '';
                    }
                  }}
                >
                  <option value="">Select type & add</option>
                  <option value="Person">Person</option>
                  <option value="Organization">Organization</option>
                  <option value="Location">Location</option>
                  <option value="Event">Event</option>
                  <option value="Product">Product</option>
                  <option value="Entity">Entity</option>
                </select>
              </div>
            </div>

            {/* Remove Node Controls */}
            <div className={styles.controlGroup}>
              <button
                className={`${styles.controlButton} ${styles.removeButton}`}
                onClick={() => selectedNode && removeNode(selectedNode)}
                disabled={!selectedNode}
              >
                {selectedNode ? `Remove "${getNode(selectedNode)?.label}"` : 'Select node to remove'}
              </button>
            </div>

            {/* Animation Controls */}
            <div className={styles.controlGroup}>
              <button
                className={`${styles.controlButton} ${styles.animateButton}`}
                onClick={() => {
                  if (animationRef.current === undefined) {
                    animationRef.current = requestAnimationFrame(animate);
                  }
                }}
              >
                🔄 Restart Animation
              </button>
            </div>
          </div>
        </div>

        {/* AI Context Panel */}
        {showContextPanel && (
          <div className={styles.contextPanel}>
            <div className={styles.contextHeader}>
              <div className={styles.contextTitle}>
                <span className={styles.aiIcon}>🤖</span>
                Graph AI Assistant
                {selectedNode && (
                  <span className={styles.contextSubtitle}>
                    Analyzing: {getNode(selectedNode)?.label}
                  </span>
                )}
              </div>
              <button 
                className={styles.closeButton}
                onClick={() => {
                  setShowContextPanel(false);
                  setContextMessages([]);
                }}
              >
                ✕
              </button>
            </div>

            <div className={styles.contextMessages}>
              {contextMessages.map((message, index) => (
                <div 
                  key={index}
                  className={`${styles.message} ${message.role === 'user' ? styles.userMessage : styles.assistantMessage}`}
                >
                  <div className={styles.messageContent}>
                    {message.content.split('\n').map((line, lineIndex) => (
                      <div key={lineIndex}>
                        {line.startsWith('**') && line.endsWith('**') ? (
                          <strong>{line.slice(2, -2)}</strong>
                        ) : line.startsWith('🔍') ? (
                          <div className={styles.analysisHeader}>{line}</div>
                        ) : line.trim() ? (
                          line
                        ) : (
                          <br />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {isAnalyzing && (
                <div className={`${styles.message} ${styles.assistantMessage}`}>
                  <div className={styles.messageContent}>
                    <div className={styles.typingIndicator}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    Analyzing node and relationships...
                  </div>
                </div>
              )}
            </div>

            <div className={styles.contextInput}>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  placeholder="Ask about this node or the graph..."
                  className={styles.chatInput}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim() && !isAnalyzing) {
                      sendChatMessage(e.currentTarget.value.trim());
                      e.currentTarget.value = '';
                    }
                  }}
                  disabled={isAnalyzing}
                />
                <button
                  className={styles.sendButton}
                  onClick={() => {
                    const input = document.querySelector(`.${styles.chatInput}`) as HTMLInputElement;
                    if (input && input.value.trim() && !isAnalyzing) {
                      sendChatMessage(input.value.trim());
                      input.value = '';
                    }
                  }}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? '⏳' : '📤'}
                </button>
              </div>
              <div className={styles.suggestions}>
                <button 
                  className={styles.suggestionButton}
                  onClick={() => sendChatMessage("What are the key relationships?")}
                  disabled={isAnalyzing}
                >
                  Key relationships
                </button>
                <button 
                  className={styles.suggestionButton}
                  onClick={() => sendChatMessage("Explain this node's role")}
                  disabled={isAnalyzing}
                >
                  Node role
                </button>
                <button 
                  className={styles.suggestionButton}
                  onClick={() => sendChatMessage("How many connections?")}
                  disabled={isAnalyzing}
                >
                  Connection count
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Professional Legend */}
        <div className={styles.legend}>
          <div className={styles.legendGrid}>
            <div className={styles.legendItems}>
              <div className={styles.legendItem}>
                <div className={`${styles.legendIcon} ${styles.legendIconPerson}`}></div>
                <span className={styles.legendLabel}>Person</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendIcon} ${styles.legendIconOrganization}`}></div>
                <span className={styles.legendLabel}>Organization</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendIcon} ${styles.legendIconLocation}`}></div>
                <span className={styles.legendLabel}>Location</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendIcon} ${styles.legendIconEvent}`}></div>
                <span className={styles.legendLabel}>Event</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendIcon} ${styles.legendIconProduct}`}></div>
                <span className={styles.legendLabel}>Product</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendIcon} ${styles.legendIconEntity}`}></div>
                <span className={styles.legendLabel}>Entity</span>
              </div>
            </div>
            
            <div className={styles.legendStatus}>
              {selectedNode ? `Selected: ${getNode(selectedNode)?.label}` : 'Click nodes for analysis'}
            </div>
          </div>
          
          <div className={styles.tips}>
            <p className={styles.tipsText}>
              <span className={styles.tipsIcon}>⚡</span>
              Drag nodes • Add/Remove nodes • Click for analysis • Interactive force simulation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleGraphVisualization;
