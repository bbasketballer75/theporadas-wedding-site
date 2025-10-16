param(
    [switch]$NoPuppeteer,
    [switch]$NoPlaywright,
    [switch]$NoPostgres
)

$ErrorActionPreference = 'Stop'


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

# Ensure context7 MCP is configured (adds upstash/context7 to the user's mcp.json in AppData)
$ensureScript = Join-Path $workspace 'scripts\ensure-context7-mcp.ps1'
if (Test-Path $ensureScript) {
    Write-Host "Ensuring context7 MCP configuration is present..." -ForegroundColor Cyan
    & $ensureScript
}
else {
    Write-Warning "Ensure script missing: $ensureScript. You can run scripts/ensure-context7-mcp.ps1 manually to configure context7 MCP." 
}

# Check Firebase auth status and warn if not configured
$ensureFirebase = Join-Path $workspace 'scripts\ensure-firebase-login.ps1'
if (Test-Path $ensureFirebase) {
    Write-Host "Checking Firebase CLI auth status..." -ForegroundColor Cyan
    & $ensureFirebase
}
else {
    Write-Warning "Firebase ensure script missing: $ensureFirebase. Create scripts/ensure-firebase-login.ps1 to verify Firebase auth."
}

# Validate optional tokens (GitHub/Brave/Firebase) used by MCP helper tools
$tokenTester = Join-Path $workspace 'scripts\test-mcp-auth.ps1'
if (Test-Path $tokenTester) {
    Write-Host "Running token validation checks (non-destructive)..." -ForegroundColor Cyan
    & $tokenTester
}
else {
    Write-Host "Token tester script not found. Skipping token validation." -ForegroundColor Gray
}

$throttleHelper = Join-Path $workspace 'scripts\check-brave-throttle.ps1'
if (Test-Path $throttleHelper) {
    Write-Host "Reminder: use check-brave-throttle.ps1 to space Brave API calls (>=1s)." -ForegroundColor Gray
}

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

Write-Host "Sentry integration removed from local dev. No Sentry MCP server will be started." -ForegroundColor Yellow

Write-Host "All requested MCP servers started." -ForegroundColor Green
