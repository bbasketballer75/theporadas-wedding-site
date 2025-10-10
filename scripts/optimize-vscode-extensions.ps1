# VS Code Extension Optimization Script
# Removes unnecessary extensions and installs recommended ones
# Run with: .\scripts\optimize-vscode-extensions.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VS Code Extension Optimization" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Extensions to REMOVE
$extensionsToRemove = @(
    "be5invis.vscode-icontheme-nomo-dark",      # Duplicate icon theme
    "vscode-icons-team.vscode-icons",           # Duplicate icon theme (keeping Material)
    "donjayamanne.githistory",                  # GitLens covers this
    "orta.vscode-jest",                         # Using Playwright, not Jest
    "firsttris.vscode-jest-runner",             # Using Playwright, not Jest
    "ms-vscode.cpptools",                       # Not using C++
    "ms-dotnettools.vscode-dotnet-runtime",     # Not using .NET
    "wallabyjs.quokka-vscode",                  # Inline logging extensions removed
    "rangav.vscode-thunder-client",             # Not needed for this project
    "codezombiech.gitignore",                   # One-time use, not needed
    "afractal.node-essentials",                 # Redundant with npm-intellisense
    "visualstudioexptteam.vscodeintellicode",   # Copilot is superior
    "visualstudioexptteam.intellicode-api-usage-examples" # Copilot is superior
)

# Extensions to INSTALL
$extensionsToInstall = @(
    "unifiedjs.vscode-mdx",                     # MDX support for React docs
    "styled-components.vscode-styled-components", # Better CSS-in-JS support
    "meganrogge.template-string-converter",     # Auto-convert to template strings
    "chakrounanas.turbo-console-log",           # Better console.log workflow
    "waderyan.gitblame"                         # Inline git blame (lighter than GitLens)
)

Write-Host "🗑️  REMOVING unnecessary extensions..." -ForegroundColor Yellow
Write-Host ""

foreach ($ext in $extensionsToRemove) {
    Write-Host "  Removing: $ext" -ForegroundColor Red
    & code-insiders --uninstall-extension $ext --force 2>$null
}

Write-Host ""
Write-Host "✅ Removal complete!" -ForegroundColor Green
Write-Host ""
Write-Host "➕ INSTALLING recommended extensions..." -ForegroundColor Yellow
Write-Host ""

foreach ($ext in $extensionsToInstall) {
    Write-Host "  Installing: $ext" -ForegroundColor Green
    & code-insiders --install-extension $ext --force 2>$null
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ OPTIMIZATION COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor White
Write-Host "  • Removed: $($extensionsToRemove.Count) extensions" -ForegroundColor Red
Write-Host "  • Added: $($extensionsToInstall.Count) extensions" -ForegroundColor Green
Write-Host "  • Net change: -$($extensionsToRemove.Count - $extensionsToInstall.Count) extensions" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  RESTART VS Code for changes to take effect!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. Restart VS Code Insiders" -ForegroundColor Gray
Write-Host "  2. Check settings (updated automatically)" -ForegroundColor Gray
Write-Host "  3. Enjoy faster, optimized experience!" -ForegroundColor Gray
Write-Host ""
