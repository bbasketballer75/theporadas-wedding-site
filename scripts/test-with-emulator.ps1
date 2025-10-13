#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Run integration tests with Firebase emulators

.DESCRIPTION
    Starts Firebase emulators, runs integration tests, and stops emulators.
    Handles emulator lifecycle automatically.

.PARAMETER Headed
    Run tests in headed mode (visible browser)

.PARAMETER Debug
    Run tests in debug mode with Playwright Inspector

.PARAMETER UI
    Keep emulator UI open (don't run headless)

.EXAMPLE
    .\test-with-emulator.ps1
    Run integration tests with emulators

.EXAMPLE
    .\test-with-emulator.ps1 -Headed -UI
    Run tests in headed mode with emulator UI visible
#>

param(
    [switch]$Headed,
    [switch]$Debug,
    [switch]$UI
)

Write-Host "🧪 Firebase Emulator Integration Tests" -ForegroundColor Cyan
Write-Host ""

# Change to project root
Set-Location -Path $PSScriptRoot\..

# Refresh PATH to pick up Java and other tools
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

# Check if Firebase CLI is installed
$firebaseInstalled = Get-Command firebase -ErrorAction SilentlyContinue
if (-not $firebaseInstalled) {
    Write-Host "❌ Firebase CLI not found!" -ForegroundColor Red
    Write-Host "   Install: npm install -g firebase-tools" -ForegroundColor Yellow
    exit 1
}

# Check if emulators are already running
Write-Host "🔍 Checking if emulators are already running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8002" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
    $emulatorsAlreadyRunning = $true
    Write-Host "✅ Emulators are already running" -ForegroundColor Green
}
catch {
    $emulatorsAlreadyRunning = $false
    Write-Host "ℹ️  Emulators not running, will start them" -ForegroundColor Yellow
}

Write-Host ""

# Start emulators if not running
$emulatorJob = $null
if (-not $emulatorsAlreadyRunning) {
    Write-Host "🚀 Starting Firebase emulators..." -ForegroundColor Cyan

    $emulatorCmd = if ($UI) {
        "firebase emulators:start"
    }
    else {
        "firebase emulators:start --import=./emulator-data --export-on-exit=./emulator-data"
    }

    # Start emulators in background
    $currentPath = $env:Path
    $emulatorJob = Start-Job -ScriptBlock {
        param($cmd, $path)
        $env:Path = $path
        Set-Location -Path $using:PWD
        Invoke-Expression $cmd
    } -ArgumentList $emulatorCmd, $currentPath

    Write-Host "⏳ Waiting for emulators to be ready..." -ForegroundColor Yellow

    # Wait for emulators to start (max 30 seconds)
    $timeout = 30
    $elapsed = 0
    $ready = $false

    while ($elapsed -lt $timeout) {
        Start-Sleep -Seconds 1
        $elapsed++

        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8002" -UseBasicParsing -TimeoutSec 1 -ErrorAction SilentlyContinue
            $ready = $true
            break
        }
        catch {
            Write-Host "." -NoNewline
        }
    }

    Write-Host ""

    if (-not $ready) {
        Write-Host "❌ Emulators failed to start within $timeout seconds" -ForegroundColor Red
        if ($emulatorJob) {
            Stop-Job -Job $emulatorJob
            Remove-Job -Job $emulatorJob
        }
        exit 1
    }

    Write-Host "✅ Emulators are ready!" -ForegroundColor Green
    Write-Host ""
}

# Build test command
Set-Location -Path "$PSScriptRoot\..\site"

$testCmd = "npx playwright test tests/integration/guestbook-emulator.spec.js"

if ($Headed) {
    $testCmd += " --headed"
    Write-Host "ℹ️  Running in HEADED mode (visible browser)" -ForegroundColor Yellow
}

if ($Debug) {
    $testCmd += " --debug"
    Write-Host "ℹ️  Running in DEBUG mode (Playwright Inspector)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🧪 Running integration tests..." -ForegroundColor Cyan
Write-Host ""

# Run tests
try {
    Invoke-Expression $testCmd
    $testExitCode = $LASTEXITCODE
}
catch {
    Write-Host "❌ Test execution error: $_" -ForegroundColor Red
    $testExitCode = 1
}

Write-Host ""

# Stop emulators if we started them
if ($emulatorJob) {
    Write-Host "🛑 Stopping emulators..." -ForegroundColor Yellow
    Stop-Job -Job $emulatorJob -ErrorAction SilentlyContinue
    Remove-Job -Job $emulatorJob -ErrorAction SilentlyContinue
    Write-Host "✅ Emulators stopped" -ForegroundColor Green
}
else {
    Write-Host "ℹ️  Emulators were already running, leaving them running" -ForegroundColor Yellow
}

Write-Host ""

# Report results
if ($testExitCode -eq 0) {
    Write-Host "✅ All integration tests passed!" -ForegroundColor Green
}
else {
    Write-Host "❌ Some integration tests failed (exit code: $testExitCode)" -ForegroundColor Red
}

exit $testExitCode
