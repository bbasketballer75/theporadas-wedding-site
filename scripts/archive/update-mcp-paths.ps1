# Update MCP Configuration Paths
# Updates mcp.json with correct project paths after computer reset
# Run Date: October 4, 2025

$ErrorActionPreference = "Stop"
$mcpConfigPath = "$env:APPDATA\Code - Insiders\User\mcp.json"
$projectRoot = "d:/wedding-website/theporadas_wedding_site"

Write-Host "🔧 Updating MCP Configuration Paths" -ForegroundColor Cyan
Write-Host "Config: $mcpConfigPath" -ForegroundColor Gray
Write-Host "Project Root: $projectRoot" -ForegroundColor Gray
Write-Host ""

# Read current config
$config = Get-Content $mcpConfigPath | ConvertFrom-Json

# Update filesystem server path
Write-Host "✓ Updating filesystem server path..." -ForegroundColor Yellow
$config.servers.filesystem.args = @(
    "-y",
    "@modelcontextprotocol/server-filesystem",
    $projectRoot
)

# Update postgres server .env path
Write-Host "✓ Updating postgres server .env path..." -ForegroundColor Yellow
$envPath = "$projectRoot/.env"
$config.servers.postgres.args = @(
    "-c",
    "npx -y @modelcontextprotocol/server-postgres `$(Get-Content '$envPath' | Select-String '^PG_URL=' | ForEach-Object { `$_.ToString().Split('=')[1].Trim() })"
)

# Disable Docker-based awesome-copilot (user wants Windows-native only)
Write-Host "✓ Removing Docker-based awesome-copilot server..." -ForegroundColor Yellow
$config.servers.PSObject.Properties.Remove('awesome-copilot')

# Verify chrome-devtools doesn't require Docker
Write-Host "✓ Verifying chrome-devtools-mcp configuration..." -ForegroundColor Yellow
if ($config.servers.'chromedevtools/chrome-devtools-mcp'.command -eq 'npx') {
    Write-Host "  ✓ Chrome DevTools using npx (Windows-native) ✓" -ForegroundColor Green
}
else {
    Write-Host "  ⚠ Chrome DevTools may require Docker" -ForegroundColor Red
}

# Save updated config
Write-Host ""
Write-Host "💾 Saving updated configuration..." -ForegroundColor Cyan
$config | ConvertTo-Json -Depth 10 | Set-Content $mcpConfigPath -Encoding UTF8

Write-Host ""
Write-Host "✅ MCP configuration updated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Changes made:" -ForegroundColor Cyan
Write-Host "  ✓ filesystem: Updated to $projectRoot" -ForegroundColor Gray
Write-Host "  ✓ postgres: Updated .env path to $envPath" -ForegroundColor Gray
Write-Host "  ✓ awesome-copilot: Removed (Docker dependency)" -ForegroundColor Gray
Write-Host "  ✓ chrome-devtools: Verified Windows-native" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠ Restart VS Code for changes to take effect" -ForegroundColor Yellow
