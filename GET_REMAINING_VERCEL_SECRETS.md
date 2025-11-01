# 🔑 Get Remaining Vercel Secrets

## ✅ Step 1: VERCEL_TOKEN - DONE!

---

## ⏳ Step 2: Get VERCEL_ORG_ID

1. **Go to:** https://vercel.com/account
2. **Look for:**
   - Your **Organization ID** (usually shown in settings or account info)
   - OR check the URL when you're in your organization dashboard
   - It's a string like: `team_xxxxx` or `org_xxxxx`

**Alternative:** 
- Go to your Vercel dashboard
- Check the browser URL - sometimes the org ID is in the path

---

## ⏳ Step 3: Get VERCEL_PROJECT_ID

You need to **deploy the project first** to get this.

### Option A: Deploy Now (Recommended)
1. **Go to:** https://vercel.com/sherifrosas-projects
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Find: **doorwin-craft**
5. Click **"Import"**
6. Add environment variables (from your `.env.local`)
7. Click **"Deploy"**
8. **After deployment:**
   - Go to **Project Settings** → **General**
   - Copy the **Project ID** (looks like: `prj_xxxxx`)

### Option B: Get from Existing Project
If you already deployed:
- Go to your project on Vercel
- **Settings** → **General** tab
- Scroll down to see **Project ID**

---

## 📝 Add to GitHub

1. **Go to:** https://github.com/SherifRosas/doorwin-craft/settings/secrets/actions

2. **Add VERCEL_ORG_ID:**
   - Click "New repository secret"
   - Name: `VERCEL_ORG_ID`
   - Value: (paste org ID)
   - Add secret

3. **Add VERCEL_PROJECT_ID:**
   - Click "New repository secret"
   - Name: `VERCEL_PROJECT_ID`
   - Value: (paste project ID)
   - Add secret

---

## ✅ After All 3 Secrets Are Added

Then you can:
1. Push the workflow fix to GitHub
2. GitHub Actions will automatically deploy to Vercel on every push!

---

## 🚀 Quick Deploy Path

**Easiest way:**
1. Deploy manually to Vercel (takes 2 minutes)
2. Get Project ID from project settings
3. Add both secrets to GitHub
4. Done! Auto-deployment enabled

---

**Next: Deploy to Vercel manually, then add the other 2 secrets!**

