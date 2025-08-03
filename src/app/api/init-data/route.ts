import { NextResponse } from 'next/server';
import { graphOperations } from '@/lib/db/neo4j';

// Sample graph data for initialization
const sampleGraphData = {
  nodes: [
    {
      id: '1',
      labels: ['Entity', 'Person'],
      properties: {
        name: 'Sarah Johnson',
        type: 'Person',
        description: 'Software Engineer at TechCorp',
        email: 'sarah.johnson@techcorp.com',
        skills: ['JavaScript', 'React', 'Node.js']
      }
    },
    {
      id: '2',
      labels: ['Entity', 'Organization'],
      properties: {
        name: 'TechCorp',
        type: 'Organization',
        description: 'Leading technology company',
        industry: 'Software Development',
        founded: '2010'
      }
    },
    {
      id: '3',
      labels: ['Entity', 'Location'],
      properties: {
        name: 'San Francisco',
        type: 'Location',
        description: 'Major tech hub in California',
        country: 'United States',
        population: '884363'
      }
    },
    {
      id: '4',
      labels: ['Entity', 'Product'],
      properties: {
        name: 'GraphNexus',
        type: 'Product',
        description: 'Knowledge graph visualization platform',
        category: 'Software',
        version: '1.0.0'
      }
    },
    {
      id: '5',
      labels: ['Entity', 'Event'],
      properties: {
        name: 'Tech Conference 2024',
        type: 'Event',
        description: 'Annual technology conference',
        date: '2024-09-15',
        attendees: '500'
      }
    }
  ],
  relationships: [
    {
      startNodeId: '1',
      endNodeId: '2',
      type: 'WORKS_AT',
      properties: {
        role: 'Senior Software Engineer',
        startDate: '2022-01-15'
      }
    },
    {
      startNodeId: '2',
      endNodeId: '3',
      type: 'LOCATED_IN',
      properties: {
        office: 'Headquarters',
        since: '2015'
      }
    },
    {
      startNodeId: '1',
      endNodeId: '4',
      type: 'DEVELOPED',
      properties: {
        contribution: 'Lead Developer',
        involvement: 'High'
      }
    },
    {
      startNodeId: '1',
      endNodeId: '5',
      type: 'ATTENDED',
      properties: {
        role: 'Speaker',
        presentation: 'Knowledge Graph Innovations'
      }
    },
    {
      startNodeId: '2',
      endNodeId: '5',
      type: 'SPONSORED',
      properties: {
        level: 'Gold',
        amount: '50000'
      }
    }
  ]
};

export async function POST() {
  try {
    console.log('Initializing database with sample data...');
    
    // Import the sample data
    await graphOperations.bulkImportData(sampleGraphData);
    
    console.log('Sample data imported successfully');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database initialized with sample data',
      nodesCreated: sampleGraphData.nodes.length,
      relationshipsCreated: sampleGraphData.relationships.length
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database with sample data' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to initialize the database with sample data',
    sampleData: {
      nodes: sampleGraphData.nodes.length,
      relationships: sampleGraphData.relationships.length
    }
  });
}
