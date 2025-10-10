# Add Firebase Environment Variables to Vercel
# Run this script after creating your Firebase web app and updating site/.env.production

param(
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

Write-Host "🔧 Firebase to Vercel Environment Variable Setup" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI not found!" -ForegroundColor Red
    Write-Host "Install with: npm install -g vercel" -ForegroundColor Yellow
    exit 1
}

# Check if .env.production exists
$envFile = "site\.env.production"
if (-not (Test-Path $envFile)) {
    Write-Host "❌ File not found: $envFile" -ForegroundColor Red
    Write-Host "Please create this file with your Firebase configuration first." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Found: $envFile" -ForegroundColor Green
Write-Host ""

# Read Firebase environment variables
$envContent = Get-Content $envFile
$firebaseVars = $envContent | Where-Object { 
    $_ -match '^NEXT_PUBLIC_FIREBASE_' -and $_ -match '=' 
}

if ($firebaseVars.Count -eq 0) {
    Write-Host "❌ No Firebase environment variables found in $envFile" -ForegroundColor Red
    Write-Host "Variables should start with: NEXT_PUBLIC_FIREBASE_" -ForegroundColor Yellow
    exit 1
}

Write-Host "📋 Found $($firebaseVars.Count) Firebase environment variable(s):" -ForegroundColor Cyan
Write-Host ""

# Parse and display variables
$parsedVars = @()
foreach ($line in $firebaseVars) {
    # Skip comments
    if ($line.Trim().StartsWith('#')) { continue }
    
    $parts = $line -split '=', 2
    if ($parts.Count -eq 2) {
        $key = $parts[0].Trim()
        $value = $parts[1].Trim()
        
        # Remove quotes if present
        $value = $value -replace '^["'']|["'']$', ''
        
        $parsedVars += @{
            Key = $key
            Value = $value
            Display = $value.Substring(0, [Math]::Min(20, $value.Length)) + "..."
        }
        
        Write-Host "  • $key = $($parsedVars[-1].Display)" -ForegroundColor White
    }
}

Write-Host ""

if ($parsedVars.Count -lt 6) {
    Write-Host "⚠️  Warning: Expected 6 Firebase variables, found $($parsedVars.Count)" -ForegroundColor Yellow
    Write-Host "Make sure you have all of these:" -ForegroundColor Yellow
    Write-Host "  • NEXT_PUBLIC_FIREBASE_API_KEY" -ForegroundColor Yellow
    Write-Host "  • NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" -ForegroundColor Yellow
    Write-Host "  • NEXT_PUBLIC_FIREBASE_PROJECT_ID" -ForegroundColor Yellow
    Write-Host "  • NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" -ForegroundColor Yellow
    Write-Host "  • NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" -ForegroundColor Yellow
    Write-Host "  • NEXT_PUBLIC_FIREBASE_APP_ID" -ForegroundColor Yellow
    Write-Host ""
    
    $continue = Read-Host "Continue anyway? (y/N)"
    if ($continue -ne 'y' -and $continue -ne 'Y') {
        Write-Host "Cancelled." -ForegroundColor Yellow
        exit 0
    }
}

if ($DryRun) {
    Write-Host "🔍 DRY RUN MODE - No changes will be made" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Would execute these commands:" -ForegroundColor Cyan
    foreach ($var in $parsedVars) {
        Write-Host "  vercel env add $($var.Key) production preview development" -ForegroundColor Gray
    }
    Write-Host ""
    Write-Host "Run without -DryRun to actually add variables to Vercel" -ForegroundColor Yellow
    exit 0
}

Write-Host "🚀 Adding variables to Vercel..." -ForegroundColor Cyan
Write-Host "   (Production + Preview + Development environments)" -ForegroundColor Gray
Write-Host ""

$successCount = 0
$failCount = 0

foreach ($var in $parsedVars) {
    Write-Host "Adding: $($var.Key)..." -ForegroundColor White
    
    try {
        # Add to all three environments
        $output = vercel env add $var.Key production --value $var.Value --yes 2>&1
        if ($LASTEXITCODE -eq 0) {
            $output = vercel env add $var.Key preview --value $var.Value --yes 2>&1
        }
        if ($LASTEXITCODE -eq 0) {
            $output = vercel env add $var.Key development --value $var.Value --yes 2>&1
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✅ Success" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "  ⚠️  Warning: $output" -ForegroundColor Yellow
            $failCount++
        }
    } catch {
        Write-Host "  ❌ Error: $_" -ForegroundColor Red
        $failCount++
    }
}

Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "✅ Complete: $successCount variables added" -ForegroundColor Green
if ($failCount -gt 0) {
    Write-Host "⚠️  Warnings/Errors: $failCount" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "📋 Verify your environment variables:" -ForegroundColor Cyan
Write-Host "   vercel env ls" -ForegroundColor Gray
Write-Host ""

Write-Host "🚀 Ready to deploy to production:" -ForegroundColor Cyan
Write-Host "   vercel --prod" -ForegroundColor Gray
Write-Host ""
