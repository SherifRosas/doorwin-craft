# 🚀 Step-by-Step Deployment Guide

Follow these steps to deploy DoorWin Craft to production.

---

## 📦 Step 1: Prepare Your Code

### Option A: If Git is Installed

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "DoorWin Craft - Production Ready"

# Create GitHub repository first, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Option B: If Git is NOT Installed

1. Install Git from [git-scm.com](https://git-scm.com/download/win)
2. Or use GitHub Desktop: [desktop.github.com](https://desktop.github.com/)
3. Then follow Option A above

### Option C: Direct Upload (Vercel Only)

You can deploy directly without Git:
1. Go to Vercel.com
2. Use "Deploy" → "Upload" option
3. Zip your project folder
4. Upload the zip file

---

## 🌐 Step 2: Choose Your Platform

### ⭐ Recommended: Vercel (Easiest)

**Why Vercel?**
- Built by Next.js team
- Zero configuration needed
- Free tier available
- Automatic HTTPS
- Global CDN

**Steps:**

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up** (use GitHub for easy integration)
3. **Click "New Project"**
4. **Import Repository**
   - If code is on GitHub: Select your repo
   - If not: Use "Upload" option
5. **Configure Project**
   - Framework: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (auto)
   - Output Directory: `.next` (auto)
6. **Add Environment Variables** (see Step 3 below)
7. **Click "Deploy"**
8. **Wait 2-3 minutes**
9. **Done!** Get your URL: `your-app.vercel.app`

---

### Alternative: Railway

**Why Railway?**
- Easy database setup
- Good for full-stack apps
- Free tier available

**Steps:**

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. **Add PostgreSQL Database:**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway auto-creates `DATABASE_URL`
6. Add environment variables (see Step 3)
7. Auto-deploys on git push

---

### Alternative: DigitalOcean App Platform

1. Go to DigitalOcean dashboard
2. Create → Apps → GitHub
3. Connect repository
4. Configure:
   - Build Command: `npm run build`
   - Run Command: `npm start`
   - Environment: Node.js 18+
5. Add environment variables
6. Deploy

---

## 🔑 Step 3: Set Environment Variables

Add these in your deployment platform's dashboard:

### Required Variables:

```env
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-super-secret-key-at-least-32-characters-long
```

**How to get DATABASE_URL:**
- **Vercel**: Add "Postgres" from Integrations tab
- **Railway**: Auto-creates when you add PostgreSQL database
- **DigitalOcean**: Create managed database, copy connection string

**How to generate JWT_SECRET:**
```bash
# Use this online: https://generate-secret.vercel.app/32
# Or in Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Optional (but Recommended):

```env
# Error Tracking
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Payment Gateways (if using):

```env
# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx

# Tap Payments
TAP_SECRET_KEY=sk_live_xxx

# Moyasar
MOYASAR_SECRET_KEY=sk_live_xxx
```

---

## 🗄️ Step 4: Setup Database

After deployment, run migrations:

### If using Vercel CLI:
```bash
npx vercel login
npx vercel link
npx vercel env pull .env.local

# Run migrations
npx prisma migrate deploy
npx prisma generate
```

### If using Railway/DigitalOcean:
```bash
# SSH into your deployment or use their CLI
npx prisma migrate deploy
npx prisma generate
```

### Or use Vercel Postgres Console:
1. Go to Vercel Dashboard
2. Your Project → Storage → Postgres
3. Click "Query" tab
4. Run Prisma migrations manually (from `prisma/migrations` folder)

---

## ✅ Step 5: Verify Deployment

1. **Visit your URL** (e.g., `your-app.vercel.app`)
2. **Test Registration:**
   - Create an account
   - Should redirect to dashboard
3. **Test Designer:**
   - Go to `/draw`
   - 3D preview should load
   - Try changing templates
4. **Test Database:**
   - Create a design
   - Save it
   - Should appear in dashboard
5. **Check Logs:**
   - Vercel: Dashboard → Deployments → Click deployment → Logs
   - Railway: Dashboard → View Logs

---

## 🔧 Step 6: Post-Deployment

### Setup Custom Domain (Optional):
1. **Vercel**: Settings → Domains → Add domain
2. **Railway**: Settings → Domains
3. Follow DNS instructions provided

### Enable Analytics (Recommended):
1. Add Sentry DSN
2. Add PostHog key
3. Restart deployment
4. Verify events in dashboards

### Test Payments:
1. Use test cards from payment providers
2. Verify webhooks are working
3. Test full payment flow

---

## 🐛 Troubleshooting

### Build Fails
**Issue**: Build error in logs
**Solution**: 
- Check environment variables are set
- Verify `DATABASE_URL` format
- Check `package.json` dependencies

### Database Connection Error
**Issue**: Cannot connect to database
**Solution**:
- Verify `DATABASE_URL` is correct
- Check database is publicly accessible
- Verify network settings

### 3D Preview Not Working
**Issue**: Blank 3D preview
**Solution**:
- Check browser console for errors
- Verify WebGL is enabled
- Check if Three.js loaded (Network tab)

### Page 404 Errors
**Issue**: Routes not found
**Solution**:
- Verify Next.js App Router structure
- Check if `src/app` directory exists
- Rebuild deployment

---

## 📊 Success Indicators

✅ Application loads at your URL  
✅ Registration works  
✅ Designer loads with 3D preview  
✅ Database connections work  
✅ No errors in console  
✅ Analytics tracking (if configured)  

---

## 🎉 You're Deployed!

Once all checks pass, your application is live!

**Next Steps:**
- Monitor error rates in Sentry
- Track user behavior in PostHog
- Review `PRODUCTION_CHECKLIST.md` for ongoing maintenance

---

## 📞 Need Help?

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Project Docs**: Check `DEPLOYMENT_GUIDE.md` for more details

---

**Ready? Let's deploy! 🚀**


