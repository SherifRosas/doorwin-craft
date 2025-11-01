# 🚀 Deploy to Vercel - Final Steps

## ✅ Current Configuration:
- ✅ Repository: `SherifRosas/doorwin-craft`
- ✅ Branch: `main`
- ✅ Framework: `Next.js` (auto-detected)
- ✅ Project Name: `doorwin-craft`
- ✅ Root Directory: `./`

---

## ⚠️ IMPORTANT: Add Environment Variables

**Before clicking "Deploy", add your environment variables:**

### Step 1: Click "Environment Variables" (on the left sidebar or in settings)

### Step 2: Add these variables (from your `.env.local`):

**Required:**
- `DATABASE_URL` - Your database connection string
- `JWT_SECRET` - Your JWT secret key

**Optional (if using):**
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `TAP_SECRET_KEY` - Tap Payments secret key
- `MOYASAR_SECRET_KEY` - Moyasar secret key
- `POSTHOG_API_KEY` - PostHog analytics key
- `SENTRY_DSN` - Sentry error tracking DSN

**For each variable:**
1. Click "Add" or "+"
2. Enter the **name** (e.g., `DATABASE_URL`)
3. Enter the **value** (from your `.env.local`)
4. Select environment: **Production, Preview, Development** (or just Production)
5. Click "Save"

---

## 🚀 Step 3: Deploy

1. Click **"Deploy"** button
2. Wait 2-3 minutes
3. Your site will be live! 🎉

---

## 📋 After Deployment

### Get Your URLs:
- **Production URL:** `https://doorwin-craft.vercel.app` (or custom domain)
- **Preview URLs:** Created for each branch/PR

### Get Project ID (for GitHub Actions):
1. Go to **Project Settings** → **General**
2. Scroll down to see **Project ID** (looks like: `prj_xxxxx`)
3. Copy it

### Get Org ID (for GitHub Actions):
1. Go to: https://vercel.com/account
2. Find your **Organization ID**
3. Copy it

---

## ✅ Add Remaining GitHub Secrets

After getting IDs:

1. Go to: https://github.com/SherifRosas/doorwin-craft/settings/secrets/actions

2. Add `VERCEL_ORG_ID`:
   - Name: `VERCEL_ORG_ID`
   - Value: (paste org ID from step above)

3. Add `VERCEL_PROJECT_ID`:
   - Name: `VERCEL_PROJECT_ID`
   - Value: (paste project ID from project settings)

---

## 🎯 Summary

**Current:**
- ✅ Adding environment variables
- ⏳ Click "Deploy"
- ⏳ Get Project ID and Org ID
- ⏳ Add final 2 secrets to GitHub

**Then:** Auto-deployment will work on every push! 🚀

---

**Add environment variables first, then deploy!**

