# NPM Workspace Symlink Fix - October 6, 2025

## Problem Summary

Encountered **Windows symlink permission issue** preventing npm workspace installation:

```
npm error code EISDIR
npm error syscall symlink
npm error path D:\wedding-website\theporadas_wedding_site\site
npm error dest D:\wedding-website\theporadas_wedding_site\node_modules\theporadas-site
npm error errno -4068
npm error EISDIR: illegal operation on a directory, symlink
```

### Root Cause

Windows requires **Developer Mode** or **SeCreateSymbolicLinkPrivilege** to create symlinks. npm workspaces create a symlink from `node_modules/theporadas-site` → `site/`, which failed on Windows without proper permissions.

### Attempted Fixes (All Failed)

1. ✗ **Robocopy deletion** - Cleared corrupted `node_modules`, but symlink issue persisted
2. ✗ **npm install --force** - Same symlink error
3. ✗ **npm install --install-links=false** - File lock errors from running VS Code
4. ✗ **npm config set install-strategy=shallow/hoisted** - Symlink error persisted
5. ✗ **PowerShell fix scripts** - Cleared directories but couldn't bypass symlink requirement

### Permanent Solution

**Removed npm workspaces entirely** and switched to **independent package.json files**:

#### Changes Made

1. **Removed workspace configuration from root `package.json`:**

   ```diff
   - "workspaces": [
   -   "site"
   - ],
   ```

2. **Installed packages independently:**

   ```bash
   # Root packages
   cd d:\wedding-website\theporadas_wedding_site
   npm install
   
   # Site workspace packages
   cd d:\wedding-website\theporadas_wedding_site\site
   npm install
   ```

3. **Instrumentation / Monitoring:**

   This repository no longer installs or enables Sentry by default. If you wish to add production monitoring, configure it separately and avoid committing tokens or DSNs to source control.

### Result

✅ **All packages installed successfully without errors**

- Root: 313 packages (0 vulnerabilities)
- Site: 1,557 packages (0 vulnerabilities)
- Sentry: `@sentry/nextjs@10.17.0` installed

### Deprecation Warnings (Safe to Ignore)

These are **transitive dependencies from `firebase-tools`** and do not affect functionality:

- `inflight@1.0.6` - Firebase tools dependency
- `glob@7.2.3` - Firebase tools dependency  
- `sourcemap-codec@1.4.8` - Build tool dependency
- `source-map@0.8.0-beta.0` - Build tool dependency
- `node-domexception@1.0.0` - Polyfill dependency

**No action required** - these will be updated when Firebase releases new versions.

### Script Updates Required

Since workspaces are removed, **npm workspace commands will no longer work**. Update root `package.json` scripts:

#### Before (Workspace Commands)

```json
{
  "scripts": {
    "dev": "npm run dev --workspace=site",
    "build": "npm run build --workspace=site",
    "start": "npm run start --workspace=site"
  }
}
```

#### After (Direct Commands)

```json
{
  "scripts": {
    "dev": "cd site && npm run dev",
    "build": "cd site && npm run build",
    "start": "cd site && npm start"
  }
}
```

Or run commands directly from `site/` directory:

```bash
cd site
npm run dev
npm run build
npm start
```

### Future Installations

**Always install from the correct directory:**

- **Root dependencies**: `cd d:\wedding-website\theporadas_wedding_site && npm install`
- **Site dependencies**: `cd d:\wedding-website\theporadas_wedding_site\site && npm install`

### Alternative Solutions (Not Used)

If npm workspaces are required in the future:

1. **Enable Windows Developer Mode:**
   - Settings → Privacy & security → For developers → Developer Mode ON
   - Restart VS Code after enabling

2. **Grant SeCreateSymbolicLinkPrivilege:**
   - Run: `secpol.msc`
   - Local Policies → User Rights Assignment
   - "Create symbolic links" → Add your user account
   - Restart computer

3. **Use npm v7+ with --install-links:**
   - `npm install --install-links=false` (bypasses symlinks but breaks workspace features)

### Lessons Learned

1. **Windows symlinks require elevated permissions** - Developer Mode or admin rights
2. **VS Code locks files in `node_modules`** - Must close ALL windows for deep cleanup
3. **npm workspaces are optional** - Independent `package.json` files work perfectly
4. **Transitive dependency warnings are normal** - Firebase tools use older packages internally

### Status: RESOLVED ✅

- **Date:** October 6, 2025
- **Solution:** Removed npm workspaces, installed packages independently
- **Result:** All packages installed successfully, Sentry integration ready
- **Next Steps:** Update root package.json scripts to use `cd site &&` pattern

---

**Key Takeaway:** npm workspaces provide convenience but are **not required** for monorepo setups on Windows. Independent `package.json` files avoid symlink permission issues entirely.
