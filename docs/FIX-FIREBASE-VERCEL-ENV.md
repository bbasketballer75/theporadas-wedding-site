# Fix Firebase Environment Variables in Vercel

## The Problem

Your Vercel deployment is using the WRONG Firebase project:

- ❌ Current (wrong): `the-poradas-2025-813c7`
- ✅ Correct: `theporadas-wedding`

This is causing all the Firestore 400 errors you see in the console.

## The Fix (5 Minutes)

Go to: <https://vercel.com/bbasketballer75s-projects/theporadas-wedding-site/settings/environment-variables>

### Update These 6 Variables

For each variable below:

1. Find it in the list
2. Click **⋯** (three dots) → **Edit**
3. Copy the new value below
4. Paste into Vercel
5. Make sure ✓ Production, ✓ Preview, ✓ Development are ALL checked
6. Click **Save**

---

### 1. NEXT_PUBLIC_FIREBASE_API_KEY

**New Value:**

```
AIzaSyDc4_5yqL1VvUnB5bO-u3drqU8YH6uHnOk
```

---

### 2. NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN

**New Value:**

```
theporadas-wedding.firebaseapp.com
```

---

### 3. NEXT_PUBLIC_FIREBASE_PROJECT_ID

**New Value:**

```
theporadas-wedding
```

---

### 4. NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

**New Value:**

```
theporadas-wedding.firebasestorage.app
```

---

### 5. NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID

**New Value:**

```
1090064583753
```

---

### 6. NEXT_PUBLIC_FIREBASE_APP_ID

**New Value:**

```
1:1090064583753:web:8d485f595e8fca7984c398
```

---

## After Updating All 6

1. Vercel will ask if you want to redeploy - click **Yes** or **Redeploy**
2. Wait 2-3 minutes for deployment to complete
3. Visit <https://theporadas.com/guestbook>
4. Open browser console (F12) - Firestore 400 errors should be GONE!

## Quick Copy-Paste Version

If Vercel lets you bulk edit, here's all 6 in order:

```
AIzaSyDc4_5yqL1VvUnB5bO-u3drqU8YH6uHnOk
theporadas-wedding.firebaseapp.com
theporadas-wedding
theporadas-wedding.firebasestorage.app
1090064583753
1:1090064583753:web:8d485f595e8fca7984c398
```
