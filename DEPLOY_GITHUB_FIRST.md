# 🚀 Deploy to GitHub First - Complete Guide

Deploy your code to GitHub, then connect Vercel to it.

---

## 📋 Step 1: Install Git (If Not Installed)

### Option A: Install Git Directly
1. Download: **https://git-scm.com/download/win**
2. Install with default settings
3. **Restart PowerShell** after installation

### Option B: Install GitHub Desktop (Easier - GUI)
1. Download: **https://desktop.github.com/**
2. Install and sign in with your GitHub account
3. Git is included automatically!

---

## 📦 Step 2: Prepare Your Code

### Check if Git is Installed:
```powershell
git --version
```

If you see a version number, Git is installed! ✅

### Initialize Git Repository:
```powershell
# Navigate to your project (if not already there)
cd C:\Users\Sherif-Rosas\AI-app_project\doorwindow-design

# Initialize Git
git init

# Add all files
git add .

# Create first commit
git commit -m "DoorWin Craft - Production Ready"
```

---

## 🌐 Step 3: Create GitHub Repository

### Option A: Via GitHub Website
1. Go to **https://github.com** and sign in
2. Click the **"+"** icon (top right) → **"New repository"**
3. Repository name: `doorwin-craft`
4. Description: "Professional Window & Door Design Platform"
5. Choose: **Public** (easier) or **Private**
6. **⚠️ DO NOT** check "Initialize with README" (you already have code)
7. Click **"Create repository"**

### Option B: Via GitHub Desktop
1. Open GitHub Desktop
2. Click **"File"** → **"New Repository"**
3. Name: `doorwin-craft`
4. Local path: `C:\Users\Sherif-Rosas\AI-app_project\doorwindow-design`
5. Check "Initialize this repository with a README" → **UNCHECK THIS**
6. Click **"Create Repository"**

---

## 🔗 Step 4: Connect and Push to GitHub

### Option A: Using Command Line

After creating the repo on GitHub, you'll see instructions. Run:

```powershell
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/doorwin-craft.git
git branch -M main
git push -u origin main
```

**If prompted for credentials:**
- Username: Your GitHub username
- Password: Use a **Personal Access Token** (not your password)
  - Create token: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  - Generate new token with `repo` scope
  - Use token as password

### Option B: Using GitHub Desktop

1. Click **"Publish repository"** button
2. Uncheck "Keep this code private" if you want it public
3. Click **"Publish repository"**
4. Done! ✅

---

## ✅ Step 5: Verify on GitHub

1. Go to: **https://github.com/YOUR_USERNAME/doorwin-craft**
2. You should see all your files
3. ✅ Repository is ready!

---

## 🚀 Step 6: Deploy to Vercel from GitHub

Now that your code is on GitHub, deploy to Vercel:

1. Go to: **https://vercel.com/sherifrosas-projects**
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select: **doorwin-craft** (your GitHub repo)
5. Click **"Import"**

### Configure Project:
- Framework: Next.js (auto-detected) ✅
- Root Directory: `./` (default)
- Build Command: `npm run build` (auto)
- Output Directory: `.next` (auto)
- Install Command: `npm install` (auto)

6. Click **"Deploy"**

---

## 🔑 Step 7: Add Environment Variables (Important!)

After first deployment:

1. Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add:

### DATABASE_URL
- Easiest: Use Vercel Postgres
  - Vercel Dashboard → Project → **Storage** → **Create Database** → **Postgres**
  - Vercel auto-creates `DATABASE_URL`
  - Copy it to Environment Variables

### JWT_SECRET
Generate it:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

3. Add both variables
4. Go to **Deployments** → Click **"..."** → **"Redeploy"**

---

## 🗄️ Step 8: Setup Database

After adding `DATABASE_URL`:

```powershell
# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy
npx prisma generate
```

---

## ✅ Success Checklist

- [ ] Git installed
- [ ] Git repository initialized
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Vercel connected to GitHub repo
- [ ] Deployment completed
- [ ] Environment variables added
- [ ] Database migrations run
- [ ] App working at vercel URL

---

## 🎉 Benefits of GitHub First

✅ **Automatic deployments** on every push  
✅ **Preview deployments** for pull requests  
✅ **Version control** - track all changes  
✅ **Collaboration** - easy to work with others  
✅ **Backup** - code safely stored on GitHub  

---

## 🔄 Making Updates

After setup, updating is easy:

```powershell
# Make your changes
# Then:
git add .
git commit -m "Your update description"
git push

# Vercel automatically deploys! 🚀
```

---

**Ready? Start with Step 1!** 🚀


