# 🚀 Quick Deploy to Railway (5 minutes)

Railway is the fastest way to deploy your TicX app. Here's how:

## Step 1: Push to GitHub ✅ COMPLETED
```bash
# ✅ Your TicX code is now successfully on GitHub!
# Repository: https://github.com/dyn-warrior/TicX
# Verify: git status shows "nothing to commit, working tree clean"
git log --oneline -1  # Shows latest commit pushed
```

## Step 2: Deploy to Railway
1. **Go to [railway.app](https://railway.app)**
2. **Sign up** with your GitHub account
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your TicX repository**
6. **Click "Deploy Now"**

## Step 3: Add Database
1. **In your Railway project, click "New Service"**
2. **Select "Database" → "PostgreSQL"**
3. **Railway will automatically provision it**

## Step 4: Set Environment Variables
Click on your app service, go to "Variables" tab, and add:

```
NEXTAUTH_SECRET=your-super-secret-key-change-this-to-something-random
NEXTAUTH_URL=https://your-app-name.railway.app
NODE_ENV=production
DRAW_REFUND=full
TURN_MS=20000
RESTRICTED_STATES=""
```

Railway automatically provides `DATABASE_URL` - you don't need to set it!

## Step 5: Deploy
- Railway will automatically deploy your app
- You'll get a URL like `https://your-app-name.railway.app`
- Share this URL with friends to play!

## 💰 Cost
- **Free tier**: Good for testing (500 hours/month)
- **Pro plan**: $5/month for unlimited usage

## 🎮 That's it!
Your TicX game is now live and others can play at your Railway URL!

## Troubleshooting
If deployment fails:
1. Check the build logs in Railway dashboard
2. Make sure all environment variables are set
3. Verify your code is pushed to GitHub

Need help? Check the full DEPLOYMENT.md guide!
