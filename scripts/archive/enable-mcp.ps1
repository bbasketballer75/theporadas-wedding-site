# Enable MCP in VS Code Insiders
$settingsPath = "$env:APPDATA\Code - Insiders\User\settings.json"

Write-Host "Enabling MCP feature in VS Code Insiders..." -ForegroundColor Cyan

# Read settings
$settings = Get-Content $settingsPath -Raw | ConvertFrom-Json -AsHashtable

# Enable MCP
$settings['chat.mcp.enabled'] = $true

# Save settings
$settings | ConvertTo-Json -Depth 10 | Set-Content $settingsPath -Force

Write-Host "✓ Set chat.mcp.enabled = true" -ForegroundColor Green
Write-Host "`nRestart VS Code Insiders to activate MCP."
