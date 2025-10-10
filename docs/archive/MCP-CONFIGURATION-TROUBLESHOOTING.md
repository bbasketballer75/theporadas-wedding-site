# MCP Configuration Troubleshooting Guide

**Created:** October 5, 2025  
**Issue Discovered:** Firebase MCP installation using wrong configuration method  
**Resolution:** VS Code Insiders uses `settings.json`, not separate `mcp.json`

---

## The Problem

When installing the Firebase MCP server, we initially configured it using the global `mcp.json` file at:

```
%APPDATA%\Code - Insiders\User\globalStorage\@modelcontextprotocol\mcp\mcp.json
```

**This approach did NOT work.** The MCP tools never appeared in Copilot's tool list after restart.

---

## The Root Cause

**VS Code Insiders (October 2025) uses a different MCP configuration method:**

- ❌ **Does NOT use:** `globalStorage\@modelcontextprotocol\mcp\mcp.json`
- ✅ **DOES use:** `settings.json` with `chat.mcp.servers` property

This is different from some MCP documentation which references the separate `mcp.json` file.

---

## The Solution

### Correct Configuration Location

MCP servers must be added to VS Code Insiders `settings.json`:

```
%APPDATA%\Code - Insiders\User\settings.json
```

### Correct JSON Structure

Add the `chat.mcp.servers` property to your settings.json:

```json
{
  "chat.mcp.servers": {
    "firebase": {
      "command": "npx",
      "args": [
        "-y",
        "@firebase/firebase-mcp-server",
        "--project",
        "theporadas-wedding"
      ],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "d:\\wedding-website\\theporadas_wedding_site\\.secrets\\firebase-service-account.json"
      }
    }
  }
}
```

**Important Notes:**

- Use double backslashes (`\\`) in Windows paths within JSON
- The `chat.mcp.servers` property holds ALL MCP server configurations
- Each server gets a unique key (e.g., `"firebase"`, `"sentry"`, etc.)

---

## Automated Fix Script

We created `scripts/add-firebase-to-vscode-settings.ps1` to handle this correctly:

```powershell
# Add Firebase MCP to VS Code Insiders Settings
$settingsPath = "$env:APPDATA\Code - Insiders\User\settings.json"

# Read current settings
$settingsContent = Get-Content $settingsPath -Raw
$settings = $settingsContent | ConvertFrom-Json -AsHashtable

# Create chat.mcp.servers if it doesn't exist
if (-not $settings.ContainsKey('chat.mcp.servers')) {
    $settings['chat.mcp.servers'] = @{}
}

# Add Firebase MCP server
$settings['chat.mcp.servers']['firebase'] = @{
    command = 'npx'
    args = @('-y', '@firebase/firebase-mcp-server', '--project', 'theporadas-wedding')
    env = @{
        GOOGLE_APPLICATION_CREDENTIALS = 'd:\wedding-website\theporadas_wedding_site\.secrets\firebase-service-account.json'
    }
}

# Save settings
$settings | ConvertTo-Json -Depth 10 | Set-Content $settingsPath -Force
```

---

## Verification Steps

### 1. Verify Configuration Exists

```powershell
$settings = Get-Content "$env:APPDATA\Code - Insiders\User\settings.json" -Raw | ConvertFrom-Json
$settings.'chat.mcp.servers'.firebase | Format-List
```

**Expected Output:**

```
args    : {-y, @firebase/firebase-mcp-server, --project, theporadas-wedding}
env     : @{GOOGLE_APPLICATION_CREDENTIALS=d:\wedding-website\theporadas_wedding_site\.secrets\firebase-service-account.json}
command : npx
```

### 2. Restart VS Code Insiders

**Critical:** Close ALL VS Code Insiders windows, not just reload window.

```powershell
# Kill all VS Code Insiders processes (if needed)
Get-Process "Code - Insiders" -ErrorAction SilentlyContinue | Stop-Process -Force
```

### 3. Check MCP Output Panel

After restart:

1. Wait 5-10 seconds for MCP initialization
2. Open Output panel: **View → Output**
3. Select **"Model Context Protocol"** from dropdown
4. Look for Firebase MCP initialization messages

**Success indicators:**

```
[INFO] Initializing MCP server: firebase
[INFO] Firebase MCP connected successfully
```

**Error indicators:**

```
[ERROR] Failed to start MCP server: firebase
[ERROR] Cannot find module '@firebase/firebase-mcp-server'
```

### 4. Test MCP Tools Available

Ask Copilot a Firebase-specific query:

- "List my Firebase Firestore collections"
- "How many RSVPs do we have?"
- "Check Firebase Storage usage"

If Firebase MCP tools are loaded, Copilot will have access to Firebase-specific functions.

---

## Common Issues & Fixes

### Issue 1: Service Account Key Not Found

**Error:**

```
Error: GOOGLE_APPLICATION_CREDENTIALS path does not exist
```

**Fix:**

```powershell
# Verify service account key exists
Test-Path "d:\wedding-website\theporadas_wedding_site\.secrets\firebase-service-account.json"
# Should return: True

# If False, re-download from Firebase Console:
# https://console.firebase.google.com/project/theporadas-wedding/settings/serviceaccounts/adminsdk
```

### Issue 2: Wrong Project Name

**Error:**

```
Error: Firebase project 'xxx' not found
```

**Fix:**

```powershell
# Verify your Firebase project ID
firebase projects:list

# Update settings.json with correct project ID
# Replace "theporadas-wedding" with your actual project ID
```

### Issue 3: NPM/NPX Not Found

**Error:**

```
Error: 'npx' is not recognized as an internal or external command
```

**Fix:**

