# ⚠️ SUPABASE SETUP REQUIRED - Photo Upload Blocked

## 🚫 Current Issue

**Supabase authentication failed**: `signature verification failed`

The anon key in `.env.local` is either:

- Incorrect format
- From wrong project
- Expired or revoked

---

## ✅ How to Fix (5 minutes)

### Step 1: Get Correct Anon Key

1. **Go to Supabase Dashboard**: <https://supabase.com/dashboard>
2. **Select your project**: `theporadas-wedding` (or create new project)
3. **Navigate to**: Project Settings → API (left sidebar)
4. **Copy the API keys**:
   - **Project URL**: Should match `https://shegniwzcjkqfsrgvajs.supabase.co`
   - **Project API Key (anon, public)**: Long JWT starting with `eyJ...`

### Step 2: Update `.env.local`

Open `site/.env.local` and replace:

```env
NEXT_PUBLIC_SUPABASE_URL=https://shegniwzcjkqfsrgvajs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (paste your FULL anon key here)
```

**IMPORTANT**:

- ✅ Anon key should be ~200+ characters long
- ✅ Must start with `eyJ` (JWT format)
- ❌ DO NOT use service_role key (security risk!)
- ❌ NO leading/trailing spaces

### Step 3: Create Storage Bucket

In Supabase Dashboard:

1. **Go to**: Storage (left sidebar)
2. **Click**: "New bucket"
3. **Name**: `wedding-photos`
4. **Public bucket**: ✅ YES (enable)
5. **File size limit**: 50MB
6. **Allowed MIME types**: Leave default (all)
7. **Click**: "Save"

### Step 4: Test Connection

```bash
# From project root:
cd P:\Dev\theporadas_site

# Set env vars and run test:
$env:NEXT_PUBLIC_SUPABASE_URL='your_url_here'
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY='your_anon_key_here'
node site/lib/supabaseTest.js
```

**Expected output**:

```
✓ Supabase client initialized
✓ Found X bucket(s)
✓ "wedding-photos" bucket exists
✓ Upload successful!
✓ Public URL generated
✓ Test file deleted
✅ All tests passed!
```

---

## 🔒 Storage Security Rules (Optional)

After bucket created, add these rules in **Storage → Policies**:

### Rule 1: Public Read Access

```sql
-- Allow anyone to read photos
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'wedding-photos' );
```

### Rule 2: Authenticated Upload

```sql
-- Allow uploads (we'll add guest name validation later)
CREATE POLICY "Allow uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'wedding-photos' );
```

### Rule 3: File Size Limit

```sql
-- Limit file size to 50MB
CREATE POLICY "File size limit"
ON storage.objects FOR INSERT
WITH CHECK ( 
  bucket_id = 'wedding-photos' 
  AND (octet_length(decode(content, 'base64'))) < 50000000
);
```

---

## 📋 What's Already Built

✅ **PhotoUpload.jsx**: Fully implemented

- File selection + drag-drop UI
- Image compression (1MB target, WebP)
- Video compression (FFmpeg.wasm, 720p)
- Progress tracking
- Error handling

✅ **Upload page** (`/upload`): Complete with success messages

✅ **Compression libraries**:

- `browser-image-compression`: ^2.0.2
- `@ffmpeg/ffmpeg`: ^0.12.15

✅ **Firestore metadata**: Saves upload info to `wedding-photos` collection

---

## 🎯 Once Fixed - Next Tasks

After Supabase setup complete:

1. ✅ Test photo upload (image → compress → Supabase → Firestore)
2. ✅ Test video upload (video → compress → Supabase → YouTube trigger)
3. ✅ Verify gallery displays uploaded photos
4. ✅ Add real-time updates (Firestore listeners)
5. ✅ Implement photo lightbox modal
6. ✅ Add gallery filters (All/Images/Videos)

---

## 🆘 Need Help?

If you get stuck:

1. **Verify Project URL matches**: Check Supabase dashboard Project Settings
2. **Regenerate anon key**: Project Settings → API → Reset anon key
3. **Check bucket exists**: Storage section should show "wedding-photos"
4. **Test in browser**: Open <http://localhost:3000/upload> (dev server running)

---

**Ready to continue?** Just provide the correct anon key and I'll test the upload flow immediately! 🚀
