param(
    [Parameter(Mandatory=$false)][string]$Token = $env:SENTRY_AUTH_TOKEN,
    [Parameter(Mandatory=$false)][string]$Dsn = $env:SENTRY_DSN,
    [Parameter(Mandatory=$false)][string]$Scopes,
    [Parameter(Mandatory=$false)][string]$AddScopes,
    [Parameter(Mandatory=$false)][string]$OrganizationSlug,
    [Parameter(Mandatory=$false)][string]$ProjectSlug,
    [Parameter(Mandatory=$false)][switch]$AllScopes
)

if (-not $Token) {
    Write-Error "No token supplied and SENTRY_AUTH_TOKEN not set in environment."
    exit 1
}

$cmd = 'npx'
$processArgs = @('-y', '@sentry/mcp-server')
if ($Scopes) { $processArgs += @('--scopes', $Scopes) }
if ($AddScopes) { $processArgs += @('--add-scopes', $AddScopes) }
if ($OrganizationSlug) { $processArgs += @('--organization-slug', $OrganizationSlug) }
if ($ProjectSlug) { $processArgs += @('--project-slug', $ProjectSlug) }
if ($AllScopes) { $processArgs += @('--all-scopes') }
$processArgs += @('--access-token', $Token)
if ($Dsn) { $processArgs += @('--sentry-dsn', $Dsn) }

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
