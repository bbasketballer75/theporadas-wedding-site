# Photo Upload End-to-End Test Plan

**Date:** October 2, 2025  
**Status:** Ready to Test  
**Supabase Status:** ✅ Authenticated, RLS Policies Active, Bucket Ready

---

## 🎯 Test Objectives

Verify complete photo/video upload flow:

1. ✅ File selection and validation
2. ✅ Image compression (browser-image-compression)
3. ✅ Video compression (FFmpeg.wasm - optional, 30MB)
4. ✅ Upload to Supabase Storage
5. ✅ Metadata saved to Firestore
6. ✅ Real-time display in Gallery
7. ✅ Lightbox modal functionality
8. ✅ Filter tabs (All/Photos/Videos)
9. ✅ Infinite scroll (20+ items)

---

## 🧪 Test Suite

### Test 1: Upload Page Access ✅

**Steps:**

1. Open: <http://localhost:3000/upload>
2. Verify page loads correctly
3. Check for PhotoUpload component

**Expected:**

- Upload page displays
- "Share Your Photos & Videos" heading visible
- File drop zone visible
- No console errors

---

### Test 2: Image Upload (Small)

**Test File:** Any JPEG/PNG < 5MB

**Steps:**

1. Click file drop zone
2. Select small image file (< 5MB)
3. Click "Upload" button
4. Watch progress bar
5. Wait for completion message

**Expected:**

- ✅ File selected successfully
- ✅ Progress: 10% → 15% (compression) → 30% (upload start) → 70% (upload complete) → 80% (URL) → 100% (Firestore)
- ✅ Success message: "Photo uploaded successfully!"
- ✅ File reset (drop zone empty again)
- ⏱️ Duration: 2-5 seconds

**Verify in Console:**

```
[PhotoUpload] Compressing image...
[PhotoUpload] Saving metadata to Firestore...
[PhotoUpload] Firestore document created: <docId>
```

---

### Test 3: Image Upload (Large)

**Test File:** JPEG/PNG 10-20MB

**Steps:**

1. Select large image (10-20MB)
2. Upload
3. Monitor compression progress
4. Verify compressed size

**Expected:**

- ✅ Compression reduces file size significantly (30-70% smaller)
- ✅ Upload completes successfully
- ✅ Console shows compression savings percentage
- ⏱️ Duration: 5-10 seconds

**Check Compression:**

- Original: 15MB → Compressed: 5MB (67% savings) ✅
- Progress bar shows compression phase (10-25%)

---

### Test 4: Video Upload (Small)

**Test File:** MP4 < 20MB

**Steps:**

1. Select small video file
2. Upload
3. Monitor progress
4. Verify metadata

**Expected:**

- ✅ Video compression may be skipped (optional)
- ✅ Upload completes
- ✅ Firestore metadata includes: `uploadStatus: 'pending'`
- ✅ Console: "Video will be automatically uploaded to YouTube by Firebase Function"
- ⏱️ Duration: 5-15 seconds

**Note:** YouTube upload happens in background via Firebase Function

---

### Test 5: Video Upload (Large) - Optional

**Test File:** MP4 20-50MB

**Steps:**

1. Select large video
2. Upload (compression will run if FFmpeg loaded)
3. Monitor progress (may take 30+ seconds)

**Expected:**

- ⚠️ FFmpeg.wasm (30MB) loads on first video upload
- ✅ Compression may reduce file size (or skip if too complex)
- ✅ Upload completes
- ⏱️ Duration: 30-60 seconds (first time with FFmpeg load)

---

### Test 6: File Validation

**Test Invalid Files:**

| File Type | Expected Behavior |
|-----------|-------------------|
| .txt file | ❌ Error: "Invalid file type. Please upload an image or video." |
| 100MB file | ❌ Error: "File too large. Maximum size is 50MB." |
| .zip file | ❌ Error: "Invalid file type." |

**Steps:**

1. Try uploading invalid file types
2. Verify error messages appear
3. Verify upload button disabled

---

### Test 7: Gallery Real-Time Display

**Steps:**

