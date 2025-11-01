# 🔧 Setup Vercel GitHub Actions Deployment

## ❌ Current Error:
```
Error: Input required and not supplied: vercel-token
```

This happens because the GitHub Actions workflow needs Vercel secrets configured.

---

## ✅ Solution: Configure Vercel Secrets in GitHub

### Step 1: Get Vercel Tokens

1. **Go to Vercel:** https://vercel.com/account/tokens
2. **Create a new token:**
   - Name: `GitHub Actions - doorwin-craft`
   - Click **"Create"**
   - **Copy the token** (you won't see it again!)

3. **Get your Vercel Org ID:**
   - Go to: https://vercel.com/account
   - Copy your **Organization ID** (or check your Vercel dashboard URL)

4. **Get your Vercel Project ID:**
   - Deploy your project on Vercel first (see `DEPLOY_TO_VERCEL_NOW.md`)
   - After first deployment, go to: Project Settings → General
   - Copy the **Project ID**

---

### Step 2: Add Secrets to GitHub

1. **Go to your GitHub repository:**
   - https://github.com/SherifRosas/doorwin-craft

2. **Go to Settings → Secrets and variables → Actions**

3. **Click "New repository secret"** and add these 3 secrets:

   **Secret 1: `VERCEL_TOKEN`**
   - Name: `VERCEL_TOKEN`
   - Value: (paste your Vercel token from Step 1)
   - Click "Add secret"

   **Secret 2: `VERCEL_ORG_ID`**
   - Name: `VERCEL_ORG_ID`
   - Value: (paste your Vercel Organization ID)
   - Click "Add secret"

   **Secret 3: `VERCEL_PROJECT_ID`**
   - Name: `VERCEL_PROJECT_ID`
   - Value: (paste your Vercel Project ID - get this after first deployment)
   - Click "Add secret"

---

### Step 3: Deploy Manually First

**Before setting up auto-deployment, deploy manually once:**

1. Go to: https://vercel.com/sherifrosas-projects
2. Click **"Add New..."** → **"Project"**
3. Import: `doorwin-craft` repository
4. Configure environment variables
5. Click **"Deploy"**

After deployment, you'll get the **Project ID** from Project Settings.

---

### Step 4: Test Auto-Deployment

After adding all 3 secrets:

1. Make a small change and push to GitHub:
   ```powershell
   git commit --allow-empty -m "Test Vercel auto-deployment"
   git push origin main
   ```

2. Check GitHub Actions:
   - Go to: https://github.com/SherifRosas/doorwin-craft/actions
   - You should see the workflow running and deploying to Vercel! ✅

---

## 🎯 Quick Alternative: Skip Auto-Deployment for Now

If you don't want auto-deployment yet, the workflow is already configured to **skip** if secrets are missing.

You can:
- Deploy manually from Vercel dashboard (recommended for now)
- Set up secrets later when ready

The workflow will run but skip the Vercel deployment step if secrets aren't configured.

---

## 📝 Summary

**Current Status:**
- ✅ Workflow configured to skip if secrets missing (won't fail builds)
- ⏳ Add Vercel secrets to enable auto-deployment
- 🚀 Deploy manually from Vercel dashboard for now

**Next Steps:**
1. Deploy to Vercel manually first (get Project ID)
2. Add the 3 secrets to GitHub
3. Push to trigger auto-deployment

---

**Need help?** The workflow is now safe - it won't fail your builds if Vercel isn't configured yet!

