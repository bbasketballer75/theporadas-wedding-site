# VS Code Extension Review (2025-10-07)

## Install Now (Core)

| Extension | Why keep |
| --- | --- |
| `acomagu.vscode-as-mcp-server` | Needed to host MCP servers per workspace guidance. |
| `block.vscode-mcp-extension` | Base extension for MCP tooling called out in instructions. |
| `davidanson.vscode-markdownlint` | Keeps extensive markdown docs consistent. |
| `dbaeumer.vscode-eslint` | Next.js + TypeScript linting pipeline relies on ESLint. |
| `esbenp.prettier-vscode` | Project enforces Prettier formatting per ESLint config. |
| `github.copilot` | Core AI pairing assistant heavily used in repo. |
| `github.copilot-chat` | Chat interface for Copilot workflow and troubleshooting. |
| `mikestead.dotenv` | Highlights `.env` files; repo uses environment variables. |
| `ms-playwright.playwright` | UI automation suite uses Playwright with 90 tests. |
| `ms-vscode.js-debug` | Debugger for Next.js/Node runtime. |
| `ms-vscode.js-debug-companion` | Adds browser debugging helpers for JS Debug. |
| `ms-vscode.powershell` | Workspace ships PowerShell scripts for tooling fixes. |
| `nickeolofsson.remember-mcp-vscode` | Stores MCP session memory as mandated. |
| `orta.vscode-jest` | Jest tooling needed for unit test maintenance. |
| `streetsidesoftware.code-spell-checker` | Prevents typos in content-heavy wedding site. |
| `vscode-icons-team.vscode-icons` | Matches `workbench.iconTheme` setting already restored. |

- `bradlc.vscode-tailwindcss` – Tailwind CSS IntelliSense for the custom wedding theme (was missing from backup).

## Optional (Install on Demand)

| Extension | Why keep (optional) |
| --- | --- |
| `christian-kohler.npm-intellisense` | Auto-completes package imports; helpful but optional. |
| `christian-kohler.path-intellisense` | Faster path autocompletion for imports; nice productivity boost. |
| `codezombiech.gitignore` | Snippets for .gitignore maintenance. |
| `eamodio.gitlens` | Deep git history insights if desired. |
| `github.vscode-github-actions` | Manage Actions workflows if adjustments are needed. |
| `github.vscode-pull-request-github` | Manage PRs from VS Code when collaborating. |
| `humao.rest-client` | Quickly test HTTP endpoints without leaving the editor. |
| `mechatroner.rainbow-csv` | Enhanced CSV viewing; rarely needed here. |
| `mintlify.document` | AI-assisted documentation lookup; nice but not critical. |
| `ms-python.python` | Installed per request for occasional Python scripting, though not required for the core stack. |
| `ms-python.vscode-pylance` | Provides Python language server features (IntelliSense, diagnostics) alongside the Python extension. |
| `ms-vscode.js-debug-nightly` | Nightly JS debugger build; use only if needing latest fixes. |
| `ms-vscode.test-adapter-converter` | Legacy test adapter support; only needed for older suites. |
| `ms-vscode.vscode-copilot-vision` | Adds Copilot vision capabilities; situational. |
| `ms-vscode.vscode-js-profile-table` | Advanced JS performance profiling UI. |
| `oderwat.indent-rainbow` | Visual indent guides; personal preference. |
| `pflannery.vscode-versionlens` | Shows latest package versions inline. |
| `redhat.vscode-yaml` | Gives YAML schema/validation support for workflows; install if editing YAML regularly. |
| `wix.vscode-import-cost` | Displays bundle cost per import; useful when optimizing. |

## Skip Restoring

These extensions were in the backup but do not support the current Next.js + Firebase workflow:

