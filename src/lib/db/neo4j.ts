import neo4j, { Driver, Session } from 'neo4j-driver';
import config, { isDevelopment, configValidation } from '@/lib/config';

// Driver instance (singleton)
let driver: Driver | null = null;
let connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second

// Database health status
export interface DatabaseHealth {
  isConnected: boolean;
  lastCheck: Date;
  error?: string;
  version?: string;
}

let healthStatus: DatabaseHealth = {
  isConnected: false,
  lastCheck: new Date(),
};

// Get Neo4j driver instance with configuration and retry logic
export function getDriver(): Driver {
  if (!driver) {
    try {
      // Check if configuration is valid
      if (configValidation.some(error => error.includes('Neo4j'))) {
        throw new Error('Neo4j configuration is invalid. Please check your environment variables.');
      }

      driver = neo4j.driver(
        config.neo4j.uri,
        neo4j.auth.basic(config.neo4j.user, config.neo4j.password),
        {
          // Connection pool configuration
          maxConnectionPoolSize: 50,
          connectionAcquisitionTimeout: 5000,
          maxConnectionLifetime: 60000,
          // Logging configuration
          logging: {
            level: isDevelopment ? 'info' : 'warn',
            logger: (level, message) => {
              switch (level) {
                case 'error':
                  console.error(`[Neo4j] ${message}`);
                  break;
                case 'warn':
                  console.warn(`[Neo4j] ${message}`);
                  break;
                case 'info':
                  console.info(`[Neo4j] ${message}`);
                  break;
                default:
                  console.log(`[Neo4j] ${message}`);
              }
            }
          }
        }
      );
      
      // Verify connectivity
      verifyConnection();
    } catch (error) {
      console.error('[Neo4j] Failed to create driver:', error);
      healthStatus = {
        isConnected: false,
        lastCheck: new Date(),
        error: error instanceof Error ? error.message : String(error)
      };
      throw error;
    }
  }
  return driver;
}

// Verify database connection with retry logic
async function verifyConnection(): Promise<void> {
  if (!driver) return;
  
  try {
    console.info('[Neo4j] Verifying database connection...');
    await driver.verifyConnectivity();
    
    // Get database version
    const session = driver.session();
    try {
      const result = await session.run('CALL dbms.components() YIELD name, versions RETURN name, versions[0] as version');
      const version = result.records[0]?.get('version') || 'Unknown';
      
      healthStatus = {
        isConnected: true,
        lastCheck: new Date(),
        version
      };
      
      console.info(`[Neo4j] Database connection verified (Version: ${version})`);
    } finally {
      await session.close();
    }
    
    connectionAttempts = 0; // Reset on successful connection
  } catch (error) {
    connectionAttempts++;
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    healthStatus = {
      isConnected: false,
      lastCheck: new Date(),
      error: errorMessage
    };
    
    console.error(`[Neo4j] Database connection failed (attempt ${connectionAttempts}):`, errorMessage);
    
    // Retry connection if under max attempts
    if (connectionAttempts < MAX_CONNECTION_ATTEMPTS) {
      console.info(`[Neo4j] Retrying connection in ${RETRY_DELAY}ms...`);
      setTimeout(() => verifyConnection(), RETRY_DELAY);
    } else {
      console.error('[Neo4j] Max connection attempts reached. Database unavailable.');
    }
  }
}

// Get a Neo4j session
export function getSession(): Session {
  return getDriver().session();
}

// Close the driver when the application shuts down
export async function closeDriver(): Promise<void> {
  if (driver) {
    await driver.close();
  }
}

// Graph data types
export interface GraphNode {
  id: string;
  labels: string[];
  properties: Record<string, any>;
}

export interface GraphRelationship {
  id: string;
  type: string;
  startNodeId: string;
  endNodeId: string;
  properties: Record<string, any>;
}

export interface GraphData {
  nodes: GraphNode[];
  relationships: GraphRelationship[];
}

// Get database health status
export function getDatabaseHealth(): DatabaseHealth {
  return healthStatus;
}

