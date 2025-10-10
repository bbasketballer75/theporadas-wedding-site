<#
  Set MCP-related environment variables in the current user environment.
  Usage examples:
    ./set-mcp-auth.ps1 -GithubToken "ghp_xxx" -BraveKey "brave_subscription_token"
    ./set-mcp-auth.ps1 -FirebaseToken "token" -Persist

  This script does not store tokens in the repository. Use `-Persist` to write to
  the User environment variables (requires no admin on Windows). Avoid committing
  exported environment files.
#>
param(
  [string]$GithubToken,
  [string]$BraveKey,
  [string]$FirebaseToken,
  [switch]$Persist
)

function Set-UserEnvVar($name, $value) {
  if (-not $value) { return }
  if ($Persist) {
    [System.Environment]::SetEnvironmentVariable($name, $value, 'User')
    Write-Host "Set user environment variable: $name"
  }
  else {
    # Use the env: provider with dynamic variable name (concatenate to avoid parser issues)
    $envPath = 'Env:' + $name
    Set-Item -Path $envPath -Value $value -Force
    Write-Host "Set environment variable for current session: $name"
  }
}

Set-UserEnvVar -name 'GITHUB_PERSONAL_ACCESS_TOKEN' -value $GithubToken
Set-UserEnvVar -name 'BRAVE_API_KEY' -value $BraveKey
if ($BraveKey) {
  Write-Host 'BRAVE_API_KEY doubles as the X-Subscription-Token header for Brave.' -ForegroundColor Gray
}
Set-UserEnvVar -name 'FIREBASE_TOKEN' -value $FirebaseToken

Write-Host "Done. If you used -Persist, restart VS Code and any terminals to pick up the new User env vars."
