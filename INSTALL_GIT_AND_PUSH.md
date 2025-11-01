# 🔧 Install Git & Push to GitHub - Complete Steps

Git is not installed. Here's how to install it and push your code.

---

## 🚀 Quick Install: GitHub Desktop (EASIEST - Recommended)

### Why GitHub Desktop?
- ✅ Includes Git automatically
- ✅ Visual interface (no command line needed)
- ✅ Easy to use
- ✅ Built by GitHub

### Steps:

1. **Download:** https://desktop.github.com/
2. **Install** GitHub Desktop
3. **Sign in** with your GitHub account
4. **Add your repository:**
   - Click "File" → "Add Local Repository"
   - Browse to: `C:\Users\Sherif-Rosas\AI-app_project\doorwindow-design`
   - Click "Add Repository"
5. **Publish to GitHub:**
   - Click "Publish repository" button (top right)
   - Repository name: `doorwin-craft` ✅
   - Description: "Professional Window & Door Design Platform"
   - Uncheck "Keep this code private" (if you want it public)
   - Click "Publish Repository"
6. **Done!** Your code is on GitHub! 🎉

---

## 📥 Alternative: Install Git for Windows

If you prefer command line:

### Step 1: Download & Install
1. Go to: **https://git-scm.com/download/win**
2. Download the installer
3. Run installer
4. **Important settings during install:**
   - ✅ Git Bash Here
   - ✅ Git GUI Here  
   - ✅ Use Visual Studio Code as default editor (if you have VS Code)
   - ✅ Use bundled OpenSSH
   - ✅ Checkout Windows-style, commit Unix-style line endings
   - ✅ Use MinTTY (default terminal)

### Step 2: Restart PowerShell
**After installation, close and reopen PowerShell!**

### Step 3: Verify Installation
```powershell
git --version
```
You should see: `git version 2.xx.x`

### Step 4: Configure Git (First Time)
```powershell
git config --global user.name "SherifRosas"
git config --global user.email "your-email@example.com"
```
(Replace with your actual email)

### Step 5: Push Your Code
```powershell
# Navigate to your project (if not already there)
cd C:\Users\Sherif-Rosas\AI-app_project\doorwindow-design

# Initialize Git
git init

# Add all files
git add .

# Create first commit
git commit -m "DoorWin Craft - Production Ready"

# Connect to GitHub
git remote add origin https://github.com/SherifRosas/doorwin-craft.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

**When prompted for credentials:**
- Username: `SherifRosas`
- Password: Use **Personal Access Token** (not your password)
  - Create token: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  - Generate with `repo` scope
  - Copy the token and use it as password

---

## ✅ Verify Code is on GitHub

After pushing, visit:
**https://github.com/SherifRosas/doorwin-craft**

You should see all your files! ✅

---

## 🚀 Next: Deploy to Vercel

Once code is on GitHub:

1. Go to: **https://vercel.com/sherifrosas-projects**
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Search for: **doorwin-craft**
5. Click **"Import"**
6. Click **"Deploy"**

---

## 🎯 Which Method Should You Choose?

- **GitHub Desktop** → If you want the easiest way (GUI, visual interface)
- **Git for Windows** → If you prefer command line or need Git for other projects

**Recommendation:** Use **GitHub Desktop** for simplicity! 🎉

---

## 🆘 Troubleshooting

### "Git not recognized" after installing
- **Solution:** Restart PowerShell completely (close and reopen)

### Authentication failed when pushing
- **Solution:** Use Personal Access Token, not password
- Create token: GitHub → Settings → Developer settings → Personal access tokens

### "Repository already exists"
- **Solution:** The remote is already added. Just run:
  ```powershell
  git push -u origin main
  ```

---

**Start with GitHub Desktop - it's the easiest! 🚀**


