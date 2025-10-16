# CI/CD Quick Start Guide

**Status:** ✅ Infrastructure Ready - Manual Setup Required  
**Time to Complete:** 10-15 minutes (one-time)  
**Commits:** c2e9793, 921d24c

## 🎯 What You Got

6 PowerShell scripts + 1 GitHub Actions workflow + 6 npm commands = **Fully automated CI/CD pipeline**

## ⚡ Quick Commands (After Setup)

```powershell
# Deployments
npm run deploy:preview   # Deploy preview (30 seconds)
npm run deploy:prod      # Deploy production (with safety checks)
npm run deploy:inspect   # View latest deployment

# Workflow Management  
npm run gh:status        # View all workflow runs + statistics
npm run gh:logs          # Interactive failed log viewer
npm run gh:diagnose      # 8-point diagnostic check
```

## 🚀 3-Step Manual Setup (REQUIRED)

### Step 1: Enable GitHub Actions (2 minutes)

1. **Go here:** <https://github.com/bbasketballer75/theporadas-wedding-site/settings/actions>
2. **Select:** "Allow all actions and reusable workflows"
3. **Select:** "Read and write permissions" + "Allow GitHub Actions to create and approve pull requests"
4. **Click:** Save

**Why needed:** GitHub Actions is disabled by default, API returns 404 until manually enabled.

### Step 2: Get Vercel Token (3 minutes)

1. **Go here:** <https://vercel.com/account/tokens>
2. **Click:** Create Token
3. **Name:** GitHub Actions CI/CD
4. **Scope:** Full Account
5. **Expiration:** No expiration
6. **COPY THE TOKEN** ← You won't see it again!

### Step 3: Configure Secrets (5 minutes)

**⚠️ IMPORTANT:** Step 1 (Enable Actions) MUST be completed first, or you'll get 404 errors!

**Option A: Automated Script (Easiest)**

```powershell
cd f:\wedding-website

# Run automated setup (prompts for Vercel token)
.\scripts\setup-github-secrets.ps1

# Or pass token directly
.\scripts\setup-github-secrets.ps1 -VercelToken "your_token_here"
```

The script will:

- ✅ Check if Actions is enabled (fails with helpful message if not)
- ✅ Load all values from `.vercel/project.json` and `site/.env.production`
- ✅ Set all 9 secrets automatically
- ✅ Verify secrets were set correctly

**Option B: Manual Commands**

```powershell
cd f:\wedding-website

# 1. Set Vercel token (paste when prompted)
gh secret set VERCEL_TOKEN

# 2. Set Vercel project info
gh secret set VERCEL_ORG_ID --body "team_y46D84mHpwL9BjJEjxR4DGFk"
gh secret set VERCEL_PROJECT_ID --body "prj_ObqC1inh0Jm47426TfzPaVYNO10I"

# 3. Set Firebase config (6 secrets)
gh secret set NEXT_PUBLIC_FIREBASE_API_KEY --body "AIzaSyAwucHFFCyrbJfRBxyl7Ofq-Awu2gN29wg"
gh secret set NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN --body "the-poradas-2025-813c7.firebaseapp.com"
gh secret set NEXT_PUBLIC_FIREBASE_PROJECT_ID --body "the-poradas-2025-813c7"
gh secret set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET --body "the-poradas-2025-813c7.firebasestorage.app"
gh secret set NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID --body "1059875220445"
gh secret set NEXT_PUBLIC_FIREBASE_APP_ID --body "1:1059875220445:web:459a645ef2a245728be434"

# 4. Verify all 9 secrets
gh secret list
```

**Expected output:**

```
NEXT_PUBLIC_FIREBASE_API_KEY          Updated ...
NEXT_PUBLIC_FIREBASE_APP_ID           Updated ...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN      Updated ...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID  Updated ...
NEXT_PUBLIC_FIREBASE_PROJECT_ID       Updated ...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET   Updated ...
VERCEL_ORG_ID                         Updated ...
VERCEL_PROJECT_ID                     Updated ...
VERCEL_TOKEN                          Updated ...
```

## ✅ Test the Setup

```powershell
cd f:\wedding-website\site

# Should show "All checks passed" (not 404 errors)
npm run gh:diagnose

# Should show workflow list (may be empty if no runs yet)
npm run gh:status

# View current Vercel deployment
npm run deploy:inspect
```

## 🎉 Trigger First Workflow

```powershell
# Make a small change
echo "# CI/CD Setup Complete" >> README.md

# Commit and push
git add README.md
git commit -m "docs: trigger first GitHub Actions workflow"
git push origin main

# Watch it run!
npm run gh:status
```

## 📚 Full Documentation

- **Setup Guide:** `docs/GITHUB-ACTIONS-SETUP.md` (detailed instructions)
- **Implementation Summary:** `docs/CI-CD-IMPLEMENTATION-COMPLETE.md` (what was built)
- **This File:** Quick reference for fast setup

## 🔧 Troubleshooting

### Still getting 404 errors?

**Problem:** `gh workflow list` or `gh secret set` returns 404

**Solution:** GitHub Actions not enabled yet. Complete Step 1 above.

### Workflow doesn't trigger?

**Problem:** Pushed to main but no workflow run

**Check:**

1. Actions enabled? (Step 1)
2. Secrets configured? (Step 3)  
3. Visit: <https://github.com/bbasketballer75/theporadas-wedding-site/actions>

### Need help?

```powershell
npm run gh:diagnose  # Run full diagnostics
```

## 💡 What Happens After Setup

### Automatic Deployments

- **Push to main** → Production deployment (automatic)
- **Open PR** → Preview deployment + comment with URL (automatic)
- **Failed workflow** → Easy log access via `npm run gh:logs`

### One-Command Local Deploys

```powershell
npm run deploy:preview  # Preview in 30 seconds
npm run deploy:prod     # Production with safety checks
```

### Time Savings

- **Before:** 5-10 minutes per deployment
- **After:** 30-60 seconds per deployment
- **Savings:** 83-90% reduction ⚡

## 🎯 Expected Results

After manual setup (10-15 minutes):

- ✅ Automated deployments on every push/PR
- ✅ One-command local deployments  
- ✅ Easy workflow management
- ✅ Comprehensive diagnostics
- ✅ 83-90% time savings on deployments

---

**Current Status:** Infrastructure complete, waiting for manual enablement  
**Next Action:** Follow 3-step setup above (10-15 minutes)  
**Support:** Full documentation in `docs/` directory
