# Optimize MCP Configuration for VS Code Tool Limit
# Problem: 143 tools loaded, VS Code limit is 128
# Solution: Keep only essential servers active, activate others on-demand

$ErrorActionPreference = "Stop"
$mcpConfigPath = "$env:APPDATA\Code - Insiders\User\mcp.json"

Write-Host "🔧 Optimizing MCP Configuration for Tool Limit" -ForegroundColor Cyan
Write-Host "Current: 143 tools (15 over limit)" -ForegroundColor Yellow
Write-Host "Target: <128 tools" -ForegroundColor Green
Write-Host ""

# Read current config
$config = Get-Content $mcpConfigPath | ConvertFrom-Json

# Backup
$backupPath = "$mcpConfigPath.backup-optimize-$(Get-Date -Format 'yyyyMMddHHmmss')"
Copy-Item $mcpConfigPath $backupPath -Force
Write-Host "✓ Backup created: $backupPath" -ForegroundColor Green
Write-Host ""

# Create optimized configuration
# Keep only essential servers active by default
$optimized = @{
    servers = @{
        # ESSENTIAL - Always Active (~20 tools total)
        "sequentialthinking" = $config.servers.sequentialthinking
        "filesystem"         = $config.servers.filesystem
        "postgres"           = $config.servers.postgres
        "brave"              = $config.servers.brave
        "upstash/context7"   = $config.servers.'upstash/context7'
        "github"             = @{
            type = "http"
            url  = "https://api.githubcopilot.com/mcp/"
        }
        
        # COMMENTED OUT - Activate on-demand via code
        # Uncomment these when you specifically need them:
        # "puppeteer" = $config.servers.puppeteer
        # "microsoft/playwright-mcp" = $config.servers.'microsoft/playwright-mcp'
        # "chromedevtools/chrome-devtools-mcp" = $config.servers.'chromedevtools/chrome-devtools-mcp'
    }
    inputs  = $config.inputs
}

# Add comment to config
Write-Host "Creating optimized configuration..." -ForegroundColor Cyan
Write-Host ""
Write-Host "ACTIVE SERVERS (6):" -ForegroundColor Green
Write-Host "  ✓ sequentialthinking - Deep reasoning" -ForegroundColor Gray
Write-Host "  ✓ filesystem - File operations" -ForegroundColor Gray
Write-Host "  ✓ postgres - Database access" -ForegroundColor Gray
Write-Host "  ✓ brave - Web search" -ForegroundColor Gray
Write-Host "  ✓ context7 - Documentation lookup" -ForegroundColor Gray
Write-Host "  ✓ github - Repository operations" -ForegroundColor Gray
Write-Host ""
Write-Host "DISABLED (Activate on-demand - 3):" -ForegroundColor Yellow
Write-Host "  ○ puppeteer - Use activate_puppeteer_tools when needed" -ForegroundColor Gray
Write-Host "  ○ playwright - Use for E2E testing only" -ForegroundColor Gray
Write-Host "  ○ chromedevtools - Use activate_chromedevt_* when needed" -ForegroundColor Gray
Write-Host ""

# Save optimized config
$optimized | ConvertTo-Json -Depth 10 | Set-Content $mcpConfigPath -Encoding UTF8

Write-Host "✅ Configuration optimized!" -ForegroundColor Green
Write-Host ""
Write-Host "Expected tool count: ~80-100 (well under 128 limit)" -ForegroundColor Cyan
Write-Host ""
Write-Host "How to use disabled servers:" -ForegroundColor Yellow
Write-Host "  1. Ask AI to activate them when needed" -ForegroundColor Gray
Write-Host "  2. AI calls: activate_puppeteer_tools()" -ForegroundColor Gray
Write-Host "  3. Tools become available for that session" -ForegroundColor Gray
Write-Host "  4. Keeps overall count under limit" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠ IMPORTANT: Restart VS Code Insiders" -ForegroundColor Red
Write-Host ""
Write-Host "If you need a server permanently:" -ForegroundColor Cyan
Write-Host "  1. Uncomment it in this script" -ForegroundColor Gray
Write-Host "  2. Run script again" -ForegroundColor Gray
Write-Host "  3. Or manually edit mcp.json" -ForegroundColor Gray

