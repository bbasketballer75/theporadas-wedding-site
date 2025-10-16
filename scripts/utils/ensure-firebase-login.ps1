<#
  Ensure Firebase CLI is logged in or a FIREBASE_TOKEN is provided.
  Usage: ./ensure-firebase-login.ps1 [-FailOnMissing] [-Verbose]
  - If no interactive login is available, pass a FIREBASE_TOKEN (CI or user token)
    as an environment variable before running.
#>
param(
    [switch]$FailOnMissing
)

Write-Host "Checking Firebase CLI authentication..."

try {
    # Use Start-Process to avoid PowerShell parsing issues with arguments containing colons etc.
    # Use cmd.exe /c which will pick up npx from the PATH and run it like a normal shell command
    $cmd = "npx --yes firebase-tools@latest projects:list --json"
    $proc = Start-Process -FilePath 'cmd.exe' -ArgumentList @('/c', $cmd) -NoNewWindow -Wait -PassThru -ErrorAction Stop
    if ($proc.ExitCode -ne 0) {
        Write-Host "Firebase CLI appears not to be logged in or not authorized." -ForegroundColor Yellow
        Write-Host "If you have the Firebase CLI installed, run: firebase login"
        Write-Host "For CI or non-interactive environments, set FIREBASE_TOKEN environment variable:" 
        Write-Host "  [PowerShell]  $env:FIREBASE_TOKEN = '<your_token>' ; [System.Environment]::SetEnvironmentVariable('FIREBASE_TOKEN','<your_token>','User')"
        if ($FailOnMissing) { exit 2 }
    }
    else {
        Write-Host "Firebase CLI is authenticated and returned a list of projects (or accessible)." -ForegroundColor Green
    }
}
catch {
    Write-Host "Firebase check failed: $($_.Exception.Message)" -ForegroundColor Yellow
    if ($FailOnMissing) { exit 3 }
}
