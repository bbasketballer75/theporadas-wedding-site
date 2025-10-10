# Knowledge Note — Copilot Todo Workflow (October 9, 2025)

**Audience:** Future maintainers using the VS Code Insiders autonomous agent stack.

## Why It Matters

- Keeps the 25-task optimization plan visible inside Copilot chat while juggling MCP tool activations.
- Provides quick recall of pending work without leaving the editor or switching documentation.
- Reduces regressions: safety rails ensure todo-driven actions never auto-edit sensitive paths.

## Configuration Snapshot

- `chat.todoListTool.enabled = true` turns on the experimental widget.
- `chat.todoListWidget.position = "panel"` pins the widget alongside chat so it remains visible during tool calls.
- `chat.tools.edits.autoApprove = false` keeps guardrails in place when items trigger edits to config or secret files.
- `.vscode/settings.json` also enables checkpoints and MCP auto-start so todo status persists across restarts.

## Daily Usage Pattern

1. Load the workspace; the widget appears in the Copilot panel.
2. Link each todo entry to the matching line in `docs/OPTIMIZATION-CHECKLIST-2025-10-09.md` (or its successor).
3. Before activating optional MCP servers (Playwright, Puppeteer, etc.), verify the todo item requires them.
4. Mark items complete in both the widget and the checklist to keep documentation synchronized.
5. Archive supporting logs (e.g., Brave throttle tests) in `logs/` to preserve audit trails referenced by the todo item.

## Maintenance Tips

- When new optimization sweeps are launched, copy this workflow into the new checklist doc to maintain conventions.
- If the widget disappears, confirm the `chat.todoListTool.enabled` flag in `.vscode/settings.json` and restart VS Code Insiders.
- For teams, sync the checklist via git so todos remain aligned; the widget is per-user, but the doc keeps everyone honest.
- Document notable learnings in `docs/project-history/` after closing the associated todo to build long-term knowledge.

## Status

- Workflow adopted on October 9, 2025.
- Linked documentation updated: `docs/TOOL-LIMIT-SOLUTION.md`, `docs/AI-CAPABILITIES-GUIDE.md`, `docs/MCP-SERVER-RECOMMENDATIONS-2025-10-04.md`.
- Checklist `docs/OPTIMIZATION-CHECKLIST-2025-10-09.md` now at 25/25 complete.
