# 🚀 Push Code to GitHub Repository

Your repository is ready: **https://github.com/SherifRosas/doorwin-craft.git**

Now let's push your code!

---

## ✅ Step 1: Check Git Status

Run in PowerShell:
```powershell
git status
```

---

## 📦 Step 2: Initialize Git (If Not Done)

If Git is not initialized:
```powershell
git init
git add .
git commit -m "DoorWin Craft - Production Ready"
```

---

## 🔗 Step 3: Connect to GitHub

```powershell
git remote add origin https://github.com/SherifRosas/doorwin-craft.git
```

---

## 🚀 Step 4: Push to GitHub

```powershell
git branch -M main
git push -u origin main
```

**If prompted for credentials:**
- Username: `SherifRosas`
- Password: Use a **Personal Access Token** (not your password)
  - Create: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  - Generate with `repo` scope
  - Copy and use as password

---

## ✅ Step 5: Verify

Go to: **https://github.com/SherifRosas/doorwin-craft**

You should see all your files! ✅

---

## 🚀 Step 6: Deploy to Vercel from GitHub

1. Go to: **https://vercel.com/sherifrosas-projects**
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Search for: **doorwin-craft**
5. Click **"Import"**
6. Click **"Deploy"**

---

## 🔑 Step 7: Add Environment Variables

After deployment:
1. Vercel Dashboard → Project → **Settings** → **Environment Variables**
2. Add:
   - `DATABASE_URL` (use Vercel Postgres)
   - `JWT_SECRET` (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
3. Redeploy

---

## 🎉 Success!

Your code is on GitHub and deployed to Vercel! 🚀


