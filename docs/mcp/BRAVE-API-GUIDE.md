# Brave Search MCP Usage Guide

**Last Updated:** October 9, 2025  
**Scope:** Token management, throttling, and validation steps for the Brave Search MCP server.

---

## 1. Overview

- The existing `brave-search` MCP server enables web search directly from VS Code Copilot / MCP tool calls.
- Brave issues a single value that serves as both the dashboard API key and the `X-Subscription-Token` header.
- Manual REST calls must respect the documented **~1 request per second** throttle to avoid HTTP 429/422 responses.

---

## 2. Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `BRAVE_API_KEY` | ✅ | Paste the value from <https://brave.com/search/api/>; it doubles as the `X-Subscription-Token` header. |

Set or persist the key via `scripts/set-mcp-auth.ps1`:

```powershell
pwsh -File scripts/set-mcp-auth.ps1 -BraveKey 'bs_xxxxxxxx' -Persist
```

---

## 3. Respecting the Throttle

Use the helper to wait out the remaining cooldown before you fire a manual request:

```powershell
pwsh -File scripts/check-brave-throttle.ps1
```

Add `-Test` to perform a lightweight verification query after the enforced delay:

```powershell
pwsh -File scripts/check-brave-throttle.ps1 -Test
```

The script stores the last-call timestamp under `%LOCALAPPDATA%\ThePoradas\brave-throttle-state.json` so that consecutive terminal sessions share the same cooldown information.

---

## 4. Verifying Credentials Quickly

Run the consolidated MCP token check:

```powershell
pwsh -File scripts/test-mcp-auth.ps1
```

Expected Brave output:

- `Testing Brave API key: ****` (masked)  
- Success message indicating the response was received.

If the Brave section raises a failure, re-run `check-brave-throttle.ps1 -Test` to see the raw HTTP error.

---

## 5. Common Errors & Fixes

| Error | Explanation | Fix |
|-------|-------------|-----|
| `HTTP 401/422: header/x-subscription-token` | Missing or incorrect header | Ensure the key is present and passed as `X-Subscription-Token`. |
| `HTTP 429 Too Many Requests` | Throttle hit | Re-run `check-brave-throttle.ps1` and wait ≥1 second between calls. |
| PowerShell `Invoke-RestMethod` parsing errors | Unescaped quotes or wrong header casing | Use the helper scripts; they send the correct headers automatically. |

---

## 6. Integrating with MCP Workflows

- The Brave MCP server is optional, but when present it augments documentation lookups and research prompts.
- In Copilot conversations, the agent already enforces pacing; manual terminal commands should continue using the helper scripts above.
- Include Brave validation in broader environment smoke tests:
  1. `pwsh -File scripts/test-mcp-auth.ps1`
  2. `pwsh -File scripts/check-brave-throttle.ps1 -Test`
  3. `firebase projects:list`

---

## 7. Related Documents

- [MCP Final Status](./MCP-FINAL-STATUS.md)
- [MCP Quick Fix](./MCP-QUICK-FIX.md)
- [MCP Configuration Troubleshooting](./MCP-CONFIGURATION-TROUBLESHOOTING.md)

Use this guide whenever Brave introduces new limits or tokens so the workflow remains reliable.
