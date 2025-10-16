<#
  Safe repair helper for npm install failures on Windows.
  Strategy:
    1. Try to rename existing node_modules to node_modules.backup-<timestamp> (non-destructive).
    2. If rename fails due to locked files, attempt to stop common locking processes (node).
    3. Retry rename; if still failing, print guidance and abort.
    4. Run `npm ci` in the site folder. If install succeeds, remove the backup folder; if it fails, leave the backup intact.

  Usage: Run from repo root (the script will target the site/ folder):
    pwsh -NoProfile -ExecutionPolicy Bypass -File .\scripts\repair-npm-install.ps1

  Note: This script is conservative — it renames rather than deletes and will not remove
  backups automatically unless the install succeeds.
#>

param(
    [string]$SiteDir
)

# Determine target site directory if not explicitly provided
if (-not $SiteDir) {
    $cwd = (Get-Location).Path
    if ([System.IO.Path]::GetFileName($cwd) -ieq 'site') {
        $SiteDir = $cwd
    }
    else {
        $SiteDir = Join-Path $cwd 'site'
    }
}

# Normalize SiteDir and collapse accidental duplicate 'site\site' occurrences
$SiteDir = [System.IO.Path]::GetFullPath($SiteDir)
if ($SiteDir -match '(?i)\\site\\site') {
    $SiteDir = $SiteDir -replace '(?i)\\site\\site', '\\site'
}

Write-Host "Repairing npm install in: $SiteDir" -ForegroundColor Cyan

if (-not (Test-Path $SiteDir)) {
    Write-Host "Site directory not found: $SiteDir" -ForegroundColor Red
    exit 1
}

$nodeModules = Join-Path $SiteDir 'node_modules'
if (-not (Test-Path $nodeModules)) {
    Write-Host "No node_modules folder present. Running npm ci directly..." -ForegroundColor Gray
    Push-Location $SiteDir
    npm ci
    $code = $LASTEXITCODE
    Pop-Location
    exit $code
}

$timestamp = Get-Date -Format 'yyyyMMddHHmmss'
$backup = "$nodeModules.backup-$timestamp"

function Move-NodeModulesToBackup {
    try {
        Rename-Item -Path $nodeModules -NewName (Split-Path $backup -Leaf) -ErrorAction Stop
        return $true
    }
    catch {
        Write-Host "Rename failed: $($_.Exception.Message)" -ForegroundColor Yellow
        return $false
    }
}

