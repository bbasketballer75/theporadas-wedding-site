<#
.SYNOPSIS
Inspect Vercel deployment details

.DESCRIPTION
Get detailed information about a Vercel deployment

.PARAMETER Url
Deployment URL to inspect (optional, uses latest if not provided)

.EXAMPLE
.\vercel-inspect.ps1
.\vercel-inspect.ps1 -Url "https://wedding-website-abc123.vercel.app"
#>

param(
    [string]$Url
)

Write-Host "`n🔍 Vercel Deployment Inspector" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

Push-Location site

try {
    if ([string]::IsNullOrEmpty($Url)) {
        Write-Host "🔍 Finding latest deployment..." -ForegroundColor Yellow
        $deployments = vercel ls --json 2>&1 | ConvertFrom-Json
        
        if ($deployments -and $deployments.Count -gt 0) {
            $Url = $deployments[0].url
            Write-Host "✅ Using latest deployment: $Url" -ForegroundColor Green
        }
        else {
            Write-Host "❌ No deployments found" -ForegroundColor Red
            exit 1
        }
    }

    Write-Host "`n📊 Deployment Details:" -ForegroundColor Cyan
    vercel inspect $Url

    Write-Host "`n🌐 Aliases:" -ForegroundColor Cyan
    $inspection = vercel inspect $Url --json 2>&1 | ConvertFrom-Json
    if ($inspection.alias -and $inspection.alias.Count -gt 0) {
        $inspection.alias | ForEach-Object {
            Write-Host "   • https://$_" -ForegroundColor Green
        }
    }
    else {
        Write-Host "   (none)" -ForegroundColor DarkGray
    }

    Write-Host "`n💡 Quick actions:" -ForegroundColor Yellow
    Write-Host "   • Open deployment: Start-Process 'https://$Url'" -ForegroundColor Gray
    Write-Host "   • View logs: vercel logs $Url" -ForegroundColor Gray
    Write-Host "   • Promote to prod: vercel promote $Url --prod" -ForegroundColor Gray

}
catch {
    Write-Host "`n❌ Error: $_" -ForegroundColor Red
    exit 1
}
finally {
    Pop-Location
}

Write-Host "`n✅ Done!" -ForegroundColor Green
