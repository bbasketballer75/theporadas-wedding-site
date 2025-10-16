# Check common PowerShell profile files for problematic Activate.ps1 or unmatched call operator patterns
$paths = @($PROFILE.AllUsersAllHosts, $PROFILE.AllUsersCurrentHost, $PROFILE.CurrentUserAllHosts, $PROFILE.CurrentUserCurrentHost)
$problemLines = @()
foreach ($p in $paths) {
    Write-Host '----' $p
    if (Test-Path $p) {
        $lines = Get-Content $p -ErrorAction SilentlyContinue
        for ($i = 0; $i -lt $lines.Count; $i++) {
            $line = $lines[$i]
            if ($line -match 'Activate\.ps1' -or $line -match '\\venv\\Scripts' -or $line -match '(^|\s)&\s+\S') {
                Write-Host "Match in $p (line $($i+1)): $line" -ForegroundColor Yellow
                $problemLines += [PSCustomObject]@{ Path = $p; LineNumber = $i + 1; Text = $line }
            }
        }
    }
    else {
        Write-Host 'MISSING'
    }
}

if ($problemLines.Count -eq 0) {
    Write-Host 'No suspicious profile lines found.' -ForegroundColor Green
}
else {
    $out = Join-Path $PSScriptRoot '..' '.profile-issues.json'
    $problemLines | ConvertTo-Json -Depth 3 | Out-File $out -Encoding UTF8
    Write-Host "Wrote report to $out" -ForegroundColor Yellow
}

return $problemLines.Count
