Gitleaks triage summary

This folder contains artifacts to help maintainers triage the gitleaks findings discovered by the automated scan.

Artifacts:

- tools/gitleaks-triage.csv — CSV dump of all filtered findings (public/*.ini, .vscode/*.json, logs/*)
- tools/gitleaks-triage.json — JSON version of the filtered findings

High-priority files (summary):

- public/Untitled-1.ini — 98 findings across 14 commits. Action: human review, rotate credentials if live, and add replacements to tools/replacements_template.txt.
- .vscode/mcp.json — 42 findings across many commits. Action: remove file from repo tree (or redact), add to .gitignore, rotate credentials if live.
- logs/replacements_template.txt — Only template entries (already redacted); no direct action unless real keys present.

Suggested next steps:

1. Open the CSV and confirm for each fingerprint whether the matched string is an active credential or a placeholder.
2. Use docs/credential_rotation_playbook.md to rotate any live credentials before attempting history rewrite.
3. After rotation, populate tools/replacements_template.txt with the exact old literals and run the history rewrite steps in tools/history_rewrite_runbook.md.

If you want, I can create per-finding issue files for the top-priority items.
