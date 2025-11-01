# 🚀 Setup Auto-Deployment - Step by Step

## ✅ Step 1: Verify VERCEL_TOKEN (Already Done!)

You already have `VERCEL_TOKEN` in GitHub secrets. ✅

---

## 📋 Step 2: Get VERCEL_ORG_ID

1. **Go to:** https://vercel.com/account
2. **Look for your Organization/Team ID**
   - It might be in the URL or in your account settings
   - Usually looks like: `team_xxxxx` or `org_xxxxx` or just an ID string
3. **If you can't find it:**
   - Go to: https://vercel.com/settings/general
   - Check the URL or page content for your organization ID

**Alternative method:**
- In Vercel Dashboard, check the URL when viewing your projects
- Sometimes the org ID is in the path: `/orgs/YOUR_ORG_ID/`

---

## 📋 Step 3: Get VERCEL_PROJECT_ID

1. **Go to Vercel Dashboard:**
   - https://vercel.com/sherifrosas-projects
2. **Click on:** `doorwin-craft` project
3. **Go to:** **Settings** tab → **General** section
4. **Scroll down** to find **"Project ID"**
   - It looks like: `prj_xxxxx`
5. **Copy it**

---

## 🔐 Step 4: Add Secrets to GitHub

1. **Go to GitHub Secrets:**
   - https://github.com/SherifRosas/doorwin-craft/settings/secrets/actions

2. **Add VERCEL_ORG_ID:**
   - Click **"New repository secret"**
   - Name: `VERCEL_ORG_ID`
   - Value: (paste the org ID from Step 2)
   - Click **"Add secret"**

3. **Add VERCEL_PROJECT_ID:**
   - Click **"New repository secret"** again
   - Name: `VERCEL_PROJECT_ID`
   - Value: (paste the project ID from Step 3)
   - Click **"Add secret"**

---

## ✅ Step 5: Verify All Secrets

You should now have **3 secrets** in GitHub:
- ✅ `VERCEL_TOKEN`
- ✅ `VERCEL_ORG_ID`
- ✅ `VERCEL_PROJECT_ID`

---

## 🚀 Step 6: Test Auto-Deployment

1. **Make a small change** (or the fix is already pushed)
2. **Check GitHub Actions:**
   - Go to: https://github.com/SherifRosas/doorwin-craft/actions
   - You should see a workflow running
   - It will deploy to Vercel automatically!

3. **Check Vercel:**
   - Go to: https://vercel.com/sherifrosas-projects → doorwin-craft
   - **Deployments** tab → Should show new deployment

---

## 🎯 Current Status

- ✅ Code pushed to GitHub
- ✅ `VERCEL_TOKEN` added
- ⏳ Need: `VERCEL_ORG_ID`
- ⏳ Need: `VERCEL_PROJECT_ID`

---

## 💡 Can't Find IDs?

**If you can't find the IDs, let me know and I'll help you:**
1. Share a screenshot of your Vercel dashboard
2. Or we can use Vercel CLI to get them:
   ```powershell
   vercel projects ls
   vercel teams ls
   ```

---

**Let's start with Step 2 - Getting your Org ID! 🚀**

