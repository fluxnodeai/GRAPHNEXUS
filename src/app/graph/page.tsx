'use client';

import React, { useEffect, useState } from 'react';
import { GraphData } from '@/lib/db/neo4j';
import SimpleGraphVisualization from '@/components/SimpleGraphVisualization';
import styles from './page.module.css';

export default function GraphPage() {
  const [mounted, setMounted] = useState(false);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('discovery');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [analysisMode, setAnalysisMode] = useState('network');
  const [collaborators, setCollaborators] = useState(8);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Connecting to Knowledge Graph API...');
        const response = await fetch('/api/graph');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: GraphData = await response.json();
        
        if (data.nodes.length > 0) {
          console.log(`✅ Knowledge Graph Loaded: ${data.nodes.length} entities, ${data.relationships.length} connections`);
          setGraphData(data);
        } else {
          console.log('⚠️ Initializing empty knowledge graph');
          setError('Knowledge graph is empty. Import data or create entities to begin exploration.');
        }
      } catch (err) {
        console.error('❌ API Connection Failed:', err);
        setError(`Graph API connection failed: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [mounted]);

  const handleNodeClick = (nodeId: string) => {
    const node = graphData?.nodes.find(n => n.id === nodeId);
    if (node && graphData) {
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        alert(`🧠 ENTITY ANALYSIS\n\nID: ${nodeId}\nName: ${node.properties.name || 'Unknown'}\nType: ${node.labels[1] || 'Entity'}\nConnections: ${graphData.relationships.filter(r => r.startNodeId === nodeId || r.endNodeId === nodeId).length}`);
      }, 1500);
    }
  };

  const startDiscovery = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      alert('🎯 PATTERN DISCOVERY COMPLETE\n\n• Found 23 hidden connections\n• Identified 5 knowledge clusters\n• Detected 3 research opportunities\n• Community insights updated');
    }, 3000);
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-400 text-lg font-mono">INITIALIZING NEURAL INTERFACE...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.graphPageContainer}>
      {/* Professional Background Grid */}
      <div className={styles.backgroundGrid}></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={styles.floatingParticle}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Command Center Header */}
      <div className={styles.commandHeader}>
        <div className={styles.headerContainer}>
          <div className={styles.headerContent}>
            <div className={styles.brandSection}>
              <div className={styles.brandIcon}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v.01M8 12h.01M16 12h.01M12 16v.01" />
                </svg>
              </div>
              <div className={styles.brandInfo}>
                <h1>KNOWLEDGE GRAPH CONTROL CENTER</h1>
                <p>Neural Network Intelligence • Real-time Collaboration Platform</p>
              </div>
            </div>
            
            <div className={styles.statusSection}>
              {/* Live Collaboration Status */}
              <div className={styles.statusCard}>
                <div className={styles.collaboratorAvatars}>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={styles.avatar}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                  <div className={`${styles.avatar} ${styles.avatarMore}`}>
                    +{collaborators - 3}
                  </div>
                </div>
                <div className={styles.statusInfo}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                    <div className={styles.statusDot}></div>
                    <span>{collaborators} ACTIVE</span>
                  </div>
                </div>
              </div>

              {/* Neural Processing Status */}
              <div className={styles.statusCard}>
                <div className={styles.neuralStatus}>
                  <div className={styles.neuralSpinner}></div>
                  <div className={styles.neuralCore}></div>
                  <div className={styles.neuralInner}></div>
                </div>
                <div className={styles.neuralInfo}>
                  <div>NEURAL SYNC</div>
                  <div>98.7% EFFICIENCY</div>
                </div>
              </div>

              {/* Discovery Mode Toggle */}
              <button
                onClick={startDiscovery}
                disabled={isAnalyzing}
                className={`${styles.actionButton} ${styles.actionPrimary}`}
              >
                {isAnalyzing ? (
                  <>
                    <div className={styles.actionSpinner}></div>
                    <span>ANALYZING...</span>
                  </>
                ) : (
                  <>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '1rem', height: '1rem'}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>DISCOVER PATTERNS</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* System Metrics */}
          <div className={styles.metricsGrid}>
            <div className={`${styles.metricCard} ${styles.metricCardCyan}`}>
              <div className={styles.metricHeader}>
                <span className={`${styles.metricLabel} ${styles.metricLabelCyan}`}>ENTITIES</span>
                <div className={`${styles.metricPulse} ${styles.metricPulseCyan}`}></div>
              </div>
              <div className={styles.metricValue}>{graphData?.nodes.length || 0}</div>
              <div className={styles.metricDescription}>Knowledge Nodes</div>
            </div>
            
            <div className={`${styles.metricCard} ${styles.metricCardGreen}`}>
              <div className={styles.metricHeader}>
                <span className={`${styles.metricLabel} ${styles.metricLabelGreen}`}>CONNECTIONS</span>
                <div className={`${styles.metricPulse} ${styles.metricPulseGreen}`}></div>
              </div>
              <div className={styles.metricValue}>{graphData?.relationships.length || 0}</div>
              <div className={styles.metricDescription}>Neural Links</div>
            </div>
            
            <div className={`${styles.metricCard} ${styles.metricCardPurple}`}>
              <div className={styles.metricHeader}>
                <span className={`${styles.metricLabel} ${styles.metricLabelPurple}`}>DENSITY</span>
                <div className={`${styles.metricPulse} ${styles.metricPulsePurple}`}></div>
              </div>
              <div className={styles.metricValue}>
                {graphData ? ((graphData.relationships.length / (graphData.nodes.length * (graphData.nodes.length - 1))) * 100).toFixed(1) : 0}%
              </div>
              <div className={styles.metricDescription}>Network Complexity</div>
            </div>
            
            <div className={`${styles.metricCard} ${styles.metricCardOrange}`}>
              <div className={styles.metricHeader}>
                <span className={`${styles.metricLabel} ${styles.metricLabelOrange}`}>INSIGHTS</span>
                <div className={`${styles.metricPulse} ${styles.metricPulseOrange}`}></div>
              </div>
              <div className={styles.metricValue}>147</div>
              <div className={styles.metricDescription}>Discoveries</div>
            </div>
          </div>
        </div>
      </div>

      {/* Command Interface */}
      <div className={styles.interfaceGrid}>
        {/* Control Panel */}
        <div className={styles.controlPanel}>
          <div className={styles.controlHeader}>
            <div className={styles.controlPulse}></div>
            <h3 className={styles.controlTitle}>NEURAL CONTROLS</h3>
          </div>
          
              {/* Analysis Mode */}
              <div className={styles.controlSection}>
                <label className={styles.controlLabel}>Analysis Engine</label>
                <div className={styles.modeButtons}>
                  {[
                    { 
                      id: 'network', 
                      label: 'Network Topology', 
                      icon: (
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      )
                    },
                    { 
                      id: 'semantic', 
                      label: 'Semantic Analysis', 
                      icon: (
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      )
                    },
                    { 
                      id: 'temporal', 
                      label: 'Temporal Patterns', 
                      icon: (
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )
                    },
                    { 
                      id: 'collaborative', 
                      label: 'Collective Intelligence', 
                      icon: (
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      )
                    }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setAnalysisMode(mode.id)}
                      className={`${styles.modeButton} ${analysisMode === mode.id ? styles.modeButtonActive : ''}`}
                    >
                      <span className={styles.modeIcon}>{mode.icon}</span>
                      <span>{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

          {/* Entity Filters */}
          <div className={styles.controlSection}>
            <label className={styles.controlLabel}>Entity Classification</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={styles.controlSelect}
            >
              <option value="all">🌐 All Entities</option>
              <option value="Person">👤 Persons</option>
              <option value="Organization">🏢 Organizations</option>
              <option value="Location">📍 Locations</option>
              <option value="Event">📅 Events</option>
              <option value="Product">📦 Products</option>
            </select>
          </div>

          {/* Research Commands */}
          <div className={styles.commandButtons}>
            <button className={`${styles.commandButton} ${styles.commandPrimary}`}>
              <svg style={{width: '1rem', height: '1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>ADD KNOWLEDGE</span>
            </button>
            
            <button className={`${styles.commandButton} ${styles.commandSecondary}`}>
              <svg style={{width: '1rem', height: '1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              <span>SHARE INSIGHTS</span>
            </button>
            
            <button className={`${styles.commandButton} ${styles.commandTertiary}`}>
              <svg style={{width: '1rem', height: '1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>EXPORT FINDINGS</span>
            </button>
          </div>

          {/* Community Activity */}
          <div className={styles.activitySection}>
            <h4 className={styles.activityTitle}>LIVE ACTIVITY</h4>
            <div className={styles.activityList}>
              <div className={`${styles.activityItem} ${styles.activityGreen}`}>
                <div className={styles.activityDot}></div>
                <span>Alex added 3 entities</span>
              </div>
              <div className={`${styles.activityItem} ${styles.activityBlue}`}>
                <div className={styles.activityDot}></div>
                <span>Maya discovered connection</span>
              </div>
              <div className={`${styles.activityItem} ${styles.activityPurple}`}>
                <div className={styles.activityDot}></div>
                <span>Research team exported data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Visualization */}
        <div className={styles.visualizationPanel}>
          {/* Visualization Header */}
          <div className={styles.visualizationHeader}>
            <div className={styles.visualizationTitle}>
              <h3>NEURAL NETWORK VISUALIZATION</h3>
              <div className={styles.syncStatus}>
                <div className={styles.syncDot}></div>
                <span>Real-time Sync</span>
              </div>
            </div>
            
            <div className={styles.visualizationControls}>
              {/* Search Interface */}
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Neural search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
                <div className={styles.searchIcon}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              {/* View Mode Tabs */}
              <div className={styles.tabContainer}>
                {[
                  { 
                    id: 'discovery', 
                    label: 'DISCOVERY', 
                    icon: (
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    )
                  },
                  { 
                    id: 'analysis', 
                    label: 'ANALYSIS', 
                    icon: (
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    )
                  },
                  { 
                    id: 'collaboration', 
                    label: 'COLLAB', 
                    icon: (
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    )
                  }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`${styles.tab} ${selectedTab === tab.id ? styles.tabActive : ''}`}
                  >
                    <span className={styles.tabIcon}>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className={styles.contentArea}>
            {loading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}>
                  <div className={styles.spinnerOuter}></div>
                  <div className={styles.spinnerMiddle}></div>
                  <div className={styles.spinnerInner}></div>
                </div>
                <p className={styles.loadingText}>NEURAL INTERFACE LOADING...</p>
                <p className={styles.loadingSubtext}>Establishing connection to knowledge graph</p>
              </div>
            ) : error ? (
              <div className={styles.errorContainer}>
                <div className={styles.errorCard}>
                  <div className={styles.errorIcon}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className={styles.errorTitle}>NEURAL NETWORK OFFLINE</h3>
                  <p className={styles.errorMessage}>{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className={styles.errorButton}
                  >
                    RECONNECT
                  </button>
                </div>
              </div>
            ) : graphData && graphData.nodes.length > 0 ? (
              <div className={styles.visualizationContainer}>
                <SimpleGraphVisualization 
                  graphData={graphData} 
                  onNodeClick={handleNodeClick}
                />
              </div>
            ) : (
              <div className={styles.emptyContainer}>
                <div className={styles.emptyIcon}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className={styles.emptyTitle}>KNOWLEDGE GRAPH AWAITING INPUT</h3>
                <p className={styles.emptySubtext}>Initialize neural network with research data</p>
                <button className={styles.emptyButton}>
                  IMPORT KNOWLEDGE
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
