# 🚀 Deploy to Vercel - Next Steps

## ✅ GitHub Push Complete!

Your code is now on GitHub:
**https://github.com/SherifRosas/doorwin-craft**

---

## 🚀 Deploy to Vercel (5 minutes)

### Step 1: Go to Vercel
Visit: **https://vercel.com/sherifrosas-projects**

### Step 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Search for: **doorwin-craft**
4. Click **"Import"**

### Step 3: Configure Project
Vercel will auto-detect:
- ✅ Framework: **Next.js**
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `.next`

**Add Environment Variables:**
Click "Environment Variables" and add:
- `DATABASE_URL` (from your `.env.local`)
- `JWT_SECRET` (from your `.env.local`)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (if using Stripe)
- Any other keys from `.env.local`

### Step 4: Deploy
Click **"Deploy"** → Wait 2-3 minutes → Done! 🎉

---

## 🔗 Your Live Site

After deployment, you'll get:
- **Production URL:** `https://doorwin-craft.vercel.app` (or custom domain)
- **Preview URLs:** for each commit

---

## 🔐 Security Reminder

**⚠️ Your GitHub token was shared publicly!**

**Rotate it immediately:**
1. Go to: https://github.com/settings/tokens
2. Revoke/Delete the token you used
3. Create a new one when needed (with `repo` + `workflow` scopes)

**Never share tokens in chat/messages again!**

---

## ✅ Deployment Checklist

Before deploying, make sure:
- [ ] `.env.local` has all required variables
- [ ] Database is set up (if using Prisma, run migrations)
- [ ] All API keys are valid
- [ ] Environment variables added to Vercel

---

**Ready? Go to Vercel and deploy! 🚀**

