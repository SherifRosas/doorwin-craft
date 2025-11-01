# 🚀 Vercel Deployment - Complete Guide

You're deploying! Follow these steps:

---

## 📋 Current Step: Project Name

**What to type:** `doorwin-craft`

Then press **Enter**

---

## 🔄 Complete Deployment Flow

After you enter the project name, Vercel will ask:

1. **What's the name of your existing project?**
   → Type: `doorwin-craft`
   → Press Enter

2. **In which directory is your code located?**
   → Type: `./` (or just press Enter - default is correct)

3. **Want to override the settings?**
   → Type: `No` (or press Enter)

4. **Deploy now?**
   → Type: `Yes` (or press Enter)

---

## ⏳ What Happens Next

1. **Vercel will:**
   - Install dependencies
   - Build your Next.js app
   - Deploy to production
   - Give you a URL (e.g., `doorwin-craft.vercel.app`)

2. **Deployment takes 2-3 minutes**

3. **You'll see:**
   ```
   ✅ Production: https://doorwin-craft.vercel.app
   ```

---

## 🔑 IMPORTANT: Add Environment Variables

**After deployment completes**, you MUST add environment variables:

### Step 1: Go to Vercel Dashboard
1. Open: https://vercel.com/sherifrosas-projects
2. Click on your project: **doorwin-craft**

### Step 2: Add Environment Variables
1. Click **"Settings"** tab
2. Click **"Environment Variables"**
3. Add these **two required variables**:

#### Variable 1: DATABASE_URL
```
Name: DATABASE_URL
Value: postgresql://user:password@host:5432/database
```

**How to get DATABASE_URL:**
- **Easiest:** Use Vercel Postgres
  1. In Vercel Dashboard → Your Project → **"Storage"** tab
  2. Click **"Create Database"** → **"Postgres"**
  3. Vercel auto-creates `DATABASE_URL`
  4. Copy it and paste as the value

- **Alternative:** Use external PostgreSQL
  - Railway: https://railway.app (free tier)
  - Supabase: https://supabase.com (free tier)
  - Neon: https://neon.tech (free tier)

#### Variable 2: JWT_SECRET
```
Name: JWT_SECRET
Value: [generate a 32+ character secret]
```

**Generate JWT_SECRET:**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as the value.

### Step 3: Redeploy
After adding environment variables:
1. Go to **"Deployments"** tab
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**
4. Or run: `vercel --prod`

---

## 🗄️ Setup Database (After Environment Variables)

Once `DATABASE_URL` is set, run migrations:

### Option 1: Using Vercel CLI

```powershell
# Pull environment variables locally
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy
npx prisma generate
```

### Option 2: Using Vercel Dashboard

1. Go to Vercel Dashboard → Your Project → **Storage** → **Postgres**
2. Click **"Data"** tab
3. Use the SQL editor to run migrations manually
4. Or use Prisma Studio: `npx prisma studio`

---

## ✅ Verify Deployment

### Test Your App:
1. **Visit your URL:** `https://doorwin-craft.vercel.app`
2. **Test Registration:**
   - Click "Register"
   - Create an account
   - Should redirect to dashboard
3. **Test Designer:**
   - Go to `/draw`
   - 3D preview should load
   - Try changing templates
4. **Test Database:**
   - Create a design
   - Save it
   - Should work if database is connected

### Check Logs (if issues):
1. Vercel Dashboard → Your Project → **"Deployments"**
2. Click on deployment → **"Logs"**
3. Check for errors

---

## 🐛 Common Issues & Solutions

### Issue: "Database connection error"
**Solution:**
- Verify `DATABASE_URL` is correct
- Check database is publicly accessible
- Run migrations: `npx prisma migrate deploy`

### Issue: "JWT_SECRET not found"
**Solution:**
- Add `JWT_SECRET` to Environment Variables
- Redeploy

### Issue: "Build failed"
**Solution:**
- Check Vercel Dashboard → Deployments → Logs
- Verify all dependencies in `package.json`
- Check environment variables are set

### Issue: "3D preview not working"
**Solution:**
- Check browser console for errors
- Verify WebGL is enabled
- Check if Three.js loaded

---

## 🎉 Success Indicators

✅ Deployment completes without errors  
✅ App loads at your URL  
✅ Registration works  
✅ Designer loads with 3D preview  
✅ Database operations work  
✅ No errors in console  

---

## 📊 Next Steps After Deployment

1. ✅ **Setup custom domain** (optional)
   - Vercel Dashboard → Settings → Domains

2. ✅ **Enable analytics** (optional)
   - Add `NEXT_PUBLIC_SENTRY_DSN`
   - Add `NEXT_PUBLIC_POSTHOG_KEY`

3. ✅ **Test payment flows** (if using)
   - Use test cards from payment providers

---

## 🆘 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Project Docs:** Check `DEPLOYMENT_GUIDE.md`
- **Issues?** Check deployment logs in Vercel dashboard

---

**You're almost there! Follow the steps above! 🚀**


