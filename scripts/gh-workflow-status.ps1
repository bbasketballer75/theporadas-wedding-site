<#
.SYNOPSIS
Check GitHub Actions workflow status using GitHub CLI

.DESCRIPTION
Displays recent workflow runs and summary statistics

.PARAMETER Workflow
Specific workflow name to filter (default: all)

.PARAMETER Limit
Number of runs to display (default: 10)

.EXAMPLE
.\gh-workflow-status.ps1
.\gh-workflow-status.ps1 -Workflow "e2e" -Limit 5
#>

param(
    [string]$Workflow = "all",
    [int]$Limit = 10
)

Write-Host "`n🔍 GitHub Actions Workflow Status" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

try {
    # Check gh CLI is installed and authenticated
    $ghStatus = gh auth status 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ GitHub CLI not authenticated. Run 'gh auth login'" -ForegroundColor Red
        exit 1
    }

    Write-Host "✅ GitHub CLI authenticated as $((gh api user --jq .login))" -ForegroundColor Green

    # List recent runs
    Write-Host "`n📋 Recent workflow runs:" -ForegroundColor Yellow
    if ($Workflow -eq "all") {
        gh run list --limit $Limit
    } else {
        gh run list --workflow=$Workflow --limit $Limit
    }

    # Get workflow summary
    Write-Host "`n📊 Workflow summary (last 50 runs):" -ForegroundColor Green
    $summary = gh run list --limit 50 --json status,conclusion,name,workflowName | ConvertFrom-Json
    
    $grouped = $summary | Group-Object -Property workflowName | ForEach-Object {
        $workflow = $_.Name
        $total = $_.Count
        $failed = ($_.Group | Where-Object { $_.conclusion -eq "failure" }).Count
        $success = ($_.Group | Where-Object { $_.conclusion -eq "success" }).Count
        $pending = ($_.Group | Where-Object { $_.status -eq "in_progress" -or $_.status -eq "queued" }).Count
        
        [PSCustomObject]@{
            Workflow = $workflow
            Total = $total
            Success = $success
            Failed = $failed
            Pending = $pending
            SuccessRate = if ($total -gt 0) { [math]::Round(($success / $total) * 100, 1) } else { 0 }
        }
    }
    
    $grouped | Format-Table -AutoSize

    # Show active runs
    Write-Host "`n🔄 Active workflow runs:" -ForegroundColor Cyan
    $active = gh run list --limit 20 --json status,name,databaseId,createdAt | ConvertFrom-Json | Where-Object { $_.status -eq "in_progress" -or $_.status -eq "queued" }
    
    if ($active.Count -gt 0) {
        $active | ForEach-Object {
            Write-Host "  • $($_.name) (ID: $($_.databaseId)) - Started: $($_.createdAt)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  (none)" -ForegroundColor DarkGray
    }

} catch {
    Write-Host "`n❌ Error: $_" -ForegroundColor Red
    Write-Host $_.ScriptStackTrace -ForegroundColor DarkGray
    exit 1
}

Write-Host "`n✅ Done!" -ForegroundColor Green
