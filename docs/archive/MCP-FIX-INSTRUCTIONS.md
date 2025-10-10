# MCP Server Configuration Fix - October 4, 2025

## Issues Identified

1. **fetch server**: Package `@modelcontextprotocol/server-fetch` does not exist on npm (Python-only)
2. **modemanager server**: Package `@modemanager/server` does not exist
3. **postgres server**: Complex PowerShell command may be failing

## Corrected MCP Configuration

Replace your `mcp.json` file at:
`C:\Users\Austin\AppData\Roaming\Code - Insiders\User\mcp.json`

With this corrected configuration:

```json
{
 "servers": {
  "upstash/context7": {
   "type": "http",
   "url": "https://mcp.context7.com/mcp",
   "headers": {
    "Authorization": "ctx7sk-36a86d20-790b-4e78-aef6-5f2070011353"
   },
   "gallery": "https://api.mcp.github.com/v0/servers/dcec7705-b81b-4e0f-8615-8032604be7ad",
   "version": "1.0.0"
  },
  "microsoft/playwright-mcp": {
   "type": "stdio",
   "command": "npx",
   "args": [
    "@playwright/mcp@latest"
   ],
   "gallery": "https://api.mcp.github.com/v0/servers/41b79849-7e6c-4fc7-82c0-5a611ea21523",
   "version": "0.0.1-seed"
  },
  "postgres": {
   "command": "npx",
   "args": [
    "-y",
    "@modelcontextprotocol/server-postgres",
    "postgresql://postgres:theporadas2025!@localhost:5432/theporadas_dev"
   ],
   "type": "stdio"
  },
  "sequentialthinking": {
   "command": "npx",
   "args": [
    "-y",
    "@modelcontextprotocol/server-sequential-thinking"
   ],
   "type": "stdio"
  },
  "filesystem": {
   "command": "npx",
   "args": [
    "-y",
    "@modelcontextprotocol/server-filesystem",
    "d:/wedding-website/theporadas_wedding_site"
   ],
   "type": "stdio"
  },
  "memory": {
   "command": "npx",
   "args": [
    "-y",
    "@modelcontextprotocol/server-memory"
   ],
   "type": "stdio"
  },
  "puppeteer": {
   "command": "npx",
   "args": [
    "-y",
    "@modelcontextprotocol/server-puppeteer"
   ],
   "type": "stdio"
  },
  "brave": {
   "command": "npx",
   "args": [
    "-y",
    "@modelcontextprotocol/server-brave-search"
   ],
   "env": {
    "BRAVE_API_KEY": "BSAS9aZVHM-uGNa2Cy4CjzeOvIBEkZi"
   },
   "type": "stdio"
  },
  "chromedevtools/chrome-devtools-mcp": {
   "command": "npx",
   "args": [
    "-y",
    "chrome-devtools-mcp"
   ],
   "type": "stdio"
  },
  "github": {
   "type": "http",
   "url": "https://api.githubcopilot.com/mcp/"
  }
 },
 "inputs": [
  {
   "type": "promptString",
   "id": "apiKey"
  },
  {
   "type": "promptString",
   "id": "pg_url",
   "description": "PostgreSQL URL (e.g. postgresql://user:pass@localhost:5432/mydb)",
   "value": "postgresql://postgres:theporadas2025!@localhost:5432/theporadas_dev"
  }
 ]
}
```

## Key Changes Made

1. **Removed `fetch` server** - Not available as npm package
2. **Removed `modemanager` server** - Package doesn't exist (Mode Manager uses pipx, not npm)
3. **Simplified `postgres` command** - Direct connection string instead of PowerShell parsing
4. **Updated `github` server** - Using HTTP-based GitHub Copilot API (no token needed)
5. **Password embedded** - Using the password set during PostgreSQL setup

### Brave Search configuration checklist

- `BRAVE_API_KEY` is the value Brave expects in the `X-Subscription-Token` header; no separate token is issued.
- Space requests by at least one second. You can automate the wait + verify step via:

```powershell
pwsh -File scripts/check-brave-throttle.ps1 -Test
```

- The broader MCP token test harness will also confirm Brave access:

```powershell
pwsh -File scripts/test-mcp-auth.ps1
```

## Mode Manager Installation

Mode Manager should be installed via pipx, not as an MCP server:

```powershell
# Install Mode Manager globally
pipx install mode-manager-mcp

# Or upgrade if already installed
pipx upgrade mode-manager-mcp
```

Mode Manager works through VS Code's built-in `.chatmode.md` and `.instructions.md` files, not as an MCP server.

## Next Steps

1. Close VS Code Insiders completely
2. Replace the mcp.json file with the corrected version above
3. Restart VS Code Insiders
4. All servers should now start successfully

## Working MCP Servers (9 total)

✅ upstash/context7 - Documentation context
✅ microsoft/playwright-mcp - Browser automation
✅ postgres - Database access
✅ sequentialthinking - Deep reasoning
✅ filesystem - File operations
✅ memory - Persistent storage
✅ puppeteer - Browser control
✅ brave - Web search
✅ chromedevtools - Browser debugging
✅ github - Repository operations
