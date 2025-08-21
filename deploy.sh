#!/bin/bash

# TicX Deployment Script
# This script helps deploy TicX to various platforms

echo "🎮 TicX Deployment Helper"
echo "========================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Initializing..."
    git init
    git add .
    git commit -m "Initial commit"
    echo "✅ Git initialized"
fi

echo ""
echo "Choose deployment platform:"
echo "1) Railway (Recommended - Easiest)"
echo "2) Vercel + Database"
echo "3) Digital Ocean / VPS"
echo "4) Google Cloud Run"
echo "5) Just push to GitHub"

read -p "Enter choice (1-5): " choice

case $choice in
    1)
        echo "🚂 Railway Deployment"
        echo "1. Go to https://railway.app"
        echo "2. Sign up and connect GitHub"
        echo "3. Import this repository"
        echo "4. Add PostgreSQL database"
        echo "5. Set environment variables (see DEPLOYMENT.md)"
        echo "6. Deploy!"
        ;;
    2)
        echo "▲ Vercel Deployment"
        echo "1. Go to https://vercel.com"
        echo "2. Import this repository"
        echo "3. Set up database (PlanetScale recommended)"
        echo "4. Set environment variables"
        echo "5. Deploy!"
        ;;
    3)
        echo "🌊 VPS Deployment"
        echo "1. Get a VPS (DigitalOcean, Linode, etc.)"
        echo "2. Install Docker and Docker Compose"
        echo "3. Clone this repository"
        echo "4. Copy env.production.example to .env.production"
        echo "5. Fill in environment variables"
        echo "6. Run: docker-compose -f docker-compose.prod.yml up -d"
        ;;
    4)
        echo "☁️ Google Cloud Run"
        echo "1. Install Google Cloud CLI"
        echo "2. Set up Cloud SQL (PostgreSQL)"
        echo "3. Build and push Docker image"
        echo "4. Deploy to Cloud Run"
        echo "See DEPLOYMENT.md for detailed steps"
        ;;
    5)
        echo "📦 Pushing to GitHub..."
        git add .
        git commit -m "Ready for deployment"
        echo "✅ Committed changes"
        echo "Now push to GitHub and use any platform above"
        ;;
    *)
        echo "❌ Invalid choice"
        ;;
esac

echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo "🎮 Good luck with your TicX deployment!"
