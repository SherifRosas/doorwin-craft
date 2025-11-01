# 🔧 Install Git on Windows - Quick Guide

Since Git is not installed, here are your options:

---

## Option 1: Install Git (Recommended)

### Step 1: Download Git
1. Go to: **https://git-scm.com/download/win**
2. Download the installer (it will auto-detect 64-bit or 32-bit)
3. Run the installer

### Step 2: Installation Settings
When installing, use these recommended settings:
- ✅ **Git Bash Here** (adds Git Bash to right-click menu)
- ✅ **Git GUI Here** (optional, for visual Git interface)
- ✅ **Use Visual Studio Code as Git's default editor** (if you have VS Code)
- ✅ **Use bundled OpenSSH**
- ✅ **Use the OpenSSL library**
- ✅ **Checkout Windows-style, commit Unix-style line endings**
- ✅ **Use MinTTY** (default terminal for Git Bash)

### Step 3: Verify Installation
After installation, **restart your terminal/PowerShell** and run:
```powershell
git --version
```

You should see something like: `git version 2.xx.x`

### Step 4: Configure Git (First Time)
```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## Option 2: Install GitHub Desktop (Easier GUI)

If you prefer a visual interface:

1. Go to: **https://desktop.github.com/**
2. Download GitHub Desktop
3. Install it
4. Sign in with your GitHub account
5. It includes Git automatically!

**Then:**
- Click "File" → "Add Local Repository"
- Select your `doorwindow-design` folder
- Click "Publish repository" to push to GitHub

---

## Option 3: Deploy Without Git (Vercel Direct Upload)

**If you don't want to install Git right now**, you can deploy directly:

### Using Vercel CLI (No Git needed!)

1. **Install Vercel CLI:**
   ```powershell
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```powershell
   vercel login
   ```

3. **Deploy directly:**
   ```powershell
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project? → **No**
   - Project name? → `doorwin-craft`
   - Directory? → `./` (current directory)
   - Override settings? → **No**

4. **Add environment variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add `DATABASE_URL` and `JWT_SECRET`

5. **Deploy again:**
   ```powershell
   vercel --prod
   ```

---

## Option 4: Deploy via Vercel Web Interface

1. Go to [vercel.com/sherifrosas-projects](https://vercel.com/sherifrosas-projects)
2. Click **"Add New..."** → **"Project"**
3. Instead of "Import Git Repository", look for **"Upload"** or **"Deploy"**
4. **Zip your project folder:**
   - Right-click `doorwindow-design` folder
   - Send to → Compressed (zipped) folder
5. **Upload the zip file** to Vercel
6. Vercel will extract and deploy!

**Note:** This method doesn't auto-update. You'll need to re-upload for updates.

---

## 🎯 Recommended Path

**Best Option:** Install Git → Use GitHub Desktop → Deploy to Vercel

**Fastest Option:** Use Vercel CLI (no Git needed)

**Easiest Option:** Install GitHub Desktop (GUI, no command line)

---

## ✅ After Git is Installed

Once Git is installed, come back and run:
```powershell
git add .
git commit -m "DoorWin Craft - Production Ready"
```

Then follow the `DEPLOY_TO_GITHUB_VERCEL.md` guide!

---

## 🆘 Need Help?

- **Git Installation Issues:** Check https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
- **GitHub Desktop:** https://desktop.github.com/
- **Vercel CLI Docs:** https://vercel.com/docs/cli


