import { createClient, SupabaseClient } from '@supabase/supabase-js';
import config, { configValidation, isDevelopment } from '@/lib/config';

// Supabase client instance
let supabase: SupabaseClient | null = null;

// Database health status
export interface SupabaseHealth {
  isConnected: boolean;
  lastCheck: Date;
  error?: string;
  latency?: number;
}

let healthStatus: SupabaseHealth = {
  isConnected: false,
  lastCheck: new Date(),
};

// Initialize Supabase client with configuration and validation
export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    try {
      // Check if configuration is valid
      if (configValidation.some(error => error.includes('Supabase'))) {
        throw new Error('Supabase configuration is invalid. Please check your environment variables.');
      }

      supabase = createClient(
        config.supabase.url,
        config.supabase.anonKey,
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
          },
          realtime: {
            params: {
              eventsPerSecond: 10,
            },
          },
        }
      );

      // Verify connection
      verifyConnection();
    } catch (error) {
      console.error('[Supabase] Failed to create client:', error);
      healthStatus = {
        isConnected: false,
        lastCheck: new Date(),
        error: error instanceof Error ? error.message : String(error)
      };
      throw error;
    }
  }
  return supabase;
}

// Verify database connection
async function verifyConnection(): Promise<void> {
  if (!supabase) return;

  try {
    console.info('[Supabase] Verifying database connection...');
    const startTime = Date.now();
    
    // Simple query to test connection
    const { data, error } = await supabase
      .from('entities')
      .select('count')
      .limit(1);

    const latency = Date.now() - startTime;

    if (error && !error.message.includes('relation "public.entities" does not exist')) {
      throw error;
    }

    healthStatus = {
      isConnected: true,
      lastCheck: new Date(),
      latency
    };

    console.info(`[Supabase] Database connection verified (Latency: ${latency}ms)`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    healthStatus = {
      isConnected: false,
      lastCheck: new Date(),
      error: errorMessage
    };

    console.error('[Supabase] Database connection failed:', errorMessage);
  }
}

// Get database health status
export function getSupabaseHealth(): SupabaseHealth {
  return healthStatus;
}

// Initialize database schema
export async function initializeSupabaseSchema(): Promise<void> {
  const client = getSupabaseClient();
  
  try {
    console.info('[Supabase] Initializing database schema...');
    
    // Check if entities table exists
    const { data: tables, error: tablesError } = await client
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'entities');

    if (tablesError) {
      console.warn('[Supabase] Could not check table existence:', tablesError);
      return;
    }

    if (!tables || tables.length === 0) {
      console.info('[Supabase] Entities table does not exist. Please create it manually or use the Supabase dashboard.');
      console.info('[Supabase] SQL to create entities table:');
      console.info(`
CREATE TABLE entities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  properties JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX entities_type_idx ON entities (type);
CREATE INDEX entities_name_idx ON entities (name);
      `);
    } else {
      console.info('[Supabase] Entities table exists');
    }
  } catch (error) {
    console.error('[Supabase] Schema initialization failed:', error);
  }
}

// For backward compatibility, export the client directly
export { getSupabaseClient as supabase };

// Entity types for TypeScript
export interface Entity {
  id: string;
  name: string;
  type: string;
  description: string;
  properties: Record<string, any>;
  created_at: string;
}

// Supabase table operations
export const entityOperations = {
  // Get all entities
  getEntities: async (): Promise<Entity[]> => {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('entities')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },
  
  // Get entity by ID
  getEntityById: async (id: string): Promise<Entity | null> => {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('entities')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Create new entity
  createEntity: async (entity: Omit<Entity, 'id' | 'created_at'>): Promise<Entity> => {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('entities')
      .insert([entity])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Update entity
  updateEntity: async (id: string, updates: Partial<Entity>): Promise<Entity> => {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('entities')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Delete entity
  deleteEntity: async (id: string): Promise<void> => {
    const client = getSupabaseClient();
    const { error } = await client
      .from('entities')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
