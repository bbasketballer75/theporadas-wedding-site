# Post-Deployment Verification Guide - CSP Corrected Fix

**Deployment:** October 13, 2025 ~18:45  
**Commit:** 9e7d3e8 (Corrected CSP fix)  
**Expected Vercel Build Time:** ~3 minutes

---

## QUICK VERIFICATION (5 minutes)

### Step 1: Wait for Deployment

Check Vercel dashboard or wait ~3 minutes after push completed (18:48).

### Step 2: Open Production Site

Navigate to: <https://wedding-website-sepia-ten.vercel.app>

### Step 3: Check Browser Console (F12)

Look for these **SUCCESS INDICATORS:**

#### ✅ GOOD SIGNS (What You Want to See)

1. **NO CSP violation errors** mentioning:
   - `firebase.googleapis.com`
   - `firebaseinstallations.googleapis.com`

2. **Firestore connection success:**
   - Look for: `@firebase/firestore: Connected to Cloud Firestore`

3. **NO 400 errors** on Firestore Listen channels

4. **NO "transport errored" warnings** from WebChannelConnection

#### ❌ BAD SIGNS (What Would Indicate Failure)

- "Refused to connect to '<https://firebase.googleapis.com>...'"
- "GET <https://firestore.googleapis.com/...Listen/channel>? 400 (Bad Request)"
- "@firebase/firestore: WebChannelConnection RPC 'Listen' stream transport errored"

---

## DETAILED VERIFICATION (15 minutes)

### Console Log Capture

1. Open DevTools Console (F12)
2. Clear console
3. Refresh page (Ctrl+R)
4. Wait 5 minutes
5. Right-click console → "Save as..." → save to file
6. Search for keywords:
   - `"Refused to connect"` - should be ZERO Firebase-related
   - `"400 (Bad Request)"` on firestore.googleapis.com - should be ZERO
   - `"Connected to Cloud Firestore"` - should appear once

### Guestbook Realtime Test

1. **Window 1:** Navigate to `/guestbook` page
2. **Window 2:** Open site in incognito/different browser at `/guestbook`
3. **Window 1:** Submit test guestbook entry
4. **Window 2:** Entry should appear **INSTANTLY** (no refresh needed)
5. ✅ **SUCCESS:** Realtime sync working
6. ❌ **FAILURE:** Must refresh to see entry = still in offline mode

---

## COMPARISON: Before vs. After

### BEFORE (Console Log from First Deployment)

```text
❌ Refused to connect to 'https://firebase.googleapis.com/...'
❌ Refused to connect to 'https://firebaseinstallations.googleapis.com/...'
❌ GET https://firestore.googleapis.com/...Listen/channel? 400 (Bad Request)
❌ WebChannelConnection RPC 'Listen' stream transport errored (20+ times)
```

### AFTER (Expected with Corrected Fix)

```text
✅ Connected to Cloud Firestore
✅ (no CSP violations related to Firebase)
✅ (no 400 errors on Listen channels)
✅ (no transport errored warnings)
```

---

## IF VERIFICATION PASSES

**Great!** The CSP fix is working correctly. You can:

1. Close this verification guide
2. Monitor guestbook for realtime functionality
3. Check Firebase Analytics dashboard (data should be flowing)

**Document your success:**

- Capture clean console log showing no errors
- Save as `VERIFICATION-SUCCESS-2025-10-13.txt`

---

## IF VERIFICATION FAILS

**Don't panic.** Follow these steps:

### 1. Check Vercel Deployment Status

- Visit Vercel dashboard
- Confirm deployment `9e7d3e8` completed successfully
- Check build logs for errors

### 2. Hard Refresh Browser

- Press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- This clears browser cache and loads fresh CSP

### 3. Check Different Browser

- Try Chrome, Firefox, or Edge
- Browser extensions can interfere with CSP

### 4. Capture Evidence

- Save console log showing failures
- Note specific error messages
- Share with development team

### 5. Investigate Further

Possible issues:

- Vercel build cache (may need to clear)
- Browser cache (hard refresh required)
- Additional Firebase domains not yet discovered
- CDN propagation delay (wait 5-10 minutes)

---

## EXPECTED TIMELINE

| Time | Event | Status |
|------|-------|--------|
| 18:45 | Git push completed | ✅ Done |
| 18:48 | Vercel build started | ⏳ In progress |
| 18:51 | Vercel deployment live | ⏳ Expected |
| 18:55 | Verification ready | ⏳ Ready to test |

**Current Time:** October 13, 2025 18:48  
**Status:** Waiting for Vercel deployment (~3 minutes remaining)

---

## QUICK REFERENCE

**Production URL:** <https://wedding-website-sepia-ten.vercel.app>  
**Commit:** 9e7d3e8  
**File Changed:** `site/pages/_document.js`  
**Change:** Added explicit base domains to CSP (firebase.googleapis.com, firebaseinstallations.googleapis.com)

**Expected Outcome:** Firebase/Firestore connectivity restored, guestbook realtime sync working.

---

**Generated:** October 13, 2025 18:48  
**Version:** 1.0  
**For:** Austin Porada (@bbasketballer75)
