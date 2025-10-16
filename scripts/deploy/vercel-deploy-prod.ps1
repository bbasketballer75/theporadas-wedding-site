<#
.SYNOPSIS
Deploy to Vercel production using CLI

.DESCRIPTION
Deploy the site to Vercel production with confirmation

.EXAMPLE
.\vercel-deploy-prod.ps1
#>

Write-Host "`n🚀 Vercel PRODUCTION Deployment" -ForegroundColor Red
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

Write-Host "`n⚠️  WARNING: This will deploy to PRODUCTION" -ForegroundColor Yellow
Write-Host "   • Changes will be live immediately" -ForegroundColor Gray
Write-Host "   • All visitors will see this version" -ForegroundColor Gray

Push-Location site

try {
    # Check Vercel CLI
    Write-Host "`n🔍 Checking Vercel CLI..." -ForegroundColor Yellow
    $vercelVersion = vercel --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Vercel CLI not installed" -ForegroundColor Red
        Write-Host "💡 Install with: npm install -g vercel" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✅ Vercel CLI version: $vercelVersion" -ForegroundColor Green

    # Check git status
    Write-Host "`n📝 Checking git status..." -ForegroundColor Yellow
    $gitStatus = git status --porcelain
    if ($gitStatus) {
        Write-Host "⚠️  Uncommitted changes detected:" -ForegroundColor Yellow
        git status --short
        Write-Host "`n💡 Consider committing changes before production deployment" -ForegroundColor Cyan
        
        $proceed = Read-Host "`nProceed anyway? (yes/no)"
        if ($proceed -ne "yes") {
            Write-Host "❌ Deployment cancelled" -ForegroundColor Yellow
            exit 0
        }
    }
    else {
        Write-Host "✅ Working tree clean" -ForegroundColor Green
    }

    # Show current commit
    Write-Host "`n📌 Current commit:" -ForegroundColor Cyan
    git log -1 --oneline

    # Final confirmation
    Write-Host "`n⚠️  FINAL CONFIRMATION" -ForegroundColor Red
    $confirmation = Read-Host "Type 'DEPLOY' to proceed with production deployment"
    if ($confirmation -ne "DEPLOY") {
        Write-Host "❌ Deployment cancelled" -ForegroundColor Yellow
        exit 0
    }

    # Deploy
    Write-Host "`n🚀 Deploying to production..." -ForegroundColor Cyan
    
    $output = vercel --prod --yes 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        # Extract URL from output
        $prodUrl = ($output | Select-String -Pattern "https://.*\.vercel\.app" | Select-Object -Last 1).Matches.Value
        
        if ($prodUrl) {
            Write-Host "`n✅ Production deployed successfully!" -ForegroundColor Green
            Write-Host "`n🔗 Production URL:" -ForegroundColor Cyan
            Write-Host "   $prodUrl" -ForegroundColor White
            
            # Copy URL to clipboard
            try {
                Set-Clipboard -Value $prodUrl
                Write-Host "`n📋 URL copied to clipboard!" -ForegroundColor Yellow
            }
            catch {
                Write-Host "`n⚠️  Could not copy to clipboard" -ForegroundColor Yellow
            }
            
            # Show inspection command
            Write-Host "`n💡 Inspect deployment:" -ForegroundColor Cyan
            Write-Host "   vercel inspect $prodUrl" -ForegroundColor Gray
            
            # Offer to open in browser
            $open = Read-Host "`nOpen in browser? (y/n)"
            if ($open -eq "y" -or $open -eq "Y") {
                Start-Process $prodUrl
            }
            
            # Show domains
            Write-Host "`n🌐 Production domains:" -ForegroundColor Cyan
            Write-Host "   Fetching domains..." -ForegroundColor Gray
            vercel domains ls
        }
        else {
            Write-Host "`n✅ Deployment completed" -ForegroundColor Green
            Write-Host "⚠️  Could not extract URL from output" -ForegroundColor Yellow
            Write-Host "`nFull output:" -ForegroundColor Gray
            Write-Host $output
        }
    }
    else {
        Write-Host "`n❌ Deployment failed!" -ForegroundColor Red
        Write-Host "`nError output:" -ForegroundColor Yellow
        Write-Host $output
        exit 1
    }

}
catch {
    Write-Host "`n❌ Error: $_" -ForegroundColor Red
    Write-Host $_.ScriptStackTrace -ForegroundColor DarkGray
    exit 1
}
finally {
    Pop-Location
}

Write-Host "`n✅ Done!" -ForegroundColor Green
