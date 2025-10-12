#!/usr/bin/env pwsh
#Requires -Version 7.0

<#
.SYNOPSIS
    Configures all 9 GitHub repository secrets for CI/CD pipeline.

.DESCRIPTION
    Sets up Vercel and Firebase secrets required for automated deployments.
    REQUIRES: GitHub Actions to be enabled first (will fail with 404 if not).

.PARAMETER VercelToken
    Vercel authentication token (required). Get from https://vercel.com/account/tokens

.EXAMPLE
    .\setup-github-secrets.ps1
    # Prompts for Vercel token interactively

.EXAMPLE
    .\setup-github-secrets.ps1 -VercelToken "abc123..."
    # Sets token via parameter

.NOTES
    Prerequisites:
    1. Enable GitHub Actions: https://github.com/bbasketballer75/theporadas-wedding-site/settings/actions
    2. Create Vercel token: https://vercel.com/account/tokens
    
    This script sets 9 secrets:
    - VERCEL_TOKEN (from parameter/prompt)
    - VERCEL_ORG_ID (from .vercel/project.json)
    - VERCEL_PROJECT_ID (from .vercel/project.json)
    - 6x NEXT_PUBLIC_FIREBASE_* (from site/.env.production)
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory=$false)]
    [string]$VercelToken
)

$ErrorActionPreference = 'Stop'

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "GitHub Secrets Setup for CI/CD Pipeline" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if GitHub CLI is authenticated
Write-Host "[1/5] Checking GitHub CLI authentication..." -ForegroundColor Yellow
try {
    $authStatus = gh auth status 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "GitHub CLI not authenticated"
    }
    Write-Host "✓ GitHub CLI authenticated" -ForegroundColor Green
} catch {
    Write-Host "✗ GitHub CLI not authenticated" -ForegroundColor Red
    Write-Host "`nPlease run: gh auth login" -ForegroundColor Yellow
    exit 1
}

# Check if Actions is enabled (test with gh secret list)
Write-Host "`n[2/5] Checking if GitHub Actions is enabled..." -ForegroundColor Yellow
try {
    $null = gh secret list 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Actions not enabled"
    }
    Write-Host "✓ GitHub Actions is enabled" -ForegroundColor Green
} catch {
    Write-Host "✗ GitHub Actions is NOT enabled (404 error)" -ForegroundColor Red
    Write-Host "`n⚠️  REQUIRED: Enable GitHub Actions first!" -ForegroundColor Yellow
    Write-Host "`n1. Go to: https://github.com/bbasketballer75/theporadas-wedding-site/settings/actions" -ForegroundColor Cyan
    Write-Host "2. Select: 'Allow all actions and reusable workflows'" -ForegroundColor Cyan
    Write-Host "3. Select: 'Read and write permissions' + 'Allow GitHub Actions to create and approve pull requests'" -ForegroundColor Cyan
    Write-Host "4. Click: Save`n" -ForegroundColor Cyan
    Write-Host "Then run this script again.`n" -ForegroundColor Yellow
    exit 1
}

# Load Vercel project info
Write-Host "`n[3/5] Loading Vercel project configuration..." -ForegroundColor Yellow
$vercelProjectPath = "site\.vercel\project.json"
if (-not (Test-Path $vercelProjectPath)) {
    Write-Host "✗ Vercel project.json not found at: $vercelProjectPath" -ForegroundColor Red
    Write-Host "Run 'cd site && vercel' to link the project first." -ForegroundColor Yellow
    exit 1
}

$vercelProject = Get-Content $vercelProjectPath | ConvertFrom-Json
$vercelOrgId = $vercelProject.orgId
$vercelProjectId = $vercelProject.projectId

Write-Host "✓ Vercel Org ID: $vercelOrgId" -ForegroundColor Green
Write-Host "✓ Vercel Project ID: $vercelProjectId" -ForegroundColor Green

# Load Firebase config
Write-Host "`n[4/5] Loading Firebase configuration..." -ForegroundColor Yellow
$firebaseEnvPath = "site\.env.production"
if (-not (Test-Path $firebaseEnvPath)) {
    Write-Host "✗ Firebase .env.production not found at: $firebaseEnvPath" -ForegroundColor Red
    exit 1
}

$firebaseConfig = @{}
Get-Content $firebaseEnvPath | ForEach-Object {
    if ($_ -match '^NEXT_PUBLIC_FIREBASE_(\w+)=(.+)$') {
        $key = "NEXT_PUBLIC_FIREBASE_$($matches[1])"
        $value = $matches[2]
        $firebaseConfig[$key] = $value
    }
}

$requiredFirebaseKeys = @(
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
)

$missingKeys = $requiredFirebaseKeys | Where-Object { -not $firebaseConfig.ContainsKey($_) }
if ($missingKeys) {
    Write-Host "✗ Missing Firebase config keys: $($missingKeys -join ', ')" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Firebase configuration loaded (6 keys)" -ForegroundColor Green

# Get Vercel token
if (-not $VercelToken) {
    Write-Host "`n[5/5] Vercel Token Required" -ForegroundColor Yellow
    Write-Host "Get your token from: https://vercel.com/account/tokens" -ForegroundColor Cyan
    Write-Host "Token name: 'GitHub Actions CI/CD'" -ForegroundColor Cyan
    Write-Host "Scope: 'Full Account'" -ForegroundColor Cyan
    $VercelToken = Read-Host -Prompt "`nPaste your Vercel token" -AsSecureString
    $VercelToken = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($VercelToken)
    )
}

if ([string]::IsNullOrWhiteSpace($VercelToken)) {
    Write-Host "✗ Vercel token is required" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Vercel token provided" -ForegroundColor Green

# Set all secrets
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Setting GitHub Secrets (9 total)" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$secrets = @{
    'VERCEL_TOKEN' = $VercelToken
    'VERCEL_ORG_ID' = $vercelOrgId
    'VERCEL_PROJECT_ID' = $vercelProjectId
}

# Add Firebase secrets
foreach ($key in $requiredFirebaseKeys) {
    $secrets[$key] = $firebaseConfig[$key]
}

$successCount = 0
$failCount = 0

foreach ($secretName in $secrets.Keys | Sort-Object) {
    $secretValue = $secrets[$secretName]
    Write-Host "Setting $secretName..." -NoNewline
    
    try {
        $secretValue | gh secret set $secretName 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host " ✓" -ForegroundColor Green
            $successCount++
        } else {
            throw "gh CLI returned exit code $LASTEXITCODE"
        }
    } catch {
        Write-Host " ✗" -ForegroundColor Red
        Write-Host "  Error: $_" -ForegroundColor Red
        $failCount++
    }
}

# Verify secrets
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Verification" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Listing all secrets..." -ForegroundColor Yellow
gh secret list

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "✓ Secrets set successfully: $successCount/9" -ForegroundColor Green
if ($failCount -gt 0) {
    Write-Host "✗ Secrets failed: $failCount/9" -ForegroundColor Red
}

if ($successCount -eq 9) {
    Write-Host "`n🎉 All secrets configured successfully!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "1. cd site" -ForegroundColor White
    Write-Host "2. npm run gh:diagnose    # Verify setup" -ForegroundColor White
    Write-Host "3. npm run gh:status      # Check workflows" -ForegroundColor White
    Write-Host "4. git push origin main   # Trigger first workflow`n" -ForegroundColor White
} else {
    Write-Host "`n⚠️  Some secrets failed to set. Check errors above." -ForegroundColor Yellow
    exit 1
}
