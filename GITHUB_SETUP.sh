#!/bin/bash
# Quick setup script for GitHub deployment

echo "🚀 DoorWin Craft - GitHub Setup"
echo "================================"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first:"
    echo "   https://git-scm.com/downloads"
    exit 1
fi

echo "✅ Git is installed"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git repository already initialized"
fi

echo ""
echo "📝 Next steps:"
echo "1. Create a new repository on GitHub.com"
echo "2. Copy the repository URL"
echo "3. Run these commands:"
echo ""
echo "   git add ."
echo "   git commit -m 'DoorWin Craft - Production Ready'"
echo "   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. Then import to Vercel from GitHub"
echo ""


