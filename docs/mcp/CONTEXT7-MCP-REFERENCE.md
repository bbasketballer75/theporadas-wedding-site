Context7 MCP (Upstash) — Quick Reference

This file collects the important Context7 MCP configuration snippets and usage notes (fetched automatically).

Library ID: /upstash/context7

Quick usage notes

- Remote MCP: add an HTTP remote server entry pointing to <https://mcp.context7.com/mcp>. Add Authorization header if you have an API key.
- Local MCP: run the Context7 MCP server locally via npx (or bun/bunx) and configure the client to use the command.
- Restart VS Code after editing %APPDATA%\Code - Insiders\User\mcp.json to pick up changes.

Example: add remote Context7 server to mcp.json (minimal)

```
{
  "servers": {
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

Example: run Context7 MCP locally via npx

```
npx -y @upstash/context7-mcp --api-key YOUR_API_KEY
```

Example: VS Code / Cline mcp.json local `stdio` entry

```
"mcp": {
  "servers": {
    "context7": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp", "--api-key", "YOUR_API_KEY"]
    }
  }
}
```

Notes & recommendations

- Prefer remote HTTP server with an API key for production usage to avoid local runtime installs.
- For local dev on Windows, use the `npx` stdio command; ensure Node/Bun is available.
- Respect rate limits and API key secrecy. Store keys in environment variables or the OS keychain; avoid committing them to source control.
- Restart VS Code after any `%APPDATA%/Code - Insiders/User/mcp.json` edits to apply changes.

Sources:

- Upstash Context7 README (selected code snippets)
