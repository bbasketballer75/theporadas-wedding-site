# 🎯 SOLVED: How to Access Custom Prompts in VS Code Insiders 1.105

**Your Version:** VS Code Insiders 1.105.0 (October 3, 2025)  
**Issue:** Looking for custom modes in the wrong place!

---

## ❌ **What You're Doing (Wrong Place)**

You're clicking the dropdown that shows:

- ✅ Agent
- ✅ Ask  
- ✅ Edit
- 🔧 Configure Modes...

**This is for BUILT-IN modes only!** Custom prompts are accessed differently.

---

## ✅ **How to Access Custom Prompts (CORRECT)**

### **Method 1: Type `#` in Chat Input (EASIEST!)**

1. Open Chat view (`Ctrl+Alt+I`)
2. In the chat input box, type **`#`** (just the # symbol)
3. A dropdown will appear showing **ALL your prompts**:

   ```
   #ultra-autonomous
   #new-component
   #new-page
   #new-test
   #fix-a11y
   #optimize-performance
   ```

4. Select `#ultra-autonomous` (or any other prompt)
5. Type your request after it

**Example:**

```
#ultra-autonomous Create a photo gallery with lazy loading
```

### **Method 2: Type `/` for Slash Commands**

1. Open Chat view (`Ctrl+Alt+I`)
2. Type **`/`** (forward slash)
3. Look for commands like:

   ```
   /ask
   /edit
   /agent
   ```

4. These are built-in modes, but you can also see if custom prompts appear here

### **Method 3: Start Typing the Prompt Name**

1. Open Chat view (`Ctrl+Alt+I`)
2. Start typing **`#ultra`** and it should auto-suggest
3. Press Tab or Enter to accept

---

## 🔍 **Why the Confusion?**

| What You See | What It's For | Where Custom Prompts Are |
|--------------|---------------|--------------------------|
| **Agent/Ask/Edit dropdown** | Built-in chat modes | ❌ Not here |
| **"Configure Modes..."** | Settings for built-in modes | ❌ Not here |
| **`#` mentions in chat** | Custom prompts & context | ✅ **HERE!** |

---

## ✅ **Your Custom Prompts (Confirmed Installed)**

These files exist in your prompts directory:

| File | Access With | Description |
|------|-------------|-------------|
| `ultra-autonomous.prompt.md` | `#ultra-autonomous` | Your "Ultra Chad Mode" |
| `new-component.prompt.md` | `#new-component` | Create React components |
| `new-page.prompt.md` | `#new-page` | Create Next.js pages |
| `new-test.prompt.md` | `#new-test` | Create E2E tests |
| `fix-a11y.prompt.md` | `#fix-a11y` | Fix accessibility |
| `optimize-performance.prompt.md` | `#optimize-performance` | Performance optimization |

**Location:**

```
C:\Users\Austin\AppData\Roaming\Code - Insiders\User\prompts\
```

---

## 🎯 **Quick Test RIGHT NOW**

1. **Press** `Ctrl+Alt+I` to open Chat
2. **Type** `#` in the chat input
3. **You should see** a dropdown list with your prompts
4. **Select** `#ultra-autonomous`
5. **Type** `explain what you do`
6. **Press** Enter

If you see the dropdown with `#ultra-autonomous` in it, **it's working!** 🎉

---

## 🤔 **If `#` Doesn't Show Prompts**

### **Option 1: Reload VS Code**

```
Ctrl+Shift+P → "Developer: Reload Window"
```

### **Option 2: Check the File Format**

The file must start with YAML frontmatter:

```yaml
---
mode: 'agent'
description: 'Your description here'
---

# Your Prompt Title

Your prompt content here...
```

### **Option 3: Check Settings**

Press `Ctrl+Shift+P` and search for:

```
Preferences: Open Settings (JSON)
```

Look for any settings related to:

- `chat.prompts.enabled`
- `chat.prompts.location`

### **Option 4: Use the Command Palette**

```
Ctrl+Shift+P → "Chat: Use Prompt..."
```

This should show all available prompts.

---

## 📸 **Visual Guide**

### **What You're Looking At (Wrong):**

```
┌─────────────────────────────────────┐
│  [✓ Agent]  ← You're here           │
│  [ Ask    ]                          │
│  [ Edit   ]                          │
│  ────────────                        │
│  Configure Modes...                  │
└─────────────────────────────────────┘
```

### **Where You Should Look (Right):**

```
┌─────────────────────────────────────┐
│  Chat View                           │
├─────────────────────────────────────┤
│  Type your message...                │
│  #█  ← Type # here!                  │
│                                      │
│  Dropdown appears:                   │
│  📄 #ultra-autonomous                │
│  📄 #new-component                   │
│  📄 #new-page                        │
│  📄 #new-test                        │
│  📄 #fix-a11y                        │
│  📄 #optimize-performance            │
└─────────────────────────────────────┘
```

---

## 💡 **Key Differences in VS Code 1.105**

| Feature | Old Behavior | Current (1.105) |
|---------|--------------|-----------------|
| Custom Modes | Might have been in dropdown | Use `#` mentions |
| Access Method | `@` symbols | `#` symbols |
| Location | Chat mode selector | Chat input field |
| Configuration | "Configure Modes..." button | Settings JSON |

---

## 🚀 **Using Ultra Autonomous Prompt**

Once you type `#ultra-autonomous` and your request:

```
#ultra-autonomous Build a contact form with validation, email sending, and rate limiting
```

I will:

- ✅ Never ask for permission
- ✅ Work continuously until complete
- ✅ Research documentation automatically
- ✅ Fix issues as they arise
- ✅ Only stop when you say "stop"

---

## 📝 **Alternative: Use Command Palette**

If `#` mentions don't work:

1. **Press** `Ctrl+Shift+P`
2. **Type** `Chat: Use Prompt`
3. **Select** from the list
4. Choose `ultra-autonomous`

---

## ✅ **Summary**

| ❌ Wrong | ✅ Right |
|---------|---------|
| Looking in Agent/Ask/Edit dropdown | Type `#` in chat input |
| Clicking "Configure Modes..." | Use `#ultra-autonomous` |
| Using `@` symbols | Use `#` symbols |
| Looking for "Ultra Autonomous Agent" in modes | Type `#ultra` and auto-complete |

---

## 🔥 **Try This Command NOW:**

Open Chat (`Ctrl+Alt+I`) and type:

```
#ultra-autonomous create a test.txt file with "Hello World" inside it
```

If the `#` dropdown appears, select `#ultra-autonomous` and watch me execute without asking! 🚀

---

**Your prompts are installed and ready. You just need to use `#` instead of the dropdown!**
