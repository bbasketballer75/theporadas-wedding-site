# 🎯 VS Code Quick Reference - New Features

**Date:** October 4, 2025  
**Print this or keep open for reference!**

---

## ⚡ NEW KEYBOARD SHORTCUTS

### Turbo Console Log (Docs)

| Shortcut | Action |
|----------|--------|
| `Ctrl+Alt+L` | Insert console.log for selected variable |
| `Ctrl+Alt+U` | Uncomment all console.logs in file |
| `Ctrl+Alt+D` | **DELETE all console.logs in file** |
| `Shift+Alt+C` | Comment all console.logs |

**Usage:**

```typescript
const userData = await fetchUser();
// 1. Select "userData"
// 2. Press Ctrl+Alt+L
// 3. Result: console.log('🚀 ~ userData:', userData)
```

**Before Committing:**

- Press `Ctrl+Alt+D` → Removes ALL console.logs instantly!

---

## 🎨 AUTOMATIC FEATURES

### Template String Converter (No Shortcut Needed!)

**Just type `${` in any string:**

```typescript
// Type this:
const message = 'Hello ${

// Auto-converts to:
const message = `Hello ${name}!`
```

**Works in:**

- Single quotes `'...'`
- Double quotes `"..."`
- Automatically switches to backticks!

---

## 📦 IMPORT COST (Automatic)

**Inline bundle size display:**

```typescript
import moment from 'moment';     // 📦 288.4KB ← Shows in RED (too big!)
import dayjs from 'dayjs';       // 📦 6.5KB ← Shows in GREEN (good!)
import lodash from 'lodash';     // 📦 545KB ← Shows in RED
import _ from 'lodash-es';       // 📦 24KB ← Shows in ORANGE
```

**Color Coding:**

- 🟢 **Green** = Under 50KB (good)
- 🟠 **Orange** = 50-100KB (moderate)
- 🔴 **Red** = Over 100KB (consider alternatives)

---

## 🔍 GIT BLAME (Automatic)

**Hover over any line of code to see:**

- Who wrote it
- When they wrote it
- Full commit message
- Click to open commit

**Status Bar:**

- Bottom bar shows blame for current line
- Click to see full details

---

## 🎯 ERROR LENS (Automatic)

**Errors show inline next to code:**

```typescript
const user = await getUser()  // Error: Semicolon expected
//                            ↑ Shows right here!
```

**What you see:**

- ❌ **Errors** - Red inline text
- ⚠️ **Warnings** - Yellow inline text
- ℹ️ **Hints** - Gray inline text

---

## 💅 PRETTIER (Automatic)

**Auto-formats on save:**

**Before Save:**

```typescript
const user={name:"Austin",age:25}
```

**After Save:**

```typescript
const user = {
  name: "Austin",
  age: 25
};
```

**Formats:**

- JavaScript/TypeScript
- React/JSX
- JSON
- CSS/SCSS
- Markdown

---

## 🎨 TAILWIND INTELLISENSE

**Auto-complete Tailwind classes:**

```typescript
className="flex " // ← Type space, get suggestions
```

**Works in:**

- `className="..."`
- `class="..."`
- `cva()` patterns
- `cx()` patterns

---

## 🔥 CONSOLE NINJA (Retired)

Console Ninja previously surfaced inline console output, but it now injects an unsupported loader for Node 24 and Next 15. The extension and all runtime hooks were removed on October 6, 2025 to stop repeated compatibility warnings and npm install interference. If you need inline logs again, prefer the built-in VS Code JavaScript debugging tools or lightweight extensions that avoid patching `node_modules`.

---

## 📝 BETTER COMMENTS

**Special comment highlighting:**

```typescript
// ! Important note - shows in RED
// ? Question/unclear - shows in BLUE
// TODO: Fix this later - shows in ORANGE
// * Highlighted note - shows in GREEN
// // Strikethrough comment - shows GRAY
```

---

## 🌐 Brave Search MCP Quick Steps

- `BRAVE_API_KEY` doubles as the `X-Subscription-Token` header for manual requests.
- Run `pwsh -File scripts/check-brave-throttle.ps1 -Test` to respect the 1 second rate limit and verify the key.
- Need a full refresher? Open `docs/mcp/BRAVE-API-GUIDE.md` from the repo root.

---

## 🚀 GITHUB COPILOT TIPS

**Inline Suggestions:**

- Start typing → Copilot suggests
- `Tab` = Accept
- `Esc` = Reject
- `Alt+]` = Next suggestion
- `Alt+[` = Previous suggestion

