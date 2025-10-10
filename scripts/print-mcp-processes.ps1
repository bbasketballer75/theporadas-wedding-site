<#
  Print MCP-related processes and listening TCP ports.
  Outputs a short table and writes JSON to .mcp-process-map.json in the workspace root.
  Usage: .\print-mcp-processes.ps1
#>

Write-Host "Collecting MCP-related process and TCP listen map..." -ForegroundColor Cyan

$interesting = 'modelcontextprotocol', 'playwright', 'puppeteer', 'node', 'firebase', 'postgres', 'context7', 'pieces', 'upstash', 'brave'

$procList = Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -and ($_.CommandLine -match ($interesting -join '|')) } | Select-Object ProcessId, Name, CommandLine

$listens = @()
try {
    $listens = Get-NetTCPConnection -State Listen | Select-Object LocalAddress, LocalPort, OwningProcess
}
catch {
    Write-Warning "Get-NetTCPConnection failed (requires elevated rights on some systems). Falling back to netstat output."
    $netstat = netstat -ano | Select-String "LISTENING" | ForEach-Object {
        $_ -replace '\s{2,}', ' ' | ForEach-Object {
            $parts = $_.ToString().Trim() -split ' '
            [PSCustomObject]@{ LocalAddress = $parts[1]; LocalPort = ($parts[1] -split ':')[-1]; OwningProcess = $parts[-1] }
        }
    }
    $listens = $netstat
}

$map = [PSCustomObject]@{
    timestamp = (Get-Date).ToString('o')
    processes = $procList
    listens   = $listens
}

$outPath = Join-Path (Get-Location).Path '.mcp-process-map.json'
$map | ConvertTo-Json -Depth 5 | Out-File -FilePath $outPath -Encoding utf8

Write-Host "Wrote process/port map to: $outPath" -ForegroundColor Green
Write-Host "Processes:" -ForegroundColor Cyan
$procList | Format-Table -AutoSize
Write-Host "Listening ports (sample):" -ForegroundColor Cyan
($listens | Select-Object -First 40) | Format-Table -AutoSize
