# GitHub Actions CLI Limitation - Must Use Web UI

**Date:** October 13, 2025  
**Issue:** GitHub CLI cannot enable Actions on private repos  
**Status:** ⚠️ MUST use web UI (CLI will not work)  
**Time to Fix:** 1 minute via web UI

---

## ❌ CLI Method Does Not Work

The GitHub CLI **cannot enable Actions** on a private repository that has Actions disabled.

### What We Tried

```powershell
# This command fails with 404
gh api -X PUT repos/bbasketballer75/theporadas-wedding-site/actions/permissions `
  -f enabled=true `
  -f allowed_actions=all

# Output:
# {
#   "message": "Not Found",
#   "status": "404"
# }
```

### Why This Fails

**The Actions permissions API endpoint does not exist until Actions is enabled via the web UI.**

- ❌ CLI cannot enable Actions (API returns 404)
- ❌ CLI cannot check if Actions is enabled (API returns 404)
- ❌ CLI cannot modify Actions settings (API returns 404)
- ✅ **Web UI is the ONLY way to enable Actions initially**

This is a GitHub platform limitation, not a CLI bug.

---

## ✅ The ONLY Solution: Web UI (1 Minute)

### Step 1: Open Settings in Browser

Visit this URL:

```text
https://github.com/bbasketballer75/theporadas-wedding-site/settings/actions
```

### Step 2: Enable Actions

1. Under **"Actions permissions"**:
   - Select: ☑️ **"Allow all actions and reusable workflows"**

2. Under **"Workflow permissions"**:
   - Select: ☑️ **"Read and write permissions"**
   - Select: ☑️ **"Allow GitHub Actions to create and approve pull requests"**

3. Scroll down and click the green **"Save"** button

### Step 3: Verify It Worked

```powershell
# This should now succeed (not 404)
gh api repos/bbasketballer75/theporadas-wedding-site/actions/permissions

# Should return JSON with "enabled": true
```

---

## 🚀 After Enabling via Web UI

### Run the Setup Script

Now that Actions is enabled, configure secrets:

```powershell
cd f:\wedding-website
.\scripts\setup-github-secrets.ps1
```

**Expected output:**

```text
[1/5] Checking GitHub CLI authentication... ✓
[2/5] Checking if GitHub Actions is enabled... ✓ (no more 404!)
[3/5] Loading Vercel configuration... ✓
[4/5] Loading Firebase configuration... ✓
[5/5] Setting GitHub secrets... ✓

✓ Secrets set successfully: 9/9
```

### Verify Everything Works

```powershell
cd site
npm run gh:diagnose  # Should show "All checks passed"
npm run gh:status    # Should show workflow list
```

### Trigger First Deployment

```powershell
echo "# CI/CD enabled" >> README.md
git add . && git commit -m "docs: enable CI/CD" && git push
npm run gh:status  # Watch green checkmarks!
```

---

## 📋 Summary

**Issue:** CLI cannot enable GitHub Actions on private repos (404 error)

**Solution:** Must use web UI to enable Actions initially

**Steps:**

1. ✅ Visit settings URL in browser
2. ✅ Enable "Allow all actions" + permissions
3. ✅ Click "Save"
4. ✅ Run `.\scripts\setup-github-secrets.ps1`
5. ✅ Push a commit to test workflows

**Time:** 1 minute via web UI + 2 minutes for setup script = **3 minutes total**

**Result:** All 3 workflows will work! 🚀

---

## 🆘 If You Still See Errors

After enabling via web UI, if you still see issues:

**Wait 30 seconds** - GitHub may need a moment to propagate settings

**Clear GitHub CLI cache:**

```powershell
gh auth logout
gh auth login
```

**Verify Actions is enabled:**

```powershell
gh api repos/bbasketballer75/theporadas-wedding-site/actions/permissions
# Should return JSON (not 404)
```

**Check workflow files exist:**

```powershell
gh api repos/bbasketballer75/theporadas-wedding-site/actions/workflows
# Should list 3 workflows
```

---

**Bottom line:** You MUST use the web UI to enable Actions. There is no CLI workaround. Visit the settings URL above! 🌐
