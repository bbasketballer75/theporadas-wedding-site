# Fix MCP Configuration - October 4, 2025
# This script updates the mcp.json file with corrected server configurations

$ErrorActionPreference = "Stop"
$mcpConfigPath = "$env:APPDATA\Code - Insiders\User\mcp.json"

Write-Host "Fixing MCP Configuration..." -ForegroundColor Cyan
Write-Host "Config file: $mcpConfigPath" -ForegroundColor Gray
Write-Host ""

# Create corrected configuration
$config = @{
    servers = @{
        "upstash/context7"                   = @{
            type    = "http"
            url     = "https://mcp.context7.com/mcp"
            headers = @{
                Authorization = "ctx7sk-36a86d20-790b-4e78-aef6-5f2070011353"
            }
            gallery = "https://api.mcp.github.com/v0/servers/dcec7705-b81b-4e0f-8615-8032604be7ad"
            version = "1.0.0"
        }
        "microsoft/playwright-mcp"           = @{
            type    = "stdio"
            command = "npx"
            args    = @("@playwright/mcp@latest")
            gallery = "https://api.mcp.github.com/v0/servers/41b79849-7e6c-4fc7-82c0-5a611ea21523"
            version = "0.0.1-seed"
        }
        postgres                             = @{
            command = "npx"
            args    = @(
                "-y",
                "@modelcontextprotocol/server-postgres",
                "postgresql://postgres:theporadas2025!@localhost:5432/theporadas_dev"
            )
            type    = "stdio"
        }
        sequentialthinking                   = @{
            command = "npx"
            args    = @("-y", "@modelcontextprotocol/server-sequential-thinking")
            type    = "stdio"
        }
        filesystem                           = @{
            command = "npx"
            args    = @("-y", "@modelcontextprotocol/server-filesystem", "d:/wedding-website/theporadas_wedding_site")
            type    = "stdio"
        }
        memory                               = @{
            command = "npx"
            args    = @("-y", "@modelcontextprotocol/server-memory")
            type    = "stdio"
        }
        puppeteer                            = @{
            command = "npx"
            args    = @("-y", "@modelcontextprotocol/server-puppeteer")
            type    = "stdio"
        }
        brave                                = @{
            command = "npx"
            args    = @("-y", "@modelcontextprotocol/server-brave-search")
            env     = @{
                BRAVE_API_KEY = "BSAS9aZVHM-uGNa2Cy4CjzeOvIBEkZi"
            }
            type    = "stdio"
        }
        "chromedevtools/chrome-devtools-mcp" = @{
            command = "npx"
            args    = @("-y", "chrome-devtools-mcp")
            type    = "stdio"
        }
        github                               = @{
            type = "http"
            url  = "https://api.githubcopilot.com/mcp/"
        }
    }
    inputs  = @(
        @{
            type = "promptString"
            id   = "apiKey"
        },
        @{
            type        = "promptString"
            id          = "pg_url"
            description = "PostgreSQL URL (e.g. postgresql://user:pass@localhost:5432/mydb)"
            value       = "postgresql://postgres:theporadas2025!@localhost:5432/theporadas_dev"
        }
    )
}

# Backup existing config
if (Test-Path $mcpConfigPath) {
    $backupPath = "$mcpConfigPath.backup-$(Get-Date -Format 'yyyyMMddHHmmss')"
    Copy-Item $mcpConfigPath $backupPath -Force
    Write-Host "Backup created: $backupPath" -ForegroundColor Green
}

# Save new config
$config | ConvertTo-Json -Depth 10 | Set-Content $mcpConfigPath -Encoding UTF8

Write-Host ""
Write-Host "MCP configuration fixed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Changes made:" -ForegroundColor Yellow
Write-Host "  - Removed non-existent 'fetch' server" -ForegroundColor Gray
Write-Host "  - Removed non-existent 'modemanager' server" -ForegroundColor Gray
Write-Host "  - Simplified postgres connection (direct string)" -ForegroundColor Gray
Write-Host "  - Updated all paths to d:/wedding-website/theporadas_wedding_site" -ForegroundColor Gray
Write-Host ""
Write-Host "Restart VS Code Insiders to apply changes." -ForegroundColor Cyan
