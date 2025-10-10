# 🔧 Create Firebase Web App - Step-by-Step Guide

**Date:** October 10, 2025  
**Purpose:** Get the 3 missing Firebase configuration values for deployment

---

## 🎯 What You Need

You already have these values:

- ✅ `NEXT_PUBLIC_FIREBASE_API_KEY`
- ✅ `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- ✅ `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

You need to create a **Web App** in Firebase to get:

- ❌ `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- ❌ `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- ❌ `NEXT_PUBLIC_FIREBASE_APP_ID`

---

## 📝 Step-by-Step Instructions

### Step 1: Open Firebase Console

1. Go to: **<https://console.firebase.google.com/>**
2. Select your project: **wedding-site-final** (or whatever your project is named)

---

### Step 2: Navigate to Project Settings

1. Click the **⚙️ gear icon** in the top-left (next to "Project Overview")
2. Select **"Project settings"**
3. Scroll down to the **"Your apps"** section

---

### Step 3: Add a Web App (if not already created)

**If you see an existing web app listed:**

- ✅ Skip to Step 4 (just copy the config)

**If you DON'T see a web app:**

1. Click the **`</> Web`** icon (it says "Add app" when you hover)
2. Enter app nickname: **"Wedding Website"** (or any name you want)
3. **Check the box:** ☑️ "Also set up Firebase Hosting for this app"
   - This links the web app to your hosting site
4. Click **"Register app"**
5. Click **"Continue to console"** (don't worry about the SDK setup, we already have it)

---

### Step 4: Copy Your Firebase Config

In the **"Your apps"** section, you'll see your web app listed.

**Two ways to get the config:**

#### Option A: From the Web App Card

1. Find your web app in the list
2. Click the **"Config"** radio button (next to "SDK setup and configuration")
3. You'll see a `firebaseConfig` object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",                          // ✅ You already have this
  authDomain: "wedding-site-final.firebaseapp.com",  // ✅ You already have this
  projectId: "wedding-site-final",            // ✅ You already have this
  storageBucket: "wedding-site-final.appspot.com",   // ❌ COPY THIS
  messagingSenderId: "123456789012",          // ❌ COPY THIS
  appId: "1:123456789012:web:abc123def456"    // ❌ COPY THIS
};
```

#### Option B: From the Settings Gear Icon

1. Click the **⚙️ gear icon** next to your web app name
2. Scroll down to **"SDK setup and configuration"**
3. Select **"Config"** (not "CDN")
4. Copy the three missing values

---

### Step 5: Update Your .env.production File

Open `site/.env.production` and add the missing values:

```bash
# Firebase Configuration (for production deployment)

# ✅ Already have these 3 values:
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=wedding-site-final.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=wedding-site-final

# ❌ ADD THESE 3 VALUES from Firebase Console:
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=wedding-site-final.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456
```

---

## 🚀 After Getting the Values

### Option 1: Use PowerShell Script (Fastest)

Create a file: `scripts/add-firebase-to-vercel.ps1`

```powershell
# Load environment variables
$envFile = "site/.env.production"
$envVars = Get-Content $envFile | Where-Object { $_ -match '^NEXT_PUBLIC_FIREBASE_' }

# Add each variable to Vercel (all environments)
foreach ($line in $envVars) {
    $parts = $line -split '=', 2
    $key = $parts[0]
    $value = $parts[1]
    
    Write-Host "Adding $key to Vercel..."
    vercel env add $key production --value $value --yes
    vercel env add $key preview --value $value --yes
    vercel env add $key development --value $value --yes
}

Write-Host "`nAll Firebase environment variables added to Vercel!" -ForegroundColor Green
```

Run it:

```powershell
.\scripts\add-firebase-to-vercel.ps1
```

---

### Option 2: Add Manually via Vercel Dashboard

1. Go to: **<https://vercel.com/dashboard>**
2. Select your project: **wedding-website** (or similar)
3. Click **"Settings"** tab
4. Click **"Environment Variables"** in the left sidebar
5. For each of the 6 Firebase variables:
   - Click **"Add New"**
   - Enter the variable name (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`)
   - Enter the value (from Firebase Console)
   - Select: ☑️ **Production**, ☑️ **Preview**, ☑️ **Development**
   - Click **"Save"**

---

### Option 3: Use Vercel CLI (Manual Commands)

```bash
# API Key
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production preview development

# Auth Domain
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production preview development

# Project ID
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production preview development

# Storage Bucket (NEW)
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production preview development

# Messaging Sender ID (NEW)
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production preview development

# App ID (NEW)
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production preview development
```

*Note: Vercel will prompt you to enter the value for each command*

---

## ✅ Verification

After adding the variables to Vercel:

1. Check they're all there:

   ```bash
   vercel env ls
   ```

2. You should see all 6 variables listed for Production, Preview, and Development

---

## 🎯 Next Step: Deploy

Once all environment variables are added:

```bash
vercel --prod
```

Your wedding website will be live! 🎉

---

## 🆘 Troubleshooting

### "I don't see the web app in Firebase Console"

**Solution:** Create one by clicking the `</>` icon in Project Settings → Your apps section

### "I already have a web app but can't see the config"

**Solution:**

1. Click the gear icon ⚙️ next to your web app name
2. Scroll to "SDK setup and configuration"
3. Select "Config" radio button

### "I see 'databaseURL' in my config but it's not in the instructions"

**Solution:** That's for Realtime Database (not needed). You're using Firestore + Storage.

### "Do I need to enable Firebase Hosting?"

**Answer:**

- **No** - You're deploying to Vercel (not Firebase Hosting)
- But it doesn't hurt to enable it when creating the web app
- You can deploy to Firebase Hosting as a backup option

---

## 📚 Related Documentation

- [VERCEL-FIREBASE-SETUP.md](./VERCEL-FIREBASE-SETUP.md) - Complete setup guide
- [FIREBASE-CLI-LIMITATION-SOLUTION.md](./FIREBASE-CLI-LIMITATION-SOLUTION.md) - Why we use Vercel
- [ALL-TASKS-COMPLETE.md](./ALL-TASKS-COMPLETE.md) - Full deployment checklist

---

**Estimated Time: 3-5 minutes** ⏱️
