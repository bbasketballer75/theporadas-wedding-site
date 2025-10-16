# Complete npm fix - Handles BOTH root and workspace node_modules
# Usage: Close VS Code, then run: .\fix-npm-complete.ps1 -Force

param([switch]$Force)

$ErrorActionPreference = "Continue"
$projectRoot = "D:\wedding-website\theporadas_wedding_site"

Write-Host "`n=== COMPLETE NPM FIX ===" -ForegroundColor Cyan
Write-Host "This fixes the workspace symlink issue on Windows`n" -ForegroundColor Gray

# Check for VS Code
$vscodeProcCount = (Get-Process | Where-Object { $_.ProcessName -like "*Code*" }).Count
if ($vscodeProcCount -gt 0 -and !$Force) {
    Write-Host "ERROR: $vscodeProcCount VS Code processes running!" -ForegroundColor Red
    Write-Host "Please CLOSE ALL VS Code windows first, then run again." -ForegroundColor Yellow
    Write-Host "`nOr run with -Force to kill them automatically:`n" -ForegroundColor Gray
    Write-Host "  .\fix-npm-complete.ps1 -Force" -ForegroundColor Cyan
    exit 1
}

if ($vscodeProcCount -gt 0 -and $Force) {
    Write-Host "Killing $vscodeProcCount VS Code processes..." -ForegroundColor Yellow
    Get-Process | Where-Object { $_.ProcessName -like "*Code*" } | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 3
    Write-Host "Done`n" -ForegroundColor Green
}

Set-Location $projectRoot

# Step 1: Delete package-lock.json
Write-Host "[1/5] Removing package-lock.json..." -ForegroundColor Cyan
if (Test-Path "package-lock.json") {
    Remove-Item "package-lock.json" -Force
    Write-Host "  ✓ Deleted" -ForegroundColor Green
}
else {
    Write-Host "  - Not found" -ForegroundColor Gray
}

# Step 2: Take ownership of BOTH node_modules
Write-Host "`n[2/5] Taking ownership of node_modules directories..." -ForegroundColor Cyan

if (Test-Path "node_modules") {
    Write-Host "  Taking ownership of ROOT node_modules..." -ForegroundColor Gray
    takeown /F "node_modules" /R /D Y 2>&1 | Out-Null
    icacls "node_modules" /grant "$env:USERNAME`:F" /T /C /Q 2>&1 | Out-Null
    Write-Host "  ✓ ROOT ownership acquired" -ForegroundColor Green
}

if (Test-Path "site\node_modules") {
    Write-Host "  Taking ownership of WORKSPACE site/node_modules..." -ForegroundColor Gray
    takeown /F "site\node_modules" /R /D Y 2>&1 | Out-Null
    icacls "site\node_modules" /grant "$env:USERNAME`:F" /T /C /Q 2>&1 | Out-Null
    Write-Host "  ✓ WORKSPACE ownership acquired" -ForegroundColor Green
}

# Step 3: Delete BOTH node_modules using robocopy
Write-Host "`n[3/5] Deleting node_modules (robocopy method)..." -ForegroundColor Cyan

# Delete ROOT node_modules
if (Test-Path "node_modules") {
    $emptyDir = "empty_$(Get-Random)"
    New-Item -ItemType Directory -Path $emptyDir -Force | Out-Null
    
    Write-Host "  Deleting ROOT node_modules..." -ForegroundColor Gray
    robocopy $emptyDir "node_modules" /MIR /R:0 /W:0 /NFL /NDL /NJH /NJS /NP 2>&1 | Out-Null
    
    Remove-Item $emptyDir -Force -Recurse
    Remove-Item "node_modules" -Force -Recurse -ErrorAction SilentlyContinue
    
    if (Test-Path "node_modules") {
        Write-Host "  ✗ ROOT still exists (partially locked)" -ForegroundColor Red
    }
    else {
        Write-Host "  ✓ ROOT deleted successfully" -ForegroundColor Green
    }
}

