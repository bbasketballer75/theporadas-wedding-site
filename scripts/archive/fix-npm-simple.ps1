# Simple npm fix - Run this with ALL VS Code windows closed
# Usage: Close VS Code, then run: .\fix-npm-simple.ps1

param([switch]$Force)

$ErrorActionPreference = "Continue"
$projectRoot = "D:\wedding-website\theporadas_wedding_site"

Write-Host "`n=== NPM NODE_MODULES FIX ===" -ForegroundColor Cyan
Write-Host "Project: $projectRoot`n" -ForegroundColor Gray

# Check for VS Code
$vscodeProcCount = (Get-Process | Where-Object { $_.ProcessName -like "*Code*" }).Count
if ($vscodeProcCount -gt 0 -and !$Force) {
    Write-Host "ERROR: $vscodeProcCount VS Code processes running!" -ForegroundColor Red
    Write-Host "Please CLOSE ALL VS Code windows first, then run again." -ForegroundColor Yellow
    Write-Host "`nOr run with -Force to kill them automatically:`n" -ForegroundColor Gray
    Write-Host "  .\fix-npm-simple.ps1 -Force" -ForegroundColor Cyan
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
Write-Host "[1/4] Removing package-lock.json..." -ForegroundColor Cyan
if (Test-Path "package-lock.json") {
    Remove-Item "package-lock.json" -Force
    Write-Host "  ✓ Deleted" -ForegroundColor Green
}
else {
    Write-Host "  - Not found" -ForegroundColor Gray
}

# Step 2: Take ownership of node_modules
Write-Host "`n[2/4] Taking ownership of node_modules..." -ForegroundColor Cyan
if (Test-Path "node_modules") {
    Write-Host "  Running takeown (this takes ~30 seconds)..." -ForegroundColor Gray
    takeown /F "node_modules" /R /D Y 2>&1 | Out-Null
    Write-Host "  Running icacls to grant permissions..." -ForegroundColor Gray
    icacls "node_modules" /grant "$env:USERNAME`:F" /T /C /Q 2>&1 | Out-Null
    Write-Host "  ✓ Ownership acquired" -ForegroundColor Green
}

# Step 3: Delete using robocopy trick
Write-Host "`n[3/4] Deleting node_modules (robocopy method)..." -ForegroundColor Cyan
if (Test-Path "node_modules") {
    $emptyDir = "empty_$(Get-Random)"
    New-Item -ItemType Directory -Path $emptyDir -Force | Out-Null
    
    Write-Host "  Mirroring empty directory..." -ForegroundColor Gray
    robocopy $emptyDir "node_modules" /MIR /R:0 /W:0 /NFL /NDL /NJH /NJS /NP 2>&1 | Out-Null
    
    Remove-Item $emptyDir -Force -Recurse
    Remove-Item "node_modules" -Force -Recurse -ErrorAction SilentlyContinue
    
    if (Test-Path "node_modules") {
        Write-Host "  ✗ Still exists (some files locked)" -ForegroundColor Red
    }
    else {
        Write-Host "  ✓ Deleted successfully" -ForegroundColor Green
    }
}

# Step 4: Fresh install
Write-Host "`n[4/4] Running npm install..." -ForegroundColor Cyan
Write-Host "  This will take 2-3 minutes...`n" -ForegroundColor Gray

npm install

$exitCode = $LASTEXITCODE

Write-Host "`n=== RESULT ===" -ForegroundColor Cyan
if ($exitCode -eq 0) {
    Write-Host "✓ SUCCESS: npm install completed" -ForegroundColor Green
    
    if (Test-Path "node_modules\theporadas-site") {
        Write-Host "✓ Workspace symlink created" -ForegroundColor Green
    }
    else {
        Write-Host "⚠ Workspace symlink missing" -ForegroundColor Yellow
    }
}
else {
    Write-Host "✗ FAILED: npm install returned exit code $exitCode" -ForegroundColor Red
    Write-Host "Check the error messages above" -ForegroundColor Gray
}

Write-Host "`nPress Enter to exit..."
Read-Host
