# Vercel Firebase Environment Variables Setup

## ❌ PROBLEM IDENTIFIED (October 14, 2025)

Browser console shows Firebase connecting to **WRONG project**:

```
projects%2Fthe-poradas-2025-813c7  ❌ WRONG
```

Should be:

```
projects%2Ftheporadas-wedding  ✅ CORRECT
```

**Root Cause:** Vercel has NO Firebase environment variables configured. The site is using old cached/fallback values.

## ✅ SOLUTION: Add Firebase Variables to Vercel

### Step 1: Go to Vercel Dashboard

1. Visit: <https://vercel.com/austins-projects-bb7c50ab/site/settings/environment-variables>
2. Log in if needed

### Step 2: Add These 7 Environment Variables

Click "Add New" for each variable and set these values:

#### 1. NEXT_PUBLIC_FIREBASE_API_KEY

```
AIzaSyDc4_5yqL1VvUnB5bO-u3drqU8YH6uHnOk
```

- Environment: ✅ Production, ✅ Preview, ✅ Development

#### 2. NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN

```
theporadas-wedding.firebaseapp.com
```

- Environment: ✅ Production, ✅ Preview, ✅ Development

#### 3. NEXT_PUBLIC_FIREBASE_PROJECT_ID

```
theporadas-wedding
```

- Environment: ✅ Production, ✅ Preview, ✅ Development

#### 4. NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

```
theporadas-wedding.firebasestorage.app
```

- Environment: ✅ Production, ✅ Preview, ✅ Development

#### 5. NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID

```
1090064583753
```

- Environment: ✅ Production, ✅ Preview, ✅ Development

#### 6. NEXT_PUBLIC_FIREBASE_APP_ID

```
1:1090064583753:web:8d485f595e8fca7984c398
```

- Environment: ✅ Production, ✅ Preview, ✅ Development

#### 7. NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID

```
G-KMCTJDDM1W
```

- Environment: ✅ Production, ✅ Preview, ✅ Development

### Step 3: Redeploy

After adding all 7 variables, you MUST redeploy:

**Option A: Vercel Dashboard**

1. Go to Deployments tab
2. Click "..." menu on latest deployment
3. Click "Redeploy"

**Option B: Command Line** (I can do this for you)

```bash
# Empty commit to force rebuild
git commit --allow-empty -m "chore: trigger rebuild with Firebase env vars"
git push
```

### Step 4: Verify (After Redeploy)

1. Wait 1-2 minutes for deployment
2. Visit: <https://theporadas.com/guestbook>
3. Open browser console (F12)
4. Look for Firebase URLs - should show `theporadas-wedding` ✅
5. Should see NO 400 errors ✅

## Why This Happened

The Vercel project was linked to the wrong directory initially. When you updated environment variables before, they were added to a different Vercel project. Now that we've properly linked the `site` directory, the environment variables are missing.

## Current Status

- ❌ Firebase variables: **NOT SET** in Vercel production
- ✅ Supabase variables: Already configured
- ✅ Local development: Working correctly with `.env.local`
- ❌ Production site: Using wrong Firebase project

## Next Steps

**I can help you:**

1. ✅ Create this documentation (DONE)
2. ⏳ Wait for you to add variables in Vercel dashboard
3. ⏳ Force redeploy after you confirm variables are added
4. ⏳ Verify console shows correct Firebase project

**You need to:**

1. Add all 7 Firebase environment variables in Vercel dashboard
2. Let me know when done
3. I'll trigger redeploy and verify

---

**Created:** October 14, 2025 8:54 PM EST  
**Last Updated:** October 14, 2025 8:54 PM EST
