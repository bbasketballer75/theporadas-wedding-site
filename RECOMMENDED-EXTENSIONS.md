# VS Code Extensions Recommendation

**Project:** The Poradas Wedding Website  
**Date:** October 2, 2025  
**Status:** Extension Analysis Complete

---

## 📊 Analysis of Suggested Extensions

### ✅ INSTALL THESE

#### 1. JavaScript and TypeScript Nightly (Microsoft)

- **ID:** `ms-vscode.vscode-typescript-next`
- **Priority:** ⭐⭐⭐⭐⭐ HIGH
- **Why:**
  - Project uses TypeScript 5.9.3
  - Next.js 15.5.4 with TypeScript support
  - React 19.2.0 with type definitions
- **Benefits:**
  - Latest TypeScript language features
  - Better IntelliSense for React/Next.js
  - Faster type checking
  - Catches type errors earlier
  - Improved autocomplete

**Install Command:**

```powershell
code --install-extension ms-vscode.vscode-typescript-next
```

---

#### 2. Microsoft Edge Tools for VS Code (Optional)

- **ID:** `ms-edgedevtools.vscode-edge-devtools`
- **Priority:** ⭐⭐⭐ MEDIUM
- **Why:**
  - Test wedding site in Microsoft Edge
  - Many guests may use Edge browser
  - Built-in debugging without leaving VS Code
- **Benefits:**
  - Debug directly in editor
  - Responsive design testing
  - Network request monitoring
  - CSS inspection

**Install Command:**

```powershell
code --install-extension ms-edgedevtools.vscode-edge-devtools
```

**When to Use:**

- Testing PWA installation in Edge
- Debugging Edge-specific issues
- Cross-browser compatibility testing

---

### ❌ SKIP THESE

#### 3. Jest ❌

- **ID:** `Orta.vscode-jest`
- **Status:** NOT NEEDED
- **Reason:**
  - Project uses **Playwright** for testing (not Jest)
  - No Jest configuration files found
  - No `*.test.js` or `*.spec.js` files using Jest
- **Evidence:**

  ```json
  "devDependencies": {
    "@playwright/test": "^1.55.1"  // Using Playwright
  }
  ```

**Alternative:**

- Playwright Test for VS Code (if you want test runner integration)
- ID: `ms-playwright.playwright`

---

#### 4. PowerShell ❌

- **ID:** `ms-vscode.powershell`
- **Status:** NOT NEEDED (Built-in Support Sufficient)
- **Reason:**
  - Windows has native PowerShell terminal support
  - Your project already uses PowerShell scripts successfully
  - `cleanup-extensions.ps1` explicitly removes this extension
- **Evidence:**

  ```powershell
  # From scripts/cleanup-extensions.ps1
  Uninstall-Extension "ms-vscode.powershell" "PowerShell extension - terminal sufficient"
  ```

**What You Have:**

- Native PowerShell terminal in VS Code
- Syntax highlighting (built-in)
- Script execution works fine
- `.ps1` files: `start-dev-server.ps1`, `deploy-production.ps1`, `pre-deploy-check.ps1`

---

#### 5. Debugger for Firefox ❌

- **ID:** `firefox-devtools.vscode-firefox-debug`
- **Status:** OPTIONAL (Not Priority)
- **Reason:**
  - Chrome DevTools more common for web development
  - Only needed if debugging Firefox-specific issues
  - Most guests use Chrome, Edge, or Safari

**When to Install:**

- If you encounter Firefox-specific bugs
- If significant user base uses Firefox
- If testing PWA on Firefox

---

#### 6. Rainbow CSV ❌

- **ID:** `mechatroner.rainbow-csv`
- **Status:** NOT NEEDED
- **Reason:**
  - Project doesn't use CSV files
  - Data stored in Firebase Firestore (NoSQL database)
  - No CSV import/export functionality
- **Data Flow:**
  - Photos: Supabase Storage (binary files)
  - Metadata: Firebase Firestore (JSON documents)
  - No CSV processing

---

## 🎯 Recommended Installation