// Initialize database with constraints and indexes
export async function initializeDatabase(): Promise<void> {
  if (!healthStatus.isConnected) {
    throw new Error('Database is not connected');
  }

  const session = getSession();
  try {
    console.info('[Neo4j] Initializing database schema...');
    
    // Create constraints and indexes
    const initQueries = [
      // Create constraint for entity names
      'CREATE CONSTRAINT entity_name IF NOT EXISTS FOR (e:Entity) REQUIRE e.name IS UNIQUE',
      
      // Create indexes for better performance
      'CREATE INDEX entity_type IF NOT EXISTS FOR (e:Entity) ON (e.type)',
      'CREATE INDEX person_name IF NOT EXISTS FOR (p:Person) ON (p.name)',
      'CREATE INDEX organization_name IF NOT EXISTS FOR (o:Organization) ON (o.name)',
      'CREATE INDEX location_name IF NOT EXISTS FOR (l:Location) ON (l.name)',
    ];
    
    for (const query of initQueries) {
      try {
        await session.run(query);
        console.info(`[Neo4j] Executed: ${query}`);
      } catch (error) {
        // Ignore constraint/index already exists errors
        if (!String(error).includes('already exists')) {
          console.warn(`[Neo4j] Warning executing query "${query}":`, error);
        }
      }
    }
    
    console.info('[Neo4j] Database schema initialized successfully');
  } finally {
    await session.close();
  }
}

// Bulk import data from synthetic dataset
export async function bulkImportData(data: { nodes: GraphNode[], relationships: Omit<GraphRelationship, 'id'>[] }): Promise<void> {
  if (!healthStatus.isConnected) {
    throw new Error('Database is not connected');
  }

  const session = getSession();
  try {
    console.info(`[Neo4j] Starting bulk import of ${data.nodes.length} nodes and ${data.relationships.length} relationships...`);
    
    // Clear existing data (for demo purposes)
    await session.run('MATCH (n) DETACH DELETE n');
    console.info('[Neo4j] Cleared existing data');
    
    // Import nodes in batches
    const batchSize = 100;
    for (let i = 0; i < data.nodes.length; i += batchSize) {
      const batch = data.nodes.slice(i, i + batchSize);
      await session.run(
        `
        UNWIND $nodes as node
        CREATE (n:Entity)
        SET n.id = node.id,
            n.name = node.properties.name,
            n.type = node.labels[1],
            n += node.properties
        WITH n, node
        CALL apoc.create.addLabels(n, node.labels) YIELD node as labeledNode
        RETURN count(labeledNode)
        `,
        { nodes: batch }
      );
    }
    console.info(`[Neo4j] Imported ${data.nodes.length} nodes`);
    
    // Import relationships in batches
    for (let i = 0; i < data.relationships.length; i += batchSize) {
      const batch = data.relationships.slice(i, i + batchSize);
      await session.run(
        `
        UNWIND $relationships as rel
        MATCH (a:Entity {id: rel.startNodeId})
        MATCH (b:Entity {id: rel.endNodeId})
        CALL apoc.create.relationship(a, rel.type, rel.properties, b) YIELD rel as relationship
        RETURN count(relationship)
        `,
        { relationships: batch }
      );
    }
    console.info(`[Neo4j] Imported ${data.relationships.length} relationships`);
    
    console.info('[Neo4j] Bulk import completed successfully');
  } catch (error) {
    console.error('[Neo4j] Bulk import failed:', error);
    throw error;
  } finally {
    await session.close();
  }
}

