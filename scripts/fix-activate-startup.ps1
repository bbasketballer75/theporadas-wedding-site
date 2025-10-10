param(
  [switch]$Fix
)

Write-Host "Searching common PowerShell profile locations and VS Code user settings for malformed Activate.ps1 invocations..."

$candidates = @()

# Candidate profile locations
$candidates += $PROFILE.AllUsersAllHosts
$candidates += $PROFILE.AllUsersCurrentHost
$candidates += $PROFILE.CurrentUserAllHosts
$candidates += $PROFILE.CurrentUserCurrentHost

# VS Code user settings (Insiders and stable)
$candidates += Join-Path $env:APPDATA 'Code - Insiders\User\settings.json'
$candidates += Join-Path $env:APPDATA 'Code\User\settings.json'

$issues = @()

foreach ($file in $candidates | Select-Object -Unique) {
  if (-not (Test-Path $file)) { continue }
  try {
    $content = Get-Content -Raw -Path $file -ErrorAction Stop
  }
  catch { continue }

  # Look for patterns: unquoted call operator, or the pattern: "&" F:\...
  $pattern1 = '(^|\s)&\s+([A-Za-z]:\\[^\r\n\"]+Activate\.ps1)'
  $pattern2 = '"&"\s+([A-Za-z]:\\[^\r\n\"]+Activate\.ps1)'

  $matches1 = [System.Text.RegularExpressions.Regex]::Matches($content, $pattern1, 'IgnoreCase')
  $matches2 = [System.Text.RegularExpressions.Regex]::Matches($content, $pattern2, 'IgnoreCase')

  if ($matches1.Count -gt 0 -or $matches2.Count -gt 0) {
    Write-Host "Found potential activation lines in: $file" -ForegroundColor Yellow
    foreach ($m in $matches1) { $issues += [PSCustomObject]@{File = $file; Text = $m.Value; FixType = 'ProfileUnquoted' } }
    foreach ($m in $matches2) { $issues += [PSCustomObject]@{File = $file; Text = $m.Value; FixType = 'QuotedAmpersand' } }

    if ($Fix) {
      $fixed = $content
      # Replace pattern1: & C:\path\Activate.ps1 -> & 'C:\path\Activate.ps1'
      # Replace pattern1: & C:\path\Activate.ps1 -> & 'C:\path\Activate.ps1'
      $fixed = [System.Text.RegularExpressions.Regex]::Replace($fixed, $pattern1, "& '$2'", 'IgnoreCase')
      # Replace pattern2: "&" C:\path -> & 'C:\path'
      $fixed = [System.Text.RegularExpressions.Regex]::Replace($fixed, $pattern2, "& '$1'", 'IgnoreCase')

      if ($fixed -ne $content) {
        Write-Host "Applying fixes to $file" -ForegroundColor Green
        # Backup original
        Copy-Item -Path $file -Destination "$file.bak" -Force
        Set-Content -Path $file -Value $fixed -Encoding UTF8
        Write-Host "Backup of original written to $file.bak" -ForegroundColor Gray
      }
    }
  }
}

if ($issues.Count -eq 0) { Write-Host "No malformed activation lines found." -ForegroundColor Green } else { Write-Host "Issues found:"; $issues | Format-Table -AutoSize }
