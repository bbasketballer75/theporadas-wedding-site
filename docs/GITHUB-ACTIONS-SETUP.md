# GitHub Actions Setup Guide

**Date:** October 12, 2025  
**Status:** GitHub Actions needs manual enablement

## Current Situation

All workflow files have been pushed to GitHub, but GitHub Actions returns 404 errors via the CLI. This typically means:

1. GitHub Actions is not enabled for the repository
2. Repository may have Actions disabled at organization level
3. First-time setup requires manual enablement via web interface

## Manual Setup Steps

### Step 1: Enable GitHub Actions

1. Go to: <https://github.com/bbasketballer75/theporadas-wedding-site/settings/actions>
2. Under "Actions permissions", select:
   - ✅ **Allow all actions and reusable workflows**
3. Under "Workflow permissions", select:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**
4. Click **Save**

### Step 2: Verify Actions Tab

1. Go to: <https://github.com/bbasketballer75/theporadas-wedding-site/actions>
2. You should now see the Actions tab (not 404)
3. If workflows appear, GitHub Actions is now enabled!

### Step 3: Configure Repository Secrets

Once Actions is enabled, set up required secrets:

#### A. Get Vercel Token

**Option 1: Vercel Dashboard (Recommended)**

1. Go to: <https://vercel.com/account/tokens>
2. Click **Create Token**
3. Name: `GitHub Actions CI/CD`
4. Scope: `Full Account`
5. Expiration: `No expiration` or `1 year`
6. Click **Create Token**
7. **Copy the token** (you won't see it again!)

**Option 2: Vercel CLI**

```powershell
# This may work after Actions is enabled
vercel token create "GitHub-Actions-CICD"
```

#### B. Set GitHub Secrets via CLI

```powershell
# Navigate to repository root
cd f:\wedding-website

# Set Vercel secrets
gh secret set VERCEL_TOKEN
# Paste token when prompted

gh secret set VERCEL_ORG_ID --body "team_y46D84mHpwL9BjJEjxR4DGFk"
gh secret set VERCEL_PROJECT_ID --body "prj_ObqC1inh0Jm47426TfzPaVYNO10I"

# Set Firebase secrets (from site/.env.production)
gh secret set NEXT_PUBLIC_FIREBASE_API_KEY --body "AIzaSyAwucHFFCyrbJfRBxyl7Ofq-Awu2gN29wg"
gh secret set NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN --body "the-poradas-2025-813c7.firebaseapp.com"
gh secret set NEXT_PUBLIC_FIREBASE_PROJECT_ID --body "the-poradas-2025-813c7"
gh secret set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET --body "the-poradas-2025-813c7.firebasestorage.app"
gh secret set NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID --body "1059875220445"
gh secret set NEXT_PUBLIC_FIREBASE_APP_ID --body "1:1059875220445:web:459a645ef2a245728be434"

# Verify all secrets
gh secret list
```

#### C. Alternative: Set via Web Interface

1. Go to: <https://github.com/bbasketballer75/theporadas-wedding-site/settings/secrets/actions>
2. Click **New repository secret** for each:

| Secret Name | Value | Source |
|------------|-------|--------|
| `VERCEL_TOKEN` | _from Step 3A_ | Vercel dashboard |
| `VERCEL_ORG_ID` | `team_y46D84mHpwL9BjJEjxR4DGFk` | `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | `prj_ObqC1inh0Jm47426TfzPaVYNO10I` | `.vercel/project.json` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyAwucHFFCyrbJfRBxyl7Ofq-Awu2gN29wg` | `site/.env.production` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `the-poradas-2025-813c7.firebaseapp.com` | `site/.env.production` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `the-poradas-2025-813c7` | `site/.env.production` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `the-poradas-2025-813c7.firebasestorage.app` | `site/.env.production` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `1059875220445` | `site/.env.production` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:1059875220445:web:459a645ef2a245728be434` | `site/.env.production` |

### Step 4: Test the Setup

```powershell
# Run diagnostics
cd f:\wedding-website\site
npm run gh:diagnose

# Check workflow status
npm run gh:status

# View recent workflow runs
npm run gh:logs
```

### Step 5: Trigger First Workflow Run

```powershell
# Make a small change
echo "# CI/CD Setup Complete" >> README.md

# Commit and push
git add README.md
git commit -m "docs: trigger first GitHub Actions workflow run"
git push origin main

# Watch the workflow
npm run gh:status
```

## Available Commands

Once setup is complete:

### GitHub Actions Commands

```powershell
npm run gh:status      # View workflow run status and statistics
npm run gh:logs        # View logs for failed workflow runs
npm run gh:diagnose    # Run comprehensive CI/CD diagnostics
```

### Vercel Deployment Commands

```powershell
npm run deploy:preview  # Deploy preview to Vercel (one command)
npm run deploy:prod     # Deploy to production (with confirmations)
npm run deploy:inspect  # Inspect latest deployment details
```

## Workflows Configured

1. **deploy-vercel.yml** - Automated Vercel deployments
   - Triggers: Push to main (production), PRs to main (preview)
   - Features: PR comments with URLs, step summaries

2. **e2e.yml** - Playwright E2E tests
   - Runs on: windows-latest with Turbopack

3. **deploy-site.yml** - Firebase Hosting deployment
   - Uses: Workload Identity Federation

4. Other workflows: no-env-commit, release, post-deploy-smoke, etc.

## Troubleshooting

### "404 Not Found" errors from gh CLI

**Problem:** `gh workflow list` or `gh secret set` returns 404

**Solution:** GitHub Actions not enabled yet. Follow Step 1 and Step 2 above.

### Workflows don't trigger automatically

**Problem:** Push to main but no workflow runs

**Possible causes:**

1. Actions not enabled - see Step 1
2. Workflow files have syntax errors - check `.github/workflows/`
3. Branch protection rules blocking Actions

**Solution:**

```powershell
# Check workflow files for errors
npm run gh:diagnose

# Manually trigger a workflow
gh workflow run deploy-vercel.yml
```

### Deployment fails with "secrets not found"

**Problem:** Workflow runs but fails with missing secrets error

**Solution:** Complete Step 3 to set all 9 required secrets

### Cannot create Vercel token via CLI

**Problem:** `vercel token create` gives "Can't deploy more than one path" error

**Solution:** Use Vercel dashboard method (Step 3A, Option 1) instead

## Next Steps After Setup

1. ✅ Enable GitHub Actions (Step 1-2)
2. ✅ Configure all 9 secrets (Step 3)
3. ✅ Run diagnostics to verify (Step 4)
4. ✅ Trigger first workflow (Step 5)
5. ✅ Test PR deployment (create test PR)
6. ✅ Verify PR comments work
7. ✅ Document team workflow in README

## Support

If issues persist:

- Check: <https://github.com/bbasketballer75/theporadas-wedding-site/actions>
- Run: `npm run gh:diagnose` for detailed diagnostics
- Review: Workflow files in `.github/workflows/`
- Contact: GitHub Support if Actions unavailable for repository
