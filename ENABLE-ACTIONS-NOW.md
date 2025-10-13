# 🚨 IMMEDIATE ACTION REQUIRED - Enable GitHub Actions

**Date:** October 12, 2025  
**Priority:** HIGH - Blocking CI/CD pipeline  
**Time:** 2 minutes to enable + 3 minutes to complete setup

## ❌ Current Error

You're getting **404 errors** when trying to set GitHub secrets:

```bash
failed to fetch public key: HTTP 404: Not Found
```

**This is EXPECTED** - GitHub Actions is not enabled on your repository yet.

## ✅ Solution - 3 Simple Steps

### Step 1: Enable GitHub Actions (2 minutes) - **DO THIS FIRST!**

1. **Open this URL in your browser:**

   ```text
   https://github.com/bbasketballer75/theporadas-wedding-site/settings/actions
   ```

2. **Under "Actions permissions":**
   - Select: ☑️ **Allow all actions and reusable workflows**

3. **Under "Workflow permissions":**
   - Select: ☑️ **Read and write permissions**
   - Select: ☑️ **Allow GitHub Actions to create and approve pull requests**

4. **Click the green "Save" button**

5. **Verify it worked:**
   - Visit: <https://github.com/bbasketballer75/theporadas-wedding-site/actions>
   - You should see the Actions tab (not a 404 error)

### Step 2: Get Your Vercel Token (3 minutes)

1. **Open this URL:**

   ```text
   https://vercel.com/account/tokens
   ```

2. **Click "Create Token"**

3. **Fill in:**
   - Name: `GitHub Actions CI/CD`
   - Scope: `Full Account`
   - Expiration: `No expiration` (or 1 year)

4. **Click "Create Token"**

5. **COPY THE TOKEN** - You won't be able to see it again!
   - It looks like: `mLrevPBCZfPWoiSCSq6Mx8l6m...` (random letters/numbers)

### Step 3: Run Automated Setup (1 command, 2 minutes)

**After Steps 1 & 2 are complete:**

```powershell
# Open PowerShell in the project directory
cd f:\wedding-website

# Run the automated setup script
.\scripts\setup-github-secrets.ps1
```

**What happens:**

1. ✅ Script checks if Actions is enabled (fails gracefully if not)
2. 💬 Prompts you to paste your Vercel token
3. ✅ Automatically loads Vercel IDs from `.vercel/project.json`
4. ✅ Automatically loads Firebase config from `site/.env.production`
5. ✅ Sets all 9 secrets with progress indicators
6. ✅ Verifies secrets were set correctly
7. 🎉 Shows success message with next steps

**Expected output:**

```bash
Setting VERCEL_TOKEN... ✓
Setting VERCEL_ORG_ID... ✓
Setting VERCEL_PROJECT_ID... ✓
Setting NEXT_PUBLIC_FIREBASE_API_KEY... ✓
(6 more Firebase secrets...)

✓ Secrets set successfully: 9/9

🎉 All secrets configured successfully!
```

## 🎯 After Setup Complete

**Test everything works:**

```powershell
cd site

# Should show "All checks passed" (not 404)
npm run gh:diagnose

# Should show workflow list
npm run gh:status

# View current deployment
npm run deploy:inspect
```

**Trigger your first automated deployment:**

```powershell
# Make a small change
echo "# CI/CD is live!" >> README.md

# Commit and push
git add README.md
git commit -m "docs: first automated deployment"
git push origin main

# Watch it deploy automatically!
npm run gh:status
```

## 📝 What You'll Get

After these 3 simple steps (5-7 minutes total):

✅ **Automated deployments** on every push to main  
✅ **Preview deployments** on every PR with URL comments  
✅ **One-command local deploys** (`npm run deploy:preview`)  
✅ **Easy workflow management** (`npm run gh:status`, `npm run gh:logs`)  
✅ **Comprehensive diagnostics** (`npm run gh:diagnose`)  
✅ **83-90% time savings** on deployments (5-10 min → 30-60 sec)

## 🆘 Need Help?

**If setup script fails:**

- Make sure Step 1 (Enable Actions) is complete - this is the #1 cause of failures
- Check you copied the full Vercel token (no spaces, complete string)
- Try manual commands from `CI-CD-QUICK-START.md` (Option B)

**If you see 404 errors:**

- Actions not enabled yet - complete Step 1 first
- Wait 30 seconds after enabling, then try again
- GitHub may need a moment to propagate the settings

**Documentation:**

- Quick Start: `CI-CD-QUICK-START.md`
- Full Setup Guide: `docs/GITHUB-ACTIONS-SETUP.md`
- Implementation Details: `docs/CI-CD-IMPLEMENTATION-COMPLETE.md`

---

## 🎯 TL;DR - Just Do This

```powershell
# 1. Enable Actions (visit URL in browser, click Save)
https://github.com/bbasketballer75/theporadas-wedding-site/settings/actions

# 2. Get Vercel token (create in browser, copy it)
https://vercel.com/account/tokens

# 3. Run setup script (paste token when prompted)
cd f:\wedding-website
.\scripts\setup-github-secrets.ps1

# 4. Test it worked
cd site
npm run gh:diagnose

# 5. Trigger first deployment
echo "# CI/CD is live!" >> README.md
git add README.md && git commit -m "docs: first automated deployment" && git push
npm run gh:status
```

**Total time: 5-7 minutes**  
**Result: Fully automated CI/CD pipeline forever** 🚀
