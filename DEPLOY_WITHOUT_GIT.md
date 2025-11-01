# 🚀 Deploy to Vercel WITHOUT Git

**No Git installed? No problem!** Deploy directly using Vercel CLI.

---

## Method 1: Vercel CLI (Recommended - No Git Required)

### Step 1: Install Vercel CLI

```powershell
npm install -g vercel
```

### Step 2: Login to Vercel

```powershell
vercel login
```

This will open your browser to authenticate.

### Step 3: Deploy Your Project

Navigate to your project folder and run:

```powershell
cd C:\Users\Sherif-Rosas\AI-app_project\doorwindow-design
vercel
```

**Follow the prompts:**
- Set up and deploy? → **Yes**
- Which scope? → Select your account
- Link to existing project? → **No**
- What's your project's name? → `doorwin-craft`
- In which directory is your code located? → `./` (press Enter)
- Want to override settings? → **No**

### Step 4: Add Environment Variables

1. Go to [vercel.com/sherifrosas-projects](https://vercel.com/sherifrosas-projects)
2. Click on your project (`doorwin-craft`)
3. Go to **Settings** → **Environment Variables**
4. Add these:

```env
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=generate-a-32-character-secret-key
```

**To get DATABASE_URL:**
- Use Vercel Postgres (easiest):
  1. Vercel Dashboard → Your Project → **Storage** tab
  2. Click **"Create Database"** → **"Postgres"**
  3. Copy the `DATABASE_URL` it creates

**Generate JWT_SECRET:**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Redeploy with Environment Variables

```powershell
vercel --prod
```

This deploys to production with your environment variables.

---

## Method 2: Vercel Web Upload (Alternative)

### Step 1: Create ZIP File

1. Right-click your project folder: `doorwindow-design`
2. **Send to** → **Compressed (zipped) folder**
3. This creates `doorwindow-design.zip`

### Step 2: Deploy to Vercel

1. Go to [vercel.com/sherifrosas-projects](https://vercel.com/sherifrosas-projects)
2. Click **"Add New..."** → **"Project"**
3. Look for **"Upload"** or **"Deploy"** option
4. Upload your ZIP file
5. Wait for extraction and deployment

**Note:** This method requires manual re-upload for updates.

---

## 🗄️ Setup Database

After deployment, setup your database:

### Using Vercel Postgres (Easiest):

1. Vercel Dashboard → Your Project → **Storage**
2. Click **"Create Database"** → **"Postgres"**
3. Database is auto-created
4. Copy `DATABASE_URL` to Environment Variables

### Run Migrations:

1. Install Vercel CLI (if not already):
   ```powershell
   npm install -g vercel
   ```

2. Pull environment variables:
   ```powershell
   vercel env pull .env.local
   ```

3. Run migrations:
   ```powershell
   npx prisma migrate deploy
   npx prisma generate
   ```

---

## ✅ Verify Deployment

1. **Check your deployment URL:**
   - Vercel Dashboard → Your Project → **Deployments**
   - Click on the latest deployment
   - Your URL: `doorwin-craft.vercel.app` (or similar)

2. **Test your app:**
   - Visit the URL
   - Test registration
   - Test designer (`/draw`)
   - Test 3D preview

---

## 🔄 Updating Your App (Without Git)

### Method 1: Vercel CLI

1. Make changes to your code
2. Run:
   ```powershell
   vercel --prod
   ```

### Method 2: Re-upload ZIP

1. Create new ZIP file
2. Upload via Vercel dashboard

**Note:** Installing Git later will make updates much easier!

---

## 📊 Next Steps

After successful deployment:

1. ✅ **Setup custom domain** (optional)
   - Vercel Dashboard → Settings → Domains

2. ✅ **Enable analytics** (optional)
   - Add Sentry DSN
   - Add PostHog key

3. ✅ **Test payment flows** (if using payments)
   - Use test cards from payment providers

---

## 🎉 Success!

Your app is now live at: `your-project.vercel.app`

**To make future updates easier, consider installing Git!**

---

## 🆘 Troubleshooting

### Vercel CLI not found
```powershell
# Install Node.js first: https://nodejs.org/
# Then install Vercel CLI:
npm install -g vercel
```

### Database connection errors
- Verify `DATABASE_URL` is correct
- Check database is publicly accessible
- Run migrations: `npx prisma migrate deploy`

### Build errors
- Check Vercel Dashboard → Deployments → Logs
- Verify all environment variables are set
- Check `package.json` dependencies

---

**You're deployed! No Git required! 🚀**


