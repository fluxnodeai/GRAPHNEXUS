import { NextResponse } from 'next/server';
import { graphOperations } from '@/lib/db/neo4j';

export async function GET() {
  try {
    const graphData = await graphOperations.getGraphData();
    // Extract unique entities from the graph data
    const entities = graphData.nodes.map(node => ({
      id: node.id,
      name: node.properties.name || 'Unnamed Entity',
      type: node.properties.type || 'Unknown',
      properties: node.properties
    }));
    
    return NextResponse.json(entities);
  } catch (error) {
    console.error('Failed to fetch entities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch entities' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const entity = await request.json();
    const newNode = await graphOperations.createEntityNode(entity);
    return NextResponse.json(newNode);
  } catch (error) {
    console.error('Failed to create entity:', error);
    return NextResponse.json(
      { error: 'Failed to create entity' },
      { status: 500 }
    );
  }
}
