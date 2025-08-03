import { NextResponse } from 'next/server';
import { graphOperations } from '@/lib/db/neo4j';

export async function GET() {
  try {
    const graphData = await graphOperations.getGraphData();
    return NextResponse.json(graphData);
  } catch (error) {
    console.error('Failed to fetch graph data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch graph data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await graphOperations.bulkImportData(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to import graph data:', error);
    return NextResponse.json(
      { error: 'Failed to import graph data' },
      { status: 500 }
    );
  }
}
