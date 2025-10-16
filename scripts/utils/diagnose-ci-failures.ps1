<#
.SYNOPSIS
Diagnose current GitHub Actions CI failures

.DESCRIPTION
Comprehensive diagnostics for CI/CD pipeline failures

.EXAMPLE
.\diagnose-ci-failures.ps1
#>

Write-Host "`n🔍 CI/CD Pipeline Diagnostics" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

$issues = @()

try {
    # 1. Check gh CLI
    Write-Host "`n1️⃣ Checking GitHub CLI..." -ForegroundColor Yellow
    try {
        $ghUser = gh api user --jq .login 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ Authenticated as: $ghUser" -ForegroundColor Green
        }
        else {
            Write-Host "   ❌ Not authenticated" -ForegroundColor Red
            $issues += "GitHub CLI not authenticated"
        }
    }
    catch {
        Write-Host "   ❌ GitHub CLI not installed or not in PATH" -ForegroundColor Red
        $issues += "GitHub CLI not available"
    }

    # 2. Check Vercel CLI
    Write-Host "`n2️⃣ Checking Vercel CLI..." -ForegroundColor Yellow
    try {
        $vercelVersion = vercel --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ Vercel CLI installed: $vercelVersion" -ForegroundColor Green
        }
        else {
            Write-Host "   ❌ Vercel CLI not responding" -ForegroundColor Red
            $issues += "Vercel CLI not installed"
        }
    }
    catch {
        Write-Host "   ❌ Vercel CLI not installed" -ForegroundColor Red
        $issues += "Vercel CLI missing"
    }

    # 3. Check recent workflow runs
    Write-Host "`n3️⃣ Checking recent workflow runs..." -ForegroundColor Yellow
    try {
        $runs = gh run list --limit 10 --json conclusion, name, createdAt, databaseId, workflowName 2>&1
        if ($LASTEXITCODE -eq 0) {
            $runsObj = $runs | ConvertFrom-Json
            Write-Host "   ✅ Found $($runsObj.Count) recent runs" -ForegroundColor Green
            
            $failedCount = ($runsObj | Where-Object { $_.conclusion -eq "failure" }).Count
            if ($failedCount -gt 0) {
                Write-Host "   ⚠️  $failedCount failed runs detected" -ForegroundColor Yellow
                $issues += "$failedCount failed workflow runs"
            }
            
            $runsObj | Select-Object -First 5 | ForEach-Object {
                $icon = if ($_.conclusion -eq "success") { "✅" } elseif ($_.conclusion -eq "failure") { "❌" } else { "⏳" }
                Write-Host "   $icon $($_.workflowName): $($_.name) - $($_.createdAt)" -ForegroundColor DarkGray
            }
        }
        else {
            Write-Host "   ⚠️  Could not fetch workflow runs (workflows may not exist on GitHub yet)" -ForegroundColor Yellow
            Write-Host "   Reason: $runs" -ForegroundColor DarkGray
        }
    }
    catch {
        Write-Host "   ❌ Error checking workflows: $_" -ForegroundColor Red
    }

    # 4. Check failed jobs details
    Write-Host "`n4️⃣ Analyzing failed jobs..." -ForegroundColor Yellow
    try {
        $failedRuns = gh run list --status failure --limit 3 --json databaseId, workflowName | ConvertFrom-Json
        
        if ($failedRuns.Count -gt 0) {
            foreach ($run in $failedRuns) {
                Write-Host "   📋 $($run.workflowName) (Run ID: $($run.databaseId)):" -ForegroundColor Red
                
                $jobs = gh run view $run.databaseId --json jobs | ConvertFrom-Json
                $failedJobs = $jobs.jobs | Where-Object { $_.conclusion -eq "failure" }
                
                foreach ($job in $failedJobs) {
                    Write-Host "      ❌ Job: $($job.name)" -ForegroundColor Yellow
                    $failedSteps = $job.steps | Where-Object { $_.conclusion -eq "failure" }
                    foreach ($step in $failedSteps) {
                        Write-Host "         💥 Step failed: $($step.name)" -ForegroundColor Red
                    }
                }
            }
        }
        else {
            Write-Host "   ✅ No failed runs in recent history" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "   ⚠️  Could not analyze failed jobs" -ForegroundColor Yellow
    }

    # 5. Check repository secrets
    Write-Host "`n5️⃣ Checking repository secrets..." -ForegroundColor Yellow
    try {
        $secrets = gh secret list 2>&1
        if ($LASTEXITCODE -eq 0) {
            $secretLines = $secrets -split "`n" | Where-Object { $_ -match '\S' }
            Write-Host "   ✅ Found $($secretLines.Count) secrets configured" -ForegroundColor Green
            
            $requiredSecrets = @("VERCEL_TOKEN", "VERCEL_ORG_ID", "VERCEL_PROJECT_ID", "FIREBASE_PROJECT_ID")
            foreach ($required in $requiredSecrets) {
                if ($secrets -match $required) {
                    Write-Host "      ✅ $required" -ForegroundColor Green
                }
                else {
                    Write-Host "      ❌ $required (missing)" -ForegroundColor Red
                    $issues += "Missing secret: $required"
                }
            }
        }
        else {
            Write-Host "   ⚠️  Could not check secrets" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "   ❌ Error checking secrets: $_" -ForegroundColor Red
    }

    # 6. Check local git status
    Write-Host "`n6️⃣ Checking local git status..." -ForegroundColor Yellow
    $gitStatus = git status --porcelain
    if ($gitStatus) {
        Write-Host "   ⚠️  Uncommitted changes detected:" -ForegroundColor Yellow
        $gitStatus | ForEach-Object { Write-Host "      $_" -ForegroundColor DarkGray }
    }
    else {
        Write-Host "   ✅ Working tree clean" -ForegroundColor Green
    }

    # 7. Check workflows exist locally
    Write-Host "`n7️⃣ Checking local workflows..." -ForegroundColor Yellow
    $workflowFiles = Get-ChildItem -Path ".\.github\workflows\" -Filter "*.yml" -ErrorAction SilentlyContinue
    if ($workflowFiles) {
        Write-Host "   ✅ Found $($workflowFiles.Count) workflow files:" -ForegroundColor Green
        $workflowFiles | ForEach-Object { Write-Host "      • $($_.Name)" -ForegroundColor DarkGray }
    }
    else {
        Write-Host "   ❌ No workflow files found" -ForegroundColor Red
        $issues += "No workflow files in .github/workflows/"
    }

    # 8. Check if workflows are tracked in git
    Write-Host "`n8️⃣ Checking if workflows are committed..." -ForegroundColor Yellow
    $trackedWorkflows = git ls-files .github/workflows/
    if ($trackedWorkflows) {
        $trackedCount = ($trackedWorkflows -split "`n").Count
        Write-Host "   ✅ $trackedCount workflow files tracked in git" -ForegroundColor Green
    }
    else {
        Write-Host "   ❌ Workflows not tracked in git" -ForegroundColor Red
        $issues += "Workflows not committed to git"
    }

    # Summary
    Write-Host "`n" + ("━" * 50) -ForegroundColor DarkGray
    Write-Host "📊 Summary" -ForegroundColor Cyan
    Write-Host ("━" * 50) -ForegroundColor DarkGray
    
    if ($issues.Count -eq 0) {
        Write-Host "`n✅ No major issues detected!" -ForegroundColor Green
        Write-Host "   Your CI/CD pipeline appears to be configured correctly." -ForegroundColor Gray
    }
    else {
        Write-Host "`n⚠️  Issues found: $($issues.Count)" -ForegroundColor Yellow
        foreach ($issue in $issues) {
            Write-Host "   • $issue" -ForegroundColor Red
        }
        
        Write-Host "`n💡 Recommended actions:" -ForegroundColor Cyan
        if ($issues -match "GitHub CLI") {
            Write-Host "   • Install and authenticate GitHub CLI: gh auth login" -ForegroundColor Yellow
        }
        if ($issues -match "Vercel CLI") {
            Write-Host "   • Install Vercel CLI: npm install -g vercel" -ForegroundColor Yellow
        }
        if ($issues -match "secret") {
            Write-Host "   • Configure missing secrets: gh secret set <NAME>" -ForegroundColor Yellow
        }
        if ($issues -match "workflow runs") {
            Write-Host "   • Review failed workflows: .\scripts\gh-workflow-logs.ps1 -Failed" -ForegroundColor Yellow
        }
        if ($issues -match "committed") {
            Write-Host "   • Commit and push workflows: git add .github/workflows/ && git commit -m 'chore: add workflows' && git push" -ForegroundColor Yellow
        }
    }

}
catch {
    Write-Host "`n❌ Diagnostic error: $_" -ForegroundColor Red
    Write-Host $_.ScriptStackTrace -ForegroundColor DarkGray
    exit 1
}

Write-Host "`n✅ Diagnostics complete!" -ForegroundColor Green
