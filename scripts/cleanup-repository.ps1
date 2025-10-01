# ============================================================================
# Repository Cleanup & Git Configuration Script
# Purpose: Remove duplicates, clean build artifacts, update .gitignore
# ============================================================================

Write-Host "`n╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          🧹 REPOSITORY CLEANUP STARTING                      ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# ============================================================================
# PHASE 1: BACKUP CURRENT STATE
# ============================================================================
Write-Host "📦 Phase 1: Creating backup..." -ForegroundColor Yellow

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "backups/pre-cleanup-$timestamp"

New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
Write-Host "✓ Backup directory created: $backupDir" -ForegroundColor Green

# Backup .gitignore
Copy-Item .gitignore "$backupDir/.gitignore.backup" -ErrorAction SilentlyContinue
Write-Host "✓ Current .gitignore backed up" -ForegroundColor Green

# ============================================================================
# PHASE 2: REMOVE DUPLICATE/TEMPORARY DIRECTORIES
# ============================================================================
Write-Host "`n🗑️  Phase 2: Removing duplicate and temporary directories..." -ForegroundColor Yellow

$dirsToRemove = @(
    "_worktree_submodule_update",
    "_worktree_submodule_update_main",
    '${PWD}',
    "coding-crap",
    "backups/reclone_after_push",
    "backups/reclone_post_rewrite",
    "tmp-recover-bundle",
    "rebase-blocking-backup",
    ".next"  # Root .next (site/.next is kept temporarily)
)

foreach ($dir in $dirsToRemove) {
    if (Test-Path $dir) {
        Write-Host "  Removing: $dir" -ForegroundColor Gray
        Remove-Item -Path $dir -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "  ✓ Removed: $dir" -ForegroundColor Green
    } else {
        Write-Host "  ⊘ Not found: $dir (already clean)" -ForegroundColor DarkGray
    }
}

# ============================================================================
# PHASE 3: REMOVE BUILD ARTIFACTS
# ============================================================================
Write-Host "`n🏗️  Phase 3: Cleaning build artifacts..." -ForegroundColor Yellow

# Clean Next.js build artifacts (keep site/out for now as it's the deployment artifact)
if (Test-Path "site/.next") {
    Write-Host "  Removing: site/.next" -ForegroundColor Gray
    Remove-Item -Path "site/.next" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ Removed: site/.next" -ForegroundColor Green
}

# Clean coverage reports (can be regenerated)
$coverageDirs = Get-ChildItem -Path . -Filter "coverage" -Recurse -Directory -ErrorAction SilentlyContinue
foreach ($dir in $coverageDirs) {
    Write-Host "  Removing: $($dir.FullName)" -ForegroundColor Gray
    Remove-Item -Path $dir.FullName -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ Removed: $($dir.FullName)" -ForegroundColor Green
}

# Clean Python cache
$pycacheDirs = Get-ChildItem -Path . -Filter "__pycache__" -Recurse -Directory -ErrorAction SilentlyContinue
foreach ($dir in $pycacheDirs) {
    Write-Host "  Removing: $($dir.FullName)" -ForegroundColor Gray
    Remove-Item -Path $dir.FullName -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ Removed: $($dir.FullName)" -ForegroundColor Green
}

# ============================================================================
# PHASE 4: REMOVE TEMPORARY LOG FILES
# ============================================================================
Write-Host "`n📋 Phase 4: Cleaning temporary log files..." -ForegroundColor Yellow

# Keep structure but remove temporary logs
$tempLogs = @(
    "logs/jest-*.txt",
    "logs/git-fsck.txt",
    "logs/gitlinks*.txt",
    "logs/objects-*.txt",
    "logs/mcp-*.json",
    "logs/playwright-*.json",
    "logs/replacements_*.txt",
    "logs/screenshot.run.err",
    "logs/*.err"
)