# Delete WORKSPACE node_modules
if (Test-Path "site\node_modules") {
    $emptyDir = "empty_$(Get-Random)"
    New-Item -ItemType Directory -Path $emptyDir -Force | Out-Null
    
    Write-Host "  Deleting WORKSPACE site/node_modules..." -ForegroundColor Gray
    robocopy $emptyDir "site\node_modules" /MIR /R:0 /W:0 /NFL /NDL /NJH /NJS /NP 2>&1 | Out-Null
    
    Remove-Item $emptyDir -Force -Recurse
    Remove-Item "site\node_modules" -Force -Recurse -ErrorAction SilentlyContinue
    
    if (Test-Path "site\node_modules") {
        Write-Host "  ✗ WORKSPACE still exists (partially locked)" -ForegroundColor Red
    }
    else {
        Write-Host "  ✓ WORKSPACE deleted successfully" -ForegroundColor Green
    }
}

# Step 4: Enable Windows Developer Mode for symlinks
Write-Host "`n[4/5] Enabling Developer Mode for symlinks..." -ForegroundColor Cyan
$devModeReg = "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock"
try {
    $current = Get-ItemProperty -Path $devModeReg -Name "AllowDevelopmentWithoutDevLicense" -ErrorAction SilentlyContinue
    if ($current -and $current.AllowDevelopmentWithoutDevLicense -eq 1) {
        Write-Host "  ✓ Developer Mode already enabled" -ForegroundColor Green
    }
    else {
        Write-Host "  Enabling Developer Mode (requires admin)..." -ForegroundColor Yellow
        Set-ItemProperty -Path $devModeReg -Name "AllowDevelopmentWithoutDevLicense" -Value 1 -Type DWord -ErrorAction Stop
        Write-Host "  ✓ Developer Mode enabled" -ForegroundColor Green
    }
}
catch {
    Write-Host "  ⚠ Could not enable Developer Mode (not admin?)" -ForegroundColor Yellow
    Write-Host "    Manually enable in Settings > Privacy & security > For developers" -ForegroundColor Gray
    Write-Host "    OR run this script as Administrator" -ForegroundColor Gray
}

# Step 5: Fresh install
Write-Host "`n[5/5] Running npm install..." -ForegroundColor Cyan
Write-Host "  This will take 2-3 minutes...`n" -ForegroundColor Gray

npm install

$exitCode = $LASTEXITCODE

Write-Host "`n=== RESULT ===" -ForegroundColor Cyan
if ($exitCode -eq 0) {
    Write-Host "✓ SUCCESS: npm install completed" -ForegroundColor Green
    
    if (Test-Path "node_modules\theporadas-site") {
        Write-Host "✓ Workspace symlink created successfully" -ForegroundColor Green
    }
    else {
        Write-Host "⚠ Workspace symlink still missing" -ForegroundColor Yellow
        Write-Host "  This is a Windows symlink permission issue" -ForegroundColor Gray
        Write-Host "  Workaround: npm will use junction/hardlinks instead" -ForegroundColor Gray
    }
    
    if (Test-Path "node_modules") {
        Write-Host "✓ node_modules exists" -ForegroundColor Green
    }
    if (Test-Path "package-lock.json") {
        Write-Host "✓ package-lock.json regenerated" -ForegroundColor Green
    }
}
else {
    Write-Host "✗ FAILED: npm install returned exit code $exitCode" -ForegroundColor Red
    Write-Host "Check the error messages above for details" -ForegroundColor Gray
}

Write-Host "`n=== TIP ===" -ForegroundColor Cyan
Write-Host "If symlink issue persists, try running PowerShell as Administrator" -ForegroundColor Gray
Write-Host "or manually enable Developer Mode in Windows Settings" -ForegroundColor Gray

Write-Host "`nPress Enter to exit..."
Read-Host
