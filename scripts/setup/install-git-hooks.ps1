param(
    [string]$RepoRoot = (Get-Location)
)

$source = Join-Path $PSScriptRoot '..\githooks\pre-push'
$destDir = Join-Path (Resolve-Path "$RepoRoot\.git").Path 'hooks'
$dest = Join-Path $destDir 'pre-push'

if (-not (Test-Path $source)) {
    Write-Error "No githooks/pre-push found in repository."
    exit 1
}

Write-Host "Installing pre-push hook to: $dest"
Copy-Item -Path $source -Destination $dest -Force

# Ensure the hook is executable in POSIX environments (Git Bash) and set CRLF -> LF
(Get-Content -Path $dest) | Set-Content -Path $dest -NoNewline -Encoding UTF8

try {
    git update-index --chmod=+x .git/hooks/pre-push
}
catch {
    Write-Host "Could not set +x bit via git; ensure your environment supports executing hooks (Git Bash)."
}

Write-Host "Git hooks installed."
