<#
  Wrapper to run Playwright in a way that avoids calling the PowerShell 'npx.ps1' wrapper
  Usage examples:
    ./run-playwright.ps1                      # runs default: npx.cmd playwright test
    ./run-playwright.ps1 -- --project=chromium  # forwards args to the npx invocation
#>
param(
  [Parameter(ValueFromRemainingArguments = $true)]
  $RemainingArgs
)

# Resolve an npx CMD executable; fall back to 'npx.cmd' if not found
$npxCmdEntry = Get-Command npx -CommandType Application, ExternalScript | Where-Object { $_.Path -match '\\npx\.cmd$' } | Select-Object -First 1
$npxCmd = if ($npxCmdEntry) { $npxCmdEntry.Path } else { 'npx.cmd' }

$argList = @('playwright', 'test')
if ($null -ne $RemainingArgs -and $RemainingArgs.Count -gt 0) {
  $argList += $RemainingArgs
}
Write-Host "Running: $npxCmd $($argList -join ' ')"

$proc = Start-Process -FilePath $npxCmd -ArgumentList $argList -NoNewWindow -Wait -PassThru
exit $proc.ExitCode