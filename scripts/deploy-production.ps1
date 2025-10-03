# Production Deployment Script for The Poradas Wedding Site
# This script builds the Next.js app and deploys to Firebase Hosting

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  The Poradas Wedding - Production Deploy" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "site/package.json")) {
    Write-Host "Error: Must run from project root directory" -ForegroundColor Red
    exit 1
}

# Step 1: Run production build
Write-Host "[1/5] Building Next.js production bundle..." -ForegroundColor Yellow
Set-Location site

try {
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed"
    }
} catch {
    Write-Host "Error: Production build failed" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host "✓ Build complete" -ForegroundColor Green
Write-Host ""

# Step 2: Export static files
Write-Host "[2/5] Exporting static files..." -ForegroundColor Yellow
try {
    npx next export
    if ($LASTEXITCODE -ne 0) {
        throw "Export failed"
    }
} catch {
    Write-Host "Error: Static export failed" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host "✓ Export complete (out/ directory created)" -ForegroundColor Green
Write-Host ""

# Step 3: Verify output
Write-Host "[3/5] Verifying output files..." -ForegroundColor Yellow
if (-not (Test-Path "out/index.html")) {
    Write-Host "Error: index.html not found in out/" -ForegroundColor Red
    Set-Location ..
    exit 1
}

$fileCount = (Get-ChildItem -Path "out" -Recurse -File).Count
Write-Host "✓ Found $fileCount files in out/" -ForegroundColor Green
Write-Host ""

Set-Location ..

# Step 4: Deploy to Firebase Hosting
Write-Host "[4/5] Deploying to Firebase Hosting..." -ForegroundColor Yellow
Write-Host "This will deploy to: https://theporadas.web.app" -ForegroundColor Cyan
Write-Host ""

$confirm = Read-Host "Continue with deployment? (y/n)"
if ($confirm -ne "y") {
    Write-Host "Deployment cancelled" -ForegroundColor Yellow
    exit 0
}

try {
    firebase deploy --only hosting
    if ($LASTEXITCODE -ne 0) {
        throw "Deployment failed"
    }
} catch {
    Write-Host "Error: Firebase deployment failed" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Deployment complete" -ForegroundColor Green
Write-Host ""

# Step 5: Display results
Write-Host "[5/5] Deployment Summary" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ Production build: Complete" -ForegroundColor Green
Write-Host "✓ Static export: Complete" -ForegroundColor Green
Write-Host "✓ Firebase deploy: Complete" -ForegroundColor Green
Write-Host ""
Write-Host "Your site is now live at:" -ForegroundColor Cyan
Write-Host "  https://theporadas.web.app" -ForegroundColor White
Write-Host "  https://theporadas.firebaseapp.com" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Test all features in production" -ForegroundColor White
Write-Host "  2. Verify PWA installation (add to homescreen)" -ForegroundColor White
Write-Host "  3. Check Firebase Analytics dashboard" -ForegroundColor White
Write-Host "  4. Configure custom domain (if needed)" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