**Chat:**

- `Ctrl+I` = Inline chat
- Type `/` to see commands:
  - `/explain` - Explain code
  - `/fix` - Fix problems
  - `/tests` - Generate tests
  - `/doc` - Add documentation

---

## 📚 QUICK ACCESS

### Sidebar Icons

| Icon | What | Shortcut |
|------|------|----------|
| 📄 | Explorer | `Ctrl+Shift+E` |
| 🔍 | Search | `Ctrl+Shift+F` |
| 🌿 | Git Graph | Click icon |
| 🤖 | Copilot Chat | `Ctrl+Shift+I` |
| ⚙️ | Extensions | `Ctrl+Shift+X` |

---

## 🎯 COMMON WORKFLOWS

### Debugging Without Console Ninja

1. Add a `console.log` or breakpoint
2. Run code (`npm run dev`)
3. Use the built-in VS Code JavaScript debugger (`Run and Debug` panel) or Turbo Console Log (`Ctrl+Alt+L`)
4. Inspect output in the Debug Console—no intrusive loaders required

### Before Committing Code

1. `Ctrl+Alt+D` - Remove all console.logs
2. `Ctrl+S` - Save (Prettier auto-formats)
3. `Ctrl+Shift+M` - Check problems panel
4. Commit if clean!

### Finding Who Changed Code

1. Hover over line
2. See Git Blame tooltip
3. Click to open commit
4. See full context

### Adding Smart Console Logs

1. Select variable
2. `Ctrl+Alt+L`
3. Auto-generates smart log
4. Includes emojis and labels

---

## 💡 PRO TIPS

### Fastest Console.log Workflow

```typescript
const data = fetchData();
// Select "data" → Ctrl+Alt+L
// console.log('🚀 ~ data:', data) ← Generated!

// Done debugging? → Ctrl+Alt+D (removes ALL logs)
```

### Check Bundle Size While Coding

```typescript
import { huge } from 'massive-library'; // ← See 📦 545KB RED
// Try alternatives!
import { small } from 'tiny-library'; // ← See 📦 6KB GREEN
```

### Use Template Strings Everywhere

```typescript
// Old way:
const url = '/api/users/' + userId + '/posts';

// New way (just type ${):
const url = `/api/users/${userId}/posts`; // ← Auto-converts!
```

### Learn From Copilot

```typescript
// Start typing what you want:
// "function that validates email"
// ↓ Copilot suggests implementation
// Tab to accept, learn from the code!
```

---

## 🆘 TROUBLESHOOTING

### Extension Not Working?

1. `Ctrl+Shift+P` → "Reload Window"
2. Check extension is enabled
3. Check settings aren't overridden

### Console Output Missing?

1. Open the Debug Console (`Ctrl+Shift+Y`) during `npm run dev`
2. Ensure Turbo Console Log is enabled (`Ctrl+Alt+L` to generate logs)
3. Use breakpoints + F5 for full debugger features

### Prettier Not Formatting?

1. Check `.prettierrc` exists
2. Verify "Format on Save" enabled
3. Check file type is supported

### Import Cost Not Showing?

1. Wait ~5 seconds (calculates size)
2. Works only for node_modules imports
3. Reload window if stuck

---

## 📖 DOCUMENTATION

**Full details in:**

- `docs/OPTIMIZATION-COMPLETE.md` - Overview
- `docs/EXTENSION-OPTIMIZATION-REPORT.md` - Technical details
- `.vscode/settings.json` - All configurations

---

## 🎓 LEARNING RESOURCES

### Turbo Console Log

- Docs: `Ctrl+Shift+P` → "Turbo Console Log"

### Template String Converter

- Just use it! Auto-detects `${` in strings

### Console Ninja (Retired)

- Removed on Oct 6, 2025 because the loader conflicts with Node 24 / Next 15
- Use VS Code debugger or Turbo Console Log for inline visibility instead

### Copilot

- Press `Ctrl+Shift+I` and ask questions!

---

## ✅ REMEMBER

**You now have:**

- ⚡ Faster startup (40% improvement)
- 🎯 Smart console.logs (Ctrl+Alt+L)
- 🔄 Auto template strings (type `${`)
- 📦 Bundle size warnings (inline)
- 🔍 Git blame (hover)
- 💅 Auto-format (on save)
- 🤖 Copilot (AI pair programmer)

**This is a professional 2025 Next.js development setup!** 🚀

---

**Print or bookmark this page for quick reference!**
