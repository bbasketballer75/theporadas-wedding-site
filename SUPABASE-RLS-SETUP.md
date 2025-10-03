# Supabase Row Level Security (RLS) Setup

## 🔒 Issue Detected

**Error:** `new row violates row-level security policy`

**Cause:** Supabase Storage has Row Level Security (RLS) enabled by default. The `wedding-photos` bucket exists but doesn't have policies allowing anonymous users to upload.

---

## ✅ Solution: Add Storage Policies

### Step 1: Navigate to Storage Policies

1. Open: <https://supabase.com/dashboard/project/shegniwzcjkqfsrgvajs/storage/policies>
2. Or: **Supabase Dashboard → Storage → Policies**

### Step 2: Create Upload Policy for `wedding-photos`

Click **"New Policy"** on the `wedding-photos` bucket and configure:

#### Policy 1: Allow Public Uploads

```sql
-- Policy Name: Allow public uploads
-- Allowed operation: INSERT
-- Target roles: public

CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'wedding-photos');
```

**Or use the GUI:**

- **Policy name:** `Allow public uploads`
- **Allowed operation:** `INSERT` (check the box)
- **Target roles:** `public` (anon users)
- **Policy definition:** `bucket_id = 'wedding-photos'`

#### Policy 2: Allow Public Reads (for viewing photos)

```sql
-- Policy Name: Allow public reads
-- Allowed operation: SELECT
-- Target roles: public

CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'wedding-photos');
```

**Or use the GUI:**

- **Policy name:** `Allow public reads`
- **Allowed operation:** `SELECT` (check the box)
- **Target roles:** `public` (anon users)
- **Policy definition:** `bucket_id = 'wedding-photos'`

#### Policy 3: Allow Public Deletes (optional - for moderation)

```sql
-- Policy Name: Allow public deletes
-- Allowed operation: DELETE
-- Target roles: public

CREATE POLICY "Allow public deletes"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'wedding-photos');
```

**Or use the GUI:**

- **Policy name:** `Allow public deletes`
- **Allowed operation:** `DELETE` (check the box)
- **Target roles:** `public`
- **Policy definition:** `bucket_id = 'wedding-photos'`

### Step 3: Save Policies

Click **"Save"** or **"Review"** → **"Save policy"**

---

## 🧪 Verify Setup

After adding policies, run:

```bash
cd site
node lib/supabaseUploadTest.js
```

**Expected output:**

```
✅ Upload successful!
✅ Public URL generated
✅ Found 1 file(s) in test/ folder
✅ Test file deleted
🎉 All tests passed! Supabase Storage is ready for photo uploads.
```

---

## 📝 Quick Copy-Paste SQL (Advanced)

If you prefer SQL editor, paste this in **SQL Editor**:

```sql
-- Allow public uploads to wedding-photos bucket
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'wedding-photos');

-- Allow public reads from wedding-photos bucket
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'wedding-photos');

-- Allow public deletes from wedding-photos bucket (optional)
CREATE POLICY "Allow public deletes"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'wedding-photos');
```

---

## 🔐 Security Notes

**Current setup:** Fully public bucket (anyone can upload/view/delete)

**For production, consider:**

1. **Authenticated uploads only:** Require Firebase Auth before upload
2. **File size limits:** Enforce in bucket settings (50MB recommended)
3. **Content moderation:** Review uploads before public display
4. **Rate limiting:** Prevent spam uploads (Firebase Functions)

**Trade-off for guest uploads:**

- ✅ Guests can upload without login (easier UX)
- ⚠️ Anyone with the URL can upload (needs moderation)
- ✅ Moderation dashboard (Task 12) will handle approval/rejection

---

## 🚀 Next Steps

1. ✅ Create policies (see above)
2. ✅ Run `node lib/supabaseUploadTest.js` to verify
3. ✅ Test photo upload at <http://localhost:3000>
4. ✅ Verify photos appear in Gallery section
5. → Continue to Task 11 (Guest name collection)

---

**Last Updated:** October 2, 2025
**Status:** Ready to implement
