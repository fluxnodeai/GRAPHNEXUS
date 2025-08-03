'use client';

import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Entity } from '@/lib/db/supabase';

interface EntityDetailProps {
  entity: Entity | null;
  loading?: boolean;
}

const EntityDetail: React.FC<EntityDetailProps> = ({ entity, loading = false }) => {
  // Format property value for display
  const formatPropertyValue = (value: any): string => {
    if (value === null || value === undefined) {
      return 'null';
    }
    
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value, null, 2);
      } catch (e) {
        return '[Complex Object]';
      }
    }
    
    return String(value);
  };

  // Get entity type badge color
  const getEntityTypeBadgeClass = (type: string): string => {
    switch (type) {
      case 'Person':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Organization':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'Location':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Event':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Product':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  // Get entity icon based on type
  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'Person':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'Organization':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'Location':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'Event':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'Product':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
        );
    }
  };

  return (
    <Card variant="glass">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Entity Details</h3>
            <p className="text-sm text-slate-400">View detailed information about selected entities</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-300">Loading entity details...</p>
          </div>
        ) : entity ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-700/50 rounded-lg text-slate-300">
                  {getEntityIcon(entity.type)}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">{entity.name}</h4>
                  <p className="text-sm text-slate-400 mt-1">{entity.description}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEntityTypeBadgeClass(entity.type)}`}>
                {entity.type}
              </span>
            </div>
            
            <div className="border-t border-slate-700 pt-4">
              <h5 className="text-sm font-medium text-slate-300 mb-3">Properties</h5>
              <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                {Object.entries(entity.properties || {}).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-3 gap-4">
                    <div className="text-sm font-medium text-blue-400">{key}:</div>
                    <div className="col-span-2 text-sm text-slate-300 break-all">
                      <pre className="whitespace-pre-wrap text-xs">{formatPropertyValue(value)}</pre>
                    </div>
                  </div>
                ))}
                
                {Object.keys(entity.properties || {}).length === 0 && (
                  <div className="text-sm text-slate-500 italic">No properties available</div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center text-xs text-slate-500 pt-3 border-t border-slate-700">
              <div>ID: <span className="font-mono text-slate-400">{entity.id}</span></div>
              <div>Created: {new Date(entity.created_at).toLocaleString()}</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="w-12 h-12 mx-auto text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="text-lg font-medium text-white mb-2">No Entity Selected</h4>
            <p className="text-slate-400">
              Click on a node in the graph to view its details here.
            </p>
          </div>
        )}
      </CardContent>
      
      {entity && (
        <CardFooter>
          <div className="flex flex-wrap gap-2 w-full">
            <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Relations
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors ml-auto">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Export
            </button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default EntityDetail;
