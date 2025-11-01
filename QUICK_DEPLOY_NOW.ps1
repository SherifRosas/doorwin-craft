# Quick Deploy Script - No Git Required
# Run this in PowerShell to deploy directly to Vercel

Write-Host "🚀 DoorWin Craft - Quick Deploy to Vercel" -ForegroundColor Green
Write-Host "==========================================`n" -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found!" -ForegroundColor Red
    Write-Host "Please install Node.js first: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI installed: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "⏳ Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Vercel CLI installed!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install Vercel CLI" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n📋 Deployment Steps:" -ForegroundColor Yellow
Write-Host "1. Login to Vercel (will open browser)" -ForegroundColor White
Write-Host "2. Deploy your project" -ForegroundColor White
Write-Host "3. Add environment variables in Vercel dashboard`n" -ForegroundColor White

# Ask to proceed
$proceed = Read-Host "Ready to deploy? (Y/N)"
if ($proceed -ne 'Y' -and $proceed -ne 'y') {
    Write-Host "Deployment cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host "`n🔐 Logging in to Vercel..." -ForegroundColor Cyan
vercel login

Write-Host "`n🚀 Deploying to Vercel..." -ForegroundColor Cyan
Write-Host "(Follow the prompts - press Enter for defaults)`n" -ForegroundColor Gray

vercel --prod

Write-Host "`n✅ Deployment complete!" -ForegroundColor Green
Write-Host "`n📝 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Go to vercel.com/sherifrosas-projects" -ForegroundColor White
Write-Host "2. Click on your project" -ForegroundColor White
Write-Host "3. Settings → Environment Variables" -ForegroundColor White
Write-Host "4. Add DATABASE_URL and JWT_SECRET" -ForegroundColor White
Write-Host "5. Redeploy: vercel --prod`n" -ForegroundColor White


