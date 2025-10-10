# Project Cleanup Policy

## File Organization Standards

### Documentation Files

- **Location:** `docs/mcp/` for MCP-related documentation
- **Naming:** Use descriptive names with dates (e.g., `MCP-SETUP-2025-10-05.md`)
- **Cleanup:** Archive after 30 days if no longer actively referenced

### Scripts

- **Active Scripts:** Keep in `scripts/` for production use
- **Temporary Scripts:** Move to `scripts/archive/` after troubleshooting complete
- **Naming:** Use descriptive names indicating purpose (e.g., `deploy-production.ps1`)

### Root Directory

Keep clean - only essential files:

- `package.json`, `tsconfig.json`, etc. (build config)
- `.env`, `.gitignore` (environment/git config)
- `README.md`, `LICENSE` (project docs)
- `firebase.json`, `firestore.rules` (Firebase config)

## Cleanup Schedule

**After Each Major Session:**

1. Move documentation to `docs/mcp/`
2. Archive temporary troubleshooting scripts
3. Update `docs/mcp/README.md` with current status
4. Commit organized files

**Monthly:**

1. Review `docs/mcp/` for outdated files
2. Clean up `scripts/archive/`
3. Update documentation index

## Current Organization (October 5, 2025)

✅ **Completed:**

- Created `docs/mcp/` folder
- Moved 20+ MCP documentation files
- Archived temporary setup scripts
- Created `docs/mcp/README.md` index

✅ **Result:**

- Clean project root
- Organized documentation
- Easy reference for future sessions
- Preserved troubleshooting history

---

**AI Agent Note:** Always organize files after major tasks. Keep root directory clean for user's development workflow.
