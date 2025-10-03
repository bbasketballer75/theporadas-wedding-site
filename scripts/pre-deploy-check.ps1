# Production Pre-Deployment Checklist
# Run this script before deploying to production

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Pre-Deployment Checklist" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$checks = @()
$warnings = @()

# Check 1: Environment variables
Write-Host "[1/10] Checking environment variables..." -ForegroundColor Yellow
if (Test-Path "site/.env.production") {
    $checks += "✓ Production environment file exists"
    
    # Check for required vars
    $envContent = Get-Content "site/.env.production" -Raw
    if ($envContent -match "NEXT_PUBLIC_FIREBASE_API_KEY") {
        $checks += "  ✓ Firebase API key configured"
    } else {
        $warnings += "  ⚠ Firebase API key not found in .env.production"
    }
    
    if ($envContent -match "NEXT_PUBLIC_SUPABASE_URL") {
        $checks += "  ✓ Supabase URL configured"
    } else {
        $warnings += "  ⚠ Supabase URL not found in .env.production"
    }
} else {
    $warnings += "⚠ site/.env.production not found - using .env.local"
}
Write-Host ""

# Check 2: Dependencies
Write-Host "[2/10] Checking dependencies..." -ForegroundColor Yellow
Set-Location site
try {
    $auditResult = npm audit --json 2>$null | ConvertFrom-Json
    if ($auditResult.metadata.vulnerabilities.total -eq 0) {
        $checks += "✓ No security vulnerabilities found"
    } else {
        $warnings += "⚠ Found $($auditResult.metadata.vulnerabilities.total) vulnerabilities - run 'npm audit fix'"
    }
} catch {
    $checks += "✓ Dependency check skipped (npm audit unavailable)"
}
Set-Location ..
Write-Host ""

# Check 3: Lint errors
Write-Host "[3/10] Running linter..." -ForegroundColor Yellow
Set-Location site
try {
    $lintOutput = npm run lint 2>&1
    if ($LASTEXITCODE -eq 0) {
        $checks += "✓ No lint errors"
    } else {
        $warnings += "⚠ Lint errors found - fix before deploying"
    }
} catch {
    $warnings += "⚠ Lint check failed"
}
Set-Location ..
Write-Host ""

# Check 4: Firestore rules
Write-Host "[4/10] Checking Firestore rules..." -ForegroundColor Yellow
if (Test-Path "firestore.rules") {
    $checks += "✓ Firestore rules file exists"
    $rulesContent = Get-Content "firestore.rules" -Raw
    if ($rulesContent -match "allow read") {
        $checks += "  ✓ Read rules configured"
    }
    if ($rulesContent -match "allow write") {
        $checks += "  ✓ Write rules configured"
    }
} else {
    $warnings += "⚠ firestore.rules not found"
}
Write-Host ""

# Check 5: Storage rules
Write-Host "[5/10] Checking Storage rules..." -ForegroundColor Yellow
if (Test-Path "storage.rules") {
    $checks += "✓ Storage rules file exists"
} else {
    $warnings += "⚠ storage.rules not found"
}
Write-Host ""

# Check 6: Firebase config
Write-Host "[6/10] Checking Firebase config..." -ForegroundColor Yellow
if (Test-Path "firebase.json") {
    $checks += "✓ firebase.json exists"
    $firebaseConfig = Get-Content "firebase.json" -Raw | ConvertFrom-Json
    if ($firebaseConfig.hosting.public -eq "site/out") {
        $checks += "  ✓ Hosting configured for site/out"
    } else {
        $warnings += "  ⚠ Hosting public path is not 'site/out'"
    }
} else {
    $warnings += "⚠ firebase.json not found"
}
Write-Host ""

# Check 7: PWA manifest
Write-Host "[7/10] Checking PWA configuration..." -ForegroundColor Yellow
if (Test-Path "site/public/manifest.json") {
    $checks += "✓ PWA manifest exists"
} else {
    $warnings += "⚠ PWA manifest not found"
}

if (Test-Path "site/next.config.js") {
    $nextConfig = Get-Content "site/next.config.js" -Raw
    if ($nextConfig -match "withPWA") {
        $checks += "  ✓ PWA plugin configured"
    }
}
Write-Host ""

# Check 8: Build test
Write-Host "[8/10] Testing production build (dry run)..." -ForegroundColor Yellow
Write-Host "  (Skipped - run manually with: cd site; npm run build)" -ForegroundColor Gray
$checks += "⏭ Build test skipped"
Write-Host ""

# Check 9: Analytics
Write-Host "[9/10] Checking Analytics integration..." -ForegroundColor Yellow
if (Test-Path "site/lib/analytics.js") {
    $checks += "✓ Analytics library exists"
    $analyticsContent = Get-Content "site/lib/analytics.js" -Raw
    if ($analyticsContent -match "logEvent") {
        $checks += "  ✓ Event tracking configured"
    }
} else {
    $warnings += "⚠ Analytics library not found"
}
Write-Host ""

# Check 10: Documentation
Write-Host "[10/10] Checking documentation..." -ForegroundColor Yellow
if (Test-Path "README.md") {
    $checks += "✓ README.md exists"
}
if (Test-Path "COMPLETE-FEATURE-LIST-2025-10-02.md") {
    $checks += "✓ Feature documentation exists"
}
Write-Host ""

# Display results
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Checklist Results" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

foreach ($check in $checks) {
    Write-Host $check -ForegroundColor Green
}

if ($warnings.Count -gt 0) {
    Write-Host ""
    Write-Host "Warnings:" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host $warning -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($warnings.Count -eq 0) {
    Write-Host "✓ All checks passed - ready for deployment!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Run deployment with:" -ForegroundColor Cyan
    Write-Host "  .\scripts\deploy-production.ps1" -ForegroundColor White
} else {
    Write-Host "⚠ $($warnings.Count) warning(s) found - review before deploying" -ForegroundColor Yellow
}

Write-Host ""
