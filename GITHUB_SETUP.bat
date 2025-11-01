@echo off
REM Quick setup script for GitHub deployment (Windows)

echo.
echo ========================================
echo   DoorWin Craft - GitHub Setup
echo ========================================
echo.

REM Check if git is installed
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git is not installed.
    echo Please install Git first: https://git-scm.com/downloads
    pause
    exit /b 1
)

echo [OK] Git is installed
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
echo 1. Create a new repository on GitHub.com
echo 2. Copy the repository URL
echo 3. Run these commands:
echo.
echo    git add .
echo    git commit -m "DoorWin Craft - Production Ready"
echo    git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 4. Then go to vercel.com and import from GitHub
echo.
pause


