# 🎯 The Poradas Wedding Website - Git Commit Plan

**Generated:** October 1, 2025  
**Purpose:** Clear documentation of what will be committed to fresh GitHub repository

---

## ✅ **WILL BE COMMITTED** (Wedding Website Essentials)

### 📁 **Core Directories**

- ✅ `site/` - Next.js wedding website application
  - pages/, components/, public/, styles/, lib/
  - package.json, tsconfig.json
- ✅ `functions/` - Firebase Cloud Functions
  - index.js, index-gen1-backup.js, index-gen2.js
  - generateThumbnail/, ping/
- ✅ `.github/` - GitHub Actions & Workflows
  - instructions/, prompts/ (custom chat modes)

### 📄 **Configuration Files**

- ✅ `firebase.json` - Firebase project configuration
- ✅ `firestore.rules` - Firestore security rules
- ✅ `firestore.indexes.json` - Database indexes
- ✅ `storage.rules` - Cloud Storage security rules
- ✅ `.firebaserc` - Firebase project ID
- ✅ `package.json` - Root package configuration (workspace)
- ✅ `package-lock.json` - Dependency lock file
- ✅ `eslint.config.js` - ESLint configuration
- ✅ `playwright.config.js` - Playwright test configuration
- ✅ `.prettierrc.json` - Prettier formatting rules
- ✅ `.gitignore` - Git ignore rules (updated)
- ✅ `.gitattributes` - Git attributes
- ✅ `.vscode/extensions.json` - Recommended VS Code extensions

### 📝 **Documentation**

- ✅ `README.md` - Project documentation (needs rewrite for wedding site)
- ✅ `LICENSE` - Project license (needs update for wedding site)

---

## ❌ **WILL BE IGNORED** (Build Artifacts, Secrets, MCP Servers)

### 🚫 **Critical - Never Commit**

- ❌ `.env` - Environment secrets (CRITICAL)
- ❌ `.env.local` - Local environment variables
- ❌ `*.log` - Log files
- ❌ `firestore-debug.log` - Firebase debug logs

### 🗂️ **Build Artifacts**

- ❌ `node_modules/` - npm dependencies (~28,000+ files)
- ❌ `.next/` - Next.js build output
- ❌ `out/` - Next.js export output
- ❌ `dist/` - Distribution builds
- ❌ `build/` - Build artifacts
- ❌ `.firebase/` - Firebase cache

### 🧪 **Testing & Reports**

- ❌ `tests/` - Playwright E2E tests (too large)
- ❌ `test-results/` - Test execution results
- ❌ `playwright-report/` - Test reports
- ❌ `coverage/` - Code coverage reports
- ❌ `logs/` - Application logs

### 🔧 **MCP Servers - NOT Wedding Website**

- ❌ `src/` - MCP server implementations (filesystem, git, memory, etc.)
- ❌ `servers/` - MCP server runtime
- ❌ `scripts/init-graceful-fs.cjs` - MCP-specific script
- ❌ `mcp-config.json` - MCP configuration
- ❌ `MCP-QUICKREF.md` - MCP documentation

### 📚 **Documentation - Too Extensive**

- ❌ `docs/` - Extensive documentation (v1.104 guide, etc.)
- ❌ `agents.md` - AI agent instructions
- ❌ `CODE_OF_CONDUCT.md` - MCP project governance
- ❌ `CONTRIBUTING.md` - MCP contribution guidelines
- ❌ `SECURITY.md` - MCP security policy

### 🛠️ **Development Utilities**

- ❌ `backups/` - Backup files
- ❌ `tools/` - Development tools
- ❌ `tasksync/` - TaskSync files
- ❌ `.venv/` - Python virtual environment
- ❌ `__pycache__/` - Python cache
- ❌ `.DS_Store`, `Thumbs.db` - OS files

### ⚙️ **Configuration - Not Needed**

- ❌ `.vscode/settings.json` - Personal VS Code settings
- ❌ `.eslintrc.cjs` - Legacy ESLint config
- ❌ `.prettierrc.cjs` - Legacy Prettier config
- ❌ `.prettierignore` - Prettier ignore rules
- ❌ `.markdownlintrc` - Markdown linting
- ❌ `.pre-commit-config.yaml` - Pre-commit hooks
- ❌ `.npmrc` - npm configuration
- ❌ `.husky/` - Git hooks

---

## 🔍 **Git Status Summary**

### **Modified Files (M)** - Will commit changes

- `.gitignore` - Updated to ignore MCP servers & docs
- `package.json` - Needs metadata cleanup
- `site/package.json` - Fixed start script
- `functions/` - Various updates
- `site/` - Component and page updates

### **Deleted Files (D)** - Already removed from working tree

- All `src/` MCP server files (~200+ files)
- MCP Docker files
- MCP README files
- MCP package.json files

### **Untracked Files (?)** - Will be added

- `.github/instructions/` - Custom instructions
- `.github/prompts/` - Custom chat modes
- `site/components/` - New components (Button.tsx, PhotoUpload, etc.)
- `site/types/` - TypeScript types
- `firestore.indexes.json` - Database indexes
- `playwright.config.js` - Test configuration

---

## 📊 **Size Estimation**

### **Before Cleanup:**

- Repository size: ~500 MB (with MCP servers, node_modules, etc.)
- File count: ~30,000+ files

### **After Cleanup:**

- Repository size: ~5-10 MB (essential code only)
- File count: ~200-300 files
- **97% reduction in repository size!**

---

## 🚀 **Next Steps**

### **Before Git Commit:**

1. ✅ Update `.gitignore` (DONE)
2. ⏳ Clean `package.json` metadata (remove MCP references)
3. ⏳ Rewrite `README.md` for wedding website
4. ⏳ Update `LICENSE` for wedding website
5. ⏳ Delete MCP files: `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `SECURITY.md`, `MCP-QUICKREF.md`

### **Git Operations:**

1. Initialize fresh git repository: `git init`
2. Add all files: `git add .`
3. Commit: `git commit -m "Initial commit: The Poradas Wedding Website"`
4. Create GitHub repository
5. Add remote: `git remote add origin <URL>`
6. Push: `git push -u origin main`

---

## ✨ **What You Get**

A **clean, professional wedding website repository** with:

- ✅ Next.js 15.5.4 wedding website
- ✅ Firebase integration (Hosting, Functions, Firestore, Storage)
- ✅ Photo gallery with map
- ✅ Event timeline
- ✅ PWA support
- ✅ TypeScript strict mode
- ✅ Playwright testing
- ✅ Professional documentation
- ✅ No MCP servers
- ✅ No build artifacts
- ✅ No secrets
- ✅ No 28,000+ node_modules files

**Result:** Clean, maintainable, ready-to-deploy wedding website! 🎉
