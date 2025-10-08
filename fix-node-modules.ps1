# Fix Node Modules - Nuclear Option
# Closes VS Code, force-deletes node_modules, reinstalls

Write-Host "🔄 Starting Node Modules Nuclear Fix..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Close VS Code Insiders
Write-Host "1️⃣  Closing VS Code Insiders..." -ForegroundColor Yellow
Get-Process | Where-Object { $_.ProcessName -like "*Code*Insiders*" -or $_.ProcessName -eq "Code - Insiders" } | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "   ✓ VS Code Insiders closed" -ForegroundColor Green
Write-Host ""

# Step 2: Force delete node_modules
Write-Host "2️⃣  Force deleting node_modules..." -ForegroundColor Yellow
$projectPath = "d:\wedding-website\theporadas_wedding_site"
Set-Location $projectPath

# Try normal delete first
Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue 2>$null

# If still exists, use robocopy trick (fastest Windows deletion)
if (Test-Path "node_modules") {
    $emptyDir = "$env:TEMP\empty_$(Get-Random)"
    New-Item -ItemType Directory -Path $emptyDir -Force | Out-Null
    robocopy $emptyDir "node_modules" /mir /r:0 /w:0 /nfl /ndl /njh /njs | Out-Null
    Remove-Item -Recurse -Force $emptyDir -ErrorAction SilentlyContinue
    Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
}

Write-Host "   ✓ node_modules deleted" -ForegroundColor Green
Write-Host ""

# Step 3: Delete package-lock.json
Write-Host "3️⃣  Deleting package-lock.json..." -ForegroundColor Yellow
Remove-Item -Force "package-lock.json" -ErrorAction SilentlyContinue
Write-Host "   ✓ package-lock.json deleted" -ForegroundColor Green
Write-Host ""

# Step 4: Fresh npm install
Write-Host "4️⃣  Running fresh npm install..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ npm install successful!" -ForegroundColor Green
}
else {
    Write-Host "   ✗ npm install failed with exit code $LASTEXITCODE" -ForegroundColor Red
    Write-Host "   Run manually: npm install" -ForegroundColor Yellow
}
Write-Host ""

# Step 5: Reopen VS Code Insiders
Write-Host "5️⃣  Reopening VS Code Insiders..." -ForegroundColor Yellow
Start-Process "code-insiders" -ArgumentList $projectPath
Write-Host "   ✓ VS Code Insiders reopening..." -ForegroundColor Green
Write-Host ""

Write-Host "✅ Fix complete! Check VS Code Insiders." -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
