#!/usr/bin/env pwsh
<#
.SYNOPSIS
Start Firebase emulators in the background for integration testing
.DESCRIPTION
Starts Firebase emulators on configured ports and waits for them to be ready.
Used automatically by Playwright during test execution.
.PARAMETER Wait
If specified, waits for emulators to be ready before returning
.EXAMPLE
./start-firebase-emulator.ps1 -Wait
#>

param(
    [switch]$Wait = $false
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting Firebase emulators..." -ForegroundColor Green

# Check if Java is available (required for emulators)
$java = Get-Command java -ErrorAction SilentlyContinue
if (-not $java) {
    Write-Host "❌ Java is not installed. Firebase emulators require Java." -ForegroundColor Red
    Write-Host "Install from: https://www.java.com/en/download/" -ForegroundColor Yellow
    exit 1
}

# Navigate to project root
$projectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $projectRoot

# Start emulators in background
Write-Host "📍 Starting from: $projectRoot"
Write-Host "🔥 Firestore emulator on port 8002"
Write-Host "📦 Storage emulator on port 9199"
Write-Host "🎛️  Emulator UI on port 4000"

# Start Firebase emulators (suppress output unless there's an error)
$process = Start-Process -FilePath "firebase" -ArgumentList "emulators:start", "--project", "demo-test" `
    -PassThru -WindowStyle Hidden -RedirectStandardOutput $null -RedirectStandardError $null

if ($null -eq $process) {
    Write-Host "❌ Failed to start Firebase emulators" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Firebase emulators started (PID: $($process.Id))" -ForegroundColor Green

# Wait for emulators to be ready if requested
if ($Wait) {
    Write-Host "⏳ Waiting for emulators to be ready..." -ForegroundColor Yellow
    
    $maxAttempts = 60
    $attempt = 0
    $ready = $false
    
    while ($attempt -lt $maxAttempts -and -not $ready) {
        try {
            # Check if Firestore emulator is responding
            $response = Invoke-WebRequest -Uri "http://localhost:8002" -Method GET -TimeoutSec 1 -ErrorAction SilentlyContinue
            $ready = $true
        }
        catch {
            $attempt++
            Start-Sleep -Milliseconds 500
            Write-Host "." -NoNewline
        }
    }
    
    if ($ready) {
        Write-Host "`n✅ Firebase emulators are ready!" -ForegroundColor Green
    }
    else {
        Write-Host "`n❌ Timeout waiting for Firebase emulators" -ForegroundColor Red
        Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
        exit 1
    }
}

exit 0
