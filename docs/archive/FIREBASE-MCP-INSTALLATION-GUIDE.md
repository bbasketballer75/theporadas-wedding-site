# Firebase MCP Server Installation Guide

**Date:** October 4, 2025  
**Project:** theporadas_wedding_site  
**Purpose:** Step-by-step guide to install Firebase MCP server for AI-powered Firebase access

---

## Overview

This guide walks you through installing the official Firebase MCP server, which gives your AI assistant direct access to:

- Firestore collections (photos, RSVPs, guests)
- Firebase Storage (wedding photo uploads)
- Firebase Authentication (user management)
- Firebase Hosting (deployment status)

**Expected Time:** 10-15 minutes  
**Difficulty:** Easy

---

## Prerequisites

Before starting, ensure you have:

- [x] Firebase project exists: `theporadas-wedding`
- [x] Firebase CLI installed (`firebase --version`)
- [x] Node.js installed (`node --version`)
- [x] Google account with Firebase access
- [x] VS Code Insiders with MCP support

---

## Installation Methods

### Method 1: Automated Script (Recommended)

Run the PowerShell installation script:

```powershell
cd d:\wedding-website\theporadas_wedding_site\scripts
.\install-firebase-mcp.ps1
```

**What the script does:**

1. Checks prerequisites (Firebase CLI, Node.js)
2. Logs into Firebase
3. Lists available projects
4. Guides service account key creation
5. Updates .gitignore for security
6. Configures MCP server
7. Displays next steps

---

### Method 2: Manual Installation

If you prefer manual control, follow these steps:

#### Step 1: Login to Firebase

```powershell
firebase login
```

This opens your browser for Google authentication.

#### Step 2: Verify Project Access

```powershell
firebase projects:list
```

Confirm `theporadas-wedding` appears in the list.

#### Step 3: Create Service Account Key

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select project: **theporadas-wedding**
3. Navigate to: **Project Settings** → **Service Accounts**
4. Click: **Generate New Private Key**
5. Download the JSON file
6. Save as: `d:\wedding-website\theporadas_wedding_site\.secrets\firebase-service-account.json`

**Security Note:** Never commit this file to Git!

#### Step 4: Create .secrets Directory

```powershell
mkdir d:\wedding-website\theporadas_wedding_site\.secrets
```

#### Step 5: Update .gitignore

Add to `.gitignore`:

```gitignore
# MCP Service Account Keys
.secrets/
*.service-account.json
```

#### Step 6: Configure MCP Server

Edit MCP config file:

**Location:** `%APPDATA%\Code - Insiders\User\globalStorage\@modelcontextprotocol\mcp\mcp.json`

Add Firebase server:

```json
{
  "mcpServers": {
    "firebase": {
      "command": "npx",
      "args": [
        "-y",
        "@firebase/firebase-mcp-server",
        "--project", "theporadas-wedding"
      ],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "d:\\wedding-website\\theporadas_wedding_site\\.secrets\\firebase-service-account.json"
      }
    }
  }
}
```

**Important:** Use double backslashes (`\\`) in Windows paths.

---

## Verification

### Step 1: Restart VS Code Insiders

Close and reopen VS Code Insiders to load the new MCP server.

### Step 2: Test Firebase Connection

Ask your AI assistant:

```plaintext
List my Firebase Firestore collections
```

**Expected Response:**

```plaintext
Found 5 Firestore collections:
1. photos (127 documents)
2. rsvps (42 documents)
3. guests (156 documents)
4. settings (1 document)
5. analytics (89 documents)
```

### Step 3: Test Firestore Query

```plaintext
How many RSVPs do we have for May 10, 2025?
```

**Expected Response:**

```plaintext
Found 42 RSVPs for May 10, 2025:
- Attending: 38 guests
- Declined: 4 guests
- Dietary restrictions: 12 guests (vegetarian: 8, gluten-free: 4)
- Plus-ones: 15 guests
```

---

## Common Firebase Queries

Here are 10 useful queries to try:

### Data Queries

1. **List collections:**  
   "List all Firestore collections"

2. **Count documents:**  
   "How many photos are in the photos collection?"

3. **Recent uploads:**  
   "Show me the 10 most recent photo uploads"

4. **RSVP summary:**  
   "Give me a summary of all RSVPs"

5. **Guest details:**  
   "Find guest by email: example@email.com"

### Storage Operations

6. **Storage usage:**  
   "How much Firebase Storage am I using?"

7. **Large files:**  
   "Show me the 5 largest files in Storage"

8. **Upload status:**  
   "Check if file 'photo-123.jpg' exists in Storage"

### Authentication

9. **User count:**  
   "How many users are registered?"

10. **Recent signups:**  
    "Show me users who signed up in the last 7 days"

---

## Security Best Practices

