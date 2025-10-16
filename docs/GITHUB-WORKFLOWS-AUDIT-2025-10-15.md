# GitHub Workflows Audit - October 15, 2025

**Status:** 🔴 **CRITICAL ISSUES FOUND** - 6 unnecessary workflows, 1 workflow with redundant steps

---

## Executive Summary

| Workflows | Count | Status |
|-----------|-------|--------|
| **Total Workflows** | 11 | 🔴 Too many |
| **Needed (Keep)** | 5 | ✅ Essential |
| **Delete (Unnecessary)** | 6 | ❌ Remove |
| **Fix (Redundant Steps)** | 1 | ⚠️ Simplify |

---

## 🔴 WORKFLOWS TO DELETE (6)

### 1. `deploy-firebase.yml` ❌

- **Purpose:** Firebase Hosting deployment
- **Status:** DISABLED - Explicitly sets `workflow_dispatch` with forced failure
- **Why Delete:** Hosting is handled by Vercel (deploy-vercel.yml), not Firebase
- **Note:** File has comment: "This workflow is disabled. Firebase hosting not needed with Vercel."
- **Action:** DELETE

### 2. `deploy-gh-pages.yml` ❌

- **Purpose:** GitHub Pages deployment (deprecated)
- **Status:** DISABLED - workflow_dispatch only, runs notice step
- **Why Delete:** Misleading. Comment says "Using Firebase" but Firebase hosting is disabled. Actually using Vercel.
- **Impact:** Confusing for developers who see this file
- **Action:** DELETE

### 3. `deploy-site.yml` ❌

- **Purpose:** Firebase Hosting deployment via gcloud + workload identity
- **Status:** ACTIVE on push to main - **CONFLICT WITH VERCEL**
- **Issue:** Attempts to deploy to Firebase Hosting, but primary hosting is Vercel
- **Config:** Uses complex GCP workload identity, service account auth, Firebase CLI
- **Impact:**
  - May deploy to wrong hosting platform
  - Confuses deployment flow
  - Redundant with deploy-vercel.yml
- **Action:** DELETE - Use Vercel (deploy-vercel.yml) exclusively for hosting

### 4. `python.yml` ❌

- **Purpose:** Python package detection, testing, building, publishing (for src/*/package.json pattern)
- **Status:** DISABLED - workflow_dispatch only (no actual triggers)
- **Why Delete:** No Python packages in this project (wedding website, not monorepo)
- **Note:** Looks like copied from MCP server template
- **Action:** DELETE

### 5. `release.yml` ❌

- **Purpose:** Automatic release creation, PyPI + npm package publishing
- **Status:** ACTIVE on schedule (daily at 10 AM UTC)
- **Issue:** **RUNNING DAILY EVEN THOUGH NOT NEEDED**
- **Why Delete:**
  - Wedding website is not a monorepo with packages
  - Assumes src/ directory with pyproject.toml and package.json files
  - Looks like copy-pasted from MCP server monorepo
  - Will fail when trying to find Python/npm packages
- **Action:** DELETE - Remove unnecessary scheduled job

### 6. `typescript.yml` ❌

- **Purpose:** TypeScript package detection, testing, building, publishing (for src/*/package.json pattern)
- **Status:** DISABLED - workflow_dispatch only
- **Why Delete:** No src/packages structure in this project (wedding website, not monorepo)
- **Note:** Looks like copied from MCP server template
- **Action:** DELETE

---

## ✅ WORKFLOWS TO KEEP (4)

### 1. `no-env-commit.yml` ✅ CRITICAL

- **Purpose:** Prevent `.env` file commits in PRs (security critical)
- **Status:** Active on PRs - **WORKING CORRECTLY**
- **Config:** ✅ Proper checks for .env in git and PR changes
- **Importance:** CRITICAL - Prevents accidental secret leaks
- **Action:** KEEP - Essential security measure

### 2. `deploy-vercel.yml` ✅ CRITICAL

- **Purpose:** Deploy site to Vercel on push/PR
- **Status:** Active on push (main) and PRs - **WORKING CORRECTLY**
- **Config:** ✅ Proper Vercel CLI usage, preview + production deployments
- **Features:**
  - Production deploys on push to main
  - Preview deploys on PRs
  - PR comments with deployment URLs
  - Proper environment variable passing
- **Importance:** CRITICAL - Primary deployment mechanism
- **Action:** KEEP - Works correctly

---

## ⚠️ WORKFLOWS TO FIX (1)

### `e2e.yml` ⚠️ NEEDS SIMPLIFICATION

