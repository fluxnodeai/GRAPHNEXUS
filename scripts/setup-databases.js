#!/usr/bin/env node

/**
 * GraphNexus Database Setup Script
 * 
 * This script helps you set up the database integrations for GraphNexus.
 * It will guide you through creating accounts and configuring the databases.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    warning: '\x1b[33m', // Yellow
    error: '\x1b[31m',   // Red
    reset: '\x1b[0m'     // Reset
  };
  
  console.log(`${colors[type]}${message}${colors.reset}`);
}

function displayBanner() {
  console.log(`
${'\x1b[36m'}
  ╔═══════════════════════════════════════════════════════════════╗
  ║                                                               ║
  ║               GraphNexus Database Setup                       ║
  ║                                                               ║
  ║   This script will help you configure free database          ║
  ║   integrations for your hackathon project.                   ║
  ║                                                               ║
  ╚═══════════════════════════════════════════════════════════════╝
${'\x1b[0m'}
  `);
}

async function setupSupabase() {
  log('\n📦 Setting up Supabase (PostgreSQL Database)', 'info');
  log('Supabase provides a free tier with 500MB storage and 2 projects.', 'info');
  
  console.log(`
Steps to set up Supabase:
1. Go to https://supabase.com
2. Sign up for a free account
3. Create a new project
4. Go to Settings > API in your project
5. Copy the Project URL and anon public key
  `);
  
  const hasSupabase = await ask('Do you have a Supabase project set up? (y/n): ');
  
  if (hasSupabase.toLowerCase() === 'y') {
    const supabaseUrl = await ask('Enter your Supabase Project URL: ');
    const supabaseKey = await ask('Enter your Supabase anon public key: ');
    
    return {
      url: supabaseUrl.trim(),
      key: supabaseKey.trim()
    };
  } else {
    log('Please set up Supabase first and run this script again.', 'warning');
    log('Visit: https://supabase.com', 'info');
    return null;
  }
}

async function setupNeo4j() {
  log('\n🔗 Setting up Neo4j (Graph Database)', 'info');
  log('Neo4j Aura Free provides a cloud graph database with 200k nodes limit.', 'info');
  
  console.log(`
Steps to set up Neo4j Aura Free:
1. Go to https://neo4j.com/cloud/aura-free/
2. Sign up for a free account
3. Create a free AuraDB instance
4. Download the credentials (save the password!)
5. Copy the connection URI, username, and password
  `);
  
  const hasNeo4j = await ask('Do you have a Neo4j Aura Free instance set up? (y/n): ');
  
  if (hasNeo4j.toLowerCase() === 'y') {
    const neo4jUri = await ask('Enter your Neo4j URI (neo4j+s://...): ');
    const neo4jUser = await ask('Enter your Neo4j username (usually "neo4j"): ');
    const neo4jPassword = await ask('Enter your Neo4j password: ');
    
    return {
      uri: neo4jUri.trim(),
      user: neo4jUser.trim() || 'neo4j',
      password: neo4jPassword.trim()
    };
  } else {
    log('Please set up Neo4j Aura Free first and run this script again.', 'warning');
    log('Visit: https://neo4j.com/cloud/aura-free/', 'info');
    return null;
  }
}

async function setupAI() {
  log('\n🤖 Setting up AI Integration', 'info');
  log('You can use either NVIDIA NIM (paid) or Hugging Face (free) for AI features.', 'info');
  
  const aiChoice = await ask('Which AI service would you like to use? (nvidia/huggingface/skip): ');
  
  switch (aiChoice.toLowerCase()) {
    case 'nvidia':
      console.log(`
Steps to set up NVIDIA NIM:
1. Go to https://www.nvidia.com/en-us/ai-data-science/products/nim/
2. Sign up and get an API key
3. Copy your API key
      `);
      
      const nvidiaKey = await ask('Enter your NVIDIA NIM API key (or press Enter to skip): ');
      return {
        type: 'nvidia',
        key: nvidiaKey.trim(),
        enabled: !!nvidiaKey.trim()
      };
    
    case 'huggingface':
      console.log(`
Steps to set up Hugging Face (Free):
1. Go to https://huggingface.co
2. Sign up for a free account
3. Go to Settings > Access Tokens
4. Create a new token with 'Read' permissions
5. Copy your token
      `);
      
      const hfKey = await ask('Enter your Hugging Face API token (or press Enter to use free tier): ');
      return {
        type: 'huggingface',
        key: hfKey.trim(),
        enabled: true // Hugging Face has a free tier
      };
    
    default:
      return {
        type: 'none',
        enabled: false
      };
  }
}

function createEnvFile(config) {
  const envContent = `# GraphNexus Environment Configuration
# Generated by setup script on ${new Date().toISOString()}

# App Configuration
NODE_ENV=development
USE_SYNTHETIC_DATA=${config.supabase && config.neo4j ? 'false' : 'true'}
ENABLE_NIM_INTEGRATION=${config.ai.enabled ? 'true' : 'false'}

# Supabase Configuration (PostgreSQL)
NEXT_PUBLIC_SUPABASE_URL=${config.supabase?.url || 'your-supabase-url'}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${config.supabase?.key || 'your-supabase-anon-key'}

# Neo4j Configuration (Graph Database)
NEO4J_URI=${config.neo4j?.uri || 'neo4j://localhost:7687'}
NEO4J_USER=${config.neo4j?.user || 'neo4j'}
NEO4J_PASSWORD=${config.neo4j?.password || 'password'}

# AI Configuration
${config.ai.type === 'nvidia' ? `
# NVIDIA NIM Configuration
NEXT_PUBLIC_NIM_API_BASE_URL=https://api.nim.nvidia.com
NIM_API_KEY=${config.ai.key || 'your-nim-api-key'}
` : ''}
${config.ai.type === 'huggingface' ? `
# Hugging Face Configuration (Free AI)
HUGGINGFACE_API_KEY=${config.ai.key || 'your-huggingface-api-key'}
` : ''}
`;

  const envPath = path.join(process.cwd(), '.env.local');
  fs.writeFileSync(envPath, envContent);
  
  log(`✅ Created .env.local file with your configuration`, 'success');
}

function createDatabaseSchema() {
  const schemaContent = `-- Supabase Schema for GraphNexus
-- Run this in your Supabase SQL editor

-- Create entities table
CREATE TABLE IF NOT EXISTS entities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  properties JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS entities_type_idx ON entities (type);
CREATE INDEX IF NOT EXISTS entities_name_idx ON entities (name);
CREATE INDEX IF NOT EXISTS entities_created_at_idx ON entities (created_at);

-- Enable Row Level Security (optional)
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now
-- In production, you'd want more restrictive policies
CREATE POLICY "Enable all operations for entities" ON entities
  FOR ALL USING (true);

-- Insert some sample data
INSERT INTO entities (name, type, description, properties) VALUES
  ('John Doe', 'Person', 'Software engineer', '{"age": 30, "skills": ["React", "Node.js"]}'),
  ('Tech Corp', 'Organization', 'Technology company', '{"founded": 2020, "employees": 50}'),
  ('San Francisco', 'Location', 'City in California', '{"population": 873965, "state": "CA"}')
ON CONFLICT DO NOTHING;
`;

  const schemaPath = path.join(process.cwd(), 'database-schema.sql');
  fs.writeFileSync(schemaPath, schemaContent);
  
  log(`📄 Created database-schema.sql file`, 'success');
  log('Run this SQL in your Supabase SQL editor to set up the database schema.', 'info');
}

function displayNextSteps(config) {
  log('\n🎉 Setup Complete!', 'success');
  
  console.log(`
Next steps:

1. Database Schema:
   ${config.supabase ? '✅' : '❌'} Copy the SQL from database-schema.sql to your Supabase SQL editor and run it

2. Neo4j Setup:
   ${config.neo4j ? '✅' : '❌'} Your Neo4j database will be initialized automatically when you start the app

3. Start the application:
   npm run dev

4. Test your setup:
   - Visit http://localhost:3000
   - Check the console for connection status
   - Try the text analyzer feature

5. Troubleshooting:
   - Check the browser console for any connection errors
   - Verify your credentials in .env.local
   - Make sure your databases are running and accessible

6. For the hackathon:
   - Import your own data using the CSV upload feature
   - Create compelling visualizations
   - Use the AI features to extract insights from text
  `);

  if (!config.supabase || !config.neo4j) {
    log('\n⚠️  Warning: Some databases are not configured.', 'warning');
    log('The app will use synthetic data, which is fine for demos but limits functionality.', 'warning');
  }

  log('\n📚 Resources:', 'info');
  console.log(`
- GraphNexus Documentation: See README.md
- Supabase Documentation: https://supabase.com/docs
- Neo4j Documentation: https://neo4j.com/docs/
- Hugging Face Documentation: https://huggingface.co/docs/
  `);
}

async function main() {
  try {
    displayBanner();
    
    log('This script will help you set up the database integrations for GraphNexus.', 'info');
    log('All services have free tiers that are perfect for hackathons!', 'info');
    
    const proceed = await ask('\nWould you like to continue with the setup? (y/n): ');
    if (proceed.toLowerCase() !== 'y') {
      log('Setup cancelled.', 'warning');
      rl.close();
      return;
    }

    const config = {};

    // Setup Supabase
    config.supabase = await setupSupabase();
    
    // Setup Neo4j
    config.neo4j = await setupNeo4j();
    
    // Setup AI
    config.ai = await setupAI();

    // Create configuration files
    createEnvFile(config);
    
    if (config.supabase) {
      createDatabaseSchema();
    }

    // Display next steps
    displayNextSteps(config);

  } catch (error) {
    log(`Error during setup: ${error.message}`, 'error');
  } finally {
    rl.close();
  }
}

// Check if running directly
if (require.main === module) {
  main();
}

module.exports = { main };
