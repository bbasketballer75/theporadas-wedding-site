Development setup checklist
==========================

This file documents the minimal steps to get a local developer environment running for this repository.

1) Install Node.js and repo dependencies
   - From repository root: cd site && npm ci

2) Playwright browsers
   - After installing dependencies run: npx playwright install --with-deps
   - CI uses the same command (workflow at .github/workflows/e2e.yml)

3) Firebase
   - Interactive: run `firebase login` (requires Firebase CLI installed).
   - Non-interactive / CI: generate a CI token with `firebase login:ci` and set the token as the environment variable `FIREBASE_TOKEN` or add as your CI secret.
   - You can verify auth locally via: `./scripts/ensure-firebase-login.ps1` (a helper script has been added to `scripts/ensure-firebase-login.ps1`)

4) GitHub and Brave tokens
   - Add a GitHub PAT as `GITHUB_PERSONAL_ACCESS_TOKEN` (scopes: repo for private operations; fine-grained tokens recommended).
   - Add a Brave Search API key as `BRAVE_API_KEY` if you require authenticated Brave searches (pass it in the `X-Subscription-Token` header; Brave enforces a ~1 request/sec rate limit).
   - Use `scripts/set-mcp-auth.ps1` to set these tokens in your user environment safely. Pass `-Persist` to persist to the Windows User environment.

5) MCP servers
   - Start local MCP servers with the workspace Run Task `Start MCP Servers` (or run scripts/start-mcp-servers.ps1).
   - The start script invokes the Context7 ensure script and the Firebase auth check (warn only).
   - To inspect MCP processes and listening ports, run `scripts/print-mcp-processes.ps1` which writes `.mcp-process-map.json` in the repo root.

6) CI / E2E
   - A GitHub Actions workflow has been added at `.github/workflows/e2e.yml` which runs Playwright tests on Windows runners.

7) Windows-only convenience setup
   - A Windows-only helper script `scripts/setup-dev.ps1` automates the local developer setup steps listed above.
   - Usage: `pwsh -NoProfile -ExecutionPolicy Bypass -File ./scripts/setup-dev.ps1` or run `npm run setup:dev` from the repo root.
   - Pass `-StartMCP` to the script to start the MCP servers after setup (e.g. `./scripts/setup-dev.ps1 -StartMCP`).
   - Pass `-PersistTokens` to be prompted for GitHub/Brave/Firebase tokens and persist them to the Windows User environment. Tokens entered are persisted only when you explicitly request it; the script does not collect tokens by default.

Security note
-------------

- Never commit real tokens into the repository. Use environment variables and CI secret stores.
- If tokens were ever committed, perform secret rotation and optionally a git-history purge (requires coordination).
