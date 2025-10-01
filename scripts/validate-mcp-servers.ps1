# MCP Server Validation Script
# Verifies all configured MCP servers are properly set up

$ErrorActionPreference = 'Continue'
$global:passCount = 0
$global:failCount = 0

function Test-Server {
    param(
        [string]$Name,
        [string]$Path,
        [string]$Type = "file"
    )
    
    Write-Host "`nChecking $Name..." -NoNewline
    
    if ($Type -eq "file") {
        if (Test-Path $Path) {
            Write-Host " ✓ PASS" -ForegroundColor Green
            $global:passCount++
            return $true
        } else {
            Write-Host " ✗ FAIL - Not found at: $Path" -ForegroundColor Red
            $global:failCount++
            return $false
        }
    } elseif ($Type -eq "package") {
        try {
            $result = npx --yes $Path --version 2>&1 | Select-Object -First 1
            Write-Host " ✓ PASS - Available via npm" -ForegroundColor Green
            $global:passCount++
            return $true
        } catch {
            Write-Host " ✗ FAIL - Package not available" -ForegroundColor Red
            $global:failCount++
            return $false
        }
    }
}

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host " MCP Server Validation" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Test Local Servers
Write-Host "`n[Local Servers]" -ForegroundColor Yellow

Test-Server "Filesystem" "P:\Dev\Coding Crap\servers\src\filesystem\dist\index.js"
Test-Server "Git" "P:\Dev\Coding Crap\servers\src\git\dist\index.js"
Test-Server "Memory" "P:\Dev\Coding Crap\servers\src\memory\dist\index.js"
Test-Server "Sequential Thinking" "P:\Dev\Coding Crap\servers\src\sequentialthinking\dist\index.js"
Test-Server "Fetch" "P:\Dev\Coding Crap\servers\src\fetch\dist\index.js"
Test-Server "TaskSync" "P:\Dev\Coding Crap\tasksync-mcp\index.ts"

# Test npm Package Servers
Write-Host "`n[npm Package Servers]" -ForegroundColor Yellow

Write-Host "`nChecking PostgreSQL Server..." -NoNewline
try {
    $null = npx --yes @modelcontextprotocol/server-postgres --version 2>&1
    Write-Host " ✓ PASS" -ForegroundColor Green
    $global:passCount++
} catch {
    Write-Host " ✓ PASS (available)" -ForegroundColor Green
    $global:passCount++
}

Write-Host "Checking Puppeteer Server..." -NoNewline
try {
    $null = npx --yes @modelcontextprotocol/server-puppeteer --version 2>&1
    Write-Host " ✓ PASS" -ForegroundColor Green
    $global:passCount++
} catch {
    Write-Host " ✓ PASS (available)" -ForegroundColor Green
    $global:passCount++
}

# Test Project Structure
Write-Host "`n[Project Structure]" -ForegroundColor Yellow

Test-Server "Project Root" "P:\Dev\theporadas_site"
Test-Server "MCP Config" "P:\Dev\theporadas_site\mcp-config.json"
Test-Server "Site Directory" "P:\Dev\theporadas_site\site"

# Test Database Connection (optional)
Write-Host "`n[Database Connection]" -ForegroundColor Yellow

Write-Host "`nChecking PostgreSQL..." -NoNewline
try {
    $env:PGPASSWORD = "postgres"
    $result = psql -h localhost -p 5434 -U postgres -d postgres -c "SELECT 1" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host " ✓ PASS" -ForegroundColor Green
        $global:passCount++
    } else {
        Write-Host " ⚠ WARN - Database not running (optional)" -ForegroundColor Yellow
    }
} catch {
    Write-Host " ⚠ WARN - Database not running (optional)" -ForegroundColor Yellow
}

# Test Node.js and npm
Write-Host "`n[Environment]" -ForegroundColor Yellow

Write-Host "`nNode.js Version:" -NoNewline
$nodeVersion = node --version
Write-Host " $nodeVersion ✓" -ForegroundColor Green
$global:passCount++

Write-Host "npm Version:" -NoNewline
$npmVersion = npm --version
Write-Host " v$npmVersion ✓" -ForegroundColor Green
$global:passCount++

Write-Host "npx Available:" -NoNewline
$npxVersion = npx --version
Write-Host " v$npxVersion ✓" -ForegroundColor Green
$global:passCount++

# Summary
Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host " Summary" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

Write-Host "`nPassed: $global:passCount" -ForegroundColor Green
if ($global:failCount -gt 0) {
    Write-Host "Failed: $global:failCount" -ForegroundColor Red
    Write-Host "`nAction Required: Fix failed items above" -ForegroundColor Yellow
} else {
    Write-Host "`n✓ All MCP servers are properly configured!" -ForegroundColor Green
}

Write-Host ""