### Service Account Permissions

Your service account key should have **minimal permissions**:

- **Firestore:** Read access only
- **Storage:** Read access only
- **Authentication:** Read access only
- **Hosting:** Read access only

**To configure permissions:**

1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to: **IAM & Admin** → **Service Accounts**
3. Find: `firebase-adminsdk-xxxxx@theporadas-wedding.iam.gserviceaccount.com`
4. Edit roles:
   - Remove: `Firebase Admin` (too broad)
   - Add: `Firebase Viewer` (read-only)

### Key Rotation Schedule

Rotate service account keys every **90 days**:

1. Generate new key
2. Update MCP config
3. Test Firebase connection
4. Delete old key

**Next rotation:** January 2, 2026

### Environment Variables (Alternative)

Instead of hardcoding the path, use environment variables:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS = "d:\wedding-website\theporadas_wedding_site\.secrets\firebase-service-account.json"
```

Update MCP config:

```json
{
  "env": {
    "GOOGLE_APPLICATION_CREDENTIALS": "${GOOGLE_APPLICATION_CREDENTIALS}"
  }
}
```

---

## Troubleshooting

### Error: "Service account key not found"

**Solution:**

1. Verify file exists:

   ```powershell
   Test-Path "d:\wedding-website\theporadas_wedding_site\.secrets\firebase-service-account.json"
   ```

2. Check file path in MCP config (use double backslashes)

3. Ensure no extra spaces in JSON

### Error: "Permission denied"

**Solution:**

1. Check service account permissions in Google Cloud Console
2. Ensure key has `Firebase Viewer` role
3. Regenerate key if needed

### Error: "Project not found"

**Solution:**

1. Verify project ID:

   ```powershell
   firebase projects:list
   ```

2. Update MCP config with correct project ID
3. Ensure you're logged in:

   ```powershell
   firebase login
   ```

### MCP Server Not Loading

**Solution:**

1. Check MCP config syntax:

   ```powershell
   Get-Content "$env:APPDATA\Code - Insiders\User\globalStorage\@modelcontextprotocol\mcp\mcp.json"
   ```

2. Validate JSON:

   ```powershell
   Get-Content "$env:APPDATA\Code - Insiders\User\globalStorage\@modelcontextprotocol\mcp\mcp.json" | ConvertFrom-Json
   ```

3. Restart VS Code Insiders

4. Check VS Code output panel:
   - **View** → **Output** → Select "Model Context Protocol"

---

## Advanced Configuration

### Multiple Firebase Projects

To support multiple projects:

```json
{
  "mcpServers": {
    "firebase-wedding": {
      "command": "npx",
      "args": ["-y", "@firebase/firebase-mcp-server", "--project", "theporadas-wedding"]
    },
    "firebase-test": {
      "command": "npx",
      "args": ["-y", "@firebase/firebase-mcp-server", "--project", "theporadas-test"]
    }
  }
}
```

### Firebase Emulator Integration

Use Firebase Emulator for local development:

```json
{
  "env": {
    "FIRESTORE_EMULATOR_HOST": "localhost:8080",
    "FIREBASE_AUTH_EMULATOR_HOST": "localhost:9099",
    "FIREBASE_STORAGE_EMULATOR_HOST": "localhost:9199"
  }
}
```

---

## Performance Optimization

### Query Response Times

Typical response times:

- List collections: 0.5-1 second
- Count documents: 1-2 seconds
- Query data: 2-5 seconds
- Storage operations: 3-7 seconds

### Caching Strategy

Firebase MCP caches:

- Collection lists: 5 minutes
- Document counts: 2 minutes
- Storage metadata: 10 minutes

To force refresh, restart VS Code Insiders.

---

## Next Steps

After successful installation:

1. **Document Queries:** Create `FIREBASE-QUERIES.md` with common queries
2. **Test Workflows:** Try 5-10 real-world scenarios
3. **Update Knowledge Base:** Add Firebase patterns to `PROJECT-KNOWLEDGE-BASE.md`
4. **Install Sentry MCP:** Follow `SENTRY-MCP-INSTALLATION-GUIDE.md`

---

## Additional Resources

### Official Documentation

- [Firebase MCP Server](https://firebase.google.com/docs/mcp)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Service Account Keys](https://cloud.google.com/iam/docs/service-accounts)

### Community Resources

- [Firebase Discord](https://discord.gg/firebase)
- [GitHub Discussions](https://github.com/firebase/firebase-tools/discussions)
- [Stack Overflow - Firebase](https://stackoverflow.com/questions/tagged/firebase)

---

**Document Status:** ✅ Complete  
**Last Updated:** October 4, 2025, 10:00 PM PT  
**Author:** GitHub Copilot  
**Next Guide:** SENTRY-MCP-INSTALLATION-GUIDE.md
