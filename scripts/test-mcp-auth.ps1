<#
  Test MCP-related tokens and credentials.
  This script safely validates tokens for GitHub, Brave Search, and Firebase without
  printing secret values. It accepts tokens as parameters or reads from environment.

  Usage examples:
    ./test-mcp-auth.ps1                # uses env vars
    ./test-mcp-auth.ps1 -GithubToken $env:GITHUB_PERSONAL_ACCESS_TOKEN -Persist
#>
param(
    [string]$GithubToken,
    [string]$BraveKey,
    [string]$FirebaseToken
)

function Mask($s) {
    if (-not $s) { return $null }
    if ($s.Length -le 8) { return '****' }
    return $s.Substring(0, 4) + '...' + $s.Substring($s.Length - 4)
}

$GithubToken = $GithubToken ? $GithubToken : $env:GITHUB_PERSONAL_ACCESS_TOKEN
$BraveKey = $BraveKey ? $BraveKey : $env:BRAVE_API_KEY
$FirebaseToken = $FirebaseToken ? $FirebaseToken : $env:FIREBASE_TOKEN

Write-Host "Starting token checks (values masked)" -ForegroundColor Cyan

# GitHub token validation
if ($GithubToken) {
    Write-Host "Testing GitHub token: $(Mask $GithubToken)" -ForegroundColor Gray
    try {
        $headers = @{'User-Agent' = 'mcp-test-script'; 'Authorization' = "token $GithubToken" }
        $resp = Invoke-RestMethod -Uri 'https://api.github.com/user' -Headers $headers -Method Get -ErrorAction Stop
        if ($resp.login) {
            Write-Host "GitHub token valid for user: $($resp.login)" -ForegroundColor Green
        }
        else {
            Write-Host "GitHub API returned no user info; token may be invalid or have insufficient scopes." -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "GitHub token check failed: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}
else {
    Write-Host "GITHUB_PERSONAL_ACCESS_TOKEN not set; skipping GitHub check." -ForegroundColor Yellow
}

# Brave Search API validation (best-effort; API formats vary)
if ($BraveKey) {
    Write-Host "Testing Brave API key: $(Mask $BraveKey)" -ForegroundColor Gray
    try {
        $uri = 'https://api.search.brave.com/res/v1/web/search?q=mcp-test&source=web'
        $headers = @{
            'accept'               = 'application/json'
            'accept-encoding'      = 'gzip'
            'x-subscription-token' = $BraveKey
        }
        Start-Sleep -Seconds 1  # respect Brave API 1 req/sec guidance
        $resp = Invoke-RestMethod -Uri $uri -Headers $headers -Method Get -ErrorAction Stop
        if ($resp && $resp.meta) {
            Write-Host "Brave API key appears valid (received meta info)." -ForegroundColor Green
        }
        else {
            Write-Host "Brave API call returned an unexpected shape; key may be invalid." -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "Brave API key check failed: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}
else {
    Write-Host "BRAVE_API_KEY not set; skipping Brave check." -ForegroundColor Yellow
}

# Firebase token validation
if ($FirebaseToken) {
    Write-Host "Testing Firebase token: $(Mask $FirebaseToken)" -ForegroundColor Gray
    try {
        # Use the Firebase CLI to validate the token non-interactively
        # Use npx.CMD explicitly on Windows to avoid invoking the PowerShell wrapper (npx.ps1) which can be altered by the shell
        $npxCmd = (Get-Command npx -CommandType Application, ExternalScript | Where-Object { $_.Path -match '\\npx.CMD$' } ).Path
        if (-not $npxCmd) { $npxCmd = 'npx.cmd' }
        $process = Start-Process -FilePath $npxCmd -ArgumentList @('--yes', 'firebase', 'projects:list', '--token', $FirebaseToken) -NoNewWindow -PassThru -Wait -ErrorAction Stop
        if ($process.ExitCode -eq 0) {
            Write-Host "Firebase token appears valid (projects list succeeded)." -ForegroundColor Green
        }
        else {
            Write-Host "Firebase CLI returned non-zero exit code ($($process.ExitCode)); token may be invalid or CLI not installed." -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "Firebase token check failed: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}
else {
    Write-Host "FIREBASE_TOKEN not set; skipping Firebase check." -ForegroundColor Yellow
}

Write-Host "Token checks complete." -ForegroundColor Cyan
