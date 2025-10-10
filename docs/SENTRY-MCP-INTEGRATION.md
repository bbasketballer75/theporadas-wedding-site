# Sentry MCP Integration Guide

This document explains how to provision a Sentry auth token with the correct scopes and configure the project to run the `@sentry/mcp-server` locally via the MCP tooling.

## Overview

The Sentry MCP server connects the Model Context Protocol to Sentry for tasks like fetching events, creating DSNs, creating projects and more. The server requires an access token (Sentry auth token) and a DSN to operate.

Two common modes:

- Read-only: Use a token with read scopes (default minimum). Great for inspecting org, project, and events.
- Read-write / Admin: Use a token with higher scopes (event:write, project:write, org:write, project:releases) for management actions.

## Steps

1. Create an auth token in Sentry:
   - In Sentry → Organization Settings → Developer → Auth Tokens
   - Click **Create Token**
   - Add a description (e.g., `mcp-local-dev`) and set expiration if desired
   - Grant the minimal scopes you need:
     - Read-only: `org:read, project:read, team:read, event:read`
     - Write: add `event:write, project:write` when needed
     - Admin: add `org:write` or choose **All Scopes** for full access (only for trusted tokens)

2. Add to workspace `.env` (DO NOT commit):

```
SENTRY_AUTH_TOKEN=sntryu_yourtokenhere
SENTRY_DSN=https://<public>@o12345.ingest.sentry.io/12345
```

3. Load the env into your session and start MCP servers (task will load token automatically):

- Run the helper to export Sentry variables:

```
pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/load-sentry-env.ps1
```

- Start MCP servers (task):

```
Run Task → Start MCP Servers
```

4. Verify server logs for missing scopes/warnings. If you see messages like `Skipping tool 'create_project' - missing required scopes`, then the token lacks the required scope for that action. Create a token with the needed scopes as above.

5. (Optional) Constrain the MCP server to a specific org or project with `--organization-slug` or `--project-slug` when starting the server.

## Troubleshooting

- "No access token was provided": Ensure `SENTRY_AUTH_TOKEN` (or `SENTRY_ACCESS_TOKEN`) is set in `.env` and run `scripts/load-sentry-env.ps1`.
- Tools skipped due to scopes: Recreate token with higher scopes.
- Missing OPENAI features: Add `OPENAI_API_KEY` to `.env` if you need tools that depend on OpenAI.

## Security

- Do not commit `.env` or tokens to source control.
- Prefer scoped tokens with the minimal permissions required for your tasks.
- If using shared machines, consider rotating tokens regularly.

## Example commands

- Test token quickly (shows enabled/disabled tools):

```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -Command "npx -y @sentry/mcp-server --access-token=$env:SENTRY_AUTH_TOKEN --sentry-dsn=$env:SENTRY_DSN"
```

This will print which internal tools were enabled or skipped based on token scopes.

## OpenAI Integration (Optional)

Some Sentry MCP features use OpenAI for evaluation or automation tests. To enable those features locally, add your OpenAI API key to the `.env` file (do not commit this key):

```
OPENAI_API_KEY=sk-...
```

After adding the key, reload the environment and restart the MCP servers. The `load-sentry-env.ps1` helper will export `OPENAI_API_KEY` into your session so child MCP processes inherit it.

## Default write scopes for local development

The `scripts/start-mcp-servers.ps1` helper will automatically request the common write scopes `event:write,project:write` when starting the Sentry MCP server if you do not explicitly provide `-SentryAddScopes`. This is intended to make local testing and common management operations available during development. If you prefer not to auto-request write scopes, set the `-SentryAddScopes` parameter to an empty string when invoking the script.

Example: start servers without requesting write scopes:

```
pwsh -File scripts/start-mcp-servers.ps1 -SentryAddScopes ""
```

Or explicitly provide add-scopes and organization/project constraints:

```
pwsh -File scripts/start-mcp-servers.ps1 -SentryAddScopes "event:write,project:write" -SentryOrganizationSlug "theporadas-wedding"
```
