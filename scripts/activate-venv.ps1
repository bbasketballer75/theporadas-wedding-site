param(
    [string]$ProjectRoot
)

if (-not $ProjectRoot) {
    $ProjectRoot = Split-Path -Parent $PSScriptRoot
}

$activateScript = Join-Path $ProjectRoot ".venv\Scripts\Activate.ps1"

if (-not (Test-Path $activateScript)) {
    Write-Error "Virtual environment activate script not found at $activateScript"
    return
}

$alreadyActive = $env:VIRTUAL_ENV -and (Test-Path $env:VIRTUAL_ENV)

. $activateScript

if ($alreadyActive) {
    Write-Host "Virtual environment refreshed from $activateScript" -ForegroundColor Yellow
}
else {
    Write-Host "Activated virtual environment located at $activateScript" -ForegroundColor Green
}
