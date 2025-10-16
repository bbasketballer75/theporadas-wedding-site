<#
  setup-dev.ps1
  Windows-only developer setup script.

  Actions performed (default):
   - Installs site dependencies (npm ci)
   - Installs Playwright browsers
   - Ensures Context7 MCP is configured (if helper script present)
   - Runs Firebase auth check (warns if not logged in)
   - Optionally starts MCP servers (-StartMCP)
   - Optionally persists tokens if -PersistTokens is provided and tokens entered.

  Usage examples:
    .\setup-dev.ps1                     # run basic setup
    .\setup-dev.ps1 -StartMCP           # also start MCP servers
    .\setup-dev.ps1 -PersistTokens      # prompt for tokens and persist to User env

  Note: This script is intended for local Windows 11 development only.
#>

param(
    [switch]$StartMCP,
    [switch]$PersistTokens
)

if ($IsLinux -or $IsMacOS) {
    Write-Error "This script is intended for Windows only. Aborting."
    exit 1
}

Set-StrictMode -Version Latest

try {
    # Derive repository root relative to the script location so the script works
    # regardless of the current working directory used to invoke it.
    $repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
    $siteDir = Join-Path $repoRoot 'site'
    if (-not (Test-Path $siteDir)) { Write-Error "site directory not found: $siteDir"; exit 2 }

    Write-Host "Installing site dependencies..." -ForegroundColor Cyan
    Push-Location $siteDir
    if (Test-Path 'package-lock.json') {
        try {
            npm ci
        }
        catch {
            Write-Warning "npm ci failed; attempting npm install instead. Error: $_"
            npm install
        }
    }
    else {
        npm install
    }

    Write-Host "Installing Playwright browsers..." -ForegroundColor Cyan
    npx playwright install --with-deps
    Pop-Location

    # Ensure Context7 MCP
    $ensureContext7 = Join-Path $repoRoot 'scripts\ensure-context7-mcp.ps1'
    if (Test-Path $ensureContext7) {
        Write-Host "Ensuring Context7 MCP configuration..." -ForegroundColor Cyan
        & $ensureContext7
    }

    # Firebase check (warns, non-blocking)
    $ensureFirebase = Join-Path $repoRoot 'scripts\ensure-firebase-login.ps1'
    if (Test-Path $ensureFirebase) {
        Write-Host "Checking Firebase CLI auth (non-blocking)..." -ForegroundColor Cyan
        & $ensureFirebase
    }

    if ($PersistTokens) {
        Write-Host "Persist tokens requested. You will be prompted for each token (press Enter to skip)." -ForegroundColor Yellow

        function Convert-SecureStringToPlain($s) {
            if (-not $s) { return $null }
            $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($s)
            try { [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) }
            finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
        }

        $gh = Read-Host -Prompt 'GitHub Personal Access Token (leave blank to skip)' -AsSecureString
        $ghPlain = Convert-SecureStringToPlain $gh
        $brave = Read-Host -Prompt 'Brave API Key (leave blank to skip)' -AsSecureString
        $bravePlain = Convert-SecureStringToPlain $brave
        $fb = Read-Host -Prompt 'Firebase CI Token (leave blank to skip)' -AsSecureString
        $fbPlain = Convert-SecureStringToPlain $fb

        if ($ghPlain -or $bravePlain -or $fbPlain) {
            $setScript = Join-Path $repoRoot 'scripts\set-mcp-auth.ps1'
            if (-not (Test-Path $setScript)) { Write-Warning "set-mcp-auth.ps1 missing; cannot persist tokens." }
            else {
                & $setScript -GithubToken $ghPlain -BraveKey $bravePlain -FirebaseToken $fbPlain -Persist | Out-Null
                Write-Host "Persisted tokens to User environment. Restart VS Code and terminals to pick them up." -ForegroundColor Green
            }
        }
        else { Write-Host "No tokens entered; skipping persistence." }
    }

    if ($StartMCP) {
        Write-Host "Starting MCP servers via scripts/start-mcp-servers.ps1" -ForegroundColor Cyan
        $startScript = Join-Path $repoRoot 'scripts\start-mcp-servers.ps1'
        if (Test-Path $startScript) { & $startScript }
        else { Write-Warning "Start script missing: $startScript" }
    }

    Write-Host "Local developer setup complete (Windows)." -ForegroundColor Green
}
catch {
    Write-Error "Setup failed: $_"
    exit 10
}
