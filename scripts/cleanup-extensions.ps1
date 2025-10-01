# Extension Cleanup Script
# Removes unnecessary extensions from VS Code

$code = "C:\Program Files\Microsoft VS Code Insiders\bin\code-insiders.cmd"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VS Code Extension Cleanup Script" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$removed = 0
$failed = 0

function Uninstall-Extension {
    param([string]$id, [string]$reason)
    Write-Host "Removing: $id" -ForegroundColor Yellow
    Write-Host "  Reason: $reason" -ForegroundColor Gray
    try {
        & $code --uninstall-extension $id 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ Removed successfully`n" -ForegroundColor Green
            $script:removed++
        } else {
            Write-Host "  ✗ Failed to remove`n" -ForegroundColor Red
            $script:failed++
        }
    } catch {
        Write-Host "  ✗ Error: $_`n" -ForegroundColor Red
        $script:failed++
    }
}

Write-Host "== AZURE AI & TOOLKIT EXTENSIONS ==`n" -ForegroundColor Magenta
Uninstall-Extension "ms-windows-ai-studio.windows-ai-studio" "AI Toolkit - not needed for project"
Uninstall-Extension "teamsdevapp.vscode-ai-foundry" "Azure AI Foundry - not needed for project"
Uninstall-Extension "ms-azuretools.vscode-azure-github-copilot" "Azure Copilot integration - redundant"
Uninstall-Extension "google.geminicodeassist" "Google Gemini - competing AI, not used"
Uninstall-Extension "googlecloudtools.cloudcode" "Google Cloud Code - using Firebase"

Write-Host "`n== AZURE CLOUD SERVICES ==`n" -ForegroundColor Magenta
Uninstall-Extension "ms-azuretools.azure-dev" "Azure Dev CLI - not using Azure"
Uninstall-Extension "ms-azuretools.vscode-azureappservice" "Azure App Service - using Firebase"
Uninstall-Extension "ms-azuretools.vscode-azurecontainerapps" "Azure Container Apps - not needed"
Uninstall-Extension "ms-azuretools.vscode-azurefunctions" "Azure Functions - using Firebase Functions"
Uninstall-Extension "ms-azuretools.vscode-azureresourcegroups" "Azure Resource Groups - not needed"
Uninstall-Extension "ms-azuretools.vscode-azurestaticwebapps" "Azure Static Web Apps - not needed"
Uninstall-Extension "ms-azuretools.vscode-azurestorage" "Azure Storage - using Firebase Storage"
Uninstall-Extension "ms-azuretools.vscode-azurevirtualmachines" "Azure VMs - not needed"
Uninstall-Extension "ms-azuretools.vscode-cosmosdb" "Azure Cosmos DB - using Firestore"
Uninstall-Extension "ms-vscode.vscode-node-azure-pack" "Azure Node.js pack - not needed"
Uninstall-Extension "ms-kubernetes-tools.vscode-aks-tools" "Azure Kubernetes - not needed"
Uninstall-Extension "ms-azure-load-testing.microsoft-testing" "Azure Load Testing - not needed"

Write-Host "`n== UNUSED LANGUAGE SUPPORT ==`n" -ForegroundColor Magenta
Uninstall-Extension "dart-code.dart-code" "Dart/Flutter - not used in project"
Uninstall-Extension "devsense.composer-php-vscode" "PHP Composer - not used in project"
Uninstall-Extension "devsense.intelli-php-vscode" "PHP IntelliSense - not used in project"
Uninstall-Extension "devsense.phptools-vscode" "PHP Tools - not used in project"
Uninstall-Extension "devsense.profiler-php-vscode" "PHP Profiler - not used in project"
Uninstall-Extension "wholroyd.jinja" "Jinja templates - not used in project"
Uninstall-Extension "thebarkman.vscode-djaneiro" "Django snippets - not used in project"
Uninstall-Extension "batisteo.vscode-django" "Django support - not used in project"
Uninstall-Extension "redhat.java" "Java support - not used in project"
Uninstall-Extension "vscjava.vscode-java-debug" "Java debugger - not used in project"
Uninstall-Extension "ms-vscode.cpptools" "C/C++ tools - not used in project"
Uninstall-Extension "ms-dotnettools.vscode-dotnet-runtime" ".NET runtime - not used in project"

