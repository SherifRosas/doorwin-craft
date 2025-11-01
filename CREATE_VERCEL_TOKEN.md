# 🔑 Create Vercel Token - Step by Step

## Current Step: Select Scope

You're on the token creation page. Here's what to select:

### 1. **Token Name** ✅
- Already set: `GitHub Actions - doorwin-craft`
- This is perfect!

### 2. **SCOPE** ⚠️ IMPORTANT
Click "Select Scope" and choose:
- **✅ Full Account** (or "Full Access" if available)
  - This allows deployment to all projects
  
OR if you see individual scopes:
- ✅ **Deployments** (read & write)
- ✅ **Project** (read & write)

**Choose the highest level of access available** - usually "Full Account" or "Full Access"

### 3. **EXPIRATION** (Optional)
- **Recommended:** Set to 1 year or "No expiration" if you plan to keep using it
- Or leave blank for no expiration

### 4. **Click "Create Token"**

---

## 📋 After Creating Token

1. **⚠️ IMPORTANT:** Copy the token immediately!
   - You'll only see it once
   - It looks like: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Save it somewhere safe (password manager, notes app)

2. **Add to GitHub Secrets:**
   - Go to: https://github.com/SherifRosas/doorwin-craft/settings/secrets/actions
   - Click "New repository secret"
   - Name: `VERCEL_TOKEN`
   - Value: (paste the token you just copied)
   - Click "Add secret"

---

## ✅ Complete Setup Checklist

After creating the token, you still need:

1. ✅ Vercel Token → Add as `VERCEL_TOKEN` in GitHub
2. ⏳ Vercel Org ID → Get from https://vercel.com/account → Add as `VERCEL_ORG_ID`
3. ⏳ Vercel Project ID → Get after first deployment → Add as `VERCEL_PROJECT_ID`

**Note:** You can deploy manually first, then get the Project ID from project settings!

---

## 🚀 Quick Path: Deploy Manually First

**Easier approach:**
1. Deploy manually from Vercel dashboard (no token needed)
2. After deployment, get Project ID from project settings
3. Then create token and set up auto-deployment

**Which is faster?** Manual deployment is instant!

---

**Ready? Click "Create Token" and copy it! 🔑**

