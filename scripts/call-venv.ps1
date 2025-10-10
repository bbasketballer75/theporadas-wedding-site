param(
    [Parameter(Mandatory = $true)]
    [string]$VenvActivatePath
)

if (-not (Test-Path $VenvActivatePath)) {
    Write-Error "Virtualenv activate script not found: $VenvActivatePath"
    exit 1
}

# Properly invoke activation script with the call operator and a quoted path
Write-Host "Activating virtualenv: $VenvActivatePath"
& "$VenvActivatePath"
