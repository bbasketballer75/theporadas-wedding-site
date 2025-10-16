# Keep-Alive Script for Next.js Dev Server
# Automatically restarts the dev server if it crashes

param(
    [switch]$Turbopack = $true,
    [int]$Port = 3000,
    [int]$CheckInterval = 30
)

$WorkingDir = Join-Path $PSScriptRoot "..\site"
$LogFile = Join-Path $PSScriptRoot "..\logs\dev-server.log"

# Ensure logs directory exists
$LogDir = Split-Path $LogFile -Parent
if (-not (Test-Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
}

function Write-Log {
    param($Message)
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogMessage = "[$Timestamp] $Message"
    Write-Host $LogMessage
    Add-Content -Path $LogFile -Value $LogMessage
}

function Test-ServerRunning {
    try {
        $Response = Invoke-WebRequest -Uri "http://localhost:$Port" -Method HEAD -TimeoutSec 5 -ErrorAction Stop
        return $true
    }
    catch {
        return $false
    }
}

function Start-DevServer {
    Write-Log "Starting Next.js dev server..."
    
    $DevCommand = if ($Turbopack) { "next dev --turbopack" } else { "next dev" }
    
    # Kill any existing node processes on port 3000
    $Processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | 
                 Select-Object -ExpandProperty OwningProcess -Unique
    
    foreach ($PID in $Processes) {
        Write-Log "Killing existing process on port ${Port}: PID $PID"
        Stop-Process -Id $PID -Force -ErrorAction SilentlyContinue
    }
    
    Start-Sleep -Seconds 2
    
    # Start new dev server
    $Job = Start-Process -FilePath "powershell" `
                         -ArgumentList "-NoProfile", "-Command", "cd '$WorkingDir'; npm run dev" `
                         -PassThru `
                         -WindowStyle Hidden
    
    Write-Log "Dev server started with PID: $($Job.Id)"
    
    # Wait for server to be ready
    $MaxWait = 30
    $Waited = 0
    while (-not (Test-ServerRunning) -and $Waited -lt $MaxWait) {
        Start-Sleep -Seconds 1
        $Waited++
    }
    
    if (Test-ServerRunning) {
        Write-Log "✓ Dev server is running and responding on http://localhost:$Port"
    }
    else {
        Write-Log "⚠ Dev server started but not responding yet..."
    }
}

Write-Log "=== Keep-Alive Script Started ==="
Write-Log "Port: $Port | Check Interval: ${CheckInterval}s | Turbopack: $Turbopack"

# Initial server start
if (-not (Test-ServerRunning)) {
    Write-Log "Server not detected, starting initial instance..."
    Start-DevServer
}
else {
    Write-Log "✓ Server already running"
}

# Monitor loop
Write-Log "Entering monitoring loop (Ctrl+C to stop)..."

while ($true) {
    Start-Sleep -Seconds $CheckInterval
    
    if (-not (Test-ServerRunning)) {
        Write-Log "⚠ Server not responding! Restarting..."
        Start-DevServer
    }
    else {
        Write-Log "✓ Server health check passed"
    }
}