1. After uploading photo (Test 2)
2. Navigate to home page: <http://localhost:3000>
3. Scroll to Gallery section
4. Look for uploaded photo

**Expected:**

- ✅ Photo appears in Gallery immediately (real-time Firestore listener)
- ✅ No page refresh required
- ✅ Thumbnail loads correctly
- ✅ Upload timestamp visible

**Verify:**

- Open Browser DevTools → Console
- Check for Firestore onSnapshot update log

---

### Test 8: Lightbox Modal

**Steps:**

1. In Gallery section
2. Click on uploaded photo thumbnail
3. Verify lightbox opens
4. Press ESC key

**Expected:**

- ✅ Full-screen modal opens
- ✅ Large image displayed
- ✅ Close button (X) visible
- ✅ ESC key closes modal
- ✅ Click outside closes modal (if implemented)
- ✅ No scroll on body when modal open

---

### Test 9: Filter Tabs

**Steps:**

1. In Gallery section
2. Click "Photos" tab
3. Verify only images visible
4. Click "Videos" tab
5. Verify only videos visible
6. Click "All" tab
7. Verify all media visible

**Expected:**

- ✅ Tabs switch smoothly
- ✅ Active tab has gradient styling
- ✅ Filter works correctly
- ✅ Counts update (e.g., "Photos (5)")

---

### Test 10: Infinite Scroll

**Requirements:** 20+ photos in Gallery

**Steps:**

1. Upload 20+ small test images
2. Navigate to Gallery section
3. Scroll down slowly
4. Watch for new items loading

**Expected:**

- ✅ Initial load: 20 items
- ✅ At 200px from bottom: Loading spinner appears
- ✅ Next batch loads (20 more items)
- ✅ Scroll continues smoothly
- ✅ At end: "End of gallery" message

**Verify:**

- Check console for IntersectionObserver trigger logs
- No duplicate items loaded

---

### Test 11: Supabase Storage Verification

**Steps:**

1. Open Supabase Dashboard
2. Navigate to Storage → wedding-photos bucket
3. Check uploads/ folder

**Expected:**

- ✅ All uploaded files visible in Supabase
- ✅ Filenames match pattern: `<timestamp>_<random>.jpg`
- ✅ Public URLs work (paste in browser)
- ✅ File sizes match compressed sizes

**Verify URL:**

```
https://shegniwzcjkqfsrgvajs.supabase.co/storage/v1/object/public/wedding-photos/uploads/<filename>
```

---

### Test 12: Firestore Metadata Verification

**Steps:**

1. Open Firebase Console
2. Navigate to Firestore Database
3. Check `wedding-photos` collection

**Expected Metadata Fields:**

```json
{
  "url": "https://shegniwzcjkqfsrgvajs.supabase.co/...",
  "name": "IMG_1234.jpg",
  "type": "image/jpeg",
  "size": 1234567,
  "originalSize": 5678901,
  "path": "uploads/1759433568639_abc123.jpg",
  "compressed": true,
  "compressionSavings": "78.3%",
  "timestamp": "<serverTimestamp>",
  "uploadStatus": "completed"
}
```

**For Videos:**

```json
{
  ...
  "uploadStatus": "pending",
  "youtubeId": null,
  "youtubeUrl": null,
  "processingStartedAt": null,
  "processedAt": null
}
```

---

### Test 13: Error Handling

**Test Error Scenarios:**

#### Scenario A: Network Failure

1. Disconnect internet
2. Try to upload
3. **Expected:** Error message: "Upload failed. Please try again."

#### Scenario B: Firestore Permission Error

1. (Simulate by temporarily disabling Firestore rules)
2. Upload file
3. **Expected:** Supabase upload succeeds, Firestore fails with error

#### Scenario C: Invalid Supabase Credentials

1. (Test already passed during setup)
2. **Expected:** Upload fails with authentication error

---

### Test 14: Performance Metrics

**Measure:**

- Image compression time (< 3 seconds for 10MB image)
- Upload time to Supabase (< 5 seconds for 5MB file)
- Firestore write time (< 1 second)
- Gallery real-time update latency (< 2 seconds)

