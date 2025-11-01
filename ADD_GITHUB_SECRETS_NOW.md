# ✅ Add GitHub Secrets - Quick Steps

## 📋 What We Have:

✅ **VERCEL_TOKEN** - Already added
✅ **VERCEL_ORG_ID** - `sherifrosas-projects`

---

## 🎯 Step 1: Get Project ID

1. **Go to Vercel Dashboard:**
   - https://vercel.com/sherifrosas-projects

2. **Click on:** `doorwin-craft` project

3. **Go to:** **Settings** tab (top right)

4. **Click:** **General** (left sidebar)

5. **Scroll down** to find **"Project ID"**
   - It looks like: `prj_xxxxx` or just a long string
   - **Copy it**

---

## 🔐 Step 2: Add Secrets to GitHub

1. **Go to GitHub Secrets:**
   - https://github.com/SherifRosas/doorwin-craft/settings/secrets/actions

2. **Add VERCEL_ORG_ID:**
   - Click **"New repository secret"** button
   - Name: `VERCEL_ORG_ID`
   - Value: `sherifrosas-projects`
   - Click **"Add secret"**

3. **Add VERCEL_PROJECT_ID:**
   - Click **"New repository secret"** button again
   - Name: `VERCEL_PROJECT_ID`
   - Value: (paste the project ID from Step 1)
   - Click **"Add secret"**

---

## ✅ Step 3: Verify

You should now see **3 secrets**:
- ✅ `VERCEL_TOKEN`
- ✅ `VERCEL_ORG_ID`
- ✅ `VERCEL_PROJECT_ID`

---

## 🚀 Step 4: Test Auto-Deployment

After adding both secrets:

1. **Make a small commit** (or push again):
   ```powershell
   git commit --allow-empty -m "Test auto-deployment"
   git push origin main
   ```

2. **Check GitHub Actions:**
   - Go to: https://github.com/SherifRosas/doorwin-craft/actions
   - You should see "Vercel Deployment" workflow running
   - It will automatically deploy to Vercel! 🎉

3. **Check Vercel:**
   - Go to: https://vercel.com/sherifrosas-projects → doorwin-craft
   - **Deployments** tab → Should show new deployment from GitHub

---

## 📝 Summary

**What to do:**
1. Get Project ID from Vercel → Settings → General
2. Add both secrets to GitHub
3. Push to trigger auto-deployment

**Then:** Every push to `main` will auto-deploy! 🚀

---

**Start: Get your Project ID from Vercel Settings!**

