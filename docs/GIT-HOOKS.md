# Git Hook Installation

Enable the repository pre-push checks that verify the Next.js configuration and audit for accidental webpack injections.

## Installation

Run the PowerShell helper from the repository root:

```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -File scripts\install-git-hooks.ps1
```

## Hook Behavior

- Executes `npm run verify:next-config -- --turbopack` to ensure the exported config omits a `webpack` override when Turbopack is active.
- Invokes `node site/scripts/audit-webpack-injection.js` to surface packages that would reintroduce webpack configuration.

The hook blocks a push when either check fails.