- `afractal.node-essentials` – Node extension pack duplicates built-in tooling.
- `alefragnani.project-manager` – Project switcher unnecessary for single workspace.
- `almenon.arepl` – Python live REPL not needed.
- `batisteo.vscode-django` – Django tooling not needed.
- `be5invis.vscode-icontheme-nomo-dark` – Alternate icon theme not in use.
- `cstrap.python-snippets` – Python snippets unused.
- `dart-code.dart-code` – Dart tooling not required.
- `dbcode.dbcode` – Database modeling assistant not in scope.
- `deerawan.vscode-dash` – Dash doc integration optional and unused.
- `demystifying-javascript.python-extensions-pack` – Python extension pack not needed.
- `devsense.composer-php-vscode` – PHP tooling not relevant to Next.js/Firebase project.
- `devsense.intelli-php-vscode` – PHP tooling not relevant to Next.js/Firebase project.
- `devsense.phptools-vscode` – PHP tooling not relevant to Next.js/Firebase project.
- `devsense.profiler-php-vscode` – PHP tooling not relevant to Next.js/Firebase project.
- `docker.docker` – Docker tooling not part of current stack.
- `donjayamanne.git-extension-pack` – Extra git tooling redundant with GitLens.
- `donjayamanne.githistory` – Git history already covered by GitLens.
- `donjayamanne.python-environment-manager` – Python helper tooling unnecessary.
- `donjayamanne.python-extension-pack` – Python helper tooling unnecessary.
- `editorconfig.editorconfig` – No .editorconfig present; extension unnecessary.
- `github.codespaces` – Codespaces-specific extension not currently used.
- `github.remotehub` – RemoteHub not used; local workspace only.
- `gruntfuggly.todo-tree` – TODO tree not needed; minimal extension footprint preferred.
- `hbenl.vscode-test-explorer` – Legacy test explorer not required; Playwright/Jest tooling available.
- `kaih2o.python-resource-monitor` – Python resource monitor irrelevant.
- `kevinrose.vsc-python-indent` – Python indentation helper not needed.
- `kisstkondoros.vscode-gutter-preview` – Inline image preview not required.
- `kombai.kombai` – UI/UX assistant not needed for this workflow.
- `littlefoxteam.vscode-python-test-adapter` – Python test adapters unused.
- `ms-azure-load-testing.microsoft-testing` – Azure-specific service integration not needed.
- `ms-azuretools.azure-dev` – Azure management tooling – project is on Firebase, so unused.
- `ms-azuretools.vscode-azure-github-copilot` – Azure management tooling – project is on Firebase, so unused.
- `ms-azuretools.vscode-azure-mcp-server` – Azure management tooling – project is on Firebase, so unused.
- `ms-azuretools.vscode-azureappservice` – Azure management tooling – project is on Firebase, so unused.
- `ms-azuretools.vscode-azurecontainerapps` – Azure management tooling – project is on Firebase, so unused.
- `ms-azuretools.vscode-azurefunctions` – Azure management tooling – project is on Firebase, so unused.
- `ms-azuretools.vscode-azureresourcegroups` – Azure management tooling – project is on Firebase, so unused.
- `ms-azuretools.vscode-azurestaticwebapps` – Azure management tooling – project is on Firebase, so unused.
- `ms-azuretools.vscode-azurestorage` – Azure management tooling – project is on Firebase, so unused.
- `ms-azuretools.vscode-azurevirtualmachines` – Azure management tooling – project is on Firebase, so unused.
- `ms-azuretools.vscode-containers` – Azure management tooling – project is on Firebase, so unused.
- `ms-azuretools.vscode-cosmosdb` – Azure management tooling – project is on Firebase, so unused.
- `ms-azuretools.vscode-docker` – Azure management tooling – project is on Firebase, so unused.
- `ms-dotnettools.vscode-dotnet-runtime` – .NET runtime support not required.
- `ms-kubernetes-tools.vscode-kubernetes-tools` – Kubernetes tooling not needed.
- `ms-python.debugpy` – Python toolchain not used in this workspace.
- `ms-python.vscode-python-envs` – Python toolchain not used in this workspace.
- `ms-vscode-remote.remote-containers` – Not needed for the Next.js + Firebase workflow.
- `ms-vscode-remote.remote-wsl` – Not needed for the Next.js + Firebase workflow.
- `ms-vscode.anycode` – Anycode language packs for non-project languages.
- `ms-vscode.anycode-c-sharp` – Anycode language packs for non-project languages.
- `ms-vscode.anycode-cpp` – Anycode language packs for non-project languages.
- `ms-vscode.anycode-go` – Anycode language packs for non-project languages.
- `ms-vscode.anycode-java` – Anycode language packs for non-project languages.
- `ms-vscode.anycode-kotlin` – Anycode language packs for non-project languages.
- `ms-vscode.anycode-php` – Anycode language packs for non-project languages.
- `ms-vscode.anycode-python` – Anycode language packs for non-project languages.
- `ms-vscode.anycode-rust` – Anycode language packs for non-project languages.
- `ms-vscode.anycode-typescript` – Anycode language packs for non-project languages.
- `ms-vscode.azure-repos` – Azure Repos integration unused.
- `ms-vscode.cpptools` – Not needed for the Next.js + Firebase workflow.
- `ms-vscode.remote-explorer` – Remote development extensions not needed locally.
- `ms-vscode.remote-repositories` – Remote development extensions not needed locally.
- `ms-vscode.remote-server` – Remote development extensions not needed locally.
- `ms-vscode.vscode-node-azure-pack` – Azure extension bundle – Firebase project does not require it.
- `ms-windows-ai-studio.windows-ai-studio` – Windows AI Studio tooling unnecessary for this project.
- `njpwerner.autodocstring` – Python docstring generator unnecessary.
- `njqdev.vscode-python-typehint` – Python type hint helper unnecessary.
- `pkief.material-icon-theme` – Icon theme superseded by vscode-icons preference.
- `redhat.fabric8-analytics` – Fabric8 analytics targets Maven/npm microservices; overkill here.
- `redhat.java` – Java tooling unused.
- `ritwickdey.liveserver` – Static Live Server duplicates Next.js dev server.
- `teamsdevapp.vscode-ai-foundry` – Azure AI Foundry integration not required here.
- `thebarkman.vscode-djaneiro` – Django templates not used.
- `trabpukcip.wolf` – Workflow helper not part of process.
- `visualstudioexptteam.intellicode-api-usage-examples` – Intellicode examples redundant with Copilot.
- `visualstudioexptteam.vscodeintellicode` – Intellicode suggestions redundant with Copilot.
- `vitest.explorer` – Vitest not used; Playwright/Jest cover testing.
- `vscjava.vscode-java-debug` – Java debugging unnecessary.
- `wallabyjs.quokka-vscode` – Quokka runtime not part of workflow.
- `wayou.vscode-todo-highlight` – Duplicate TODO highlighting functionality.
- `wholroyd.jinja` – Jinja templating not used.
- `xirider.livecode` – Live coding tool unnecessary.
- `zainchen.json` – Not needed for the Next.js + Firebase workflow.
- `ziyasal.vscode-open-in-github` – Not needed for the Next.js + Firebase workflow.