Write-Host "`n== REDUNDANT PYTHON EXTENSIONS ==`n" -ForegroundColor Magenta
Uninstall-Extension "donjayamanne.python-extension-pack" "Python pack - redundant with core extension"
Uninstall-Extension "demystifying-javascript.python-extensions-pack" "Python pack - redundant"
Uninstall-Extension "cstrap.python-snippets" "Python snippets - not essential"
Uninstall-Extension "kevinrose.vsc-python-indent" "Python auto-indent - not needed"
Uninstall-Extension "kaih2o.python-resource-monitor" "Python resource monitor - not needed"
Uninstall-Extension "littlefoxteam.vscode-python-test-adapter" "Python test adapter - using Jest"
Uninstall-Extension "njpwerner.autodocstring" "Python docstring generator - not needed"
Uninstall-Extension "njqdev.vscode-python-typehint" "Python type hints - Pylance handles this"

Write-Host "`n== DUPLICATE/UNNECESSARY ==`n" -ForegroundColor Magenta
Uninstall-Extension "docker.docker" "Docker - duplicate of ms-azuretools.vscode-docker"
Uninstall-Extension "ms-azuretools.vscode-containers" "Containers - redundant with Docker extension"
Uninstall-Extension "ms-kubernetes-tools.vscode-kubernetes-tools" "Kubernetes - not needed"
Uninstall-Extension "vitest.explorer" "Vitest - not using Vitest, using Jest"
Uninstall-Extension "hbenl.vscode-test-explorer" "Test Explorer - redundant with Jest"
Uninstall-Extension "ms-vscode.test-adapter-converter" "Test adapter - not needed"
Uninstall-Extension "wallabyjs.wallaby-vscode" "Wallaby - premium tool, not essential"
Uninstall-Extension "wallabyjs.quokka-vscode" "Quokka - premium tool, not essential"
Uninstall-Extension "github.github-vscode-theme" "GitHub theme - keeping one theme"
Uninstall-Extension "be5invis.vscode-icontheme-nomo-dark" "Icon theme - keeping one"
Uninstall-Extension "vscode-icons-team.vscode-icons" "VS Code icons - keeping Material"
Uninstall-Extension "donjayamanne.git-extension-pack" "Git pack - redundant with individual tools"
Uninstall-Extension "afractal.node-essentials" "Node essentials pack - redundant"
Uninstall-Extension "ms-vscode.powershell" "PowerShell extension - terminal sufficient"
Uninstall-Extension "ms-vscode.js-debug-nightly" "Nightly debugger - use stable"
Uninstall-Extension "ms-vscode-remote.remote-wsl" "WSL extension - not using WSL"
Uninstall-Extension "github.codespaces" "Codespaces - not using Codespaces"
Uninstall-Extension "alefragnani.project-manager" "Project manager - not needed"
Uninstall-Extension "gruntfuggly.todo-tree" "TODO tree - nice but not essential"
Uninstall-Extension "wayou.vscode-todo-highlight" "TODO highlight - duplicate functionality"
Uninstall-Extension "kisstkondoros.vscode-gutter-preview" "Gutter preview - not essential"
Uninstall-Extension "oderwat.indent-rainbow" "Indent rainbow - not essential"
Uninstall-Extension "mechatroner.rainbow-csv" "Rainbow CSV - not essential"
Uninstall-Extension "streetsidesoftware.code-spell-checker" "Spell checker - not essential"
Uninstall-Extension "wix.vscode-import-cost" "Import cost - not essential"
Uninstall-Extension "pflannery.vscode-versionlens" "Version lens - not essential"
Uninstall-Extension "zainchen.json" "JSON tools - VS Code has built-in"
Uninstall-Extension "humao.rest-client" "REST client - not essential"
Uninstall-Extension "ritwickdey.liveserver" "Live Server - Next.js has own dev server"
Uninstall-Extension "deerawan.vscode-dash" "Dash integration - not essential"
Uninstall-Extension "ziyasal.vscode-open-in-github" "Open in GitHub - not essential"
Uninstall-Extension "mintlify.document" "Mintlify docs - not essential"
Uninstall-Extension "xirider.livecode" "Live code - not needed"
Uninstall-Extension "almenon.arepl" "AREPL - not needed"
Uninstall-Extension "trabpukcip.wolf" "Wolf - unknown, not needed"
Uninstall-Extension "kombai.kombai" "Kombai design tool - not needed"
Uninstall-Extension "redhat.fabric8-analytics" "Fabric8 - not needed"
Uninstall-Extension "visualstudioexptteam.intellicode-api-usage-examples" "API examples - nice but not essential"
Uninstall-Extension "ms-vscode.vscode-copilot-vision" "Copilot Vision - experimental"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Cleanup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ Successfully removed: $removed extensions" -ForegroundColor Green
Write-Host "✗ Failed to remove: $failed extensions" -ForegroundColor Red
Write-Host "`nPlease restart VS Code for changes to take effect.`n" -ForegroundColor Yellow
