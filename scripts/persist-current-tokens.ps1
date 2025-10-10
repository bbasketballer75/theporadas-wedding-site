# Persist existing environment tokens (Process or User) into User environment variables
# This is a helper that runs the existing set-mcp-auth.ps1 script with values discovered in the current environment.

$g = [System.Environment]::GetEnvironmentVariable('GITHUB_PERSONAL_ACCESS_TOKEN', 'Process')
if (-not $g) { $g = [System.Environment]::GetEnvironmentVariable('GITHUB_PERSONAL_ACCESS_TOKEN', 'User') }
$b = [System.Environment]::GetEnvironmentVariable('BRAVE_API_KEY', 'Process')
if (-not $b) { $b = [System.Environment]::GetEnvironmentVariable('BRAVE_API_KEY', 'User') }
$f = [System.Environment]::GetEnvironmentVariable('FIREBASE_TOKEN', 'Process')
if (-not $f) { $f = [System.Environment]::GetEnvironmentVariable('FIREBASE_TOKEN', 'User') }

# Call the persisting helper
. "$PSScriptRoot\set-mcp-auth.ps1" -GithubToken $g -BraveKey $b -FirebaseToken $f -Persist

Write-Host "Persist helper completed. If any value was missing it was skipped. Restart VS Code and terminals to pick up new values."