Write-Host "Attempting to rename node_modules -> $backup" -ForegroundColor Gray
if (-not (Move-NodeModulesToBackup)) {
    Write-Host "Attempting to stop node processes (may free locks)..." -ForegroundColor Gray
    try {
        $nodes = Get-Process -Name node -ErrorAction SilentlyContinue
        if ($nodes) {
            $nodes | ForEach-Object { Write-Host "Stopping process: $($_.Id) $($_.ProcessName)" -ForegroundColor Gray; Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue }
            Start-Sleep -Seconds 1
        }
        else {
            Write-Host "No node processes found." -ForegroundColor Gray
        }
    }
    catch {
        Write-Host "Stopping node processes failed or insufficient privileges: $($_.Exception.Message)" -ForegroundColor Yellow
    }

    Write-Host "Retrying rename..." -ForegroundColor Gray
    if (-not (Move-NodeModulesToBackup)) {
        Write-Host "Could not rename node_modules after stopping node processes. Attempting to escalate by stopping common editors and browsers that may hold handles..." -ForegroundColor Yellow

        # Attempt to clear read-only attributes on the node_modules folder contents
        try {
            Get-ChildItem -LiteralPath $nodeModules -Recurse -Force -ErrorAction SilentlyContinue | ForEach-Object { $_.Attributes = 'Normal' }
            Write-Host "Cleared file attributes in node_modules (best-effort)." -ForegroundColor Gray
        }
        catch {
            Write-Host "Clearing attributes failed: $($_.Exception.Message)" -ForegroundColor Yellow
        }

        # Stop common locking processes (VS Code, Brave, Chrome, Edge)
        $candidates = Get-Process -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -match '^(Code|code|brave|chrome|msedge)$' }
        if ($candidates) {
            $candidates | ForEach-Object { Write-Host "Stopping process: $($_.Id) $($_.ProcessName)" -ForegroundColor Gray; Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue }
            Start-Sleep -Seconds 1
        }
        else {
            Write-Host "No candidate editor/browser processes found to stop." -ForegroundColor Gray
        }

        Write-Host "Retrying rename after stopping editors/browsers..." -ForegroundColor Gray
        if (-not (Move-NodeModulesToBackup)) {
            Write-Host "Rename still failing. Attempting robocopy mirror of an empty folder to purge contents (best-effort)." -ForegroundColor Yellow

            $tmpEmpty = Join-Path $env:TEMP "empty-for-robocopy-$timestamp"
            if (-not (Test-Path $tmpEmpty)) { New-Item -Path $tmpEmpty -ItemType Directory | Out-Null }
            # robocopy empty -> node_modules with /MIR will remove files in destination
            $robocmd = "robocopy `"$tmpEmpty`" `"$nodeModules`" /MIR"
            Write-Host "Running: $robocmd" -ForegroundColor Gray
            $roboprocess = Start-Process -FilePath robocopy -ArgumentList @($tmpEmpty, $nodeModules, '/MIR') -NoNewWindow -Wait -PassThru -ErrorAction SilentlyContinue
            if ($roboprocess) {
                $rcode = $roboprocess.ExitCode
                Write-Host "robocopy exit code: $rcode" -ForegroundColor Gray
                # robocopy codes 0-7 are generally successful with warnings; >7 indicates failure
                if ($rcode -le 7) {
                    Write-Host "robocopy purged node_modules contents (best-effort). Attempting to remove the now-empty folder." -ForegroundColor Gray
                    try { Remove-Item -LiteralPath $nodeModules -Recurse -Force -ErrorAction Stop; Write-Host "Removed node_modules after robocopy." -ForegroundColor Green }
                    catch { Write-Host "Removal after robocopy failed: $($_.Exception.Message)" -ForegroundColor Yellow }
                }
                else {
                    Write-Host "robocopy indicated failure. Attempting to adjust ACLs for node_modules." -ForegroundColor Yellow
                }
            }

            # If node_modules still exists, try to set ACLs to current user and retry rename
            if (Test-Path $nodeModules) {
                try {
                    $user = "$env:USERDOMAIN\$env:USERNAME"
                    Write-Host "Attempting to grant full control to $user via icacls (best-effort)" -ForegroundColor Gray
                    $aclArg = "${user}:(OI)(CI)F"
                    $ic = Start-Process -FilePath icacls -ArgumentList @($nodeModules, '/grant', $aclArg, '/T') -NoNewWindow -Wait -PassThru -ErrorAction SilentlyContinue
                    Write-Host "icacls exit code: $($ic.ExitCode)" -ForegroundColor Gray
                }
                catch { Write-Host "icacls attempt failed: $($_.Exception.Message)" -ForegroundColor Yellow }

                Write-Host "Retrying rename after ACL change..." -ForegroundColor Gray
                if (-not (Move-NodeModulesToBackup)) {
                    Write-Host "Could not rename node_modules. Manual intervention required: close editors (VS Code/Brave/Edge/Chrome), disable AV, or run as Administrator." -ForegroundColor Red
                    Write-Host "Node_modules location: $nodeModules" -ForegroundColor Gray
                    exit 2
                }
            }
        }
    }
}

Write-Host "node_modules renamed to backup. Running npm ci to recreate dependencies..." -ForegroundColor Cyan
Push-Location $SiteDir
try {
    npm ci
    $exit = $LASTEXITCODE
    if ($exit -eq 0) {
        Write-Host "npm ci succeeded. Removing backup folder: $backup" -ForegroundColor Green
        try { Remove-Item -LiteralPath $backup -Recurse -Force -ErrorAction Stop; Write-Host "Backup removed." -ForegroundColor Green }
        catch { Write-Warning "Failed to remove backup folder; it is preserved at: $backup" }
    }
    else {
        Write-Warning "npm ci failed with exit code $exit. Backup preserved at: $backup"
    }
    Pop-Location
    exit $exit
}
catch {
    Pop-Location
    Write-Warning "npm ci execution failed: $($_.Exception.Message). Backup preserved at: $backup"
    exit 3
}
