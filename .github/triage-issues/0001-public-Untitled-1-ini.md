Title: public/Untitled-1.ini — Potential Sentry tokens found (98 findings)

Summary:
- 98 findings across 14 commits indicate repeated Sentry token-like values in `public/Untitled-1.ini` (see `tools/gitleaks-triage.csv` for complete list).

Impact:
- Tokens published under `public/` may be publicly readable and, if active, represent a security exposure that should be rotated.

Steps to remediate:
1. Inspect the CSV to identify which fingerprints are active credentials vs placeholders.
2. If active credentials are found: follow `docs/credential_rotation_playbook.md` to rotate/revoke them immediately.
3. Add rotated literal(s) to `tools/replacements_template.txt` (local-only edit) for history rewrite and populate the template with exact values.
4. After rotation, perform the history rewrite per `tools/history_rewrite_runbook.md`.
5. Verify results by re-running `tools/run_gitleaks.ps1` and confirm `tools/gitleaks-triage.csv` no longer includes active credentials for `public/Untitled-1.ini`.

Owner: @maintainers

Notes:
- If this file is meant to be a template/example, replace any secrets with `REDACTED` or environment-backed placeholder values and commit.
