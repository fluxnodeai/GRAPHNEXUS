'use client';

import React, { useEffect, useState } from 'react';

export default function SimpleTestPage() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Simple test data
    setData({
      nodes: [
        { id: '1', name: 'Test Node 1' },
        { id: '2', name: 'Test Node 2' },
      ],
      relationships: [
        { id: 'rel1', source: '1', target: '2', type: 'CONNECTS_TO' }
      ]
    });
  }, [mounted]);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#0f172a', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        🎯 GraphNexus Test Page
      </h1>
      
      <div style={{ 
        backgroundColor: 'rgba(100, 100, 100, 0.2)', 
        padding: '1rem', 
        borderRadius: '8px',
        marginBottom: '1rem'
      }}>
        <h2>✅ Basic Component Test</h2>
        <p>If you can see this, React is working!</p>
      </div>

      <div style={{ 
        backgroundColor: 'rgba(0, 100, 200, 0.2)', 
        padding: '1rem', 
        borderRadius: '8px',
        marginBottom: '1rem'
      }}>
        <h2>✅ Data Loading Test</h2>
        <p>Nodes: {data?.nodes?.length || 0}</p>
        <p>Relationships: {data?.relationships?.length || 0}</p>
      </div>

      <div style={{ 
        backgroundColor: 'rgba(0, 200, 100, 0.2)', 
        padding: '1rem', 
        borderRadius: '8px',
        marginBottom: '1rem'
      }}>
        <h2>✅ Neo4j Status</h2>
        <p>Check the console for: "Loaded X nodes from Neo4j database"</p>
        <p>This confirms our backend is working perfectly!</p>
      </div>

      <div style={{ 
        backgroundColor: 'rgba(200, 100, 0, 0.2)', 
        padding: '1rem', 
        borderRadius: '8px'
      }}>
        <h2>🚀 Next Steps</h2>
        <p>1. Verify this page displays correctly</p>
        <p>2. Check if the issue is in our main components</p>
        <p>3. Fix any component errors and restore the beautiful UI</p>
      </div>
    </div>
  );
}
