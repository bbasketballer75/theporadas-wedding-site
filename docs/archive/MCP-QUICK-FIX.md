# MCP Configuration - Quick Fix Guide

**Date:** October 5, 2025  
**Issue:** Firebase MCP tools not loading after installation  
**Solution:** Use `settings.json` not `mcp.json`

---

## The Problem

Firebase MCP was configured in:

```text
%APPDATA%\Code - Insiders\User\globalStorage\@modelcontextprotocol\mcp\mcp.json
```

**But VS Code Insiders doesn't read that file!**

---

## The Solution

MCP servers must be in VS Code `settings.json`:

```text
%APPDATA%\Code - Insiders\User\settings.json
```

### Automated Fix

```powershell
cd d:\wedding-website\theporadas_wedding_site\scripts
.\add-firebase-to-vscode-settings.ps1
```

### Manual Fix

1. Open VS Code Settings (JSON): `Ctrl+Shift+P` → "Preferences: Open User Settings (JSON)"
2. Add to the JSON:

```json
{
  "chat.mcp.servers": {
    "firebase": {
      "command": "npx",
      "args": ["-y", "@firebase/firebase-mcp-server", "--project", "theporadas-wedding"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "d:\\wedding-website\\theporadas_wedding_site\\.secrets\\firebase-service-account.json"
      }
    }
  }
}
```

3. Save and **restart VS Code** (close ALL windows)

---

## Verify It Works

```powershell
# Check configuration exists
$settings = Get-Content "$env:APPDATA\Code - Insiders\User\settings.json" -Raw | ConvertFrom-Json
$settings.'chat.mcp.servers'.firebase | Format-List
```

After restart:

1. **View → Output** → Select "Model Context Protocol"
2. Look for: `[INFO] Firebase MCP connected successfully`
3. Test: Ask Copilot "List my Firebase Firestore collections"

---

## Key Learnings

✅ **VS Code Insiders uses `settings.json` for MCP config**  
✅ **Must close ALL windows to reload MCP servers**  
✅ **Wait 5-10 seconds after restart for initialization**  
✅ **Check Output panel for MCP errors**  

❌ **Don't use separate `mcp.json` file (October 2025)**  
❌ **Don't use "Reload Window" - full restart required**  

---

## Quick Fix: Brave API header errors

1. Confirm `BRAVE_API_KEY` is set (it is also the `X-Subscription-Token` header).
2. Run `pwsh -File scripts/check-brave-throttle.ps1 -Test` to space requests (≥1 second) and validate the key.
3. Re-run `pwsh -File scripts/test-mcp-auth.ps1` to see a consolidated token health report.

---

## See Also

- [Full Troubleshooting Guide](./MCP-CONFIGURATION-TROUBLESHOOTING.md)
- [Firebase MCP Installation](./FIREBASE-MCP-INSTALLATION-GUIDE.md)
- [MCP Server Recommendations](./MCP-SERVER-RECOMMENDATIONS-2025-10-04.md)
