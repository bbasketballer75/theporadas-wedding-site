# October 9, 2025 Optimization Checklist (25 Tasks)

**Objective:** Track and complete the 25-item optimization and documentation sweep for the VS Code + MCP environment.

## ✅ Completed Items

- [x] BRAVE-01 - Added `scripts/check-brave-throttle.ps1` to enforce the >=1 s rate limit.
- [x] BRAVE-02 - Validated Brave throttle helper via `pwsh -File scripts/check-brave-throttle.ps1 -Test`.
- [x] BRAVE-03 - Defaulted the throttle helper to run `-Test` unless `-SkipTest` is passed.
- [x] BRAVE-04 - Updated `scripts/set-mcp-auth.ps1` with the subscription-token reminder.
- [x] BRAVE-05 - Updated `scripts/start-mcp-servers.ps1` to prompt usage of the throttle helper.
- [x] DOC-06 - Refreshed `docs/MCP-FIX-INSTRUCTIONS.md` with Brave-specific fixes.
- [x] DOC-07 - Updated `docs/mcp/MCP-FINAL-STATUS.md` to log Brave MCP verification.
- [x] DOC-08 - Updated `docs/mcp/MCP-SETUP-COMPLETE-2025-10-05.md` with Brave guidance.
- [x] DOC-09 - Added Brave checks to `docs/MCP-VERIFICATION-REPORT.md`.
- [x] DOC-10 - Documented the header fix in `docs/MCP-CONFIGURATION-TROUBLESHOOTING.md`.
- [x] DOC-11 - Added Brave quick fix steps to `docs/MCP-QUICK-FIX.md`.
- [x] DOC-12 - Extended `docs/AI-CAPABILITIES-GUIDE.md` with Brave MCP guidance (initial pass).
- [x] DOC-13 - Updated `docs/QUICK-REFERENCE-CARD.md` to mention the throttle helper.
- [x] DOC-14 - Hardened tool batching guidance in `docs/TOOL-CALLING-OPTIMIZATION.md`.
- [x] DOC-15 - Clarified load budgeting in `docs/TOOL-LIMIT-SOLUTION.md`.
- [x] DOC-16 - Authored `docs/mcp/BRAVE-API-GUIDE.md` as the canonical usage guide.
- [x] DOC-17 - Linked Brave troubleshooting from `docs/FIREBASE-MCP-TROUBLESHOOTING-FINAL.md`.
- [x] CFG-18 - Expanded `.vscode/settings.json` with agent-first configuration (auto-approve guards, checkpoints, etc.).
- [x] CFG-19 - Enabled the Copilot todo widget via `chat.todoListTool.enabled` and positioned it in the panel.
- [x] DOC-20 - Documented agent-mode/todo configuration in `docs/AI-CAPABILITIES-GUIDE.md`.
- [x] DOC-21 - Created this master checklist for 25 optimizations.
- [x] HIST-22 - Captured a project-history entry summarizing the October 9 Brave + agent enhancements.
- [x] QA-23 - Re-ran `scripts/check-brave-throttle.ps1` post-settings update and archived the output in `logs/`.
- [x] DOC-24 - Added an agent/todo note to `docs/MCP-SERVER-RECOMMENDATIONS-2025-10-04.md`.
- [x] DOC-25 - Extended `docs/TOOL-LIMIT-SOLUTION.md` with the todo-widget workflow tied to tool budgeting.
- [x] OPS-26 - Authored `docs/project-history/2025-10-09-TODO-WORKFLOW-NOTE.md` to preserve the workspace todo process.

## ⏳ In Progress

- None — checklist is 25/25 complete.

> ✅ All completed entries include file references for quick auditing. Pending items are the only remaining blockers to fully closing the 25-task optimization sweep.