### Step 1: Install TypeScript Extension

**Manual:**

1. Open VS Code Extensions (Ctrl+Shift+X)
2. Search: "JavaScript and TypeScript Nightly"
3. Click "Install" on Microsoft's extension
4. Reload VS Code

**Command Line:**

```powershell
code --install-extension ms-vscode.vscode-typescript-next
```

**Verify:**

- Open any `.tsx` or `.ts` file
- Check status bar shows "TypeScript" version
- Try hovering over variables for type hints

---

### Step 2: (Optional) Install Edge Tools

Only if you plan to test in Microsoft Edge:

```powershell
code --install-extension ms-edgedevtools.vscode-edge-devtools
```

**Use Case:**

- PWA testing in Edge
- Debug wedding site in Edge browser
- Cross-browser compatibility checks

---

## 📦 Current Extensions (Already Installed)

Based on your project setup, you likely already have:

### Core Extensions

- **ESLint** - Linting JavaScript/TypeScript
- **Prettier** - Code formatting (possibly)
- **Path Intellisense** - File path autocomplete
- **GitLens** - Git supercharged (possibly)

### Project-Specific

- **Tailwind CSS IntelliSense** - If using Tailwind (you are: `tailwindcss: ^4.1.13`)
- **ES7+ React/Redux/React-Native snippets** - React code snippets

---

## 🚫 Extensions to AVOID

Based on `scripts/cleanup-extensions.ps1`, you've already decided to avoid:

1. ❌ PowerShell - Built-in support sufficient
2. ❌ Python - Not used in this project
3. ❌ C/C++ - Not used in this project
4. ❌ Java - Not used in this project
5. ❌ Redundant linters - ESLint handles everything

---

## ✨ Additional Recommended Extensions

Beyond the screenshot, consider these for your project:

### 1. Playwright Test for VS Code

- **ID:** `ms-playwright.playwright`
- **Why:** You use Playwright for E2E testing
- **Benefits:**
  - Run tests from VS Code
  - Debug tests with breakpoints
  - View test results inline

```powershell
code --install-extension ms-playwright.playwright
```

---

### 2. Tailwind CSS IntelliSense

- **ID:** `bradlc.vscode-tailwindcss`
- **Why:** Project uses Tailwind CSS 4.1.13
- **Benefits:**
  - Autocomplete Tailwind classes
  - Hover previews for utility classes
  - Linting for class names

```powershell
code --install-extension bradlc.vscode-tailwindcss
```

---

### 3. ES7+ React/Redux/React-Native Snippets

- **ID:** `dsznajder.es7-react-js-snippets`
- **Why:** React 19.2.0 project with many components
- **Benefits:**
  - Fast component creation (`rafce`, `rfc`)
  - Hooks snippets (`useState`, `useEffect`)
  - Import shortcuts

```powershell
code --install-extension dsznajder.es7-react-js-snippets
```

---

### 4. GitLens (Optional but Powerful)

- **ID:** `eamodio.gitlens`
- **Why:** Git repository tracking
- **Benefits:**
  - Blame annotations
  - Commit history inline
  - File history visualization

```powershell
code --install-extension eamodio.gitlens
```

---

## 📋 Quick Install All Recommended

Copy and paste this command to install all recommended extensions:

```powershell
# Core Recommended
code --install-extension ms-vscode.vscode-typescript-next

# Optional but Useful
code --install-extension ms-playwright.playwright
code --install-extension bradlc.vscode-tailwindcss
code --install-extension dsznajder.es7-react-js-snippets

# Edge Testing (optional)
code --install-extension ms-edgedevtools.vscode-edge-devtools
```

---

## 🎯 Priority Summary

### 🔴 HIGH PRIORITY (Install Now)

1. **JavaScript and TypeScript Nightly** - Essential for TypeScript project

### 🟡 MEDIUM PRIORITY (Recommended)

1. **Playwright Test** - You already use Playwright testing
2. **Tailwind CSS IntelliSense** - You use Tailwind extensively
3. **React Snippets** - Speed up React development

