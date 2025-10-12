<#
.SYNOPSIS
Get logs for GitHub Actions workflow runs

.DESCRIPTION
Fetch and display logs for failed or specific workflow runs

.PARAMETER RunId
Specific run ID to fetch logs for (optional)

.PARAMETER Failed
Show logs for latest failed run

.EXAMPLE
.\gh-workflow-logs.ps1
.\gh-workflow-logs.ps1 -RunId 123456789
.\gh-workflow-logs.ps1 -Failed
#>

param(
    [string]$RunId,
    [switch]$Failed
)

Write-Host "`n📋 GitHub Actions Workflow Logs" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

try {
    # Determine which run to fetch
    if ([string]::IsNullOrEmpty($RunId)) {
        if ($Failed) {
            Write-Host "🔍 Finding latest failed run..." -ForegroundColor Yellow
            $failedRuns = gh run list --status failure --limit 5 --json databaseId,name,workflowName,conclusion,createdAt | ConvertFrom-Json
            
            if ($failedRuns.Count -eq 0) {
                Write-Host "✅ No failed runs found!" -ForegroundColor Green
                exit 0
            }

            Write-Host "`n❌ Recent failed runs:" -ForegroundColor Red
            for ($i = 0; $i -lt $failedRuns.Count; $i++) {
                $run = $failedRuns[$i]
                Write-Host "  [$($i + 1)] $($run.workflowName) - $($run.name) (ID: $($run.databaseId)) - $($run.createdAt)" -ForegroundColor Yellow
            }

            $selection = Read-Host "`nSelect run to view logs [1-$($failedRuns.Count)] or press Enter for latest"
            
            if ([string]::IsNullOrWhiteSpace($selection)) {
                $RunId = $failedRuns[0].databaseId
            } else {
                $index = [int]$selection - 1
                if ($index -ge 0 -and $index -lt $failedRuns.Count) {
                    $RunId = $failedRuns[$index].databaseId
                } else {
                    Write-Host "❌ Invalid selection" -ForegroundColor Red
                    exit 1
                }
            }
        } else {
            Write-Host "🔍 Finding latest run..." -ForegroundColor Yellow
            $RunId = gh run list --limit 1 --json databaseId --jq '.[0].databaseId'
        }
    }

    if ([string]::IsNullOrEmpty($RunId)) {
        Write-Host "❌ No runs found" -ForegroundColor Red
        exit 1
    }

    Write-Host "`n📊 Run details:" -ForegroundColor Cyan
    gh run view $RunId

    Write-Host "`n📋 Failed job logs:" -ForegroundColor Yellow
    gh run view $RunId --log-failed

    Write-Host "`n💡 Tip: View full logs at: https://github.com/$(gh repo view --json nameWithOwner --jq .nameWithOwner)/actions/runs/$RunId" -ForegroundColor Cyan

} catch {
    Write-Host "`n❌ Error: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Done!" -ForegroundColor Green
