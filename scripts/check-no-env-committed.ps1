# Check whether .env is tracked in git (fail if so)
$root = (git rev-parse --show-toplevel) 2>$null
if ($LASTEXITCODE -ne 0 -or -not $root) {
    Write-Error "Not a git repo"
    exit 2
}

$tracked = git ls-files --error-unmatch .env 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Error ".env is tracked in git. Please remove sensitive values and add .env to .gitignore."
    exit 1
}

Write-Host ".env is not tracked in git." -ForegroundColor Green
exit 0
