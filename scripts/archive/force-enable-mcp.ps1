# Force Enable MCP in VS Code Insiders
# Workaround for "managed by organization" bug

$settingsPath = "$env:APPDATA\Code - Insiders\User\settings.json"

Write-Host "Force-enabling MCP in VS Code Insiders..." -ForegroundColor Cyan

# Backup current settings
$backup = "$settingsPath.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Copy-Item $settingsPath $backup
Write-Host "Backup created: $backup" -ForegroundColor Gray

# Read as plain text to preserve all settings
$json = Get-Content $settingsPath -Raw

# Parse to check current state
$settings = $json | ConvertFrom-Json

# Check if chat.mcp.enabled exists
if ($settings.PSObject.Properties.Name -notcontains 'chat.mcp.enabled') {
    Write-Host "chat.mcp.enabled not found, adding it..." -ForegroundColor Yellow
    
    # Add the setting manually by inserting into JSON
    # Find the last closing brace and insert before it
    $insertPoint = $json.LastIndexOf('}')
    $newSetting = ',
  "chat.mcp.enabled": true'
    
    # Remove trailing whitespace/newlines before last brace
    $beforeBrace = $json.Substring(0, $insertPoint).TrimEnd()
    $json = $beforeBrace + $newSetting + "`n" + $json.Substring($insertPoint)
    
    $json | Set-Content $settingsPath -NoNewline
    Write-Host "✓ Added chat.mcp.enabled = true" -ForegroundColor Green
} else {
    $currentValue = $settings.'chat.mcp.enabled'
    if ($currentValue -eq $true) {
        Write-Host "✓ chat.mcp.enabled is already true" -ForegroundColor Green
    } else {
        Write-Host "chat.mcp.enabled is currently: $currentValue" -ForegroundColor Yellow
        Write-Host "Updating to true..." -ForegroundColor Yellow
        
        # Use hashtable method
        $settingsHash = $settings | ConvertTo-Json -Depth 10 | ConvertFrom-Json -AsHashtable
        $settingsHash['chat.mcp.enabled'] = $true
        $settingsHash | ConvertTo-Json -Depth 10 | Set-Content $settingsPath
        Write-Host "✓ Updated chat.mcp.enabled = true" -ForegroundColor Green
    }
}

Write-Host "`nNOTE: If VS Code settings UI shows 'managed by organization'," -ForegroundColor Yellow
Write-Host "this is a known bug. Check VS Code Settings UI to see if you" -ForegroundColor Yellow
Write-Host "can now toggle the setting on manually." -ForegroundColor Yellow
