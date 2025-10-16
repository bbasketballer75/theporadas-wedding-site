#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Start Firebase emulators for integration testing

.DESCRIPTION
    Starts Firebase Firestore and Storage emulators for local development and testing.
    Emulators run in the background and auto-import/export data.

.PARAMETER NoUI
    Disable emulator UI (runs headless)

.PARAMETER ImportData
    Import data from ./emulator-data on startup

.PARAMETER ExportOnExit
    Export data to ./emulator-data on shutdown

.EXAMPLE
    .\start-emulators.ps1
    Start emulators with UI

.EXAMPLE
    .\start-emulators.ps1 -NoUI
    Start emulators without UI (headless)
#>

param(
    [switch]$NoUI,
    [switch]$ImportData,
    [switch]$ExportOnExit
)

Write-Host "🚀 Starting Firebase Emulators..." -ForegroundColor Cyan
Write-Host ""

# Check if Firebase CLI is installed
$firebaseInstalled = Get-Command firebase -ErrorAction SilentlyContinue
if (-not $firebaseInstalled) {
    Write-Host "❌ Firebase CLI not found!" -ForegroundColor Red
    Write-Host "   Install: npm install -g firebase-tools" -ForegroundColor Yellow
    exit 1
}

# Build firebase command
$firebaseCmd = "firebase emulators:start"

if ($NoUI) {
    Write-Host "ℹ️  Running WITHOUT UI (headless mode)" -ForegroundColor Yellow
}

if ($ImportData) {
    $firebaseCmd += " --import=./emulator-data"
    Write-Host "📥 Will import data from ./emulator-data" -ForegroundColor Green
}

if ($ExportOnExit) {
    $firebaseCmd += " --export-on-exit=./emulator-data"
    Write-Host "📤 Will export data to ./emulator-data on exit" -ForegroundColor Green
}

Write-Host ""
Write-Host "Configuration:" -ForegroundColor Cyan
Write-Host "  Firestore: localhost:8002" -ForegroundColor White
Write-Host "  Storage:   localhost:9199" -ForegroundColor White
Write-Host "  UI:        http://localhost:4000" -ForegroundColor White
Write-Host ""

if (-not $NoUI) {
    Write-Host "Emulator UI will open at: http://localhost:4000" -ForegroundColor Green
}

Write-Host ""
Write-Host "Press Ctrl+C to stop emulators" -ForegroundColor Yellow
Write-Host ""

# Change to project root
Set-Location -Path $PSScriptRoot\..

# Start emulators
try {
    Invoke-Expression $firebaseCmd
}
catch {
    Write-Host ""
    Write-Host "❌ Error starting emulators: $_" -ForegroundColor Red
    exit 1
}
