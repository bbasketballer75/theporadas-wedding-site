#Requires -RunAsAdministrator
<#
.SYNOPSIS
    PostgreSQL Setup with Automatic Elevation
.DESCRIPTION
    This script automatically requests administrator privileges and configures PostgreSQL for the wedding website project.
    It will:
    1. Set PostgreSQL to trust authentication temporarily
    2. Restart the PostgreSQL service
    3. Set a new secure password
    4. Create the theporadas_dev database
    5. Restore secure authentication
    6. Restart the service again
.NOTES
    Run this script by right-clicking it and selecting "Run with PowerShell"
    OR from PowerShell: .\setup-postgresql-elevated.ps1
#>

# Check if running as administrator
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "This script requires administrator privileges." -ForegroundColor Yellow
    Write-Host "Attempting to restart with elevated permissions..." -ForegroundColor Yellow
    
    # Restart script with elevation
    $scriptPath = $MyInvocation.MyCommand.Path
    Start-Process powershell.exe -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`"" -Verb RunAs
    exit
}

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  PostgreSQL Setup for Wedding Website" -ForegroundColor Cyan
Write-Host "  Running with Administrator Privileges" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$pgData = "C:\Program Files\PostgreSQL\17\data"
$pgHba = Join-Path $pgData "pg_hba.conf"
$serviceName = "postgresql-x64-17"
$dbName = "theporadas_dev"
$dbUser = "postgres"

# Prompt for password
Write-Host "Enter a secure password for PostgreSQL user 'postgres':" -ForegroundColor Yellow
Write-Host "(Recommended: theporadas2025! or your own strong password)" -ForegroundColor Gray
$securePassword = Read-Host -AsSecureString
$password = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword))

if ([string]::IsNullOrWhiteSpace($password)) {
    Write-Host "Error: Password cannot be empty!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 1: Backing up pg_hba.conf..." -ForegroundColor Green
$backupPath = "$pgHba.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Copy-Item $pgHba $backupPath -Force
Write-Host "✓ Backup created: $backupPath" -ForegroundColor Green

Write-Host ""
Write-Host "Step 2: Enabling trust authentication temporarily..." -ForegroundColor Green
$content = Get-Content $pgHba
$modifiedContent = $content -replace 'scram-sha-256', 'trust'
$modifiedContent | Set-Content $pgHba -Force
Write-Host "✓ Trust authentication enabled" -ForegroundColor Green

Write-Host ""
Write-Host "Step 3: Restarting PostgreSQL service..." -ForegroundColor Green
try {
    Restart-Service $serviceName -Force -ErrorAction Stop
    Start-Sleep -Seconds 3
    Write-Host "✓ Service restarted successfully" -ForegroundColor Green
}
catch {
    Write-Host "✗ Failed to restart service: $_" -ForegroundColor Red
    Write-Host "Restoring backup..." -ForegroundColor Yellow
    Copy-Item $backupPath $pgHba -Force
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 4: Setting PostgreSQL password..." -ForegroundColor Green
$psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"
$sqlCommand = "ALTER USER $dbUser WITH PASSWORD '$password';"
try {
    & $psqlPath -h localhost -p 5432 -U $dbUser -d postgres -c $sqlCommand 2>&1 | Out-Null
    Write-Host "✓ Password set successfully" -ForegroundColor Green
}
catch {
    Write-Host "✗ Failed to set password: $_" -ForegroundColor Red
    Write-Host "Restoring backup..." -ForegroundColor Yellow
    Copy-Item $backupPath $pgHba -Force
    Restart-Service $serviceName -Force
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 5: Creating database '$dbName'..." -ForegroundColor Green
$createDbCommand = "CREATE DATABASE $dbName;"
try {
    & $psqlPath -h localhost -p 5432 -U $dbUser -d postgres -c $createDbCommand 2>&1 | Out-Null
    Write-Host "✓ Database created successfully" -ForegroundColor Green
}
catch {
    Write-Host "Warning: Database may already exist or failed to create" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 6: Restoring secure authentication..." -ForegroundColor Green
$content = Get-Content $pgHba
$restoredContent = $content -replace 'trust', 'scram-sha-256'
$restoredContent | Set-Content $pgHba -Force
Write-Host "✓ Secure authentication restored" -ForegroundColor Green

Write-Host ""
Write-Host "Step 7: Final service restart..." -ForegroundColor Green
try {
    Restart-Service $serviceName -Force -ErrorAction Stop
    Start-Sleep -Seconds 3
    Write-Host "✓ Service restarted successfully" -ForegroundColor Green
}
catch {
    Write-Host "✗ Failed to restart service: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 8: Testing connection..." -ForegroundColor Green
$env:PGPASSWORD = $password
try {
    & $psqlPath -h localhost -p 5432 -U $dbUser -d $dbName -c "SELECT version();" 2>&1 | Out-Null
    Write-Host "✓ Connection test successful!" -ForegroundColor Green
}
catch {
    Write-Host "✗ Connection test failed" -ForegroundColor Red
    Write-Host "You may need to verify the password manually" -ForegroundColor Yellow
}
$env:PGPASSWORD = $null

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  PostgreSQL Setup Complete!" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANT: Update your .env file with:" -ForegroundColor Yellow
Write-Host "PG_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/$dbName" -ForegroundColor White
Write-Host ""
Write-Host "Replace YOUR_PASSWORD with the password you just set." -ForegroundColor Gray
Write-Host ""
Write-Host "Backup file saved at:" -ForegroundColor Gray
Write-Host $backupPath -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"
