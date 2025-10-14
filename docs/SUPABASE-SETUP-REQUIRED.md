# Supabase Setup Required - October 13, 2025

## Current Issue

The website is displaying warnings that Supabase environment variables are missing:

```
⚠️ Supabase environment variables are missing. Photo and video upload features are currently disabled.
   Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to site/.env.local.
```

## What's Already Done

✅ **Supabase URL added** to `site/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://shegniwzcjkqfsrgvajs.supabase.co
```

⚠️ **Anon Key missing** - placeholder added, needs real value

## Action Required (5 minutes)

### Step 1: Get Supabase Anon Key

1. **Go to Supabase Dashboard:**
   <https://supabase.com/dashboard/project/shegniwzcjkqfsrgvajs/settings/api>

2. **Login** with your Supabase account

3. **Copy the "anon public" key**:
   - Located under "Project API keys"
   - Labeled: "anon public"
   - Format: Starts with `eyJ`, 200+ characters long
   - **NOT the service_role key** (security risk!)

### Step 2: Update .env.local

1. **Open file:** `site/.env.local`

2. **Find the line:**

   ```env
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

3. **Replace** `your_anon_key_here` with the actual key:

   ```env
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Step 3: Restart Dev Server

1. **Stop the current dev server:** `Ctrl+C` in terminal
2. **Restart:** `npm run dev`
3. **Verify:** Warning should disappear, upload features enabled

## What This Enables

Once configured, the following features will be operational:

### Photo Upload Page (`/upload`)

- ✅ Drag-and-drop photo/video upload
- ✅ Multiple file selection
- ✅ File validation (format, size)
- ✅ Upload progress tracking
- ✅ Success confirmation

### Gallery Page (`/gallery`)

- ✅ Display uploaded photos
- ✅ Image grid layout
- ✅ Lightbox viewing
- ✅ Responsive design

### Storage Backend

- ✅ Supabase Storage bucket: `wedding-photos`
- ✅ Row Level Security (RLS) policies
- ✅ Public read access
- ✅ Authenticated upload
- ✅ 50MB max file size (Supabase free tier)

## Verification

After adding the key and restarting, verify setup:

### Option 1: Check Website

1. Go to: <http://localhost:3000/upload>
2. Warning should be gone
3. Upload area should be interactive

### Option 2: Run Test Script

```powershell
cd site
node lib/supabaseTest.js
```

**Expected output:**

```
🧪 Testing Supabase Connection...

✅ Environment variables are set
✅ Supabase client created successfully
✅ Connection to Supabase is working!

📊 Supabase Status:
  URL: https://shegniwzcjkqfsrgvajs.supabase.co
  Status: Connected ✅

✅ All tests passed! Supabase is ready for photo uploads.
```

## Troubleshooting

### Issue: "Invalid API key" error

**Cause:** Wrong key copied or service_role key used

**Solution:**

1. Double-check you copied the "anon public" key
2. Verify key starts with `eyJ`
3. Ensure no extra spaces or line breaks

### Issue: Warning still appears after restart

**Cause:** Dev server not fully restarted or cached

**Solution:**

1. Stop dev server: `Ctrl+C`
2. Clear Next.js cache: `Remove-Item -Recurse -Force site/.next`
3. Restart: `cd site && npm run dev`

### Issue: "Project not found" error

**Cause:** Wrong project URL or project doesn't exist

**Solution:**

1. Verify project exists: <https://supabase.com/dashboard>
2. Confirm URL matches: `https://shegniwzcjkqfsrgvajs.supabase.co`
3. Check project ID: `shegniwzcjkqfsrgvajs`

## Security Notes

### Safe to Commit (Public Keys)

- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Public project URL
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon/public key (protected by RLS)

These are **safe for client-side code** and protected by Supabase Row Level Security policies.

### Never Commit (Secret Keys)

- ❌ `SUPABASE_SERVICE_KEY` - Full admin access
- ❌ `SUPABASE_SERVICE_ROLE_KEY` - Bypass RLS

Keep these in server-side environment variables only.

## Project Information

**Supabase Project:**

- Name: `theporadas-wedding`
- Project ID: `shegniwzcjkqfsrgvajs`
- Region: US East (likely)
- Plan: Free tier

**Dashboard Links:**

- Project Dashboard: <https://supabase.com/dashboard/project/shegniwzcjkqfsrgvajs>
- API Settings: <https://supabase.com/dashboard/project/shegniwzcjkqfsrgvajs/settings/api>
- Storage Buckets: <https://supabase.com/dashboard/project/shegniwzcjkqfsrgvajs/storage/buckets>

## Related Documentation

- **Firebase vs Supabase:** Firebase for authentication/Firestore, Supabase for file storage
- **MASTER-ARCHITECTURE-2025-10-04.md:** Complete system architecture
- **SESSION-COMPLETE-2025-10-02-EVENING.md:** Original Supabase setup notes

## Quick Reference

**Current Configuration Status:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://shegniwzcjkqfsrgvajs.supabase.co  ✅
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here                   ⚠️ NEEDS UPDATE
```

**After Update:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://shegniwzcjkqfsrgvajs.supabase.co  ✅
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...        ✅
```

---

**Status:** ⚠️ **SUPABASE KEY NEEDED**  
**Time Required:** 5 minutes to get key and update  
**Impact:** Enables photo/video upload functionality  
**Priority:** Medium (upload features currently disabled)

**Next Action:** Get anon key from Supabase dashboard and update .env.local
