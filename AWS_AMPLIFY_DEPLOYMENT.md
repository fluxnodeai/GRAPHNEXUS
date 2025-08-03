# 🚀 GraphNexus AWS Amplify Deployment Guide

## Method 1: Manual ZIP Upload (Recommended for Quick Deployment)

### Step 1: Upload Distribution Package
1. **Go to AWS Amplify Console**
   - Visit: https://console.aws.amazon.com/amplify/
   - Sign in to your AWS account

2. **Create New App**
   - Click "Get started" under "Host your web app"
   - Select "Deploy without Git provider"
   - Choose "Drag and drop"

3. **Upload the ZIP File**
   - Upload the `dist.zip` file from your project directory
   - App name: `GraphNexus`
   - Environment name: `production`
   - Click "Save and deploy"

### Step 2: Configure Environment Variables
After deployment starts, configure these environment variables:

1. **Go to App Settings → Environment variables**
2. **Add the following variables:**
   ```
   NEO4J_URI=neo4j+s://b111ef49.databases.neo4j.io
   NEO4J_USERNAME=neo4j
   NEO4J_PASSWORD=ZYfmAP4JE90SQSCv6ku0qZCfZcAK2-_jh1v0Ddnjl4E
   NEO4J_DATABASE=neo4j
   AURA_INSTANCEID=b111ef49
   AURA_INSTANCENAME=Instance01
   ```

3. **Save and redeploy** (click "Actions" → "Redeploy this version")

### Step 3: Monitor Deployment
- Build time: ~3-5 minutes
- Watch build logs for any issues
- Once complete, you'll get a live URL: `https://main.d[random].amplifyapp.com`

### Step 4: Initialize Database
After successful deployment:

```bash
curl -X POST https://your-app-url.amplifyapp.com/api/init-data
```

---

## Method 2: GitHub Integration (For Continuous Deployment)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for AWS Amplify deployment"
git push origin main
```

### Step 2: Connect Repository
1. **AWS Amplify Console** → "Host web app"
2. **Select GitHub** as source
3. **Authorize GitHub** if prompted
4. **Select repository:** `fluxnodeai/GRAPHNEXUS`
5. **Branch:** `main`

### Step 3: Build Settings
Amplify will auto-detect the `amplify.yml` file:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### Step 4: Add Environment Variables
Same as Method 1, Step 2.

---

## Post-Deployment Setup

### 1. Custom Domain (Optional)
- Go to "Domain management"
- Add your custom domain
- Follow DNS configuration

### 2. Performance Optimization
Amplify automatically provides:
- ✅ Global CDN
- ✅ HTTPS/SSL
- ✅ Automatic compression
- ✅ Image optimization
- ✅ Caching headers

### 3. Monitoring & Logs
- **Build logs:** Available in Amplify Console
- **Runtime logs:** CloudWatch integration
- **Performance:** Built-in metrics

---

## Application Features

### 🧠 Knowledge Graph Intelligence
- **Interactive graph visualization** with force-directed layout
- **Real-time collaboration** with multiple users
- **AI-powered analysis** with pattern discovery
- **Entity management** system

### 🔗 Database Integration
- **Neo4j Aura** cloud database
- **Secure API endpoints** for data operations
- **Automatic initialization** with sample data

### 🎨 Modern UI/UX
- **Responsive design** works on all devices
- **Dark theme** with professional styling
- **Real-time updates** and animations
- **Intuitive navigation** between views

---

## API Endpoints

### Graph Data
- `GET /api/graph` - Fetch graph nodes and relationships
- `POST /api/graph` - Import bulk graph data

### Entity Management
- `GET /api/entities` - Fetch all entities
- `POST /api/entities` - Create new entity

### Database Operations
- `POST /api/init-data` - Initialize with sample data

---

## Troubleshooting

### Build Issues
- Check environment variables are set correctly
- Verify Neo4j credentials are valid
- Review build logs in Amplify Console

### Runtime Issues
- Test API endpoints directly: `/api/graph`
- Check browser console for errors
- Verify database connectivity

### Performance Issues
- Amplify provides automatic optimization
- CDN caching reduces load times
- Monitor CloudWatch metrics

---

## Security Features

- ✅ **HTTPS everywhere** - All traffic encrypted
- ✅ **Environment variables** - Secrets stored securely
- ✅ **Server-side API** - Database credentials never exposed to browser
- ✅ **CORS protection** - API access controls

---

## Cost Estimation

### AWS Amplify (Free Tier Generous)
- **Build minutes:** 1,000/month free
- **Data storage:** 5GB free
- **Data transfer:** 15GB/month free

### Neo4j Aura (Free Tier)
- **Database storage:** Included in free tier
- **Suitable for:** Development and moderate production use

**Total estimated cost for moderate usage: $0-10/month**

---

## Support & Updates

### Automatic Updates
- Connect GitHub for auto-deployment on code changes
- Manual ZIP upload for one-time deployments

### Backup & Recovery
- Neo4j Aura provides automatic backups
- Source code backed up in GitHub
- Amplify maintains deployment history

---

## 🎉 Your GraphNexus app is now live and ready for users!

**Live URL Format:** `https://main.d[random-id].amplifyapp.com`

Share this URL with your team to start collaborative knowledge graph exploration!