### 🟢 LOW PRIORITY (Optional)

1. **Edge DevTools** - Only if testing in Edge
2. **GitLens** - Nice to have for Git workflows

### ⚫ NOT NEEDED

1. ❌ Jest
2. ❌ PowerShell
3. ❌ Firefox Debugger
4. ❌ Rainbow CSV

---

## 🔍 How to Check Installed Extensions

```powershell
# List all installed extensions
code --list-extensions

# List with version numbers
code --list-extensions --show-versions

# Search for specific extension
code --list-extensions | Select-String "typescript"
```

---

## 🗑️ How to Uninstall Unwanted Extensions

If you accidentally installed any unwanted extensions:

```powershell
# Uninstall specific extension
code --uninstall-extension <extension-id>

# Examples:
code --uninstall-extension Orta.vscode-jest
code --uninstall-extension mechatroner.rainbow-csv
code --uninstall-extension firefox-devtools.vscode-firefox-debug
```

---

## ⚙️ Extension Settings

After installing TypeScript Nightly, add these settings to `.vscode/settings.json`:

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always"
}
```

---

## 📊 Extension Impact

### Performance Impact

- **TypeScript Nightly:** Minimal (replaces default TypeScript)
- **Edge Tools:** Medium (launches browser instance)
- **Playwright:** Low (only active during testing)
- **Tailwind IntelliSense:** Low (CSS autocomplete)

### Disk Space

- **TypeScript Nightly:** ~20 MB
- **Edge Tools:** ~15 MB
- **Playwright:** ~10 MB
- **React Snippets:** <1 MB

**Total:** ~50 MB for all recommended extensions

---

## ✅ Action Plan

**Immediate Actions:**

1. ✅ Install JavaScript and TypeScript Nightly
2. ✅ Verify TypeScript IntelliSense works
3. ✅ (Optional) Install Playwright Test extension
4. ✅ (Optional) Install Tailwind CSS IntelliSense

**Do NOT Install:**

- ❌ Jest (not used in project)
- ❌ PowerShell (built-in support sufficient)
- ❌ Rainbow CSV (no CSV files)
- ❌ Firefox Debugger (unless specifically needed)

**Result:**

- Better TypeScript development experience
- Faster coding with IntelliSense
- Optional: Better testing workflow with Playwright extension
- Optional: Tailwind autocomplete for styling

---

## 📚 Documentation

### Extension Documentation

- **TypeScript Nightly:** <https://github.com/microsoft/TypeScript/wiki/Nightly-Packages>
- **Playwright Test:** <https://playwright.dev/docs/getting-started-vscode>
- **Tailwind IntelliSense:** <https://github.com/tailwindlabs/tailwindcss-intellisense>
- **Edge Tools:** <https://docs.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/>

### VS Code Extension Docs

- **Managing Extensions:** <https://code.visualstudio.com/docs/editor/extension-marketplace>
- **Extension CLI:** <https://code.visualstudio.com/docs/editor/command-line>

---

## 🎉 Summary

**From Screenshot - Verdict:**

- ✅ **JavaScript and TypeScript Nightly** - INSTALL (high priority)
- ⚠️ **Edge Tools** - OPTIONAL (install if testing in Edge)
- ❌ **Jest** - SKIP (using Playwright instead)
- ❌ **PowerShell** - SKIP (built-in support sufficient)
- ❌ **Firefox Debugger** - SKIP (not priority)
- ❌ **Rainbow CSV** - SKIP (not used in project)

**Additional Recommendations:**

- ✅ Playwright Test extension (you already use Playwright)
- ✅ Tailwind CSS IntelliSense (you use Tailwind 4.1.13)
- ✅ React snippets (React 19.2.0 project)

**Next Steps:**

1. Install TypeScript Nightly now
2. Test IntelliSense improvements
3. Consider Playwright + Tailwind extensions
4. Ignore Jest, PowerShell, CSV extensions

---

**Created:** October 2, 2025  
**Status:** Ready for Action  
**Priority:** Install TypeScript Nightly immediately
