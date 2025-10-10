param(
  [string[]]$PathsToScan = @($env:USERPROFILE, $env:APPDATA, $env:LOCALAPPDATA),
  [int]$MaxDepth = 6
)

Write-Host "Scanning user folders for occurrences of 'Activate.ps1' (this may take a moment)..."
$foundMatches = @()
foreach ($root in $PathsToScan | Where-Object { Test-Path $_ }) {
  Write-Host "Scanning $root" -ForegroundColor Gray
  try {
    $files = Get-ChildItem -Path $root -Recurse -Depth $MaxDepth -ErrorAction SilentlyContinue | Where-Object { $_.PSIsContainer -eq $false -and $_.Length -lt 1048576 }
    foreach ($f in $files) {
      try {
        $found = Select-String -Path $f.FullName -Pattern 'Activate.ps1' -SimpleMatch -ErrorAction SilentlyContinue
        if ($found) { $foundMatches += $found }
      }
      catch { }
    }
  }
  catch { Write-Host ('Scan failed for {0}: {1}' -f $root, $_.Exception.Message) -ForegroundColor Yellow }
}

if ($foundMatches.Count -eq 0) { Write-Host "No occurrences of Activate.ps1 detected in scanned user paths." -ForegroundColor Green }
else {
  $report = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) '..\.activate-locations.json'
  $foundMatches | Select-Object Path, LineNumber, Line | ConvertTo-Json -Depth 5 | Out-File $report -Encoding UTF8
  Write-Host "Found matches written to $report" -ForegroundColor Yellow
  $foundMatches | Select-Object Path, LineNumber, Line | Format-Table -AutoSize
}
