# GitHub Actions Private Repository Fix

**Date:** October 13, 2025  
**Issue:** GitHub Actions disabled by default on private repositories  
**Status:** ⚠️ Requires manual action (cannot be automated)  
**Time to Fix:** 1-2 minutes

---

## 🔒 The Issue: Private Repository

Your repository `theporadas-wedding-site` is **private**, which means:

- ✅ GitHub Actions **IS installed** (the feature exists)
- ❌ GitHub Actions **IS disabled** (default for private repos)
- ❌ Workflows cannot run until you manually enable it

### Why This Happens

**For private repositories**, GitHub requires you to explicitly enable Actions to:

- Control billing (Actions minutes count toward your limit)
- Prevent accidental workflow runs
- Give you explicit control over CI/CD

**For public repositories**, Actions is enabled by default.

---

## ✅ The Fix (1-2 Minutes)

### Option A: Enable Actions via Web UI (Recommended)

**Step 1:** Open your repository settings:

```text
https://github.com/bbasketballer75/theporadas-wedding-site/settings/actions
```

**Step 2:** Under "Actions permissions":

- Select: ☑️ **"Allow all actions and reusable workflows"**

**Step 3:** Under "Workflow permissions":

- Select: ☑️ **"Read and write permissions"**
- Select: ☑️ **"Allow GitHub Actions to create and approve pull requests"**

**Step 4:** Click the green **"Save"** button at the bottom

**Step 5:** Verify it worked:

```powershell
# Should now succeed (not 404)
gh api repos/bbasketballer75/theporadas-wedding-site/actions/permissions
```

### Option B: Enable Actions via GitHub CLI (Alternative)

If you prefer command-line configuration:

```powershell
# Enable Actions for the repository
gh api -X PUT repos/bbasketballer75/theporadas-wedding-site/actions/permissions `
  -f enabled=true `
  -f allowed_actions=all

# Set workflow permissions
gh api -X PUT repos/bbasketballer75/theporadas-wedding-site/actions/permissions/workflow `
  -f default_workflow_permissions=write `
  -f can_approve_pull_request_reviews=true

# Verify settings
gh api repos/bbasketballer75/theporadas-wedding-site/actions/permissions
```

**Note:** Option B may require admin permissions. If it fails, use Option A (web UI).

---

## 🚀 After Enabling Actions

### Step 1: Run the Setup Script Again

Now that Actions is enabled, configure your secrets:

```powershell
cd f:\wedding-website
.\scripts\setup-github-secrets.ps1
```

**Expected output:**

```text
[1/5] Checking GitHub CLI authentication... ✓
[2/5] Checking if GitHub Actions is enabled... ✓
[3/5] Loading Vercel configuration... ✓
[4/5] Loading Firebase configuration... ✓
[5/5] Setting GitHub secrets... ✓

✓ Secrets set successfully: 9/9
```

### Step 2: Verify Everything Works

```powershell
cd site

# Should show "All checks passed"
npm run gh:diagnose

# Should show workflow list (not 404)
npm run gh:status
```

### Step 3: Trigger Your First Successful Deployment

```powershell
# Make a small change
echo "# CI/CD enabled for private repo" >> README.md

# Commit and push
git add README.md
git commit -m "docs: enable CI/CD for private repository"
git push origin main

# Watch workflows succeed!
npm run gh:status
```

**What you'll see:**

- ✅ **Deploy to Vercel** (#57) - Green checkmark, auto-deployed
- ✅ **Playwright E2E** (#78) - Green checkmark, all tests pass
- 🟡 **Deploy to Firebase** - (Manual trigger only, won't run automatically)

---

## 📊 Why Private Repos Are Different

| Feature | Public Repo | Private Repo |
|---------|-------------|--------------|
| **Actions Enabled** | ✅ By default | ❌ Must enable manually |
| **Minutes** | Unlimited free | 2,000-3,000/month free |
| **Storage** | 500 MB free | 500 MB free |
| **Workflows** | Same | Same |
| **Secrets** | Same | Same |

**Your situation:**

- Private repo = Actions disabled by default
- You have the correct permissions = Can enable it
- 1-2 minutes to enable = Unblock all workflows

---

## 🎯 Summary

**Why are workflows failing?**

Your repository is **private**, so GitHub Actions is disabled by default. You need to manually enable it.

**How to fix:**

1. Visit: `https://github.com/bbasketballer75/theporadas-wedding-site/settings/actions`
2. Enable: "Allow all actions" + "Read and write permissions"
3. Click: "Save"
4. Run: `.\scripts\setup-github-secrets.ps1`

**Time:** 1-2 minutes to enable + 2-3 minutes for setup script = **Total: 3-5 minutes**

**Result:** All 3 workflows will work, deployments fully automated 🚀

---

## 📝 Next Steps

After enabling Actions and running the setup script:

1. ✅ Verify with `npm run gh:diagnose` (should show "All checks passed")
2. ✅ Test with `npm run gh:status` (should show workflow list)
3. ✅ Push a commit to trigger workflows
4. ✅ Watch green checkmarks appear in GitHub Actions tab!

**Documentation:**

- Full analysis: `docs/GITHUB-ACTIONS-FAILURES-ANALYSIS-2025-10-13.md`
- Quick start: `ENABLE-ACTIONS-NOW.md`
- CI/CD guide: `docs/CI-CD-IMPLEMENTATION-COMPLETE.md`

---

**Ready to enable Actions?** Just visit the settings URL above and click Save! 🚀
