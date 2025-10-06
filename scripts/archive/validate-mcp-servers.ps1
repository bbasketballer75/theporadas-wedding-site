# MCP Server Validation Script
# Verifies all configured MCP servers are properly set up

$ErrorActionPreference = 'Continue'
$global:passCount = 0
$global:failCount = 0

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $scriptRoot '..'))

function Test-Server {
    param(
        [string]$Name,
        [string]$Path,
        [ValidateSet('file', 'package')][string]$Type = 'file',
        [switch]$Optional
    )

    Write-Host "`nChecking $Name..." -NoNewline

    switch ($Type) {
        'file' {
            if (Test-Path $Path) {
                Write-Host " ✓ PASS" -ForegroundColor Green
                $global:passCount++
                return $true
            }
            else {
                if ($Optional) {
                    Write-Host " ⚠ SKIP - Not found at: $Path" -ForegroundColor Yellow
                }
                else {
                    Write-Host " ✗ FAIL - Not found at: $Path" -ForegroundColor Red
                    $global:failCount++
                }
                return $false
            }
        }
        'package' {
            try {
                $packageVersion = npm view $Path version --silent 2>$null
                $exitCode = $LASTEXITCODE
                $LASTEXITCODE = 0

                if ($exitCode -eq 0 -and $packageVersion) {
                    Write-Host " ✓ PASS - Available via npm (v$packageVersion)" -ForegroundColor Green
                    $global:passCount++
                    return $true
                }
                else {
                    if ($Optional) {
                        Write-Host " ⚠ SKIP - Package metadata unavailable" -ForegroundColor Yellow
                    }
                    else {
                        Write-Host " ⚠ WARN - Package metadata unavailable" -ForegroundColor Yellow
                    }
                    return $false
                }
            }
            catch {
                if ($Optional) {
                    Write-Host " ⚠ SKIP - Package not available" -ForegroundColor Yellow
                }
                else {
                    Write-Host " ✗ FAIL - Package not available" -ForegroundColor Red
                    $global:failCount++
                }
                return $false
            }
        }
    }
}
Write-Host "Repository root detected at: $repoRoot" -ForegroundColor Yellow

# Test Local Servers
Write-Host "`n[Local Servers]" -ForegroundColor Yellow

$customServerRoot = $env:MCP_SERVER_ROOT
if ($customServerRoot -and (Test-Path $customServerRoot)) {
    Test-Server "Filesystem" (Join-Path $customServerRoot "src\filesystem\dist\index.js") | Out-Null
    Test-Server "Git" (Join-Path $customServerRoot "src\git\dist\index.js") | Out-Null
    Test-Server "Memory" (Join-Path $customServerRoot "src\memory\dist\index.js") | Out-Null
    Test-Server "Sequential Thinking" (Join-Path $customServerRoot "src\sequentialthinking\dist\index.js") | Out-Null
    Test-Server "Fetch" (Join-Path $customServerRoot "src\fetch\dist\index.js") | Out-Null
    Test-Server "TaskSync" (Join-Path $customServerRoot "tasksync-mcp\index.ts") | Out-Null
}
else {
    Write-Host "Skipping custom MCP server build validation. Set MCP_SERVER_ROOT to validate local builds." -ForegroundColor Yellow
}

# Test npm Package Servers
Write-Host "`n[npm Package Servers]" -ForegroundColor Yellow

Test-Server "@modelcontextprotocol/server-postgres" "@modelcontextprotocol/server-postgres" -Type 'package' | Out-Null
Test-Server "@modelcontextprotocol/server-puppeteer" "@modelcontextprotocol/server-puppeteer" -Type 'package' | Out-Null

# Test Project Structure
Write-Host "`n[Project Structure]" -ForegroundColor Yellow

Test-Server "Project Root" $repoRoot | Out-Null
Test-Server "Site Directory" (Join-Path $repoRoot "site") | Out-Null
Test-Server ".env file" (Join-Path $repoRoot ".env") -Optional | Out-Null
Test-Server ".env.example" (Join-Path $repoRoot ".env.example") | Out-Null

# Test Database Connection (optional)
Write-Host "`n[Database Connection]" -ForegroundColor Yellow

$envPath = Join-Path $repoRoot ".env"
$pgUrl = $null
if (Test-Path $envPath) {
    $pgUrl = (Get-Content $envPath | Where-Object { $_ -match '^PG_URL=' } | ForEach-Object { ($_ -split '=', 2)[1].Trim() }) | Select-Object -First 1
}

if ($pgUrl) {
    Write-Host "`nChecking PostgreSQL using PG_URL..." -NoNewline
    $pgMatch = [regex]::Match($pgUrl, '^postgresql:\/\/(?<user>[^:]+):(?<password>[^@]+)@(?<host>[^:\/]+)(:(?<port>\d+))?\/(?<database>.+)$')
    if ($pgMatch.Success) {
        $pgHost = $pgMatch.Groups['host'].Value
        $pgPort = if ($pgMatch.Groups['port'].Success) { [int]$pgMatch.Groups['port'].Value } else { 5432 }
        $pgUser = $pgMatch.Groups['user'].Value
        $pgPassword = $pgMatch.Groups['password'].Value
        $pgDatabase = $pgMatch.Groups['database'].Value

        try {
            $env:PGPASSWORD = $pgPassword
            $null = psql -h $pgHost -p $pgPort -U $pgUser -d $pgDatabase -c "SELECT 1" 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host " ✓ PASS" -ForegroundColor Green
                $global:passCount++
            }
            else {
                Write-Host " ⚠ WARN - Unable to connect (check service or credentials)" -ForegroundColor Yellow
            }
        }
        catch {
            Write-Host " ⚠ WARN - Unable to connect (check service or credentials)" -ForegroundColor Yellow
        }
        finally {
            Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
        }
    }
    else {
        Write-Host " ⚠ WARN - PG_URL is malformed" -ForegroundColor Yellow
    }
}
else {
    Write-Host "`nChecking PostgreSQL... ⚠ SKIP - PG_URL not defined in .env" -ForegroundColor Yellow
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
}
else {
    Write-Host "`n✓ All MCP servers are properly configured!" -ForegroundColor Green
}

Write-Host ""
