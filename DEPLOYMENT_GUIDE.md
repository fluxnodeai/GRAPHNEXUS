# GraphNexus AWS Amplify Deployment Guide

## Prerequisites
- AWS Account
- GitHub repository (already set up at: https://github.com/fluxnodeai/GRAPHNEXUS.git)
- Environment variables ready

## Step 1: Push Latest Changes to GitHub

Ensure all your latest changes are committed and pushed to your GitHub repository:

```bash
git add .
git commit -m "Add Amplify deployment configuration"
git push origin main
```

## Step 2: Set Up AWS Amplify

1. **Go to AWS Amplify Console**
   - Visit: https://console.aws.amazon.com/amplify/
   - Sign in to your AWS account

2. **Create New App**
   - Click "Create app"
   - Select "Host web app"
   - Choose "GitHub" as your source

3. **Connect Repository**
   - Authorize GitHub if prompted
   - Select your repository: `fluxnodeai/GRAPHNEXUS`
   - Choose branch: `main`

4. **Configure Build Settings**
   - Amplify should automatically detect the `amplify.yml` file
   - If not, ensure the build settings match:
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

5. **Environment Variables**
   Add these environment variables in Amplify Console:
   ```
   NEO4J_URI=neo4j+s://b111ef49.databases.neo4j.io
   NEO4J_USERNAME=neo4j
   NEO4J_PASSWORD=ZYfmAP4JE90SQSCv6ku0qZCfZcAK2-_jh1v0Ddnjl4E
   NEO4J_DATABASE=neo4j
   AURA_INSTANCEID=b111ef49
   AURA_INSTANCENAME=Instance01
   ```

6. **Deploy**
   - Review settings
   - Click "Save and deploy"

## Step 3: Monitor Deployment

- Watch the build logs in real-time
- The deployment typically takes 3-5 minutes
- Once complete, you'll get a live URL (e.g., `https://main.d1234567890.amplifyapp.com`)

## Step 4: Custom Domain (Optional)

1. In Amplify Console, go to "Domain management"
2. Click "Add domain"
3. Enter your custom domain
4. Follow DNS configuration instructions

## Step 5: Initialize Database (After Deployment)

Once your app is deployed, you need to initialize the database with sample data:

1. **Visit your deployed app URL**
2. **Initialize the database by calling:**
   ```
   POST https://your-app-url.amplifyapp.com/api/init-data
   ```
   Or you can use curl:
   ```bash
   curl -X POST https://your-app-url.amplifyapp.com/api/init-data
   ```

## Step 6: Automatic Deployments

- Any push to the `main` branch will trigger automatic deployments
- You can disable this in the Amplify Console if needed

## Troubleshooting

### Build Failures
- Check build logs in Amplify Console
- Verify environment variables are set correctly
- Ensure all dependencies are in package.json

### Runtime Issues
- Check browser console for errors
- Verify database connections are working
- Test locally first with `npm run build && npm start`

### Performance Optimization
- Amplify automatically provides:
  - CDN distribution
  - Automatic compression
  - Image optimization
  - Caching headers

## Security Notes

- Database credentials are securely stored in Amplify environment variables
- All traffic is served over HTTPS
- Consider setting up custom headers for additional security

## Monitoring

- Use Amplify Console for deployment metrics
- CloudWatch for detailed application logs
- Consider setting up alerts for build failures

## Cost Considerations

- Amplify pricing includes:
  - Build minutes: First 1,000 minutes/month free
  - Hosting: First 15GB served/month free
  - Storage: First 5GB/month free

Your GraphNexus application should fit well within the free tier limits for moderate usage.
