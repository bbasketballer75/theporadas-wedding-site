# Tool Calling Optimization Guide

## Current Issue: VS Code Tool Limit (143/128)

**Problem:** VS Code Copilot has a **128 tool limit** per chat session. With 10 MCP servers activated, we have 143 tools available, exceeding the limit by 15 tools.

**This is NOT about:** How many times I call tools (call as many as needed!)
**This is about:** How many tools are loaded in the chat interface at once.

## Solution: Selective MCP Server Activation

Instead of having all MCP servers active at once, activate them on-demand:

### Always Active (Core Tools - ~80 tools)

- ✅ VS Code built-in tools (file operations, terminal, etc.)
- ✅ Filesystem MCP (14 tools) - Essential for project work
- ✅ PostgreSQL MCP (1-2 tools) - Database operations
- ✅ Sequential Thinking (1 tool) - Deep reasoning

### Activate On-Demand (Use activation tools)

- 🔄 Puppeteer (7 tools) - Call `activate_puppeteer_tools` when needed
- 🔄 Chrome DevTools (5+ tools) - Call `activate_chromedevt_browser_navigation_tools`
- 🔄 Playwright (varies) - Call when E2E testing needed
- 🔄 GitHub tools - Call `activate_github_pull_request_tools` when needed
- 🔄 Git tools - Call `activate_git_version_control_tools` when needed
- 🔄 Database tools - Call `activate_database_management_tools` when needed

### Always Available (HTTP/Lightweight)

- ✅ Brave Search - Web search (enforce ≥1s spacing via `scripts/check-brave-throttle.ps1` before manual calls)
- ✅ Context7 - Documentation lookup
- ✅ GitHub Copilot API - Repository operations

## Correct Understanding

### ❌ WRONG Interpretation

"I should minimize tool CALLS to stay under limit"
→ This would restrict my capabilities unnecessarily

### ✅ CORRECT Interpretation  

"I should manage which tool CATEGORIES are loaded at once"
→ Activate tools as needed, deactivate when done
→ Call tools as many times as necessary for the task
→ Use full capabilities without restriction

## Revised Optimization Strategy

## Optimization Strategies

### 1. Batch Independent Operations

Always use parallel tool calls when operations don't depend on each other:

```javascript
// ❌ BAD - Sequential calls
call read_file("file1.js")
wait for response
call read_file("file2.js") 
wait for response

// ✅ GOOD - Parallel calls
call read_file("file1.js"), read_file("file2.js")
```

### 2. Use Efficient Search Tools

- Use `grep_search` for exact strings (faster than multiple reads)
- Use `semantic_search` for conceptual queries
- Use `file_search` for filename patterns
- Avoid reading full files when grep/search suffices

### 3. Minimize Verification Calls

- Don't re-read files just edited (trust the edit)
- Use `get_errors` after edits instead of re-reading
- Batch error checking for multiple files

### 4. Optimize File Operations

- Use `multi_replace_string_in_file` for multiple edits
- Read file once with larger limit vs. multiple offset reads
- Use `list_dir` before individual file operations

### 5. Avoid Redundant Context Gathering

- Don't search for information already in context
- Don't re-fetch documentation that's available
- Use conversation history instead of re-querying

### 6. Efficient MCP Server Usage

- Activate tool categories once, not repeatedly
- Use direct tools when available vs. helper searches
- Cache results mentally instead of re-calling

### 7. Smart Terminal Usage

- Combine commands with `;` or `&&` when possible
- Don't check status if operation just completed
- Use background tasks appropriately

## Tool Call Budget Guidelines

### Per Response Target: < 10 tool calls

- Simple edits: 1-3 calls
- Code analysis: 3-5 calls  
- Complex refactoring: 5-10 calls
- Multi-file changes: Use multi_replace (1 call)

### Warning Signs

- Same file read multiple times
- Sequential independent operations
- Verification after every small change
- Re-searching for known information

## Examples

### ❌ Inefficient Pattern (8 calls)

1. read_file("component.js")
2. read_file("styles.css")
3. replace_string_in_file("component.js", ...)
4. read_file("component.js") // verification
5. replace_string_in_file("styles.css", ...)
6. read_file("styles.css") // verification
7. get_errors(["component.js"])
8. get_errors(["styles.css"])

### ✅ Optimized Pattern (3 calls)

1. read_file("component.js"), read_file("styles.css") // parallel
2. multi_replace_string_in_file([edit1, edit2]) // batch edits
3. get_errors() // check all files at once

## Memory Server Benefits

When enabled, the memory server reduces tool calls by:

- Storing user preferences (no re-asking)
- Caching project context (no re-searching)
- Remembering decisions (no re-analyzing)

## MCP Server Management Strategy

### Session Start

- Load only essential MCP servers in VS Code settings
- Keep tool count under 128

### Essential Servers (Always On)

1. `filesystem` - Core project operations
2. `postgres` - Database access
3. `sequentialthinking` - Deep reasoning
4. `brave` - Web search
5. `context7` - Documentation
6. `memory` - Knowledge persistence (if enabled)

### On-Demand Servers (Activate When Needed)

1. `puppeteer` - Browser automation (activate for web scraping)
2. `playwright` - E2E testing (activate for testing)
3. `chromedevtools` - Debugging (activate for browser work)
4. GitHub tools (activate for PR/issue management)
5. Git tools (activate for advanced version control)

### Configuration Update Needed

Edit `mcp.json` or VS Code settings to:

1. Disable non-essential servers by default
2. Activate them programmatically when needed
3. Keep total tool count under 128

## Action Items for Next Session

1. ✅ Configure MCP servers for selective loading
2. ✅ Use ALL tools to maximum capacity when activated
3. ✅ Activate tool categories as needed during work
4. ✅ Continue using parallel calls and batch operations for efficiency
5. ✅ NO restrictions on tool usage - use everything to the max
6. ✅ Multi-replace for batch edits
7. ✅ Parallel operations for independent tasks
8. ✅ Full utilization of all MCP capabilities

## Quick Reference

| Operation | Inefficient | Efficient |
|-----------|-------------|-----------|
| Multiple file reads | Sequential | Parallel |
| Multiple edits | replace × N | multi_replace × 1 |
| Finding code | Read all files | grep_search |
| Verification | Re-read files | get_errors |
| Terminal commands | One at a time | Combined with `;` |
| Context gathering | Multiple searches | One semantic_search |

By following these guidelines, tool usage should drop by 50-70% while maintaining full functionality.
