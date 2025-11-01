# 🚀 Deploy to GitHub + Vercel - Step by Step

Since you have GitHub and Vercel accounts ready, let's deploy!

---

## 📋 Step 1: Prepare Your Code for GitHub

### Initialize Git (if not done)

Open terminal in your project folder and run:

```bash
# Check if git is initialized
git status

# If not initialized, run:
git init
git add .
git commit -m "DoorWin Craft - Production Ready"
```

### Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon (top right) → **"New repository"**
3. Repository name: `doorwin-craft` (or your choice)
4. Description: "Professional Window & Door Design Platform"
5. Make it **Public** (easier for Vercel) or **Private**
6. **Don't** check "Initialize with README" (you already have code)
7. Click **"Create repository"**

### Push Code to GitHub

After creating the repo, GitHub will show you commands. Run these:

```bash
# Connect to your GitHub repo (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

**Or if you prefer SSH:**
```bash
git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## 🚀 Step 2: Deploy to Vercel

### Option A: Import from GitHub (Recommended)

1. Go to [vercel.com/sherifrosas-projects](https://vercel.com/sherifrosas-projects)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository (`doorwin-craft`)
5. Click **"Import"**

### Configure Project

Vercel will auto-detect Next.js. You'll see:

**Framework Preset:** Next.js ✅ (auto-detected)

**Root Directory:** `./` (default - leave as is)

**Build Settings:**
- Build Command: `npm run build` (auto)
- Output Directory: `.next` (auto)
- Install Command: `npm install` (auto)

**Click "Deploy"** - Wait for it to finish (may take 2-3 minutes)

---

## 🔑 Step 3: Add Environment Variables

**Important:** Before the app works, you need to set environment variables.

1. In Vercel Dashboard → Your Project → **"Settings"** → **"Environment Variables"**
2. Add these variables:

### Required Variables:

```env
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-32-character-secret-key-here
```

**How to get DATABASE_URL:**
- **Option 1:** Use Vercel Postgres (easiest)
  1. In Vercel Dashboard → Your Project → **"Storage"** tab
  2. Click **"Create Database"** → **"Postgres"**
  3. Vercel will auto-create `DATABASE_URL`
  4. Copy it to Environment Variables

- **Option 2:** Use external PostgreSQL
  - Railway: Free tier available at [railway.app](https://railway.app)
  - Supabase: Free tier at [supabase.com](https://supabase.com)
  - Neon: Free tier at [neon.tech](https://neon.tech)

**Generate JWT_SECRET:**
```bash
# In terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use online: https://generate-secret.vercel.app/32
```

### Optional (Add Later):

```env
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

---

## 🗄️ Step 4: Setup Database

After adding `DATABASE_URL`, run migrations:

### Using Vercel CLI (Recommended):

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy
npx prisma generate
```

### Or Using Vercel Dashboard:

1. Go to Vercel Dashboard → Your Project
2. Click **"Storage"** → **"Postgres"** (if using Vercel Postgres)
3. Click **"Data"** tab
4. You can run SQL directly here, or use Prisma Studio:
   ```bash
   npx prisma studio
   ```

---

## ✅ Step 5: Verify Deployment

1. **Visit your deployment URL:**
   - Vercel gives you: `your-project.vercel.app`
   - Check Vercel Dashboard → Your Project → **"Deployments"**

2. **Test the app:**
   - Home page loads ✅
   - Registration works ✅
   - Designer loads (`/draw`) ✅
   - 3D preview works ✅
   - Database connection works ✅

3. **Check logs if issues:**
   - Vercel Dashboard → Your Project → **"Deployments"** → Click deployment → **"Logs"**

---

## 🔄 Step 6: Auto-Deployments

Vercel automatically:
- ✅ Deploys on every `git push`
- ✅ Creates preview deployments for pull requests
- ✅ Runs builds automatically

**To update your app:**
1. Make changes locally
2. `git add .`
3. `git commit -m "Your changes"`
4. `git push`
5. Vercel automatically deploys! 🚀

---

## 🎯 Quick Command Reference

```bash
# Initialize Git
git init
git add .
git commit -m "Initial commit"

# Connect to GitHub
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin main

# Deploy to Vercel (via CLI)
vercel

# Run database migrations
npx prisma migrate deploy
```

---

## 🐛 Troubleshooting

### Build Fails on Vercel
- **Check:** Environment variables are set
- **Check:** `DATABASE_URL` format is correct
- **Check:** Build logs in Vercel dashboard

### Database Connection Error
- **Verify:** `DATABASE_URL` is correct
- **Check:** Database is publicly accessible
- **Verify:** Database exists and is running

### 3D Preview Not Working
- **Check:** Browser console for errors
- **Verify:** WebGL is enabled in browser
- **Check:** Three.js dependencies loaded

---

## 📚 Need More Help?

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **GitHub Docs:** [docs.github.com](https://docs.github.com)
- **Project Docs:** See `DEPLOYMENT_GUIDE.md`

---

## 🎉 Success!

Once deployed, your app will be live at:
- **Production:** `your-project.vercel.app`
- **Custom Domain:** Add in Vercel Settings → Domains

**Your DoorWin Craft app is now live! 🚀**


