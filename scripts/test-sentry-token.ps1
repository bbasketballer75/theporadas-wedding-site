param(
    [Parameter(Mandatory=$false)][string]$Token = $env:SENTRY_AUTH_TOKEN,
    [Parameter(Mandatory=$false)][string]$Dsn = $env:SENTRY_DSN,
    [Parameter(Mandatory=$false)][string]$Scopes
)

if (-not $Token) {
    Write-Error "No token supplied and SENTRY_AUTH_TOKEN not set in environment."
    exit 1
}

$cmd = 'npx'
$processArgs = @('-y', '@sentry/mcp-server', '--access-token', $Token)
if ($Dsn) { $processArgs += @('--sentry-dsn', $Dsn) }
if ($Scopes) { $processArgs += @('--scopes', $Scopes) }

Write-Host "Running: $cmd $($processArgs -join ' ')" -ForegroundColor Cyan

$logPath = Join-Path $PSScriptRoot 'sentry-token-test.log'
try {
    & $cmd $processArgs | Tee-Object -FilePath $logPath
    Write-Host "Output written to $logPath" -ForegroundColor Green
}
catch {
    Write-Error "Failed to run sentry/mcp-server: $_"
    exit 2
}
