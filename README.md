# GraphNexus - Knowledge Graph Visualization Platform

```
_____                 _     _   _                     
 / ____|               | |   | \ | |                    
| |  __ _ __ __ _ _ __ | |__ |  \| | _____  ___   _ ___ 
| | |_ | '__/ _` | '_ \| '_ \| . ` |/ _ \ \/ / | | / __|
| |__| | | | (_| | |_) | | | | |\  |  __/>  <| |_| \__ \
 \_____|_|  \__,_| .__/|_| |_|_| \_|\___/_/\_\\__,_|___/
                 | |                                    
                 |_|                                    

Interactive Knowledge Graph Visualization Platform
```

A production-grade, full-stack application for interactive knowledge graph visualization using Next.js 15, Tailwind CSS, Cytoscape.js, Supabase, Neo4j, and NVIDIA NIM.

## 🚀 Features

- **Interactive Knowledge Graph Visualization** - Explore entity relationships with an intuitive, interactive graph interface powered by Cytoscape.js
- **Entity Management System** - Create, view, edit, and delete entities with a comprehensive management interface
- **AI-Powered Text Analysis** - Extract entities and relationships from text using NVIDIA NIM's Named Entity Recognition and Relation Extraction
- **Graph Database Integration** - Store and query complex relationship data with Neo4j
- **Structured Data Storage** - Persist entity data with Supabase (PostgreSQL)
- **Responsive Design** - Fully responsive UI that works on desktop and mobile devices
- **Production-Ready Architecture** - Error handling, form validation, loading states, and more

## 🛠️ Tech Stack

- **Frontend Framework:** Next.js 15 with App Router
- **UI Components:** Custom React components with Tailwind CSS
- **Graph Visualization:** Cytoscape.js with React integration
- **Structured Database:** Supabase (PostgreSQL)
- **Graph Database:** Neo4j
- **AI Integration:** NVIDIA NIM (Named Entity Recognition and Relation Extraction)
- **Development Tools:** TypeScript, ESLint, Prettier
- **Testing:** Jest, React Testing Library (coming soon)

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account (for production use)
- Neo4j database (for production use)
- NVIDIA NIM API key (for production use)

## 🚦 Quick Start

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/graphnexus.git
cd graphnexus
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following environment variables:

```
# App Configuration
NODE_ENV=development
USE_SYNTHETIC_DATA=true
ENABLE_NIM_INTEGRATION=false

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Neo4j
NEO4J_URI=neo4j://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your-password

# NVIDIA NIM
NEXT_PUBLIC_NIM_API_BASE_URL=https://api.nim.nvidia.com
NIM_API_KEY=your-nim-api-key
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## 🗄️ Database Setup

### Setting Up Supabase

1. Create a new Supabase project at [https://supabase.com](https://supabase.com)
2. Create a table called `entities` with the following schema:

```sql
CREATE TABLE entities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  properties JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on the type column
CREATE INDEX entities_type_idx ON entities (type);
```

3. Update your `.env.local` file with your Supabase URL and anon key

### Setting Up Neo4j

1. Install Neo4j Desktop or use Neo4j Aura (cloud service)
2. Create a new database
3. Run the following Cypher queries to set up constraints:

```cypher
// Create constraints
CREATE CONSTRAINT entity_name IF NOT EXISTS
FOR (e:Entity) REQUIRE e.name IS UNIQUE;

// Create indexes
CREATE INDEX entity_type IF NOT EXISTS
FOR (e:Entity) ON (e.type);
```

4. Update your `.env.local` file with your Neo4j URI, username, and password

### Setting Up NVIDIA NIM

1. Sign up for NVIDIA NIM at [https://www.nvidia.com/en-us/ai-data-science/products/nim/](https://www.nvidia.com/en-us/ai-data-science/products/nim/)
2. Create an API key
3. Update your `.env.local` file with your NIM API key
4. Set `ENABLE_NIM_INTEGRATION=true` in your `.env.local` file

## 📁 Project Structure

```
graphnexus/
├── public/                   # Static assets
├── src/
│   ├── app/                  # Next.js app router
│   │   ├── entities/         # Entity management page
│   │   ├── graph/            # Knowledge graph visualization page
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   │   ├── ui/               # Reusable UI components
│   │   │   ├── Button.tsx    # Button component
│   │   │   ├── ErrorBoundary.tsx # Error boundary component
│   │   │   ├── FormInput.tsx # Form input component
│   │   │   ├── LoadingState.tsx # Loading state component
│   │   │   └── Toast.tsx     # Toast notification component
│   │   ├── EntityDetail.tsx  # Entity detail component
│   │   ├── GraphVisualization.tsx # Cytoscape graph component
│   │   └── TextAnalyzer.tsx  # NVIDIA NIM text analysis component
│   ├── lib/                  # Utility functions and API clients
│   │   ├── api/              # API clients
│   │   │   └── nvidia-nim.ts # NVIDIA NIM API client
│   │   ├── db/               # Database clients
│   │   │   ├── neo4j.ts      # Neo4j database client
│   │   │   └── supabase.ts   # Supabase client
│   │   ├── utils/            # Utility functions
│   │   │   ├── error-handler.ts # Error handling utilities
│   │   │   ├── synthetic-data.ts # Synthetic data generation
│   │   │   └── validation.ts # Form validation utilities
│   │   └── config.ts         # Application configuration
│   └── types/                # TypeScript type definitions
└── .env.local                # Environment variables
```

## 🧪 Development and Testing

### Development Mode

The application includes a synthetic data generation mode for development and testing. To enable it, set `USE_SYNTHETIC_DATA=true` in your `.env.local` file.

### Testing

Run tests with:

```bash
npm test
```

## 🔧 Configuration

The application uses a centralized configuration system in `src/lib/config.ts`. This file loads environment variables and provides default values for development.

## 🚨 Error Handling

The application includes a comprehensive error handling system:

- Error boundaries to catch and display errors gracefully
- Toast notifications for user feedback
- Validation for form inputs
- Consistent error logging and reporting

## 📱 Responsive Design

The UI is fully responsive and works on devices of all sizes:

- Desktop: Full-featured interface with advanced visualization options
- Tablet: Optimized layout with adjusted controls
- Mobile: Simplified interface with touch-friendly controls

## 🔒 Security

- Environment variables for sensitive configuration
- Proper error handling to prevent information leakage
- Input validation to prevent injection attacks

## 📄 License

MIT
