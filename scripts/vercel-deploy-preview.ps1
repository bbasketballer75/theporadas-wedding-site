<#
.SYNOPSIS
Deploy preview to Vercel using CLI

.DESCRIPTION
Deploy a preview version of the site to Vercel with automatic URL copying

.EXAMPLE
.\vercel-deploy-preview.ps1
#>

Write-Host "`n🚀 Vercel Preview Deployment" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

Push-Location site

try {
    # Check Vercel CLI
    Write-Host "🔍 Checking Vercel CLI..." -ForegroundColor Yellow
    $vercelVersion = vercel --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Vercel CLI not installed" -ForegroundColor Red
        Write-Host "💡 Install with: npm install -g vercel" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✅ Vercel CLI version: $vercelVersion" -ForegroundColor Green

    # Check Vercel auth
    Write-Host "`n🔐 Checking authentication..." -ForegroundColor Yellow
    $whoami = vercel whoami 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Not logged in to Vercel" -ForegroundColor Red
        Write-Host "💡 Login with: vercel login" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✅ Authenticated" -ForegroundColor Green

    # Deploy
    Write-Host "`n🚀 Deploying preview..." -ForegroundColor Cyan
    Write-Host "   This will create a preview deployment (not production)" -ForegroundColor Gray
    
    $url = vercel --yes 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        # Extract URL from output
        $deployUrl = ($url | Select-String -Pattern "https://.*\.vercel\.app" | Select-Object -Last 1).Matches.Value
        
        if ($deployUrl) {
            Write-Host "`n✅ Preview deployed successfully!" -ForegroundColor Green
            Write-Host "`n🔗 Preview URL:" -ForegroundColor Cyan
            Write-Host "   $deployUrl" -ForegroundColor White
            
            # Copy URL to clipboard
            try {
                Set-Clipboard -Value $deployUrl
                Write-Host "`n📋 URL copied to clipboard!" -ForegroundColor Yellow
            } catch {
                Write-Host "`n⚠️  Could not copy to clipboard" -ForegroundColor Yellow
            }
            
            # Offer to open in browser
            $open = Read-Host "`nOpen in browser? (y/n)"
            if ($open -eq "y" -or $open -eq "Y") {
                Start-Process $deployUrl
            }
            
            # Show inspection command
            Write-Host "`n💡 Inspect deployment:" -ForegroundColor Cyan
            Write-Host "   vercel inspect $deployUrl" -ForegroundColor Gray
        } else {
            Write-Host "`n✅ Deployment completed" -ForegroundColor Green
            Write-Host "⚠️  Could not extract URL from output" -ForegroundColor Yellow
            Write-Host "`nFull output:" -ForegroundColor Gray
            Write-Host $url
        }
    } else {
        Write-Host "`n❌ Deployment failed!" -ForegroundColor Red
        Write-Host "`nError output:" -ForegroundColor Yellow
        Write-Host $url
        exit 1
    }

} catch {
    Write-Host "`n❌ Error: $_" -ForegroundColor Red
    Write-Host $_.ScriptStackTrace -ForegroundColor DarkGray
    exit 1
} finally {
    Pop-Location
}

Write-Host "`n✅ Done!" -ForegroundColor Green
