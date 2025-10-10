# Enable Memory MCP Server - Instructions

The memory server is currently disabled in VS Code settings. To enable it:

## Option 1: Via VS Code Settings UI

1. Open VS Code Settings (`Ctrl+,` or `Cmd+,`)
2. Search for: `chat.mcp`
3. Look for disabled MCP servers
4. Find `memory` server and enable it
5. Restart VS Code Insiders

## Option 2: Via settings.json

Add this to your VS Code settings.json:

```json
{
  "chat.mcp.servers": {
    "memory": {
      "enabled": true
    }
  }
}
```

## Option 3: Check MCP Configuration

The memory server is configured in `mcp.json` at:
`C:\Users\Austin\AppData\Roaming\Code - Insiders\User\mcp.json`

Current configuration:

```json
"memory": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-memory"],
  "type": "stdio"
}
```

This configuration is correct. The server just needs to be enabled in VS Code preferences.

## Verification

After enabling, test with:

- Create a memory entity
- Read the knowledge graph
- Store observations

The memory server provides persistent knowledge storage across chat sessions.
