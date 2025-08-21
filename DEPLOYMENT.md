# TicX Deployment Guide

## 🚀 Railway Deployment (Recommended)

### Step 1: Prepare for Railway
1. Sign up at [railway.app](https://railway.app)
2. Connect your GitHub account
3. Push your code to GitHub

### Step 2: Create Railway Project
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Add PostgreSQL database
railway add postgresql

# Deploy
railway up
```

### Step 3: Set Environment Variables in Railway
```
DATABASE_URL=<Railway will auto-generate this>
NEXTAUTH_SECRET=your-super-secret-key-change-this
NEXTAUTH_URL=https://your-app.railway.app
REDIS_URL=<Optional: Add Redis service if needed>
NODE_ENV=production
DRAW_REFUND=full
TURN_MS=20000
RESTRICTED_STATES=""
```

### Step 4: Railway Configuration
- Railway will automatically detect your Dockerfile
- PostgreSQL database will be provisioned automatically
- Your app will be available at `https://your-app.railway.app`

---

## 🌐 Vercel + PlanetScale (Alternative)

### Step 1: Database Setup (PlanetScale)
1. Sign up at [planetscale.com](https://planetscale.com)
2. Create database
3. Get connection string

### Step 2: Deploy to Vercel
1. Push to GitHub
2. Import project to [vercel.com](https://vercel.com)
3. Set environment variables
4. Deploy

---

## ☁️ Google Cloud Run (Advanced)

### Step 1: Setup
```bash
# Install Google Cloud CLI
# Build and push image
docker build -t gcr.io/YOUR_PROJECT_ID/ticx .
docker push gcr.io/YOUR_PROJECT_ID/ticx

# Deploy
gcloud run deploy ticx \
  --image gcr.io/YOUR_PROJECT_ID/ticx \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Step 2: Cloud SQL
1. Create PostgreSQL instance
2. Connect to Cloud Run
3. Set environment variables

---

## 📦 Docker + VPS (Self-hosted)

### Step 1: Get VPS
- DigitalOcean ($5/month)
- Linode ($5/month)
- AWS EC2 (Free tier)

### Step 2: Deploy
```bash
# On your VPS
git clone your-repo
cd ticx
docker-compose up -d

# Setup domain and SSL with Nginx/Caddy
```

---

## 🎯 Quick Start with Railway

1. **Create account**: Go to railway.app
2. **GitHub integration**: Connect your GitHub
3. **Push code**: Push this project to GitHub
4. **Deploy**: Import project in Railway
5. **Add database**: Add PostgreSQL service
6. **Set environment variables** (see above)
7. **Deploy**: Your app will be live!

## 🔧 Pre-deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Environment variables ready
- [ ] Database migration strategy
- [ ] Domain name (optional)
- [ ] SSL certificate (auto with Railway/Vercel)

## 💰 Cost Estimates

| Platform | Cost | Features |
|----------|------|----------|
| Railway | $5-20/month | PostgreSQL + App hosting |
| Vercel + PlanetScale | $0-29/month | Serverless + Database |
| Google Cloud | $10-50/month | Full control |
| VPS | $5-20/month | Complete control |

**Recommendation**: Start with Railway for easiest deployment!
