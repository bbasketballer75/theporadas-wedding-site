Title: .vscode/mcp.json — Potential Sentry tokens in workspace file (42 findings)

Summary:
- ` .vscode/mcp.json` contains multiple Sentry token-like values across many commits. Workspace files should not contain secrets.

Impact:
- Workspace tokens can be accidentally shared; if live they may be used by attackers.

Steps to remediate:
1. Confirm whether the values in `tools/gitleaks-triage.csv` for `.vscode/mcp.json` are active.
2. If active, rotate credentials per `docs/credential_rotation_playbook.md`.
3. Remove `.vscode/mcp.json` content from the current tree by redacting sensitive fields and commit the redaction; add `.vscode/*.json` to `.gitignore` or selectively keep only non-sensitive files.
4. Add old values to `tools/replacements_template.txt` locally and run history rewrite per `tools/history_rewrite_runbook.md`.
5. Verify via `tools/run_gitleaks.ps1` and `tools/gitleaks-triage.csv`.

Owner: @maintainers
