# Firebase Service Account Key - Quick Setup Guide

**Status:** Waiting for service account key  
**Date:** October 5, 2025  
**Project:** theporadas-wedding

---

## 🔑 Get Your Service Account Key (3 minutes)

### Step 1: Open Firebase Console

Click here: [Firebase Console - Service Accounts](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk)

Or manually navigate:

1. Go to: <https://console.firebase.google.com/>
2. Select project: **theporadas-wedding** (or create it if doesn't exist)
3. Click the ⚙️ gear icon (top left) → **Project Settings**
4. Navigate to: **Service Accounts** tab

### Step 2: Generate Private Key

1. Under "Firebase Admin SDK", click: **Generate new private key**
2. A popup appears: "Generate new private key?"
3. Click: **Generate key**
4. A JSON file downloads automatically (e.g., `theporadas-wedding-firebase-adminsdk-xxxxx-xxxxxxxxxx.json`)

### Step 3: Save the Key

**Important:** Rename and move the downloaded file to:

```
d:\wedding-website\theporadas_wedding_site\.secrets\firebase-service-account.json
```

**PowerShell command to move it:**

```powershell
# Replace 'Downloads' path with your actual download location
Move-Item "$env:USERPROFILE\Downloads\theporadas-wedding-firebase-adminsdk-*.json" "d:\wedding-wedding\theporadas_wedding_site\.secrets\firebase-service-account.json" -Force
```

### Step 4: Verify File Exists

```powershell
Test-Path "d:\wedding-website\theporadas_wedding_site\.secrets\firebase-service-account.json"
```

Should return: `True`

### Step 5: Re-run Installation Script

```powershell
cd d:\wedding-website\theporadas_wedding_site\scripts
.\install-firebase-mcp.ps1
```

---

## 🔒 Security Checklist

- [x] `.secrets/` directory created
- [x] `.gitignore` will be updated by script
- [ ] Service account key downloaded
- [ ] Key renamed to `firebase-service-account.json`
- [ ] Key moved to `.secrets/` folder

---

## ⚠️ If You Don't Have a Firebase Project Yet

1. Go to: <https://console.firebase.google.com/>
2. Click: **Add project** or **Create a project**
3. Enter project name: `theporadas-wedding`
4. Follow the setup wizard
5. Then return to Step 1 above

---

## 🆘 Troubleshooting

### "Project not found"

- Make sure you're logged in as `bbasketballer75@gmail.com`
- Verify the project exists in Firebase Console
- Check if you have owner/editor permissions

### "Permission denied"

- Ensure you have Owner or Editor role on the project
- Try logging out and back in: `firebase logout && firebase login`

### "Can't download key"

- Check browser downloads folder
- Try different browser (Chrome recommended)
- Disable popup blocker temporarily

---

**Once the key is in place, press Enter in the script to continue!**

The script is waiting at this prompt:

```
Press Enter when you have saved the service account key...
```
