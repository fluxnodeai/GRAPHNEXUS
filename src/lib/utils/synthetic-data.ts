import { faker } from '@faker-js/faker';
import { Entity } from '../db/supabase';
import { GraphNode, GraphRelationship } from '../db/neo4j';

// Entity types
const ENTITY_TYPES = ['Person', 'Organization', 'Location', 'Event', 'Product'];

// Relationship types
const RELATIONSHIP_TYPES = [
  'WORKS_FOR',
  'LOCATED_IN',
  'FOUNDED_BY',
  'PARTICIPATED_IN',
  'MANUFACTURES',
  'OWNS',
  'KNOWS',
  'VISITED'
];

// Generate a random entity
export function generateRandomEntity(): Omit<Entity, 'id' | 'created_at'> {
  const type = faker.helpers.arrayElement(ENTITY_TYPES);
  
  // Generate properties based on entity type
  let properties: Record<string, any> = {};
  
  switch (type) {
    case 'Person':
      properties = {
        age: faker.number.int({ min: 18, max: 80 }),
        occupation: faker.person.jobTitle(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress()
      };
      break;
    case 'Organization':
      properties = {
        industry: faker.company.buzzNoun(),
        founded: faker.date.past({ years: 30 }).getFullYear(),
        employees: faker.number.int({ min: 5, max: 10000 }),
        website: faker.internet.url(),
        address: faker.location.streetAddress()
      };
      break;
    case 'Location':
      properties = {
        country: faker.location.country(),
        city: faker.location.city(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
        population: faker.number.int({ min: 1000, max: 10000000 })
      };
      break;
    case 'Event':
      properties = {
        date: faker.date.future().toISOString(),
        duration: faker.number.int({ min: 1, max: 5 }) + ' hours',
        venue: faker.company.name() + ' ' + faker.location.buildingNumber(),
        attendees: faker.number.int({ min: 10, max: 1000 })
      };
      break;
    case 'Product':
      properties = {
        price: parseFloat(faker.commerce.price()),
        category: faker.commerce.department(),
        sku: faker.string.alphanumeric(8).toUpperCase(),
        inStock: faker.datatype.boolean(),
        releaseDate: faker.date.past({ years: 5 }).toISOString()
      };
      break;
  }
  
  return {
    name: type === 'Person' 
      ? faker.person.fullName() 
      : type === 'Organization'
        ? faker.company.name()
        : type === 'Location'
          ? faker.location.city()
          : type === 'Event'
            ? faker.company.buzzPhrase()
            : faker.commerce.productName(),
    type,
    description: faker.lorem.sentence(),
    properties
  };
}

// Generate a batch of random entities
export function generateEntities(count: number): Omit<Entity, 'id' | 'created_at'>[] {
  return Array.from({ length: count }, () => generateRandomEntity());
}

// Generate random relationships between entities
export function generateRelationships(
  nodes: GraphNode[],
  count: number
): Omit<GraphRelationship, 'id'>[] {
  const relationships: Omit<GraphRelationship, 'id'>[] = [];
  
  for (let i = 0; i < count; i++) {
    // Get random start and end nodes
    const startNodeIndex = faker.number.int({ min: 0, max: nodes.length - 1 });
    let endNodeIndex = faker.number.int({ min: 0, max: nodes.length - 1 });
    
    // Ensure start and end nodes are different
    while (endNodeIndex === startNodeIndex) {
      endNodeIndex = faker.number.int({ min: 0, max: nodes.length - 1 });
    }
    
    const startNode = nodes[startNodeIndex];
    const endNode = nodes[endNodeIndex];
    
    // Determine relationship type based on node types
    let possibleTypes = [...RELATIONSHIP_TYPES];
    
    // Filter relationship types based on entity types
    if (startNode.labels.includes('Person') && endNode.labels.includes('Organization')) {
      possibleTypes = ['WORKS_FOR', 'FOUNDED_BY', 'OWNS'];
    } else if (startNode.labels.includes('Person') && endNode.labels.includes('Person')) {
      possibleTypes = ['KNOWS'];
    } else if (startNode.labels.includes('Person') && endNode.labels.includes('Location')) {
      possibleTypes = ['VISITED', 'LOCATED_IN'];
    } else if (startNode.labels.includes('Organization') && endNode.labels.includes('Product')) {
      possibleTypes = ['MANUFACTURES'];
    } else if (startNode.labels.includes('Person') && endNode.labels.includes('Event')) {
      possibleTypes = ['PARTICIPATED_IN'];
    } else if (startNode.labels.includes('Organization') && endNode.labels.includes('Location')) {
      possibleTypes = ['LOCATED_IN'];
    }
    
    const type = faker.helpers.arrayElement(possibleTypes);
    
    // Generate relationship properties based on type
    let properties: Record<string, any> = {};
    
    switch (type) {
      case 'WORKS_FOR':
        properties = {
          since: faker.date.past({ years: 10 }).getFullYear(),
          position: faker.person.jobTitle(),
          department: faker.commerce.department()
        };
        break;
      case 'LOCATED_IN':
        properties = {
          since: faker.date.past({ years: 20 }).getFullYear()
        };
        break;
      case 'FOUNDED_BY':
        properties = {
          year: faker.date.past({ years: 30 }).getFullYear(),
          investment: faker.finance.amount()
        };
        break;
      case 'PARTICIPATED_IN':
        properties = {
          role: faker.helpers.arrayElement(['Attendee', 'Speaker', 'Organizer', 'Sponsor']),
          feedback: faker.number.int({ min: 1, max: 5 })
        };
        break;
      default:
        properties = {
          since: faker.date.past({ years: 5 }).getFullYear()
        };
    }
    
    relationships.push({
      type,
      startNodeId: startNode.id,
      endNodeId: endNode.id,
      properties
    });
  }
  
  return relationships;
}

// Generate a complete synthetic dataset
export function generateSyntheticDataset(
  entityCount: number,
  relationshipRatio: number = 1.5
): {
  entities: Omit<Entity, 'id' | 'created_at'>[];
  nodes: GraphNode[];
  relationships: Omit<GraphRelationship, 'id'>[];
} {
  // Generate entities
  const entities = generateEntities(entityCount);
  
  // Convert entities to graph nodes
  const nodes: GraphNode[] = entities.map((entity, index) => ({
    id: index.toString(),
    labels: ['Entity', entity.type],
    properties: {
      name: entity.name,
      ...entity.properties
    }
  }));
  
  // Generate relationships
  const relationshipCount = Math.floor(entityCount * relationshipRatio);
  const relationships = generateRelationships(nodes, relationshipCount);
  
  return {
    entities,
    nodes,
    relationships
  };
}

// Sample JSON data structure for Supabase entities
export const sampleSupabaseEntityJson = {
  "name": "John Doe",
  "type": "Person",
  "description": "Software engineer with 10 years of experience",
  "properties": {
    "age": 35,
    "occupation": "Senior Software Engineer",
    "email": "john.doe@example.com",
    "phone": "555-123-4567",
    "address": "123 Main St, San Francisco, CA"
  }
};

// Sample JSON data structure for Neo4j nodes and relationships
export const sampleNeo4jDataJson = {
  "nodes": [
    {
      "id": "0",
      "labels": ["Entity", "Person"],
      "properties": {
        "name": "John Doe",
        "age": 35,
        "occupation": "Senior Software Engineer"
      }
    },
    {
      "id": "1",
      "labels": ["Entity", "Organization"],
      "properties": {
        "name": "Acme Inc",
        "industry": "Technology",
        "founded": 2005
      }
    }
  ],
  "relationships": [
    {
      "type": "WORKS_FOR",
      "startNodeId": "0",
      "endNodeId": "1",
      "properties": {
        "since": 2018,
        "position": "Senior Developer",
        "department": "Engineering"
      }
    }
  ]
};