```powershell
# Verify Node.js and npm are installed
node --version  # Should be v18+
npm --version   # Should be v9+

# If not installed, download from https://nodejs.org/
# Restart VS Code after Node.js installation
```

### Issue 4: Permission Denied on Service Account

**Error:**

```
Error: Permission denied accessing Firestore
```

**Fix:**

1. Open [Google Cloud Console IAM](https://console.cloud.google.com/iam-admin/iam?project=theporadas-wedding)
2. Find service account: `firebase-adminsdk-*@theporadas-wedding.iam.gserviceaccount.com`
3. Verify it has **Firebase Viewer** or **Firebase Admin** role
4. If missing, click Edit → Add Role → Firebase Admin

### Issue 5: Multiple VS Code Installations Conflict

**Error:**
MCP works in VS Code Stable but not VS Code Insiders (or vice versa)

**Fix:**
Each VS Code variant has separate settings:

- **VS Code Stable:** `%APPDATA%\Code\User\settings.json`
- **VS Code Insiders:** `%APPDATA%\Code - Insiders\User\settings.json`

Make sure you're editing the correct file for your VS Code variant.

### Issue 6: Brave Search API returns 401/422 errors

**Symptoms:**

```text
HTTP 401/422 with detail "Field required" for header/x-subscription-token
```

**Fix:**

- Confirm `BRAVE_API_KEY` is set; Brave uses the same value for the `X-Subscription-Token` header.
- Run `pwsh -File scripts/check-brave-throttle.ps1 -Test` to enforce the 1 second delay and verify the key still works.
- Re-run `pwsh -File scripts/test-mcp-auth.ps1` to double-check all MCP tokens after updating environment variables.

---

## Adding Additional MCP Servers

When adding more MCP servers (e.g., Sentry, Vercel), add them to the same `chat.mcp.servers` object:

```json
{
  "chat.mcp.servers": {
    "firebase": {
      "command": "npx",
      "args": ["-y", "@firebase/firebase-mcp-server", "--project", "theporadas-wedding"],
      "env": { "GOOGLE_APPLICATION_CREDENTIALS": "d:\\...\\firebase-service-account.json" }
    },
    "sentry": {
      "command": "npx",
      "args": ["-y", "@sentry/mcp-server"],
      "env": { "SENTRY_AUTH_TOKEN": "your-sentry-token-here" }
    },
    "vercel": {
      "command": "npx",
      "args": ["-y", "@vercel/mcp-server"],
      "env": { "VERCEL_TOKEN": "your-vercel-token-here" }
    }
  }
}
```

---

## PowerShell Helper Commands

### Quick Check: Is Firebase MCP Configured?

```powershell
$settings = Get-Content "$env:APPDATA\Code - Insiders\User\settings.json" -Raw | ConvertFrom-Json
if ($settings.'chat.mcp.servers'.firebase) {
    Write-Host "✓ Firebase MCP is configured" -ForegroundColor Green
    $settings.'chat.mcp.servers'.firebase | Format-List
} else {
    Write-Host "✗ Firebase MCP is NOT configured" -ForegroundColor Red
}
```

### Quick Fix: Re-add Firebase MCP

```powershell
cd d:\wedding-website\theporadas_wedding_site\scripts
.\add-firebase-to-vscode-settings.ps1
```

### Quick Test: Can Firebase MCP Server Run?

```powershell
cd d:\wedding-website\theporadas_wedding_site
$env:GOOGLE_APPLICATION_CREDENTIALS="d:\wedding-website\theporadas_wedding_site\.secrets\firebase-service-account.json"
npx -y @firebase/firebase-mcp-server --project theporadas-wedding --help
```

---

## Key Learnings (October 2025)

1. **VS Code Insiders uses `settings.json` for MCP configuration**, not separate `mcp.json` files
2. **Always restart ALL windows** when changing MCP configuration (Reload Window is insufficient)
3. **Wait 5-10 seconds** after restart for MCP servers to initialize
4. **Check Output panel** "Model Context Protocol" for initialization errors
5. **Use PowerShell hashtables with `-AsHashtable`** for easier JSON manipulation
6. **Double backslashes in JSON** for Windows file paths
7. **Service account keys must exist BEFORE** MCP server initialization
8. **Each MCP server is a persistent process**, not a one-time CLI command

---

## Related Documentation

- [Firebase MCP Installation Guide](./FIREBASE-MCP-INSTALLATION-GUIDE.md) - Full installation steps
- [Firebase MCP Success](./FIREBASE-MCP-SUCCESS.md) - Post-installation testing
- [Firebase Service Account Setup](./FIREBASE-SERVICE-ACCOUNT-SETUP.md) - Obtaining credentials
- [MCP Server Recommendations](./MCP-SERVER-RECOMMENDATIONS-2025-10-04.md) - Research and analysis

---

## Update History

| Date | Change | Reason |
|------|--------|--------|
| 2025-10-05 | Initial creation | Discovered `settings.json` vs `mcp.json` issue during Firebase MCP installation |
| 2025-10-05 | Added automated fix script | Created `add-firebase-to-vscode-settings.ps1` for reliable configuration |
| 2025-10-05 | Added verification steps | Documented how to verify MCP configuration is correct |

---

## Quick Reference Card

**Problem:** MCP tools not appearing after installation  
**Cause:** Wrong configuration file  
**Fix:** Add to `settings.json`, not `mcp.json`  
**Command:** `.\scripts\add-firebase-to-vscode-settings.ps1`  
**Verify:** Check Output panel "Model Context Protocol"  
**Test:** Ask "List my Firebase Firestore collections"

---

**Remember:** This is a VS Code Insiders-specific issue as of October 2025. Future versions may change MCP configuration methods. Always check official MCP documentation for your VS Code version.
