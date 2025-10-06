# Switch to Community Firebase MCP Package
# This uses @gannonh/firebase-mcp instead of official Firebase CLI

$settingsPath = "$env:APPDATA\Code - Insiders\User\settings.json"

Write-Host "Switching to community Firebase MCP package..." -ForegroundColor Cyan

# Read settings
$settings = Get-Content $settingsPath -Raw | ConvertFrom-Json -AsHashtable

# Configure community Firebase MCP with correct environment variables
$settings['chat.mcp.servers']['firebase'] = @{
    command = 'npx'
    args    = @('-y', '@gannonh/firebase-mcp')
    env     = @{
        SERVICE_ACCOUNT_KEY_PATH = 'd:\wedding-website\theporadas_wedding_site\.secrets\firebase-service-account.json'
        FIREBASE_PROJECT_ID      = 'theporadas-wedding'
    }
}

# Save settings
$settings | ConvertTo-Json -Depth 10 | Set-Content $settingsPath -Force

Write-Host "`n✓ Switched to community Firebase MCP (@gannonh/firebase-mcp)" -ForegroundColor Green
Write-Host "Environment variables:" -ForegroundColor Gray
Write-Host "  SERVICE_ACCOUNT_KEY_PATH: d:\wedding-website\theporadas_wedding_site\.secrets\firebase-service-account.json"
Write-Host "  FIREBASE_PROJECT_ID: theporadas-wedding"

# Verify service account exists
if (Test-Path "d:\wedding-website\theporadas_wedding_site\.secrets\firebase-service-account.json") {
    Write-Host "`n✓ Service account key found" -ForegroundColor Green
}
else {
    Write-Host "`n✗ Service account key NOT found!" -ForegroundColor Red
    Write-Host "Please download it from: https://console.firebase.google.com/project/theporadas-wedding/settings/serviceaccounts/adminsdk"
}

Write-Host "`nRestart VS Code Insiders to load the community Firebase MCP server." -ForegroundColor Yellow
