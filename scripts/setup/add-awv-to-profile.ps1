param(
    [string]$ProfilePath
)

if (-not $ProfilePath) {
    $ProfilePath = $PROFILE
}

if (-not $ProfilePath) {
    Write-Error 'Unable to determine PowerShell profile path.'
    exit 1
}

$profileDir = Split-Path -Parent $ProfilePath
if (-not (Test-Path $profileDir)) {
    New-Item -ItemType Directory -Path $profileDir -Force | Out-Null
}
if (-not (Test-Path $ProfilePath)) {
    New-Item -ItemType File -Path $ProfilePath -Force | Out-Null
}

$marker = '# Wedding Website virtual environment helper'
$existingContent = Get-Content -Path $ProfilePath -ErrorAction SilentlyContinue
if ($existingContent -and ($existingContent -match [regex]::Escape($marker))) {
    Write-Host "awv helper already present in profile: $ProfilePath" -ForegroundColor Yellow
    exit 0
}

$snippet = @"
$marker
function awv {
    . 'F:\wedding-website\scripts\activate-venv.ps1'
}

"@

Add-Content -Path $ProfilePath -Value $snippet
Write-Host "Added awv helper to PowerShell profile: $ProfilePath" -ForegroundColor Green
