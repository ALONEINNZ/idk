# 🚀 ExusCraft Deployment Guide

## **Step 1: Create GitHub Repository**

1. **Go to GitHub.com** and create a new repository
2. **Name it**: `exuscraft-gaming-marketplace` (or whatever you prefer)
3. **Make it Public** (required for free hosting)
4. **Don't initialize** with README (we already have files)

## **Step 2: Push Your Code to GitHub**

Open Command Prompt in your project folder and run:

```bash
# Navigate to your project
cd game-shop

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your code
git commit -m "Initial ExusCraft deployment"

# Add your GitHub repository (replace with YOUR username and repo name)
git remote add origin https://github.com/YOUR_USERNAME/exuscraft-gaming-marketplace.git

# Push to GitHub
git push -u origin main
```

## **Step 3: Deploy on Render (FREE)**

1. **Go to [render.com](https://render.com)**
2. **Sign up** with your GitHub account
3. **Click "New +"** → **"Web Service"**
4. **Connect your GitHub repository**
5. **Configure the deployment:**
   - **Name**: `exuscraft`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

6. **Add Environment Variables:**
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `mongodb+srv://username:password@cluster.mongodb.net/gameshop`
   - `JWT_SECRET` = `your_secure_jwt_secret_here`
   - `BASE_URL` = `https://your-app-name.onrender.com`

7. **Click "Create Web Service"**

## **Step 4: Set Up MongoDB Atlas (FREE)**

1. **Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)**
2. **Create free account**
3. **Create a cluster** (choose free tier)
4. **Create database user**
5. **Get connection string** and add to Render environment variables

## **Step 5: Seed Your Database**

After deployment, you can seed your database by:
1. Going to your Render dashboard
2. Opening the **Shell** tab
3. Running:
   ```bash
   node seedGames.js
   node seedMods.js
   ```

## **🎉 Your App Will Be Live At:**
`https://your-app-name.onrender.com`

## **Alternative Free Hosting Options:**

### **Railway** (Easier setup)
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repo
3. Auto-deploys!

### **Vercel** (Good for static sites)
1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repo
3. Deploy!

## **Need Help?**
- Check Render logs for any deployment errors
- Make sure all environment variables are set
- Verify MongoDB connection string is correct

**Your ExusCraft gaming marketplace will be live and accessible worldwide! 🌍🎮**