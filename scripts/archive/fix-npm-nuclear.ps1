# Nuclear npm fix for Windows file locks
# Run this with elevated PowerShell (Run as Administrator)

Write-Host "=== NUCLEAR NPM FIX ===" -ForegroundColor Cyan
Write-Host "This will FORCE-CLOSE VS Code and WIPE node_modules completely" -ForegroundColor Yellow
Write-Host ""

$projectRoot = "D:\wedding-website\theporadas_wedding_site"
Set-Location $projectRoot

# Step 1: Kill ALL VS Code processes
Write-Host "Step 1: Killing VS Code processes..." -ForegroundColor Cyan
$vscodeProcesses = Get-Process | Where-Object { $_.ProcessName -like "*Code*" }
if ($vscodeProcesses) {
    Write-Host "Found $($vscodeProcesses.Count) VS Code processes" -ForegroundColor Yellow
    $vscodeProcesses | ForEach-Object {
        Write-Host "  Killing: $($_.ProcessName) (PID: $($_.Id))" -ForegroundColor Gray
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 3
}
else {
    Write-Host "  No VS Code processes found" -ForegroundColor Green
}

# Step 2: Kill any node/npm processes
Write-Host "Step 2: Killing node/npm processes..." -ForegroundColor Cyan
$nodeProcesses = Get-Process | Where-Object { $_.ProcessName -like "*node*" -or $_.ProcessName -like "*npm*" }
if ($nodeProcesses) {
    Write-Host "Found $($nodeProcesses.Count) node/npm processes" -ForegroundColor Yellow
    $nodeProcesses | ForEach-Object {
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
}

# Step 3: Remove package-lock.json
Write-Host "Step 3: Removing package-lock.json..." -ForegroundColor Cyan
if (Test-Path "package-lock.json") {
    Remove-Item "package-lock.json" -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ Deleted package-lock.json" -ForegroundColor Green
}

# Step 4: Nuclear delete node_modules using robocopy trick
Write-Host "Step 4: Nuclear deletion of node_modules (robocopy method)..." -ForegroundColor Cyan
if (Test-Path "node_modules") {
    # Create empty directory
    $emptyDir = Join-Path $projectRoot "empty_temp_$(Get-Random)"
    New-Item -ItemType Directory -Path $emptyDir -Force | Out-Null
    
    Write-Host "  Running robocopy to mirror empty directory..." -ForegroundColor Gray
    # Mirror empty directory to node_modules (deletes everything)
    robocopy $emptyDir "node_modules" /MIR /R:0 /W:0 /NFL /NDL /NJH /NJS /NP | Out-Null
    
    # Clean up
    Remove-Item $emptyDir -Force -Recurse -ErrorAction SilentlyContinue
    Remove-Item "node_modules" -Force -Recurse -ErrorAction SilentlyContinue
    
    # Verify deletion
    if (Test-Path "node_modules") {
        Write-Host "  ✗ node_modules still exists, trying takeown..." -ForegroundColor Red
        takeown /F "node_modules" /R /D Y | Out-Null
        icacls "node_modules" /grant "$env:USERNAME`:F" /T /C /Q | Out-Null
        Remove-Item "node_modules" -Force -Recurse -ErrorAction Stop
    }
    
    Write-Host "  ✓ node_modules deleted" -ForegroundColor Green
}
else {
    Write-Host "  ✓ node_modules doesn't exist" -ForegroundColor Green
}

# Step 5: Enable Developer Mode for symlinks (optional but helpful)
Write-Host "Step 5: Checking Windows Developer Mode..." -ForegroundColor Cyan
$devModeReg = Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock" -ErrorAction SilentlyContinue
if ($devModeReg -and $devModeReg.AllowDevelopmentWithoutDevLicense -eq 1) {
    Write-Host "  ✓ Developer Mode is ENABLED (good for symlinks)" -ForegroundColor Green
}
else {
    Write-Host "  ⚠ Developer Mode is DISABLED" -ForegroundColor Yellow
    Write-Host "    Consider enabling it in Settings > Privacy & security > For developers" -ForegroundColor Gray
    Write-Host "    This helps with npm workspace symlinks on Windows" -ForegroundColor Gray
}

# Step 6: Fresh npm install
Write-Host "Step 6: Running fresh npm install..." -ForegroundColor Cyan
npm install --loglevel=error
$installExitCode = $LASTEXITCODE

if ($installExitCode -eq 0) {
    Write-Host "  ✓ npm install completed successfully" -ForegroundColor Green
}
else {
    Write-Host "  ✗ npm install failed with exit code $installExitCode" -ForegroundColor Red
    Write-Host "    Check the log file for details" -ForegroundColor Gray
}

# Step 7: Verify installation
Write-Host ""
Write-Host "=== VERIFICATION ===" -ForegroundColor Cyan
if (Test-Path "node_modules") {
    Write-Host "✓ node_modules exists" -ForegroundColor Green
}
else {
    Write-Host "✗ node_modules missing" -ForegroundColor Red
}

if (Test-Path "package-lock.json") {
    Write-Host "✓ package-lock.json exists" -ForegroundColor Green
}
else {
    Write-Host "✗ package-lock.json missing" -ForegroundColor Red
}

if (Test-Path "node_modules\theporadas-site") {
    Write-Host "✓ Workspace symlink created" -ForegroundColor Green
}
else {
    Write-Host "⚠ Workspace symlink missing (this might cause issues)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== DONE ===" -ForegroundColor Cyan
Write-Host "You can now reopen VS Code" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to exit"