// Neo4j operations
export const graphOperations = {
  // Get all nodes and relationships
  getGraphData: async (): Promise<GraphData> => {
    const session = getSession();
    try {
      const result = await session.run(`
        MATCH (n)
        OPTIONAL MATCH (n)-[r]->(m)
        RETURN n, r, m
      `);
      
      const nodes = new Map<string, GraphNode>();
      const relationships: GraphRelationship[] = [];
      
      result.records.forEach(record => {
        // Process nodes
        const startNode = record.get('n');
        if (startNode) {
          const id = startNode.identity.toString();
          if (!nodes.has(id)) {
            nodes.set(id, {
              id,
              labels: startNode.labels,
              properties: startNode.properties
            });
          }
        }
        
        // Process end nodes
        const endNode = record.get('m');
        if (endNode) {
          const id = endNode.identity.toString();
          if (!nodes.has(id)) {
            nodes.set(id, {
              id,
              labels: endNode.labels,
              properties: endNode.properties
            });
          }
        }
        
        // Process relationships
        const relationship = record.get('r');
        if (relationship) {
          relationships.push({
            id: relationship.identity.toString(),
            type: relationship.type,
            startNodeId: relationship.start.toString(),
            endNodeId: relationship.end.toString(),
            properties: relationship.properties
          });
        }
      });
      
      return {
        nodes: Array.from(nodes.values()),
        relationships
      };
    } finally {
      await session.close();
    }
  },
  
  // Bulk import data
  bulkImportData: async (data: { nodes: GraphNode[], relationships: Omit<GraphRelationship, 'id'>[] }): Promise<void> => {
    if (!healthStatus.isConnected) {
      throw new Error('Database is not connected');
    }

    const session = getSession();
    try {
      console.info(`[Neo4j] Starting bulk import of ${data.nodes.length} nodes and ${data.relationships.length} relationships...`);
      
      // Clear existing data (for demo purposes)
      await session.run('MATCH (n) DETACH DELETE n');
      console.info('[Neo4j] Cleared existing data');
      
      // Import nodes in batches
      const batchSize = 100;
      for (let i = 0; i < data.nodes.length; i += batchSize) {
        const batch = data.nodes.slice(i, i + batchSize);
        await session.run(
          `
          UNWIND $nodes as node
          CREATE (n:Entity)
          SET n.id = node.id,
              n.name = node.properties.name,
              n.type = node.labels[1],
              n += node.properties
          WITH n, node
          CALL {
            WITH n, node
            WITH n, node.labels as labels
            UNWIND labels as label
            CALL apoc.create.addLabels(n, [label]) YIELD node as labeledNode
            RETURN count(labeledNode) as labelCount
          }
          RETURN count(n)
          `,
          { nodes: batch }
        );
      }
      console.info(`[Neo4j] Imported ${data.nodes.length} nodes`);
      
      // Import relationships in batches
      for (let i = 0; i < data.relationships.length; i += batchSize) {
        const batch = data.relationships.slice(i, i + batchSize);
        await session.run(
          `
          UNWIND $relationships as rel
          MATCH (a:Entity {id: rel.startNodeId})
          MATCH (b:Entity {id: rel.endNodeId})
          WITH a, b, rel
          CALL apoc.create.relationship(a, rel.type, rel.properties, b) YIELD rel as relationship
          RETURN count(relationship)
          `,
          { relationships: batch }
        );
      }
      console.info(`[Neo4j] Imported ${data.relationships.length} relationships`);
      
      console.info('[Neo4j] Bulk import completed successfully');
    } catch (error) {
      console.error('[Neo4j] Bulk import failed:', error);
      // Try simpler approach without APOC
      try {
        console.info('[Neo4j] Trying simpler import without APOC...');
        
        // Clear and import nodes without APOC
        await session.run('MATCH (n) DETACH DELETE n');
        
        for (const node of data.nodes) {
          const primaryLabel = node.labels[1] || 'Entity';
          await session.run(
            `CREATE (n:Entity:${primaryLabel} $properties) SET n.id = $id`,
            { 
              id: node.id, 
              properties: { ...node.properties, name: node.properties.name || `Node ${node.id}` }
            }
          );
        }
        
        // Import relationships
        for (const rel of data.relationships) {
          await session.run(
            `
            MATCH (a:Entity {id: $startId})
            MATCH (b:Entity {id: $endId})
            CREATE (a)-[r:${rel.type.replace(/[^A-Z_]/g, '_')} $properties]->(b)
            `,
            { 
              startId: rel.startNodeId, 
              endId: rel.endNodeId, 
              properties: rel.properties 
            }
          );
        }
        
        console.info('[Neo4j] Simple import completed successfully');
      } catch (simpleError) {
        console.error('[Neo4j] Simple import also failed:', simpleError);
        throw simpleError;
      }
    } finally {
      await session.close();
    }
  },
  
  // Create a new entity node
  createEntityNode: async (entity: { name: string; type: string; properties: Record<string, any> }): Promise<GraphNode> => {
    const session = getSession();
    try {
      const result = await session.run(
        `
        CREATE (n:Entity:${entity.type} $properties)
        SET n.name = $name
        RETURN n
        `,
        { name: entity.name, properties: entity.properties }
      );
      
      const node = result.records[0].get('n');
      return {
        id: node.identity.toString(),
        labels: node.labels,
        properties: node.properties
      };
    } finally {
      await session.close();
    }
  },
  
  // Create a relationship between two entities
  createRelationship: async (
    startNodeId: string,
    endNodeId: string,
    type: string,
    properties: Record<string, any> = {}
  ): Promise<GraphRelationship> => {
    const session = getSession();
    try {
      const cleanType = type.replace(/[^A-Z_]/g, '_');
      const result = await session.run(
        `
        MATCH (a), (b)
        WHERE id(a) = $startNodeId AND id(b) = $endNodeId
        CREATE (a)-[r:${cleanType} $properties]->(b)
        RETURN r
        `,
        { startNodeId: parseInt(startNodeId), endNodeId: parseInt(endNodeId), properties }
      );
      
      const relationship = result.records[0].get('r');
      return {
        id: relationship.identity.toString(),
        type: relationship.type,
        startNodeId: relationship.start.toString(),
        endNodeId: relationship.end.toString(),
        properties: relationship.properties
      };
    } finally {
      await session.close();
    }
  }
};
