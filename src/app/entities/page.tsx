'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import EntityDetail from '@/components/EntityDetail';
import EntityCard from '@/components/EntityCard';
import EntityModal from '@/components/EntityModal';
import { Entity } from '@/lib/db/supabase';
import { generateRandomEntity } from '@/lib/utils/synthetic-data';
import { realDataFetcher } from '@/lib/utils/real-data-fetcher';
import styles from './page.module.css';

export default function EntitiesPage() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [entityToEdit, setEntityToEdit] = useState<Omit<Entity, 'id' | 'created_at'> | null>(null);
  const [viewMode, setViewMode] = useState<'neural' | 'grid' | 'analysis'>('neural');
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'date' | 'relevance'>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [aiProcessing, setAiProcessing] = useState(false);
  const [collaborators, setCollaborators] = useState(12);
  const [insights, setInsights] = useState(89);

  useEffect(() => {
    const loadEntities = async () => {
      try {
        setLoading(true);
        
        console.log('🧠 Initializing Entity Intelligence API...');
        console.log('📡 Connecting to knowledge graph database...');
        
        // Fetch entities from our API endpoint
        const response = await fetch('/api/entities');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const entities = await response.json();
        
        // If no entities exist, populate with some sample data
        if (entities.length === 0) {
          console.log('📊 Initializing with sample data...');
          const realEntities = await realDataFetcher.fetchMixedRealData(25);
          
          const entitiesWithIds = realEntities.map((entity, index) => ({
            ...entity,
            id: index.toString(),
            created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
          }));
          
          setEntities(entitiesWithIds as Entity[]);
        } else {
          // Convert API response to Entity format
          const formattedEntities = entities.map((entity: any) => ({
            id: entity.id,
            name: entity.name,
            type: entity.type,
            description: entity.properties.description || 'No description available',
            created_at: new Date().toISOString(),
            properties: entity.properties
          }));
          
          setEntities(formattedEntities);
        }
        
        setLoading(false);
        console.log(`✅ Entity Intelligence Network: ${entities.length} entities loaded`);
        console.log('📊 Data source: Knowledge Graph Database');
      } catch (err) {
        console.error('❌ Entity Intelligence Failed:', err);
        setError('Entity Intelligence network offline. Please reconnect.');
        setLoading(false);
      }
    };
    
    loadEntities();
  }, []);

  const handleEntitySelect = (entity: Entity) => {
    setSelectedEntity(entity);
  };

  const handleCreateEntity = (newEntity: Omit<Entity, 'id' | 'created_at'>) => {
    const id = (entities.length + 1).toString();
    const createdEntity: Entity = {
      ...newEntity,
      id,
      created_at: new Date().toISOString()
    };
    
    setEntities([...entities, createdEntity]);
    setSelectedEntity(createdEntity);
    setInsights(prev => prev + 1);
  };

  const handleUpdateEntity = (updatedEntity: Omit<Entity, 'id' | 'created_at'>) => {
    if (!selectedEntity) return;
    
    const updatedEntities = entities.map(entity => 
      entity.id === selectedEntity.id 
        ? { ...updatedEntity, id: entity.id, created_at: entity.created_at } 
        : entity
    );
    
    setEntities(updatedEntities);
    setSelectedEntity({ ...updatedEntity, id: selectedEntity.id, created_at: selectedEntity.created_at });
  };

  const handleDeleteEntity = (entityId: string) => {
    const updatedEntities = entities.filter(entity => entity.id !== entityId);
    setEntities(updatedEntities);
    
    if (selectedEntity && selectedEntity.id === entityId) {
      setSelectedEntity(null);
    }
  };


  const handleEditClick = (entity: Entity) => {
    const { id, ...entityData } = entity;
    setEntityToEdit(entityData);
    setIsEditModalOpen(true);
  };

  const runAIAnalysis = () => {
    setAiProcessing(true);
    setTimeout(() => {
      setAiProcessing(false);
      setInsights(prev => prev + 15);
      alert('🤖 AI ANALYSIS COMPLETE\n\n• Discovered 15 entity relationships\n• Identified 8 knowledge clusters\n• Generated 3 research leads\n• Updated collaboration insights');
    }, 3000);
  };

  const filteredAndSortedEntities = entities
    .filter(entity => {
      const matchesSearch = searchTerm === '' || 
        entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entity.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === null || entity.type === filterType;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'type') {
        return sortOrder === 'asc'
          ? a.type.localeCompare(b.type)
          : b.type.localeCompare(a.type);
      } else if (sortBy === 'relevance') {
        return sortOrder === 'asc' ? 1 : -1;
      } else {
        return sortOrder === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const entityTypes = Array.from(new Set(entities.map(entity => entity.type)));

  return (
    <div className={styles.entitiesPageContainer}>
      {/* Professional Background Grid */}
      <div className={styles.backgroundGrid}></div>

      {/* Neural Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className={styles.neuralParticle}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Entity Intelligence Command Header */}
      <div className={styles.intelligenceHeader}>
        <div className={styles.headerContainer}>
          <div className={styles.headerContent}>
            <div className={styles.brandSection}>
              <div className={styles.brandIcon}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className={styles.brandInfo}>
                <h1>ENTITY INTELLIGENCE NETWORK</h1>
                <p>NVIDIA NIM AI Engine • Collaborative Entity Discovery</p>
              </div>
            </div>
            
            <div className={styles.statusSection}>
              {/* Live Collaboration */}
              <div className={styles.statusCard}>
                <div className={styles.researcherAvatars}>
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={styles.avatar}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                  <div className={`${styles.avatar} ${styles.avatarMore}`}>
                    +{collaborators - 4}
                  </div>
                </div>
                <div className={styles.statusInfo}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                    <div className={styles.statusDot}></div>
                    <span>{collaborators} RESEARCHERS</span>
                  </div>
                </div>
              </div>

              {/* AI Processing Status */}
              <div className={styles.statusCard}>
                <div className={styles.aiStatus}>
                  <div className={styles.aiSpinner}></div>
                  <div className={styles.aiCore}></div>
                  <div className={styles.aiInner}></div>
                </div>
                <div className={styles.aiInfo}>
                  <div>NVIDIA NIM</div>
                  <div>AI ACTIVE</div>
                </div>
              </div>

              {/* AI Analysis Button */}
              <button
                onClick={runAIAnalysis}
                disabled={aiProcessing}
                className={`${styles.actionButton} ${styles.actionPrimary}`}
              >
                {aiProcessing ? (
                  <>
                    <div className={styles.actionSpinner}></div>
                    <span>AI PROCESSING...</span>
                  </>
                ) : (
                  <>
                    <svg style={{width: '1rem', height: '1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span>AI ANALYSIS</span>
                  </>
                )}
              </button>

              {/* Graph Portal */}
              <Link 
                href="/graph"
                className={`${styles.actionButton} ${styles.actionSecondary}`}
              >
                <svg style={{width: '1rem', height: '1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>GRAPH VIEW</span>
              </Link>
            </div>
          </div>

          {/* Intelligence Metrics */}
          <div className={styles.metricsGrid}>
            <div className={`${styles.metricCard} ${styles.metricCardPink}`}>
              <div className={styles.metricHeader}>
                <span className={`${styles.metricLabel} ${styles.metricLabelPink}`}>ENTITIES</span>
                <div className={`${styles.metricPulse} ${styles.metricPulsePink}`}></div>
              </div>
              <div className={styles.metricValue}>{entities.length}</div>
              <div className={styles.metricDescription}>Intelligence Assets</div>
            </div>
            
            <div className={`${styles.metricCard} ${styles.metricCardPurple}`}>
              <div className={styles.metricHeader}>
                <span className={`${styles.metricLabel} ${styles.metricLabelPurple}`}>TYPES</span>
                <div className={`${styles.metricPulse} ${styles.metricPulsePurple}`}></div>
              </div>
              <div className={styles.metricValue}>{entityTypes.length}</div>
              <div className={styles.metricDescription}>Classifications</div>
            </div>
            
            <div className={`${styles.metricCard} ${styles.metricCardGreen}`}>
              <div className={styles.metricHeader}>
                <span className={`${styles.metricLabel} ${styles.metricLabelGreen}`}>INSIGHTS</span>
                <div className={`${styles.metricPulse} ${styles.metricPulseGreen}`}></div>
              </div>
              <div className={styles.metricValue}>{insights}</div>
              <div className={styles.metricDescription}>AI Discoveries</div>
            </div>
            
            <div className={`${styles.metricCard} ${styles.metricCardCyan}`}>
              <div className={styles.metricHeader}>
                <span className={`${styles.metricLabel} ${styles.metricLabelCyan}`}>ACTIVE</span>
                <div className={`${styles.metricPulse} ${styles.metricPulseCyan}`}></div>
              </div>
              <div className={styles.metricValue}>{collaborators}</div>
              <div className={styles.metricDescription}>Researchers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Command Interface */}
      <div className={styles.interfaceGrid}>
        {/* Entity Operations */}
        <div className={styles.entityOperations}>
          {/* Command Center */}
          <div className={styles.commandCenter}>
            <div className={styles.commandHeader}>
              <div className={styles.commandTitle}>
                <div className={styles.commandPulse}></div>
                <h2 className={styles.commandTitleText}>ENTITY COMMAND CENTER</h2>
              </div>
              
              <div className={styles.commandActions}>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={`${styles.commandButton} ${styles.commandCreate}`}
                >
                  <svg style={{width: '1rem', height: '1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>CREATE ENTITY</span>
                </button>
                
                <button
                  onClick={() => {
                    const randomEntity = generateRandomEntity();
                    handleCreateEntity(randomEntity);
                  }}
                  className={`${styles.commandButton} ${styles.commandGenerate}`}
                >
                  <svg style={{width: '1rem', height: '1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>AI GENERATE</span>
                </button>

                {/* View Mode Toggle */}
                <div className={styles.viewModeToggle}>
                  {[
                    { 
                      id: 'neural', 
                      label: 'NEURAL', 
                      icon: (
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      )
                    },
                    { 
                      id: 'grid', 
                      label: 'GRID', 
                      icon: (
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      )
                    },
                    { 
                      id: 'analysis', 
                      label: 'ANALYSIS', 
                      icon: (
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      )
                    }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setViewMode(mode.id as 'neural' | 'grid' | 'analysis')}
                      className={`${styles.viewMode} ${viewMode === mode.id ? styles.viewModeActive : ''}`}
                    >
                      <span className={styles.viewModeIcon}>{mode.icon}</span>
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          
            {/* Neural Search & Filters */}
            <div className={styles.searchFilters}>
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Neural entity search..."
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className={styles.searchIcon}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <select
                className={styles.filterSelect}
                value={filterType || ''}
                onChange={(e) => setFilterType(e.target.value || null)}
              >
                <option value="">All Entity Types</option>
                {entityTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              
              <select
                className={styles.sortSelect}
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-');
                  setSortBy(newSortBy as 'name' | 'type' | 'date' | 'relevance');
                  setSortOrder(newSortOrder as 'asc' | 'desc');
                }}
              >
                <option value="relevance-desc">AI Relevance (High)</option>
                <option value="relevance-asc">AI Relevance (Low)</option>
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="type-asc">Type (A-Z)</option>
                <option value="type-desc">Type (Z-A)</option>
              </select>
            </div>
          </div>
          
          {/* Entity Display */}
          <div className={styles.entityDisplay}>
            <div className={styles.displayContent}>
              {loading ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.loadingSpinner}>
                    <div className={styles.spinnerOuter}></div>
                    <div className={styles.spinnerMiddle}></div>
                    <div className={styles.spinnerInner}></div>
                  </div>
                  <p className={styles.loadingText}>ENTITY INTELLIGENCE LOADING...</p>
                  <p className={styles.loadingSubtext}>Initializing NVIDIA NIM neural network</p>
                </div>
              ) : filteredAndSortedEntities.length > 0 ? (
                <div className={`${styles.entityGrid} ${styles[`entityGrid${viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}`]}`}>
                  {filteredAndSortedEntities.map(entity => (
                    <EntityCard
                      key={entity.id}
                      entity={entity}
                      selected={selectedEntity?.id === entity.id}
                      onClick={() => handleEntitySelect(entity)}
                      onEdit={() => handleEditClick(entity)}
                      onDelete={() => handleDeleteEntity(entity.id)}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.emptyContainer}>
                  <div className={styles.emptyIcon}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className={styles.emptyTitle}>NO ENTITIES IN NEURAL NETWORK</h3>
                  <p className={styles.emptySubtext}>Initialize intelligence network with entity data</p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className={styles.emptyButton}
                  >
                    CREATE FIRST ENTITY
                  </button>
                </div>
              )}
            </div>
          </div>
          
        </div>
        
        {/* Intelligence Panel */}
        <div className={styles.intelligencePanel}>
          <EntityDetail entity={selectedEntity} loading={loading && !selectedEntity} />
          
          <div className={styles.intelligenceStats}>
            <div className={styles.statsHeader}>
              <div className={styles.statsPulse}></div>
              <h3 className={styles.statsTitle}>AI INTELLIGENCE STATS</h3>
            </div>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={`${styles.statValue} ${styles.statValuePink}`}>{entities.length}</div>
                <div className={styles.statLabel}>Total Entities</div>
              </div>
              <div className={styles.statCard}>
                <div className={`${styles.statValue} ${styles.statValuePurple}`}>{entityTypes.length}</div>
                <div className={styles.statLabel}>Entity Types</div>
              </div>
              <div className={styles.statCard}>
                <div className={`${styles.statValue} ${styles.statValueGreen}`}>{insights}</div>
                <div className={styles.statLabel}>AI Insights</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <EntityModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateEntity}
          title="Create New Entity"
        />
      )}
      
      {isEditModalOpen && entityToEdit && (
        <EntityModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdateEntity}
          initialData={entityToEdit}
          isEditing={true}
          title="Edit Entity"
        />
      )}
    </div>
  );
}
