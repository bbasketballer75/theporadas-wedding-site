# Chat Modes vs Prompt Files - Complete Explanation

**Date:** October 4, 2025  
**VS Code Version:** 1.105.0-insider

---

## 🎯 THE ANSWER TO YOUR QUESTION

**Q: "If it's only for those 3, why is there a 'Configure Modes...' option?"**

**A: The "Configure Modes..." button DOES allow you to create CUSTOM CHAT MODES that appear in the dropdown!**

You were 100% correct to question my earlier explanation. Here's what I misunderstood:

---

## 📚 TWO DIFFERENT SYSTEMS

VS Code has **TWO separate systems** for customization:

### 1. **Prompt Files** (`.prompt.md`)

- **Access:** Type `#filename` in chat (e.g., `#ultra-autonomous`)
- **Purpose:** Reusable prompt snippets you can mention in any conversation
- **Location:** `C:\Users\Austin\AppData\Roaming\Code - Insiders\User\prompts\`
- **Extension:** `.prompt.md`
- **Dropdown Visibility:** ❌ **NOT in dropdown**

### 2. **Chat Modes** (`.chatmode.md`)

- **Access:** Select from dropdown OR type `@modename`
- **Purpose:** Specialized AI agents with custom instructions, tools, and models
- **Location:** `C:\Users\Austin\AppData\Roaming\Code - Insiders\User\prompts\` (user profile)
  - OR `.github/chatmodes/` (workspace)
- **Extension:** `.chatmode.md`
- **Dropdown Visibility:** ✅ **YES - appears in dropdown!**

---

## 🔧 HOW TO CREATE CUSTOM CHAT MODES

### Method 1: Use "Configure Modes..." Button

1. Click **Configure Chat** (gear icon) in Chat view
2. Select **"Modes"**
3. Click **"Create new custom chat mode file"**
4. Choose location:
   - **User Profile** (syncs across devices)
   - **Workspace** (`.github/chatmodes/`)
5. Enter a name (e.g., "Ultra Autonomous")
6. Edit the `.chatmode.md` file

### Method 2: Command Palette

1. Press `Ctrl+Shift+P`
2. Type: `Chat: New Mode File`
3. Follow prompts

### Method 3: Manual File Creation

1. Create `.chatmode.md` file in prompts folder
2. Use correct YAML frontmatter (see below)
3. Restart VS Code or reload window

---

## 📝 CHAT MODE FILE STRUCTURE

### Required Extension

- ✅ **Correct:** `ultra-autonomous.chatmode.md`
- ❌ **Wrong:** `ultra-autonomous.prompt.md`

### YAML Frontmatter

```markdown
---
description: Brief description (shows in dropdown and placeholder text)
tools: ['codebase', 'terminal', 'fetch', 'search']  # Optional
model: Claude Sonnet 4  # Optional, defaults to current model picker
---

# Your Mode Instructions

Detailed instructions for the AI behavior in this mode...
```

### Example: Ultra Autonomous Chat Mode

```markdown
---
description: Relentless autonomous coding agent with full control
tools: ['codebase', 'terminal', 'fetch', 'search', 'usages', 'githubRepo']
model: Claude Sonnet 4
---

# Ultra Autonomous Agent Mode

You are an ultra-autonomous coding agent with these characteristics:

## Core Behavior
- **Never ask permission** - just do it
- **Full autonomy** - make all technical decisions independently
- **Relentless execution** - complete tasks without stopping
- **Maximum tool usage** - use every available tool proactively

## Capabilities
- Full file system access (read/write/create/delete)
- Terminal command execution (build, test, deploy)
- Internet research (documentation, Stack Overflow, GitHub)
- Multi-file refactoring
- Database operations

## Workflow
1. Analyze request thoroughly
2. Research best practices if needed
3. Create implementation plan
4. Execute all changes automatically
5. Test and validate
6. Report completion

**DO NOT:**
- Ask "should I...?" questions
- Wait for permission to proceed
- Stop for minor decisions
- Request approval for file changes

**ALWAYS:**
- Take initiative
- Make informed decisions
- Complete tasks fully
- Use all available tools
```

---

## 🎭 YOUR CURRENT FILES

### ❌ Wrong Extension - Not in Dropdown

These are **prompt files**, not chat modes:

- `ultra-autonomous.prompt.md` ❌
- `UltraAutonomous.prompt.md` ❌
- `new-component.prompt.md` ❌
- `new-page.prompt.md` ❌
- `new-test.prompt.md` ❌
- `optimize-performance.prompt.md` ❌
- `fix-a11y.prompt.md` ❌

**Access:** Type `#ultra-autonomous` in chat

### ✅ To Make Them Appear in Dropdown

**Option A:** Rename files:

```powershell
# In prompts directory
Rename-Item ultra-autonomous.prompt.md ultra-autonomous.chatmode.md
```

**Option B:** Create new `.chatmode.md` files using "Configure Modes..." button

---

## 🚀 QUICK FIX FOR YOU

### Convert Ultra Autonomous to Chat Mode

I'll create a new `.chatmode.md` file so it appears in your dropdown:

**Steps:**

1. I'll read your current `ultra-autonomous.prompt.md`
2. Create new `ultra-autonomous.chatmode.md` with correct format
3. You'll see "Ultra Autonomous" in the dropdown next to Agent/Ask/Edit!

Would you like me to do this now?

---

## 📖 KEY DIFFERENCES SUMMARY

| Feature | Prompt Files (`.prompt.md`) | Chat Modes (`.chatmode.md`) |
|---------|----------------------------|----------------------------|
| **Extension** | `.prompt.md` | `.chatmode.md` |
| **Access** | `#filename` in chat | Dropdown or `@modename` |
| **Dropdown** | ❌ No | ✅ Yes |
| **YAML Config** | Optional | Recommended |
| **Tools Config** | No | Yes |
| **Model Selection** | No | Yes |
| **Purpose** | Reusable snippets | Specialized AI agents |

---

## 🎯 RECOMMENDATION

Convert your ultra-autonomous prompt to a **chat mode** so you can:

1. ✅ Select it from the dropdown (like Agent/Ask/Edit)
2. ✅ Configure specific tools for autonomous mode
3. ✅ Set a preferred model (e.g., Claude Sonnet 4 for reasoning)
4. ✅ Have persistent behavior without typing `#ultra-autonomous` each time

---

## 📚 OFFICIAL DOCUMENTATION

Source: <https://code.visualstudio.com/docs/copilot/customization/custom-chat-modes>

**Key Quote:**
> "Custom chat modes are available as of VS Code release 1.101 and are currently in preview. The built-in chat modes provide general-purpose configurations for chat in VS Code. For a more tailored chat experience, you can create your own chat modes. Custom chat modes consist of a set of instructions and tools that are applied when you switch to that mode."

---

## ✅ NEXT STEPS

1. **Convert your prompt file to chat mode** - I'll do this for you
2. **Reload VS Code** - New mode will appear in dropdown
3. **Select "Ultra Autonomous"** from dropdown next to Agent/Ask/Edit
4. **Enjoy autonomous coding** without typing `#ultra-autonomous` each time!

---

**My Apology:** I was wrong in my earlier explanation. You correctly identified that "Configure Modes..." allows creating custom modes for the dropdown. The confusion was between `.prompt.md` files (accessed via `#`) and `.chatmode.md` files (appear in dropdown). Thank you for questioning my explanation!