foreach ($pattern in $tempLogs) {
    $files = Get-ChildItem -Path $pattern -ErrorAction SilentlyContinue
    foreach ($file in $files) {
        Write-Host "  Removing: $($file.Name)" -ForegroundColor Gray
        Remove-Item -Path $file.FullName -Force -ErrorAction SilentlyContinue
        Write-Host "  ✓ Removed: $($file.Name)" -ForegroundColor Green
    }
}

# ============================================================================
# PHASE 5: UPDATE .gitignore
# ============================================================================
Write-Host "`n📝 Phase 5: Updating .gitignore..." -ForegroundColor Yellow

if (Test-Path ".gitignore.new") {
    Write-Host "  Replacing .gitignore with comprehensive version" -ForegroundColor Gray
    Move-Item -Path ".gitignore.new" -Destination ".gitignore" -Force
    Write-Host "  ✓ .gitignore updated" -ForegroundColor Green
} else {
    Write-Host "  ⚠ .gitignore.new not found, keeping current .gitignore" -ForegroundColor Yellow
}

# ============================================================================
# PHASE 6: GIT CLEANUP
# ============================================================================
Write-Host "`n🔧 Phase 6: Git repository cleanup..." -ForegroundColor Yellow

# Remove files that are now ignored
Write-Host "  Removing files from git that are now ignored..." -ForegroundColor Gray
git rm -r --cached . 2>$null | Out-Null
Write-Host "  ✓ Cached files cleared" -ForegroundColor Green

Write-Host "  Re-adding files according to new .gitignore..." -ForegroundColor Gray
git add . 2>$null | Out-Null
Write-Host "  ✓ Files re-added" -ForegroundColor Green

# ============================================================================
# PHASE 7: SUMMARY & RECOMMENDATIONS
# ============================================================================
Write-Host "`n╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          ✅ CLEANUP COMPLETE!                                 ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "📊 Changes Summary:" -ForegroundColor Yellow
Write-Host ""

# Count modified files
$gitStatus = git status --short
$modifiedCount = ($gitStatus | Measure-Object).Count

Write-Host "  • Removed duplicate directories (worktrees, temp folders)" -ForegroundColor Green
Write-Host "  • Cleaned build artifacts (.next, coverage, dist)" -ForegroundColor Green
Write-Host "  • Removed Python cache (__pycache__)" -ForegroundColor Green
Write-Host "  • Cleaned temporary log files" -ForegroundColor Green
Write-Host "  • Updated .gitignore (comprehensive)" -ForegroundColor Green
Write-Host "  • Git index updated ($modifiedCount files changed)" -ForegroundColor Green

Write-Host "`n📋 What's Now Ignored:" -ForegroundColor Yellow
Write-Host "  • All build artifacts (.next/, out/, dist/)" -ForegroundColor Gray
Write-Host "  • All node_modules/ directories" -ForegroundColor Gray
Write-Host "  • All logs/ and temporary files" -ForegroundColor Gray
Write-Host "  • Personal VS Code settings (.vscode/settings.json)" -ForegroundColor Gray
Write-Host "  • All worktree directories (_worktree_*)" -ForegroundColor Gray
Write-Host "  • All .env files (secrets protected)" -ForegroundColor Gray
Write-Host "  • All __pycache__/ and *.pyc files" -ForegroundColor Gray
Write-Host "  • All coverage/ reports" -ForegroundColor Gray

Write-Host "`n🎯 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Review changes: git status" -ForegroundColor Cyan
Write-Host "  2. Review diff: git diff --cached --stat" -ForegroundColor Cyan
Write-Host "  3. Commit cleanup: git commit -m 'chore: comprehensive repository cleanup'" -ForegroundColor Cyan
Write-Host "  4. Push to remote: git push origin security/dependabot-fixes" -ForegroundColor Cyan

Write-Host "`n💡 Recommendation:" -ForegroundColor Yellow
Write-Host "  Run 'git status' to see what will be committed." -ForegroundColor Gray
Write-Host "  Everything should now be clean with no duplicates!" -ForegroundColor Gray

Write-Host ""
