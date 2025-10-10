# ✅ FIXED: How to Access Your Custom Prompts

## The Real Answer

Custom modes in VS Code Copilot are accessed through **PROMPTS**, not chat modes!

---

## 🎯 How to Use Custom Prompts (CORRECT METHOD)

### Method 1: Use @ Symbol in Chat (EASIEST!)

1. Open Chat view (`Ctrl+Alt+I`)
2. Type **`@`** in the chat input
3. You'll see a list of available prompts including:
   - `@ultra-autonomous` ← Your Ultra Chad Mode! 🔥
   - `@new-component`
   - `@new-page`
   - `@new-test`
   - `@fix-a11y`
   - `@optimize-performance`

4. Select `@ultra-autonomous` and type your request

**Example:**

```
@ultra-autonomous Create a photo gallery with infinite scroll and lazy loading
```

### Method 2: Slash Commands

1. Open Chat view (`Ctrl+Alt+I`)
2. Type **`/`** to see available commands
3. Look for prompt-related commands

### Method 3: Command Palette

1. Press `Ctrl+Shift+P`
2. Type "Chat: Use Prompt"
3. Select from available prompts

---

## 📋 Your Available Custom Prompts

| Prompt | Command | Description |
|--------|---------|-------------|
| **Ultra Autonomous** | `@ultra-autonomous` | Relentless autonomous coding agent with full control |
| **New Component** | `@new-component` | Generate React components |
| **New Page** | `@new-page` | Generate Next.js pages |
| **New Test** | `@new-test` | Generate E2E tests |
| **Fix Accessibility** | `@fix-a11y` | Fix accessibility issues |
| **Optimize Performance** | `@optimize-performance` | Performance optimization |

---

## 🔥 Ultra Autonomous Prompt (Your Ultra Chad Mode)

**Location:**

```
C:\Users\Austin\AppData\Roaming\Code - Insiders\User\prompts\ultra-autonomous.prompt.md
```

**How to Use:**

```
@ultra-autonomous [your request]
```

**Features:**

- ✅ Never asks for permission
- ✅ Continuous operation until complete
- ✅ Full VS Code access
- ✅ Automatic research and documentation lookup
- ✅ Fixes issues as they arise
- ✅ Only stops when you say "stop", "end", or "terminate"

---

## 🔄 If @ Mentions Don't Show Your Custom Prompt

### Step 1: Reload VS Code

```
Ctrl+Shift+P → "Developer: Reload Window"
```

### Step 2: Verify File Location

```powershell
Get-ChildItem "$env:APPDATA\Code - Insiders\User\prompts" -Filter "*ultra*.prompt.md"
```

Should show:

```
ultra-autonomous.prompt.md
```

### Step 3: Check File Format

Open the file and verify it starts with:

```yaml
---
mode: 'agent'
description: 'Relentless autonomous coding agent...'
---
```

---

## 💡 Understanding Chat Modes vs Prompts

| Feature | Chat Modes | Custom Prompts |
|---------|------------|----------------|
| **Access** | Dropdown at top of Chat view | `@` mentions in chat input |
| **Built-in Examples** | Ask, Edit, Agent | N/A |
| **Custom Examples** | N/A | `@ultra-autonomous`, `@new-component` |
| **File Extension** | `.chatmode.md` | `.prompt.md` |
| **Location** | `User/chatmodes/` | `User/prompts/` |
| **Current Support** | Limited (may be deprecated) | ✅ Actively supported |

---

## 🎯 Quick Test

Try this right now:

1. Open Chat view: `Ctrl+Alt+I`
2. Type: `@` (just the @ symbol)
3. You should see a list appear with your prompts
4. Select `@ultra-autonomous`
5. Type a simple test: "explain what you do"
6. Press Enter

If you see the ultra-autonomous prompt respond, it's working! 🎉

---

## 📝 Example Usage

### Before (Not Working)

```
Looking for "Ultra Autonomous Agent" in chat mode dropdown
```

### After (Working!)

```
@ultra-autonomous Build a contact form with validation, email sending, and rate limiting
```

The prompt will:

1. Plan the implementation
2. Create all files
3. Add validation
4. Set up email service
5. Implement rate limiting
6. Test everything
7. Fix any issues
8. Report completion

All automatically without asking for permission! 🚀

---

## 🛠️ Troubleshooting

### Problem: @ mentions don't show any prompts

**Solution:**

```powershell
# Reload VS Code
Ctrl+Shift+P → "Developer: Reload Window"
```

### Problem: @ mentions show some prompts but not ultra-autonomous

**Solution:**

```powershell
# Check if file exists
Test-Path "$env:APPDATA\Code - Insiders\User\prompts\ultra-autonomous.prompt.md"

# If False, the file wasn't created
# Re-run the creation command from the terminal
```

### Problem: Prompt doesn't behave as expected

**Solution:**
The prompt is just instructions. It will behave according to the underlying model and chat mode. For best results:

1. Use in **Agent mode** (select Agent from dropdown)
2. Give clear, specific instructions
3. Let it work without interrupting

---

## 📚 Related Files

All your custom prompts are stored at:

```
C:\Users\Austin\AppData\Roaming\Code - Insiders\User\prompts\
```

You can:

- ✅ Edit existing prompts
- ✅ Create new prompts (use `.prompt.md` extension)
- ✅ Delete prompts you don't need
- ✅ Share prompts with others (just copy the files)

---

## ✅ Summary

**Chat Modes (Ask/Edit/Agent):** Selected from dropdown at top of Chat view
**Custom Prompts:** Accessed with `@` mentions in chat input

**Your Ultra Chad Mode:** `@ultra-autonomous`

**Right now:** Open chat (`Ctrl+Alt+I`), type `@ultra-autonomous`, and start using it! 🔥

---

**Everything is set up and ready to use!** Just type `@ultra-autonomous` in the chat and unleash the beast! 🚀
