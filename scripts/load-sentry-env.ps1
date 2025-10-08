# Load Sentry credentials from the workspace .env file and expose them to the current session and user scope
$envPath = Join-Path $PSScriptRoot '..\.env'
if (-not (Test-Path $envPath)) {
    Write-Error "Unable to locate .env file at $envPath"
    exit 1
}

$envContent = Get-Content $envPath

function Get-EnvValue {
    param(
        [string[]]$Content,
        [string[]]$Keys
    )

    foreach ($key in $Keys) {
        $pattern = "^\s*#?\s*" + [regex]::Escape($key) + "\s*="
        $line = $Content | Where-Object { $_ -match $pattern } | Select-Object -First 1
        if ($line) {
            $value = ($line -replace $pattern, '').Trim()
            if ($value) {
                return $value
            }
        }
    }

    return $null
}

$sentryAuth = Get-EnvValue -Content $envContent -Keys @('SENTRY_AUTH_TOKEN', 'SENTRY_API', 'SENTRY_ACCESS_TOKEN')
$sentryDsn = Get-EnvValue -Content $envContent -Keys @('SENTRY_DSN', 'SENTRY_DNS')
$openaiKey = Get-EnvValue -Content $envContent -Keys @('OPENAI_API_KEY', 'OPENAI_KEY')

if (-not $sentryAuth -or -not $sentryDsn) {
    Write-Error 'Missing SENTRY_AUTH_TOKEN/SENTRY_API or SENTRY_DSN entries in .env'
    exit 1
}

[System.Environment]::SetEnvironmentVariable('SENTRY_AUTH_TOKEN', $sentryAuth, 'User')
[System.Environment]::SetEnvironmentVariable('SENTRY_ACCESS_TOKEN', $sentryAuth, 'User')
[System.Environment]::SetEnvironmentVariable('SENTRY_API', $sentryAuth, 'User')
[System.Environment]::SetEnvironmentVariable('SENTRY_DSN', $sentryDsn, 'User')
if ($openaiKey) { [System.Environment]::SetEnvironmentVariable('OPENAI_API_KEY', $openaiKey, 'User') }
$env:SENTRY_AUTH_TOKEN = $sentryAuth
$env:SENTRY_ACCESS_TOKEN = $sentryAuth
$env:SENTRY_API = $sentryAuth
$env:SENTRY_DSN = $sentryDsn
if ($openaiKey) { $env:OPENAI_API_KEY = $openaiKey }

$tokenTail = if ($sentryAuth.Length -ge 4) { $sentryAuth.Substring($sentryAuth.Length - 4) } else { $sentryAuth }
$dsnHost = try { ([uri]$sentryDsn).Host } catch { 'unknown-host' }
Write-Host ("Sentry credentials loaded (token tail **{0}, host: {1})." -f $tokenTail, $dsnHost) -ForegroundColor Green
