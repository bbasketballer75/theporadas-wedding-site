# Ensure Context7 MCP Configuration
# This script ensures the user's MCP configuration includes the upstash/context7 server

$ErrorActionPreference = 'Stop'

$mcpConfigPath = Join-Path $env:APPDATA "Code - Insiders\User\mcp.json"
if (-not $mcpConfigPath) {
    Write-Error "Could not determine APPDATA path. Aborting."
    exit 1
}

function Backup-File($path) {
    if (Test-Path $path) {
        $backup = "$path.backup-$(Get-Date -Format 'yyyyMMddHHmmss')"
        Copy-Item -Path $path -Destination $backup -Force
        Write-Host "Backup created: $backup" -ForegroundColor Green
    }
}

$context7Key = 'upstash/context7'
$context7Entry = @{
    type    = 'http'
    url     = 'https://mcp.context7.com/mcp'
    gallery = 'https://api.mcp.github.com/v0/servers/dcec7705-b81b-4e0f-8615-8032604be7ad'
    version = '1.0.0'
}

if (-not (Test-Path $mcpConfigPath)) {
    # Create minimal config with context7 server
    $config = @{
        servers = @{
            $context7Key = $context7Entry
        }
    }
    $dir = Split-Path $mcpConfigPath -Parent
    if (-not (Test-Path $dir)) { New-Item -Path $dir -ItemType Directory -Force | Out-Null }
    $config | ConvertTo-Json -Depth 10 | Set-Content -Path $mcpConfigPath -Encoding UTF8
    Write-Host "Created new MCP config with context7 server at: $mcpConfigPath" -ForegroundColor Green
    exit 0
}

# Read and update existing config
$jsonText = Get-Content -Path $mcpConfigPath -Raw
try {
    $config = $jsonText | ConvertFrom-Json -ErrorAction Stop
}
catch {
    Write-Warning "Existing mcp.json could not be parsed as JSON. Creating a new file with context7 entry."
    Backup-File -path $mcpConfigPath
    $newConfig = @{
        servers = @{
            $context7Key = $context7Entry
        }
    }
    $newConfig | ConvertTo-Json -Depth 10 | Set-Content -Path $mcpConfigPath -Encoding UTF8
    Write-Host "Overwrote invalid mcp.json with new config including context7." -ForegroundColor Yellow
    exit 0
}

if (-not $config.servers) {
    $config.servers = @{ }
}

if ($config.servers.PSObject.Properties.Name -contains $context7Key) {
    Write-Host "context7 MCP already configured in $mcpConfigPath" -ForegroundColor Gray
    exit 0
}

# Backup and add context7 entry
Backup-File -path $mcpConfigPath
# Convert existing servers object into a plain hashtable to allow keys with slashes
$existingServers = @{}
foreach ($prop in $config.servers.PSObject.Properties) { $existingServers[$prop.Name] = $prop.Value }
$existingServers[$context7Key] = $context7Entry
$config.servers = $existingServers
$config | ConvertTo-Json -Depth 10 | Set-Content -Path $mcpConfigPath -Encoding UTF8
Write-Host "Added context7 MCP server entry to: $mcpConfigPath" -ForegroundColor Green
Write-Host "Entry: $context7Key -> $($context7Entry.url)" -ForegroundColor Gray
exit 0
