# Firebase MCP Configuration - Final Troubleshooting (October 5, 2025)

## Issues Discovered

### Attempt 1: Wrong Package Name

- ❌ Used: `@firebase/firebase-mcp-server` (doesn't exist)
- Result: Package not found, MCP server never started

### Attempt 2: Community Package Wrong Env Var

- ❌ Used: `@gannonh/firebase-mcp` with `GOOGLE_APPLICATION_CREDENTIALS`
- Should use: `SERVICE_ACCOUNT_KEY_PATH`
- Result: Server started but required different environment variable

### Attempt 3: Official Firebase CLI

- ✅ Using: `firebase experimental:mcp --dir /path/to/project`
- This is the official Google-supported Firebase MCP
- Built into firebase-tools CLI (version 14.18.0+)

## Correct Configuration (October 2025)

**For VS Code Insiders settings.json:**

```json
{
  "chat.mcp.servers": {
    "firebase": {
      "command": "firebase",
      "args": ["experimental:mcp", "--dir", "d:\\wedding-website\\theporadas_wedding_site"]
    }
  }
}
```

**Key Points:**

- Use `firebase` command (not `npx`)
- Use `experimental:mcp` subcommand
- Provide `--dir` flag with project directory path
- Double backslashes in Windows paths
- No environment variables needed (uses logged-in Firebase account)

## Why This Works

1. **Firebase CLI has built-in MCP** as of late 2024/early 2025
2. **Reads firebase.json automatically** from the --dir path
3. **Uses your logged-in Firebase account** (no service account needed)
4. **Official Google support** (not community-maintained)

## Testing the Configuration

```powershell
# Test if Firebase MCP runs
cd d:\wedding-website\theporadas_wedding_site
firebase experimental:mcp --dir d:\wedding-website\theporadas_wedding_site

# Should output:
# "This is a running process of the Firebase MCP server..."
```

## Automated Fix Script

Created: `scripts/fix-firebase-mcp-config.ps1`

```powershell
.\scripts\fix-firebase-mcp-config.ps1
# Then restart VS Code Insiders
```

## Next Steps

1. ✅ Configuration updated to use official Firebase CLI MCP
2. ⏳ **Restart VS Code Insiders** (close ALL windows)
3. ⏳ Check Output panel → "Model Context Protocol"
4. ⏳ Should see: `[INFO] Firebase MCP initialized`
5. ⏳ Test with: "List my Firebase Firestore collections"

## If It Still Doesn't Work

### Check These

1. **Firebase CLI Version:**

   ```powershell
   firebase --version  # Should be 14.18.0 or higher
   ```

2. **Firebase Project:**

   ```powershell
   cd d:\wedding-website\theporadas_wedding_site
   Get-Content firebase.json | Select-String -Pattern "projectId"
   ```

3. **Firebase Login:**

   ```powershell
   firebase login:list
   # Should show: bbasketballer75@gmail.com
   ```

4. **VS Code MCP Logs:**
   - View → Output → "Model Context Protocol"
   - Look for errors about "firebase" command

### Alternative: Use Community Package

If official CLI doesn't work, fallback to community package:

```json
{
  "chat.mcp.servers": {
    "firebase": {
      "command": "npx",
      "args": ["-y", "@gannonh/firebase-mcp"],
      "env": {
        "SERVICE_ACCOUNT_KEY_PATH": "d:\\wedding-website\\theporadas_wedding_site\\.secrets\\firebase-service-account.json",
        "FIREBASE_PROJECT_ID": "theporadas-wedding"
      }
    }
  }
}
```

## Key Learnings

1. **Official Firebase CLI MCP** is the preferred method (Google-supported)
2. **Community package** exists but requires service account
3. **VS Code Insiders** uses `settings.json` for MCP configuration
4. **Environment variables** differ between official CLI and community package
5. **Firebase CLI MCP** uses logged-in account, no separate credentials needed

## Related MCP Guides

- `docs/mcp/BRAVE-API-GUIDE.md` documents Brave Search MCP authentication, the required `X-Subscription-Token` header, and the `scripts/check-brave-throttle.ps1` helper for honoring the 1 s rate limit when validating the full MCP stack.

## Documentation Status

- ✅ Root cause identified (wrong package name, wrong env vars)
- ✅ Official Firebase CLI MCP found and tested
- ✅ Configuration updated to use official method
- ⏳ Awaiting restart to verify it works

---

**Status as of 2025-10-05 22:00:**
Configuration now uses official `firebase experimental:mcp` with project directory.
Restart required to test if this resolves the MCP initialization issue.
