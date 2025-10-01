Security & Secrets Guidance for Contributors

Do not commit secrets or credentials into the repository.

Quick rules:
- Use environment variables or secret stores (GitHub Secrets, Azure Key Vault, etc.) for credentials.
- Never check in `.env` files with real values. Add `.env` to `.gitignore` (already present).
- Remove workspace-specific files that contain secrets (`.vscode/*.json`) from the repo and add them to `.gitignore`.

Pre-commit scanning (recommended):
- We recommend adding a local pre-commit hook to run gitleaks before commits.
- Example (manual installation):
  1. curl -sSL https://github.com/zricethezav/gitleaks/releases/download/8.24.3/gitleaks_8.24.3_linux_x86_64.tar.gz | tar -xzf - -C /tmp/gitleaks
  2. ln -s /tmp/gitleaks/gitleaks ~/bin/gitleaks (ensure ~/bin is in PATH)
  3. Create a git hook `.git/hooks/pre-commit` with:
     #!/bin/sh
     /tmp/gitleaks/gitleaks detect --config .gitleaks.toml --source . --redact || { echo "Gitleaks detected a secret; fix or redact before committing."; exit 1; }
  4. Make the hook executable: chmod +x .git/hooks/pre-commit

- Alternatively, use the `pre-commit` framework to install an automated check. Example `.pre-commit-config.yaml` is included in the repo for maintainers to adopt.

If you find a secret accidentally committed:
- DO NOT attempt to remove it from history alone. Rotate the secret immediately, then follow the history rewrite runbook in `tools/history_rewrite_runbook.md`.
