@echo off
REM Complete GitHub Setup Script for Windows

echo.
echo ========================================
echo   DoorWin Craft - GitHub Setup
echo ========================================
echo.

REM Check if git is installed
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git is not installed!
    echo.
    echo Please install Git first:
    echo Option 1: Git for Windows
    echo   Download: https://git-scm.com/download/win
    echo.
    echo Option 2: GitHub Desktop (Easier)
    echo   Download: https://desktop.github.com/
    echo   (Includes Git automatically)
    echo.
    pause
    exit /b 1
)

echo [OK] Git is installed!
echo.

REM Check if git is initialized
if not exist .git (
    echo [INFO] Initializing Git repository...
    git init
    echo [OK] Git initialized
) else (
    echo [OK] Git repository already initialized
)

echo.
echo ========================================
echo   Next Steps:
echo ========================================
echo.
echo 1. Create GitHub Repository:
echo    - Go to: https://github.com
echo    - Click "+" icon (top right)
echo    - New repository
echo    - Name: doorwin-craft
echo    - Description: Professional Window & Door Design Platform
echo    - DO NOT check "Initialize with README"
echo    - Click "Create repository"
echo.
echo 2. Connect and Push:
echo    Run these commands (replace YOUR_USERNAME):
echo.
echo    git add .
echo    git commit -m "DoorWin Craft - Production Ready"
echo    git remote add origin https://github.com/YOUR_USERNAME/doorwin-craft.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. Deploy to Vercel:
echo    - Go to: https://vercel.com/sherifrosas-projects
echo    - Click "Add New..." → "Project"
echo    - Import Git Repository
echo    - Select: doorwin-craft
echo    - Deploy!
echo.
echo ========================================
echo.
pause


