# Fix Firebase MCP Configuration for VS Code Insiders
$settingsPath = "$env:APPDATA\Code - Insiders\User\settings.json"

Write-Host "Updating Firebase MCP configuration..." -ForegroundColor Cyan

# Read settings
$settings = Get-Content $settingsPath -Raw | ConvertFrom-Json -AsHashtable

# Update Firebase MCP with correct command
$settings['chat.mcp.servers']['firebase'] = @{
    command = 'firebase'
    args    = @('experimental:mcp', '--dir', 'd:\wedding-website\theporadas_wedding_site')
}

# Save settings
$settings | ConvertTo-Json -Depth 10 | Set-Content $settingsPath -Force

Write-Host "✓ Firebase MCP configured with official CLI" -ForegroundColor Green
Write-Host "Command: firebase experimental:mcp --dir d:\wedding-website\theporadas_wedding_site"
Write-Host "`nRestart VS Code Insiders to load the server."
