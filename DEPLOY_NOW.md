# 🚀 Quick Deployment Guide

## Option 1: Deploy to Vercel (Recommended - 5 minutes)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - DoorWin Craft"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click **"New Project"**
4. Import your repository
5. Configure:

   **Environment Variables:**
   ```
   DATABASE_URL=your-production-db-url
   JWT_SECRET=generate-strong-secret-here
   NEXT_PUBLIC_SENTRY_DSN=(optional)
   NEXT_PUBLIC_POSTHOG_KEY=(optional)
   STRIPE_SECRET_KEY=sk_live_...
   TAP_SECRET_KEY=(your-key)
   MOYASAR_SECRET_KEY=(your-key)
   ```

6. Click **"Deploy"**
7. Wait 2-3 minutes
8. Done! Get your URL (e.g., `your-app.vercel.app`)

### Step 3: Setup Database
```bash
# If using Vercel Postgres (recommended)
# Add Postgres from Vercel dashboard, then:
npx prisma migrate deploy
npx prisma generate
```

---

## Option 2: Deploy to Railway (10 minutes)

### Step 1: Push to GitHub (same as above)

### Step 2: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Railway auto-detects Next.js

### Step 3: Add Database
1. Click **"New"** → **"Database"** → **"PostgreSQL"**
2. Railway auto-creates `DATABASE_URL`

### Step 4: Add Environment Variables
In Railway dashboard, add:
- `JWT_SECRET`
- Payment gateway keys
- Analytics keys (optional)

### Step 5: Deploy
Railway auto-deploys on git push!

---

## Option 3: Manual Deployment (VPS/Server)

See full instructions in `DEPLOYMENT_GUIDE.md`

---

## 🔑 Required Environment Variables

### Required
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-32-character-secret-key
```

### Optional but Recommended
```env
NEXT_PUBLIC_SENTRY_DSN=https://...
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Payment Gateways (if using)
```env
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
TAP_SECRET_KEY=sk_live_...
MOYASAR_SECRET_KEY=sk_live_...
```

---

## ✅ Post-Deployment Checklist

- [ ] Visit your deployed URL
- [ ] Test registration/login
- [ ] Test designer functionality
- [ ] Test 3D preview
- [ ] Verify database connection
- [ ] Check Sentry (if configured)
- [ ] Test payment flow (with test cards)
- [ ] Set up custom domain (optional)

---

## 🐛 Troubleshooting

### Build Fails
- Check environment variables are set
- Verify database URL format
- Check build logs in deployment platform

### Database Connection Error
- Verify `DATABASE_URL` is correct
- Check database is accessible
- Run migrations: `npx prisma migrate deploy`

### 3D Preview Not Working
- Check browser console for errors
- Verify WebGL support
- Check if Three.js dependencies loaded

---

## 📞 Need Help?

- Check `DEPLOYMENT_GUIDE.md` for detailed instructions
- Review `PRODUCTION_CHECKLIST.md` before launch
- See `API_DOCUMENTATION.md` for API details

---

**Ready to deploy? Choose an option above and follow the steps!** 🚀


