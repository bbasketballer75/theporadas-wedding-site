# How to Find and Use Custom Chat Modes in VS Code

## You're Looking in the Wrong Place! 😊

Custom chat modes are **NOT** accessed with `@` mentions. They appear in a **dropdown menu** at the top of the Chat view.

---

## Quick Guide: How to Use Your Custom Chat Modes

### Step 1: Open the Chat View

Press **`Ctrl+Alt+I`** (or click the Chat icon in VS Code)

### Step 2: Look for the Chat Mode Dropdown

At the **top of the Chat view**, you'll see a dropdown menu that currently shows one of:

- 🔵 **Ask** (for questions)
- ✏️ **Edit** (for code edits)
- 🤖 **Agent** (for autonomous coding)

### Step 3: Click the Dropdown

Click on the dropdown to see **all available chat modes**, including:

- ✅ **Ultra Autonomous Agent** (your "Ultra Chad Mode")
- ✅ **4.1-Beast**
- ✅ **Thinking-Beast-Mode**
- ✅ **implementation-plan**

### Step 4: Select Your Custom Mode

Click **"Ultra Autonomous Agent"** to activate it. The chat view will now use that mode's configuration and behavior.

---

## Visual Guide

```
┌─────────────────────────────────────────┐
│  Chat View                        X     │
├─────────────────────────────────────────┤
│  [Ask ▼]  ← CLICK THIS DROPDOWN         │ <-- This is where you find custom modes!
│                                          │
│  Type your prompt here...                │
│                                          │
└─────────────────────────────────────────┘
```

When you click the dropdown, you'll see:

```
┌─────────────────────────────────────────┐
│  🔵 Ask                                  │
│  ✏️ Edit                                 │
│  🤖 Agent                                │
│  ────────────────────────────           │ <-- Separator
│  ⚡ Ultra Autonomous Agent               │ <-- YOUR CUSTOM MODES HERE
│  ⚡ 4.1-Beast                            │
│  ⚡ Thinking-Beast-Mode                  │
│  ⚡ implementation-plan                  │
└─────────────────────────────────────────┘
```

---

## Your Custom Chat Modes (Already Installed!)

| Mode | Description | Best For |
|------|-------------|----------|
| **Ultra Autonomous Agent** | Relentless autonomous coding with full control | Complex multi-step tasks that need continuous execution |
| **4.1-Beast** | Enhanced coding capabilities | General development work |
| **Thinking-Beast-Mode** | Deep analysis and reasoning | Planning and architecture decisions |
| **implementation-plan** | Structured implementation planning | Feature development roadmaps |

All 4 modes are installed at:

```
C:\Users\Austin\AppData\Roaming\Code - Insiders\User\chatmodes\
```

---

## If You Don't See Custom Modes

### Option 1: Reload VS Code (Easiest)

1. Press **`Ctrl+Shift+P`**
2. Type **"Developer: Reload Window"**
3. Press **Enter**
4. Open Chat view again (**`Ctrl+Alt+I`**)
5. Check the dropdown

### Option 2: Verify Files Exist

Run this command in PowerShell to confirm:

```powershell
Get-ChildItem "$env:APPDATA\Code - Insiders\User\chatmodes" -Filter "*.chatmode.md"
```

You should see 4 files (already confirmed ✅):

- `UltraAutonomous.chatmode.md`
- `4.1-Beast.chatmode.md`
- `Thinking-Beast-Mode.chatmode.md`
- `implementation-plan.chatmode.md`

### Option 3: Check VS Code Version

Custom chat modes were added in VS Code **1.102+**. You're running:

```
Version: 1.105.0-insider (confirmed ✅)
```

So you're all set!

---

## Using Ultra Autonomous Agent (Ultra Chad Mode)

Once you select **"Ultra Autonomous Agent"** from the dropdown:

1. **It will work continuously** until you say "stop", "end", or "terminate"
2. **No permission needed** - it has full access to all tools
3. **Never asks to continue** - just keeps executing
4. **Researches automatically** - uses fetch_webpage for current docs
5. **Full VS Code control** - can install extensions, modify settings, etc.

### Example Prompt

```
Implement a photo gallery with infinite scroll, lazy loading, and thumbnail caching
```

The Ultra Autonomous Agent will:

- ✅ Research best practices
- ✅ Plan the implementation
- ✅ Create all necessary files
- ✅ Test functionality
- ✅ Fix any issues
- ✅ Optimize performance
- ✅ Report completion

All without stopping to ask permission! 🚀

---

## Common Mistakes

❌ **WRONG:** Typing `@UltraAutonomous` in chat
✅ **RIGHT:** Selecting "Ultra Autonomous Agent" from the dropdown

❌ **WRONG:** Looking in Extensions marketplace
✅ **RIGHT:** Looking in Chat view dropdown at the top

❌ **WRONG:** Trying to install a chat mode
✅ **RIGHT:** Chat modes are already installed (just select from dropdown)

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Chat View | `Ctrl+Alt+I` |
| Quick Chat | `Ctrl+Shift+Alt+L` |
| New Chat Session | `Ctrl+N` (in Chat view) |
| Change Chat Mode | Click dropdown at top of Chat view |

---

## Troubleshooting

### "I still don't see custom modes in the dropdown"

1. **Reload Window:**

   ```
   Ctrl+Shift+P → "Developer: Reload Window"
   ```

2. **Check file format:**
   Open `UltraAutonomous.chatmode.md` and verify it has YAML frontmatter:

   ```yaml
   ---
   description: "Relentless autonomous coding agent..."
   model: Claude-3.5-Sonnet
   title: "Ultra Autonomous Agent"
   ---
   ```

3. **Check VS Code Insiders version:**

   ```
   Help → About
   ```

   Should be 1.102 or higher (you have 1.105 ✅)

4. **Check file location:**
   Files must be in:

   ```
   C:\Users\Austin\AppData\Roaming\Code - Insiders\User\chatmodes\
   ```

   NOT in:

   ```
   D:\wedding-website\theporadas_wedding_site\.github\chatmodes\
   ```

   (The repo location is just for version control)

---

## Summary

🎯 **To use Ultra Autonomous Agent (Ultra Chad Mode):**

1. Press **`Ctrl+Alt+I`** to open Chat view
2. Click the **dropdown** at the top (currently showing "Ask", "Edit", or "Agent")
3. Select **"Ultra Autonomous Agent"**
4. Start chatting with unlimited power! 🔥

**That's it!** No `@` mentions needed, no installation needed - it's already there waiting for you in the dropdown! 😊

---

## Need More Help?

If custom modes still don't appear after reloading:

1. Check VS Code Developer Console: **`Help → Toggle Developer Tools`**
2. Look for any errors related to "chatmode" or "prompts"
3. Share the error messages and I can help debug further

Your files are confirmed installed at the correct location, so a simple window reload should make them visible in the dropdown!
