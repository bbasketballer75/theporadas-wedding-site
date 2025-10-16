<#
  Ensures Brave Search API calls are spaced out to respect documented throttling.
  Records the timestamp of the last call in the user's AppData folder and, when
  invoked, waits the remaining time before allowing the next request. Optionally
  issues a lightweight verification query after the delay.

  Example (wait only):
    pwsh -File scripts/check-brave-throttle.ps1

  Example (wait + verify request):
    pwsh -File scripts/check-brave-throttle.ps1 -Test
#>
param(
    [int]$MinimumSeconds = 1,
    [switch]$Test,
    [string]$ApiKey,
    [string]$Query = 'the+poradas+throttle-check'
)

$stateDir = Join-Path $env:LOCALAPPDATA 'ThePoradas'
$stateFile = Join-Path $stateDir 'brave-throttle-state.json'

if (-not (Test-Path $stateDir)) {
    New-Item -Path $stateDir -ItemType Directory -Force | Out-Null
}

$now = Get-Date -AsUTC
$waitSeconds = 0
if (Test-Path $stateFile) {
    try {
        $state = Get-Content $stateFile -Raw | ConvertFrom-Json
        if ($state.lastCallUtc) {
            $last = Get-Date $state.lastCallUtc
            $elapsed = ($now - $last).TotalSeconds
            if ($elapsed -lt $MinimumSeconds) {
                $waitSeconds = [Math]::Ceiling($MinimumSeconds - $elapsed)
            }
        }
    }
    catch {
        Write-Verbose "Unable to read throttle state file: $($_.Exception.Message)"
    }
}

if ($waitSeconds -gt 0) {
    Write-Host "Waiting $waitSeconds second(s) to satisfy Brave throttle." -ForegroundColor Yellow
    Start-Sleep -Seconds $waitSeconds
}

$update = @{ lastCallUtc = (Get-Date -AsUTC).ToString('o') } | ConvertTo-Json -Depth 3
$update | Set-Content -Path $stateFile

if ($Test) {
    $ApiKey = if ($ApiKey) { $ApiKey } else { $env:BRAVE_API_KEY }
    if (-not $ApiKey) {
        Write-Host 'BRAVE_API_KEY not provided; skipping test request.' -ForegroundColor Yellow
        return
    }

    $uri = "https://api.search.brave.com/res/v1/web/search?q=$Query&source=web"
    $headers = @{
        'accept'               = 'application/json'
        'accept-encoding'      = 'gzip'
        'x-subscription-token' = $ApiKey
    }

    try {
        $response = Invoke-RestMethod -Uri $uri -Headers $headers -Method Get -ErrorAction Stop
        if ($response) {
            $hasMeta = $response.PSObject.Properties.Name -contains 'meta'
            $status = if ($hasMeta) { 'meta block present' } else { 'response received' }
            Write-Host "Brave verification succeeded ($status)." -ForegroundColor Green
        }
        else {
            Write-Host 'Request succeeded but returned an empty payload.' -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "Brave verification request failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}
