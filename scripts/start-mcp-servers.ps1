param(
    [switch]$NoPuppeteer,
    [switch]$NoPlaywright,
    [switch]$NoPostgres,
    [string]$SentryScopes,
    [string]$SentryAddScopes,
    [string]$SentryOrganizationSlug,
    [string]$SentryProjectSlug,
    [switch]$SentryAllScopes
)

$ErrorActionPreference = 'Stop'

# Ensure Sentry env is loaded if available
$loadSentryPath = Join-Path $PSScriptRoot 'load-sentry-env.ps1'
if (Test-Path $loadSentryPath) {
    try {
        Write-Host "Loading Sentry credentials..." -ForegroundColor Cyan
        & $loadSentryPath
    }
    catch {
        Write-Warning "Failed to load Sentry environment: $_"
    }
}

function Start-Server {
    param(
        [Parameter(Mandatory)][string]$Command,
        [Parameter()][string[]]$Arguments,
        [Parameter()][string]$DisplayName
    )

    $name = if ($DisplayName) { $DisplayName } else { $Command }
    Write-Host "Starting $name..." -ForegroundColor Cyan
    $processArgs = @{ }
    if ($Arguments) { $processArgs['ArgumentList'] = $Arguments }
    $processArgs['WorkingDirectory'] = (Get-Location).Path
    Start-Process -FilePath $Command @processArgs | Out-Null
    Write-Host "$name launched." -ForegroundColor Green
}

$workspace = (Get-Location).Path
Write-Host "Workspace root detected at: $workspace" -ForegroundColor Yellow

# Filesystem server (required for workspace access)
Start-Server -Command "npx" -Arguments @("-y", "@modelcontextprotocol/server-filesystem", $workspace) -DisplayName "MCP Filesystem"

# Memory server
Start-Server -Command "npx" -Arguments @("-y", "@modelcontextprotocol/server-memory") -DisplayName "MCP Memory"

# Sequential thinking server
Start-Server -Command "npx" -Arguments @("-y", "@modelcontextprotocol/server-sequential-thinking") -DisplayName "MCP Sequential Thinking"

if (-not $NoPuppeteer) {
    Start-Server -Command "npx" -Arguments @("-y", "@modelcontextprotocol/server-puppeteer") -DisplayName "MCP Puppeteer"
}

if (-not $NoPostgres) {
    $envPath = Join-Path $workspace ".env"
    if (Test-Path $envPath) {
        $pgUrl = (Get-Content $envPath | Where-Object { $_ -match '^PG_URL=' } | ForEach-Object { ($_ -split '=', 2)[1].Trim() })
        if ($pgUrl) {
            Start-Server -Command "npx" -Arguments @("-y", "@modelcontextprotocol/server-postgres", $pgUrl) -DisplayName "MCP Postgres"
        }
        else {
            Write-Warning "PG_URL not found in .env; skipping MCP Postgres server."
        }
    }
    else {
        Write-Warning ".env file missing; skipping MCP Postgres server."
    }
}

if (-not $NoPlaywright) {
    Start-Server -Command "npx" -Arguments @("@playwright/mcp@latest") -DisplayName "Playwright MCP"
}

# Start Sentry MCP server if credentials available
if ($env:SENTRY_ACCESS_TOKEN -or $env:SENTRY_AUTH_TOKEN -or $env:SENTRY_API) {
    $token = $env:SENTRY_ACCESS_TOKEN
    if (-not $token) { $token = $env:SENTRY_AUTH_TOKEN }
    if (-not $token) { $token = $env:SENTRY_API }

    if ($token) {
        # If user didn't specify add-scopes, request common write scopes by default for local development
        if (-not $SentryAddScopes) {
            # Default to recommended Sentry scopes for stdio transport to enable management tools during local development
            $SentryAddScopes = 'org:read,project:read,project:write,team:read,team:write,event:write,project:releases'
            Write-Host "No explicit Sentry add-scopes provided; defaulting to recommended scopes: $SentryAddScopes" -ForegroundColor Yellow
        }
        # Build sentry args safely
        $sentryArgs = @()
        if ($SentryAllScopes) { $sentryArgs += '--all-scopes' }
        if ($SentryScopes) { $sentryArgs += @('--scopes', $SentryScopes) }
        if ($SentryAddScopes) { $sentryArgs += @('--add-scopes', $SentryAddScopes) }
        if ($SentryOrganizationSlug) { $sentryArgs += @('--organization-slug', $SentryOrganizationSlug) }
        if ($SentryProjectSlug) { $sentryArgs += @('--project-slug', $SentryProjectSlug) }
        $sentryArgs += @('--access-token', $token)
        if ($env:SENTRY_DSN) { $sentryArgs += @('--sentry-dsn', $env:SENTRY_DSN) }

        $baseSentryArgs = @('-y', '@sentry/mcp-server')
        $allSentryArgs = $baseSentryArgs + $sentryArgs
        Start-Server -Command 'npx' -Arguments $allSentryArgs -DisplayName 'Sentry MCP'
    }
    else {
        Write-Warning "Sentry credentials detected but token variable empty; skipping Sentry MCP start."
    }
}
else {
    Write-Host "No Sentry credentials found in environment; skipping Sentry MCP server." -ForegroundColor Yellow
}

Write-Host "All requested MCP servers started." -ForegroundColor Green