**Tools:**

- Browser DevTools → Network tab
- Console.log timestamps
- Chrome Performance profiler

---

### Test 15: Mobile Responsive (Bonus)

**Steps:**

1. Open DevTools → Device Toolbar
2. Select iPhone 12
3. Navigate to /upload
4. Test file selection (camera or gallery)

**Expected:**

- ✅ Upload UI responsive
- ✅ Progress bar visible
- ✅ Touch interactions work
- ✅ Gallery displays correctly

---

## ✅ Success Criteria

**All tests must pass:**

- ✅ Image uploads work (small + large)
- ✅ Video uploads work
- ✅ Compression reduces file sizes
- ✅ Supabase Storage receives files
- ✅ Firestore metadata saved correctly
- ✅ Gallery displays uploads in real-time
- ✅ Lightbox modal works
- ✅ Filter tabs work
- ✅ Infinite scroll works (if 20+ items)
- ✅ File validation works
- ✅ Error handling graceful

---

## 🐛 Troubleshooting

### Issue: Upload fails with "new row violates row-level security policy"

**Solution:** RLS policies not applied. Re-run: `SUPABASE-RLS-SETUP.md`

### Issue: "wedding-photos bucket not found"

**Solution:** Bucket doesn't exist. Create in Supabase Dashboard → Storage

### Issue: Gallery doesn't update in real-time

**Solution:** Firestore listener not working. Check:

1. Firebase credentials in `.env.local`
2. Console for Firestore errors
3. GalleryDisplay component onSnapshot listener

### Issue: Compression takes too long (> 10 seconds)

**Solution:** Large file or slow device. Expected for 20MB+ files.

### Issue: Video upload fails

**Solution:** FFmpeg.wasm (30MB) may not load. Check:

1. Console for FFmpeg errors
2. Network tab for WASM download
3. Try smaller video first

---

## 📊 Test Results Template

```markdown
## Test Results - October 2, 2025

**Tester:** [Your Name]
**Environment:** Windows, Chrome, localhost:3000

| Test | Status | Duration | Notes |
|------|--------|----------|-------|
| Test 1: Upload Page Access | ✅ PASS | - | Page loads correctly |
| Test 2: Image Upload (Small) | ✅ PASS | 3s | 2MB → 500KB (75% savings) |
| Test 3: Image Upload (Large) | ✅ PASS | 8s | 15MB → 4MB (73% savings) |
| Test 4: Video Upload (Small) | ✅ PASS | 12s | No compression, uploaded directly |
| Test 5: Video Upload (Large) | ⏭️ SKIP | - | Optional test |
| Test 6: File Validation | ✅ PASS | - | Error messages correct |
| Test 7: Gallery Real-Time | ✅ PASS | 1s | Firestore listener working |
| Test 8: Lightbox Modal | ✅ PASS | - | ESC key works |
| Test 9: Filter Tabs | ✅ PASS | - | All filters work |
| Test 10: Infinite Scroll | ⏭️ SKIP | - | Need 20+ photos |
| Test 11: Supabase Verification | ✅ PASS | - | Files visible in dashboard |
| Test 12: Firestore Verification | ✅ PASS | - | Metadata correct |
| Test 13: Error Handling | ✅ PASS | - | Graceful error messages |
| Test 14: Performance | ✅ PASS | - | Within targets |
| Test 15: Mobile Responsive | ✅ PASS | - | Works on iPhone 12 |

**Overall:** ✅ 13/13 PASS (2 skipped)
**Ready for Production:** YES
```

---

## 🚀 Next Steps After Testing

1. ✅ **Mark Tasks 6-7 complete** in TODO list
2. → **Start Task 12:** Guest Name Collection
   - Prompt for name before upload
   - Store in localStorage
   - Include in Firestore metadata
3. → **Start Task 13:** Photo Moderation Dashboard
   - Admin page at `/admin/moderation`
   - Approve/reject uploads
   - Delete inappropriate content

---

**Ready to Test!** Open <http://localhost:3000/upload> and start with Test 2 (Image Upload - Small). 📸✨
