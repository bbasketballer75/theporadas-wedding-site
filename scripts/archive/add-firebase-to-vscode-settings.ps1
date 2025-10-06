# Add Firebase MCP to VS Code Insiders Settings
# This script adds the Firebase MCP server configuration to VS Code Insiders settings.json

$settingsPath = "$env:APPDATA\Code - Insiders\User\settings.json"

Write-Host "Adding Firebase MCP to VS Code Insiders settings..." -ForegroundColor Cyan

# Read current settings
$settingsContent = Get-Content $settingsPath -Raw

# Parse JSON (using -AsHashtable for easier manipulation)
$settings = $settingsContent | ConvertFrom-Json -AsHashtable

# Check if chat.mcp.servers exists
if (-not $settings.ContainsKey('chat.mcp.servers')) {
    $settings['chat.mcp.servers'] = @{}
    Write-Host "Created chat.mcp.servers section" -ForegroundColor Yellow
}

# Add Firebase MCP server
$settings['chat.mcp.servers']['firebase'] = @{
    command = 'npx'
    args    = @(
        '-y',
        '@firebase/firebase-mcp-server',
        '--project',
        'theporadas-wedding'
    )
    env     = @{
        GOOGLE_APPLICATION_CREDENTIALS = 'd:\wedding-website\theporadas_wedding_site\.secrets\firebase-service-account.json'
    }
}

Write-Host "Added Firebase MCP configuration" -ForegroundColor Green

# Convert back to JSON with proper formatting
$newSettingsJson = $settings | ConvertTo-Json -Depth 10

# Save settings
$newSettingsJson | Set-Content $settingsPath -Force

Write-Host "`nFirebase MCP successfully added to VS Code settings!" -ForegroundColor Green
Write-Host "Location: $settingsPath" -ForegroundColor Gray
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Restart VS Code Insiders (close all windows)" -ForegroundColor White
Write-Host "2. Wait 5-10 seconds after restart" -ForegroundColor White
Write-Host "3. Check Output panel: View -> Output -> 'Model Context Protocol'" -ForegroundColor White
Write-Host "4. Test with: 'List my Firebase Firestore collections'" -ForegroundColor White
