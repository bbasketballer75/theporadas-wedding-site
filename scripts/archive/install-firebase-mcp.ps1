# Firebase MCP Server Installation Script
# Date: October 4, 2025
# Project: theporadas_wedding_site
# Purpose: Install and configure Firebase MCP server for AI-powered Firebase access

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Firebase MCP Server Installation" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check prerequisites
Write-Host "[1/6] Checking prerequisites..." -ForegroundColor Yellow

# Check if Firebase CLI is installed
try {
    $firebaseVersion = firebase --version
    Write-Host "✓ Firebase CLI installed: $firebaseVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Firebase CLI not found. Installing..." -ForegroundColor Red
    npm install -g firebase-tools
    Write-Host "✓ Firebase CLI installed successfully" -ForegroundColor Green
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Step 2: Login to Firebase
Write-Host ""
Write-Host "[2/6] Logging into Firebase..." -ForegroundColor Yellow
Write-Host "Opening browser for Google authentication..." -ForegroundColor Gray

try {
    firebase login
    Write-Host "✓ Firebase login successful" -ForegroundColor Green
} catch {
    Write-Host "✗ Firebase login failed. Please try again." -ForegroundColor Red
    exit 1
}

# Step 3: List Firebase projects
Write-Host ""
Write-Host "[3/6] Listing Firebase projects..." -ForegroundColor Yellow

try {
    $projects = firebase projects:list
    Write-Host $projects
    Write-Host "✓ Projects listed successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to list projects" -ForegroundColor Red
    exit 1
}

# Step 4: Generate service account key
Write-Host ""
Write-Host "[4/6] Service Account Key Setup" -ForegroundColor Yellow
Write-Host "Please follow these steps to create a service account key:" -ForegroundColor Gray
Write-Host "1. Open Firebase Console: https://console.firebase.google.com/" -ForegroundColor Gray
Write-Host "2. Select your project: theporadas-wedding" -ForegroundColor Gray
Write-Host "3. Go to Project Settings > Service Accounts" -ForegroundColor Gray
Write-Host "4. Click 'Generate New Private Key'" -ForegroundColor Gray
Write-Host "5. Save the JSON file as 'firebase-service-account.json'" -ForegroundColor Gray
Write-Host "6. Move it to: d:\wedding-website\theporadas_wedding_site\.secrets\" -ForegroundColor Gray
Write-Host ""

$secretsDir = "d:\wedding-website\theporadas_wedding_site\.secrets"
if (-not (Test-Path $secretsDir)) {
    Write-Host "Creating .secrets directory..." -ForegroundColor Gray
    New-Item -ItemType Directory -Path $secretsDir -Force | Out-Null
    Write-Host "✓ Created .secrets directory" -ForegroundColor Green
}

Write-Host "Press Enter when you have saved the service account key..." -ForegroundColor Yellow
Read-Host

$keyPath = Join-Path $secretsDir "firebase-service-account.json"
if (Test-Path $keyPath) {
    Write-Host "✓ Service account key found" -ForegroundColor Green
} else {
    Write-Host "✗ Service account key not found at: $keyPath" -ForegroundColor Red
    Write-Host "Please save the key and run this script again." -ForegroundColor Yellow
    exit 1
}

# Step 5: Update .gitignore
Write-Host ""
Write-Host "[5/6] Updating .gitignore..." -ForegroundColor Yellow

$gitignorePath = "d:\wedding-website\theporadas_wedding_site\.gitignore"
$gitignoreContent = Get-Content $gitignorePath -Raw

if ($gitignoreContent -notmatch "\.secrets/") {
    Add-Content -Path $gitignorePath -Value "`n# MCP Service Account Keys`n.secrets/`n*.service-account.json"
    Write-Host "✓ Added .secrets/ to .gitignore" -ForegroundColor Green
} else {
    Write-Host "✓ .gitignore already configured" -ForegroundColor Green
}

# Step 6: Configure MCP
Write-Host ""
Write-Host "[6/6] Configuring MCP Server..." -ForegroundColor Yellow

$mcpConfigPath = "$env:APPDATA\Code - Insiders\User\globalStorage\@modelcontextprotocol\mcp\mcp.json"

# Read existing MCP config
if (Test-Path $mcpConfigPath) {
    $mcpConfig = Get-Content $mcpConfigPath -Raw | ConvertFrom-Json
} else {
    $mcpConfig = @{
        mcpServers = @{}
    } | ConvertTo-Json -Depth 10 | ConvertFrom-Json
}

# Add Firebase MCP server
$mcpConfig.mcpServers | Add-Member -NotePropertyName "firebase" -NotePropertyValue @{
    command = "npx"
    args = @(
        "-y",
        "@firebase/firebase-mcp-server",
        "--project", "theporadas-wedding"
    )
    env = @{
        GOOGLE_APPLICATION_CREDENTIALS = $keyPath
    }
} -Force

# Save updated config
$mcpConfig | ConvertTo-Json -Depth 10 | Set-Content $mcpConfigPath -Force

Write-Host "✓ MCP configuration updated" -ForegroundColor Green

# Step 7: Display next steps
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Restart VS Code Insiders" -ForegroundColor Gray
Write-Host "2. Test Firebase MCP with: 'List my Firebase Firestore collections'" -ForegroundColor Gray
Write-Host "3. Document common queries in knowledge base" -ForegroundColor Gray
Write-Host ""
Write-Host "Configuration saved to:" -ForegroundColor Gray
Write-Host "  $mcpConfigPath" -ForegroundColor White
Write-Host ""
Write-Host "Service account key location:" -ForegroundColor Gray
Write-Host "  $keyPath" -ForegroundColor White
Write-Host ""
Write-Host "Press Enter to exit..." -ForegroundColor Yellow
Read-Host
