# Quick Start Script for Next.js Dev Server with Auto-Restart
# Usage: .\scripts\start-dev-server.ps1 [-Turbopack] [-KeepAlive]

param(
    [switch]$Turbopack = $true,
    [switch]$KeepAlive = $false,
    [int]$Port = 3000
)

$WorkingDir = Join-Path $PSScriptRoot "..\site"

Write-Host "=== Starting Next.js Dev Server ===" -ForegroundColor Cyan
Write-Host "Port: $Port" -ForegroundColor Gray
Write-Host "Turbopack: $Turbopack" -ForegroundColor Gray
Write-Host "Keep-Alive: $KeepAlive" -ForegroundColor Gray
Write-Host ""

# Kill any existing processes on the port
$Processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | 
             Select-Object -ExpandProperty OwningProcess -Unique

if ($Processes) {
    Write-Host "Killing existing processes on port ${Port}..." -ForegroundColor Yellow
    foreach ($PID in $Processes) {
        Stop-Process -Id $PID -Force -ErrorAction SilentlyContinue
        Write-Host "  Killed PID: $PID" -ForegroundColor Gray
    }
    Start-Sleep -Seconds 2
}

# Change to site directory
Set-Location $WorkingDir

if ($KeepAlive) {
    Write-Host "Starting with Keep-Alive monitoring..." -ForegroundColor Green
    Write-Host "Server will auto-restart if it crashes." -ForegroundColor Gray
    Write-Host ""
    
    $KeepAliveScript = Join-Path $PSScriptRoot "keep-alive.ps1"
    & $KeepAliveScript -Turbopack:$Turbopack -Port $Port
}
else {
    Write-Host "Starting dev server..." -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop." -ForegroundColor Gray
    Write-Host ""
    
    if ($Turbopack) {
        npm run dev
    }
    else {
        next dev
    }
}