- **Purpose:** Run Playwright E2E/integration tests
- **Status:** Active on push/PR - **WORKING BUT HAS REDUNDANT STEPS**
- **Current Issue:**The `test-integration` job has REDUNDANT Firebase emulator startup steps because we just implemented automatic emulator startup via Playwright's `globalSetup` hook.

**Redundant Steps:**

1. ❌ `Start Firebase Emulators` (manual 15-second sleep)
   - Now handled by `site/tests/global-setup.js`
2. ❌ `Verify Emulators Running` (manual health check)
   - Now handled by globalSetup with proper polling (120 retries × 500ms)
3. ⚠️ `Install Firebase CLI` (still needed for emulator start, but might not need if globalSetup handles)

**Fix Required:**

- **Option A (Recommended):** Use globalSetup and remove manual emulator startup steps

```yaml
# Keep Java setup (required)
# Keep emulator cleanup step (cleanup)
# REMOVE: Start Firebase Emulators, Verify Emulators Running
# REMOVE: sleep 15 seconds
# ADD: SKIP_FIREBASE_EMULATOR=false environment variable (optional, default)
```

- **Option B:** Keep manual startup but configure SKIP_FIREBASE_EMULATOR=true

```yaml
# Set SKIP_FIREBASE_EMULATOR: 'true' in env
# Keep manual Firebase emulator startup
# Keep manual health checks
```

**Recommendation:** Use Option A

- globalSetup is more robust (120 retries vs 15 seconds)
- Better error handling and logging
- Cleaner test configuration
- Simpler CI/CD pipeline

**Action:** Simplify test-integration job to remove manual steps, trust globalSetup

---

## 📋 CURRENT WORKFLOW STATUS

```txt
├── ✅ no-env-commit.yml              [SECURITY] Keep - Prevents .env commits
├── ✅ deploy-vercel.yml              [DEPLOY] Keep - Primary hosting deployment
├── ⚠️  e2e.yml                       [TEST] Fix - Remove redundant emulator steps
│
├── 🟢 claude.yml                     [OPTIONAL] Keep - AI PR reviews (nice to have)
├── 🟢 post-deploy-smoke.yml          [OPTIONAL] Keep - Manual smoke test tool
│
├── ❌ deploy-firebase.yml            [DELETE] Disabled, unused (Firebase hosting)
├── ❌ deploy-gh-pages.yml            [DELETE] Deprecated, misleading
├── ❌ deploy-site.yml                [DELETE] Unused (Firebase hosting)
├── ❌ python.yml                     [DELETE] No Python packages
├── ❌ release.yml                    [DELETE] No packages to release
└── ❌ typescript.yml                 [DELETE] No packages to publish
```

---

## 🎯 ACTION ITEMS

### Phase 1: Delete Unnecessary Workflows (5 minutes)

- [ ] Delete: `deploy-firebase.yml`
- [ ] Delete: `deploy-gh-pages.yml`
- [ ] Delete: `deploy-site.yml`
- [ ] Delete: `python.yml`
- [ ] Delete: `release.yml`
- [ ] Delete: `typescript.yml`

### Phase 2: Simplify e2e.yml (10 minutes)

- [ ] Remove `Start Firebase Emulators` manual step
- [ ] Remove `Verify Emulators Running` manual step
- [ ] Keep Java setup (still needed)
- [ ] Keep emulator cleanup (good practice)
- [ ] Add comment explaining globalSetup handles startup
- [ ] Test workflow runs correctly

### Phase 3: Verify (5 minutes)

- [ ] Run `npm test` locally - should auto-start emulator via globalSetup
- [ ] Push branch to GitHub - e2e.yml should run tests
- [ ] Verify all test phases pass

---

## 📊 FINAL RESULT

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| **Total Workflows** | 11 | 5 | -6 (55% reduction) |
| **Critical Workflows** | 2 | 2 | 0 |
| **Optional Workflows** | 2 | 2 | 0 |
| **To-Fix Workflows** | 1 | 0 | -1 |
| **Deleted Workflows** | 0 | 6 | +6 |
| **Maintenance Burden** | High | Low | ✅ Reduced |
| **Clarity** | Confusing | Clear | ✅ Improved |

---

## 🔗 RELATED DOCUMENTATION

- Recent: Integration tests automation - `docs/INTEGRATION-TESTS-GUIDE.md`
- Emulator setup: `site/tests/global-setup.js`
- Test configuration: `site/playwright.config.js`

---

**Last Updated:** October 15, 2025, 14:00 UTC
**Status:** 🟡 Pending Execution
