# 🔥 Vercel Firebase Environment Variables Setup

**Project:** theporadas-wedding-site  
**Firebase Project:** the-poradas-2025-813c7  
**Date:** October 10, 2025

---

## 📋 Your Firebase Configuration

Based on the values you provided, here's what we have:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAwucHFFCyrbJfRBxyl7Ofq-Awu2gN29wg
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=the-poradas-2025-813c7.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=the-poradas-2025-813c7
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=the-poradas-2025-813c7.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1059875220445
NEXT_PUBLIC_FIREBASE_APP_ID=1:1059875220445:web:459a645ef2a245728be434
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-MT9RJG0YS0
```

---

## ⚠️ Missing Values (Need from Firebase Console)

You need to get these 3 additional values:

1. **Storage Bucket** (usually: `wedding-site-final.appspot.com`)
2. **Messaging Sender ID** (a number like: `123456789012`)
3. **App ID** (format: `1:123456789012:web:abcdef123456`)

### Where to Find Them

1. Go to: <https://console.firebase.google.com/project/the-poradas-2025-813c7/settings/general>
2. Scroll to **"Your apps"** section
3. Click on your Web app (or create one if none exists)
4. Click **"Config"** or **"SDK setup and configuration"**
5. You'll see all values in JavaScript format:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAwucHFFCyrbJfRBxyl7Ofq-Awu2gN29wg",
  authDomain: "the-poradas-2025-813c7.firebaseapp.com",
  projectId: "the-poradas-2025-813c7",
  storageBucket: "the-poradas-2025-813c7.firebasestorage.app",
  messagingSenderId: "1059875220445",
  appId: "1:1059875220445:web:459a645ef2a245728be434",
  measurementId: "G-MT9RJG0YS0"
};
```

---

## 🚀 Step-by-Step Vercel Setup

### Step 1: Add Environment Variables to Vercel

1. **Go to Vercel Dashboard:**  
   <https://vercel.com/dashboard>

2. **Select your project:**  
   Find and click: **theporadas-wedding-site**

3. **Navigate to Settings:**  
   Click **Settings** tab → **Environment Variables** (left sidebar)

4. **Add each variable:**

   For EACH of these 6 variables, do the following:

   | Variable Name | Value |
   |---------------|-------|
   | `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyAwucHFFCyrbJfRBxyl7Ofq-Awu2gN29wg` |
   | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `the-poradas-2025-813c7.firebaseapp.com` |
   | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `the-poradas-2025-813c7` |
   | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `the-poradas-2025-813c7.firebasestorage.app` |
   | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `1059875220445` |
   | `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:1059875220445:web:459a645ef2a245728be434` |
   | `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-MT9RJG0YS0` |

   **For each variable:**
   - Click **"Add New"** button
   - **Name:** Enter variable name (copy from table above)
   - **Value:** Enter the corresponding value
   - **Environment:** Select **ALL THREE**: ✅ Production, ✅ Preview, ✅ Development
   - Click **"Save"**
   - Repeat for next variable

### Step 2: Trigger Redeploy

After adding all variables:

**Option A: Redeploy from Vercel Dashboard**

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click **"..."** menu → **"Redeploy"**
4. Confirm redeploy

**Option B: Git Push (Automatic)**

```bash
git commit --allow-empty -m "chore: trigger redeploy with new env vars"
git push origin main
```

Vercel will auto-deploy if GitHub integration is active.

### Step 3: Verify Deployment

1. Wait for deployment to complete (~2 minutes)
2. Visit your production URL
3. Check browser console (F12) - should see no Firebase errors
4. Test uploading a photo to verify Storage works
5. Test guest book to verify Firestore works

---

## 🔍 Troubleshooting

### Firebase errors in browser console?

**Check:**

- All 6 environment variables are set in Vercel
- Variable names are EXACT (case-sensitive)
- Values have no extra spaces or quotes
- You redeployed after adding variables

### Storage/Upload not working?

**Verify:**

- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` is correct
- Firebase Storage is enabled in Firebase Console
- Storage rules allow uploads

### Authentication not working?

**Verify:**

- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` matches Firebase Console
- Authentication is enabled in Firebase Console
- Auth methods are configured (Email/Password, Google, etc.)

---

## ✅ Quick Checklist

Before deploying, confirm:

- [ ] Got all 6 Firebase config values from Console
- [ ] Added all 6 as environment variables in Vercel
- [ ] Selected Production + Preview + Development for each
- [ ] Triggered a redeploy
- [ ] Verified deployment completed successfully
- [ ] Tested Firebase features on production site

---

## 📝 Notes

- **API Key is public:** The `NEXT_PUBLIC_FIREBASE_API_KEY` is safe to expose in client code. It's protected by Firebase Security Rules.
- **All must start with NEXT_PUBLIC_:** Next.js only exposes env vars with this prefix to the browser.
- **Old VITE_ prefix:** Your original values used `VITE_` prefix (Vite framework). Next.js requires `NEXT_PUBLIC_` prefix instead.
- **No .env file in production:** Vercel uses dashboard environment variables, not `.env` files.

---

## 🎯 After Setup Complete

Your wedding website will have:

- ✅ Firebase Authentication
- ✅ Firestore Database (guest book, comments)
- ✅ Cloud Storage (photo/video uploads)
- ✅ Firebase Analytics
- ✅ Full production functionality

**Ready to handle thousands of wedding guests!** 🎉

---

**Need help?** Check Firebase Console or Vercel deployment logs for specific error messages.
