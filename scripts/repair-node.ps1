param(
  [string]$NodeVersion = 'lts',
  [switch]$WhatIf
)

Write-Host "This helper will download and run the Node.js installer for Windows (requested version: $NodeVersion)." -ForegroundColor Yellow
if ($WhatIf) { Write-Host "WhatIf mode: no installer will be executed."; exit 0 }

$arch = if ([Environment]::Is64BitOperatingSystem) { 'x64' } else { 'x86' }
Write-Host "Detected OS architecture: $arch"

# Simple mapping to official Node LTS download URL pattern; user should confirm before running
$base = 'https://nodejs.org/dist'
if ($NodeVersion -eq 'lts') {
  $verIndex = (Invoke-RestMethod -Uri "$base/index.json" -UseBasicParsing)[0]
  $nodeVer = $verIndex.version
} else {
  $nodeVer = 'v' + $NodeVersion.TrimStart('v')
}

$installerName = "node-$($nodeVer)-x64.msi"
$installerUrl = "$base/$nodeVer/$installerName"

Write-Host "Resolved installer URL: $installerUrl"
Write-Host "Downloading installer to temporary path..."

$tmp = Join-Path $env:TEMP $installerName
Invoke-WebRequest -Uri $installerUrl -OutFile $tmp -UseBasicParsing

Write-Host "Downloaded: $tmp"
Write-Host "Launching installer with elevated privileges..."

$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = 'msiexec.exe'
$psi.Arguments = "/i `"$tmp`" /qn /norestart"
$psi.Verb = 'runas'
$psi.UseShellExecute = $true

[System.Diagnostics.Process]::Start($psi) | Out-Null

Write-Host "Installer launched. Wait for completion and then verify with: node --version and npx --version" -ForegroundColor Green
