<#
  Load a .env-style file into the current PowerShell session safely.
  Usage:
    ./load-env.ps1                # loads .env from current directory
    ./load-env.ps1 -EnvFile .env.local
    ./load-env.ps1 -EnvFile ../.env -MaskValues

  Notes:
  - This script does not persist values to User environment. For persistence use
    scripts/set-mcp-auth.ps1 with -Persist.
  - Values are masked when printed to avoid leaking secrets to logs.
#>
param(
    [string]$EnvFile = '.env',
    [switch]$MaskValues
)

if (-not (Test-Path $EnvFile)) {
    Write-Warning "Env file not found: $EnvFile"
    exit 1
}

Write-Host "Loading environment file: $EnvFile" -ForegroundColor Cyan

Get-Content $EnvFile | ForEach-Object {
    $line = $_.Trim()
    if (-not $line) { return }
    if ($line.StartsWith('#')) { return }
    if ($line -notmatch '=') { return }
    $pair = $line -split '=', 2
    $name = $pair[0].Trim()
    $value = $pair[1].Trim('"')
    # Do not echo value directly; mask when requested
    if ($MaskValues) {
        $masked = if ($value.Length -gt 8) { $value.Substring(0, 4) + '...' + $value.Substring($value.Length - 4) } else { '****' }
        Write-Host "Setting $name = $masked"
    }
    else {
        Write-Host "Setting $name" -ForegroundColor Gray
    }
    Set-Item -Path "Env:\$name" -Value $value -Force
}

Write-Host "Environment variables loaded into current session."
