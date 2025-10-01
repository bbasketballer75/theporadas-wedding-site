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
    $processArgs = @{}
    if ($Arguments) {
        $processArgs["ArgumentList"] = $Arguments
    }
    $processArgs["WorkingDirectory"] = (Get-Location).Path
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
            Start-Server -Command "pwsh" -Arguments @("-Command", "npx -y @modelcontextprotocol/server-postgres $pgUrl") -DisplayName "MCP Postgres"
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

Write-Host "All requested MCP servers started." -ForegroundColor Green
