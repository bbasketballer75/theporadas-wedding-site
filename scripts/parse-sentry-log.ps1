# Parse Sentry MCP log to summarize skipped tools and recommend scopes
param(
    [Parameter(Mandatory=$false)][string]$LogPath = "$PSScriptRoot\sentry-token-test.log"
)

if (-not (Test-Path $LogPath)) {
    Write-Error "Log file not found at: $LogPath"
    exit 1
}

$lines = Get-Content $LogPath
$skipped = $lines | Where-Object { $_ -match "Skipping tool '(.+)' - missing required scopes" } | ForEach-Object {
    $m = [regex]::Match($_, "Skipping tool '(?<tool>.+)' - missing required scopes")
    if ($m.Success) { $m.Groups['tool'].Value }
}

if (-not $skipped) {
    Write-Host "No skipped tools detected in log." -ForegroundColor Green
    exit 0
}

Write-Host "Detected skipped tools:" -ForegroundColor Yellow
$skipped | Sort-Object | Get-Unique | ForEach-Object { Write-Host " - $_" }

# Map tools to required scopes (best-effort mapping)
$scopeMap = @{
    'update_issue' = @('event:write')
    'create_team' = @('team:write')
    'create_project' = @('project:write')
    'update_project' = @('project:write')
    'create_dsn' = @('project:write','project:releases')
}

$recommended = New-Object System.Collections.Generic.HashSet[string]

foreach ($tool in $skipped | Get-Unique) {
    if ($scopeMap.ContainsKey($tool)) {
        $scopes = $scopeMap[$tool]
        Write-Host "Tool '$tool' likely requires scopes: $($scopes -join ', ')" -ForegroundColor Cyan
        foreach ($s in $scopes) { [void]$recommended.Add($s) }
    }
    else {
        Write-Host "Tool '$tool' - no mapping available; please consult Sentry docs for required scopes." -ForegroundColor Red
    }
}

if ($recommended.Count -gt 0) {
    Write-Host "`nRecommended additional scopes to add to your Sentry token:" -ForegroundColor Green
    Write-Host ($recommended -join ', ')
    Write-Host "`nCreate or update a Sentry auth token with these scopes and add it to your .env as SENTRY_AUTH_TOKEN (or SENTRY_ACCESS_TOKEN), then re-run the test helper." -ForegroundColor Yellow
}
