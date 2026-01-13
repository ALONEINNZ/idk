#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 ExusCraft Deployment Setup');
console.log('================================');

// Create production environment file
const prodEnv = `NODE_ENV=production
JWT_SECRET=exuscraft_super_secure_jwt_secret_2026_gaming_${Date.now()}
MONGODB_URI=mongodb://localhost:27017/exuscraft
BASE_URL=https://your-app-name.onrender.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=ExusCraft <your-email@gmail.com>
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key`;

fs.writeFileSync('.env.production', prodEnv);
console.log('✅ Created .env.production file');

// Create deployment checklist
const checklist = `# 🚀 ExusCraft Deployment Checklist

## Copy these EXACT values to Render:

### Environment Variables (Copy & Paste):
\`\`\`
NODE_ENV=production
JWT_SECRET=exuscraft_super_secure_jwt_secret_2026_gaming_${Date.now()}
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/exuscraft
BASE_URL=https://your-app-name.onrender.com
\`\`\`

## Quick Steps:
1. ✅ Push to GitHub (git commands below)
2. ✅ Go to render.com → New Web Service
3. ✅ Connect GitHub repo
4. ✅ Copy environment variables above
5. ✅ Deploy!

## Git Commands (run these):
\`\`\`bash
git init
git add .
git commit -m "Deploy ExusCraft"
git remote add origin https://github.com/YOUR_USERNAME/exuscraft.git
git push -u origin main
\`\`\`

## MongoDB Atlas (Free):
1. Go to mongodb.com/atlas
2. Create free cluster
3. Get connection string
4. Replace MONGODB_URI above

Your app will be live in 10 minutes! 🎉
`;

fs.writeFileSync('DEPLOYMENT_CHECKLIST.md', checklist);
console.log('✅ Created DEPLOYMENT_CHECKLIST.md');

console.log('\n🎉 Setup Complete!');
console.log('📋 Check DEPLOYMENT_CHECKLIST.md for copy-paste values');
console.log('🚀 Your ExusCraft is ready to deploy!');