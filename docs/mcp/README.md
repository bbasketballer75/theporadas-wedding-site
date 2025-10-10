# MCP Setup Documentation

This folder contains all MCP (Model Context Protocol) setup and troubleshooting documentation.

## Quick Reference

**Current Status:** 12/12 servers configured (100%)
**Last Updated:** October 5, 2025

### Active MCP Servers

All 12 servers are now configured with authentication:

- ✅ firebase (authenticated)
- ✅ filesystem (d:/wedding-website/theporadas_wedding_site)
- ✅ postgres (password configured)
- ✅ github (API token configured)
- ✅ brave-search (API key configured)
- ✅ memory, sequential-thinking, fetch, playwright, puppeteer, context7, mode-manager

### Configuration Files

- **Main Config:** `%APPDATA%\Code - Insiders\User\mcp.json`
- **Environment:** `d:\wedding-website\theporadas_wedding_site\.env`

### Documentation Files

- `MCP-FINAL-STATUS.md` - Complete setup status and testing guide
- `MCP-SETUP-COMPLETE-2025-10-05.md` - Detailed configuration walkthrough
- `MCP-VERIFICATION-2025-10-05.md` - Verification and test results
- Other files: Historical troubleshooting documentation

### Archived Scripts

Temporary setup scripts are in `scripts/archive/` - kept for reference but no longer needed for daily operations.

---

**Note:** After setting new environment variables, restart VS Code to load updated MCP servers.
