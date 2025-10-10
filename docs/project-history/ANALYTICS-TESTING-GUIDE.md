# Firebase Analytics Testing Guide

**Status:** 🧪 Ready for Testing  
**Date:** October 2, 2025  
**Measurement ID:** G-KMCTJDDM1W

---

## Quick Start Testing

You should now have **TWO BROWSER WINDOWS** open:

1. **Firebase Console DebugView** (left side)
   - Shows real-time analytics events as they happen
   - Updates within seconds of user actions

2. **Live Wedding Site** (right side)
   - <https://theporadas.web.app>
   - Interact with the site to generate events

---

## Testing Workflow

### Step 1: Verify Analytics is Running

**In the live site (right window):**

1. Press **F12** to open DevTools
2. Click the **Console** tab
3. Look for this message:

   ```
   [Analytics] Initialized successfully
   ```

✅ **If you see this:** Analytics is working!  
❌ **If not:** Refresh the page and check again

---

### Step 2: Test Page View Events

**Action:** Navigate around the site

1. Scroll down to different sections
2. Click navigation links (Our Story, Gallery, Upload)
3. Watch the DebugView (left window)

**Expected in DebugView:**

```
Event: page_view
Parameters:
  - page_title: "Home"
  - page_path: "/"
```

---

### Step 3: Test Photo Upload

**Action:** Upload a test photo

1. Go to Upload section or page
2. Click "Choose Photos/Videos"
3. Select 1-2 test images (any photos from your computer)
4. Enter name: "Test Guest"
5. Click "Upload Photos"
6. Wait for success message

**Expected in DebugView:**

```
Event: guest_name_collection
Parameters:
  - name_provided: true

Event: photo_upload
Parameters:
  - file_type: "image"
  - file_size: 2048576
  - compression_savings: 23.5
  - uploader_name: "Test Guest"
```

---

### Step 4: Test Moderation Actions

**Action:** Approve the test photo

1. Go to `/admin/moderate` page
2. Find your uploaded photo (should be at top, status: pending)
3. Click **"Approve"** button
4. Watch the DebugView

**Expected in DebugView:**

```
Event: moderation_action
Parameters:
  - action: "approve"
  - photo_id: "abc123xyz"
```

**Additional Tests:**

- Click "Flag" on another photo → `moderation_action` with `action: "flag"`
- Click "Delete" on test photo → `moderation_action` with `action: "delete"`

---

### Step 5: Test Gallery Download

**Action:** Download all photos as ZIP

1. Go to Gallery page or section
2. Scroll to see approved photos
3. Click **"Download All Photos"** button
4. Wait for ZIP to generate and download
5. Watch the DebugView

**Expected in DebugView:**

```
Event: gallery_download
Parameters:
  - photo_count: 15
  - zip_size: 10485760
  - total_size_mb: 10.0
```

---

### Step 6: Test Navigation Clicks

**Action:** Click various navigation links

1. Click on navigation menu items:
   - Our Story
   - Gallery
   - Upload
   - Timeline
   - Venue
   - Guestbook
2. Watch the DebugView

**Expected in DebugView:**

```
Event: navigation_click
Parameters:
  - section_id: "our-story"
```

---

## Troubleshooting

### No Events Appearing in DebugView

**Check 1: Is Analytics Initialized?**

```
1. Open browser console (F12)
2. Look for: [Analytics] Initialized successfully
3. If missing: Refresh page and check again
```

**Check 2: Is Site Using New Build?**

```
1. Hard refresh the page: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. This clears cache and loads latest version
```

**Check 3: Enable Debug Mode**

```javascript
// In browser console, run:
sessionStorage.setItem('firebase_debug_mode', true);
location.reload();

// More detailed logs should appear
```

**Check 4: Check Network Tab**

```
1. Open DevTools (F12)
2. Click "Network" tab
3. Perform an action (upload photo, click nav)
4. Look for requests to: google-analytics.com/g/collect
5. Status should be 200 OK
```

---

### Events in Console But Not DebugView

**Common Causes:**

1. **Wrong Project Open**
   - Ensure DebugView is for: theporadas-wedding
   - Check URL: `.../project/theporadas-wedding/analytics/debugview`

2. **DebugView Not Refreshing**
   - Refresh the DebugView page
   - Close and reopen DebugView

3. **Ad Blocker Enabled**
   - Disable ad blocker (can block analytics)
   - Try incognito/private window

4. **VPN or Privacy Extensions**
   - Some privacy tools block analytics
   - Temporarily disable and test

---

### Browser Console Shows Errors

**Error: "Analytics not available"**

```
Solution: Hard refresh page (Ctrl+Shift+R)
This ensures latest build is loaded
```

**Error: "measurementId is required"**

```
Solution: Check .env.local has NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
Run: npm run build
Deploy: firebase deploy --only hosting
```

**Error: "initializeApp failed"**

```
Solution: Check all Firebase config values in .env.local
Ensure no typos or missing values
```

---

## Expected Events List

After testing all features, you should see these events in DebugView:

✅ **Automatic Events (Firebase Auto-Tracks):**

- `first_visit` - User's first visit to site
- `session_start` - Session begins
- `page_view` - Page loads

✅ **Custom Events (We Implemented):**

- `photo_upload` - Photo/video uploaded
- `guest_name_collection` - Guest name entered
- `gallery_download` - Photos downloaded as ZIP
- `moderation_action` - Admin flag/approve/delete
- `navigation_click` - Nav link clicked
- `gallery_filter` - Gallery filter changed
- `lightbox_interaction` - Photo viewed in lightbox
- `video_processing` - Video processing status
- `viewer_pin` - Map pin clicked
- `app_error` - Error occurred

---

## What Happens After Testing?

### Real-Time (Immediate)

- **DebugView:** Shows events within seconds
- **Console Logs:** Immediate confirmation
- **Network Tab:** See requests to Google Analytics

### Short-Term (4 Hours)

- **Real-Time Reports:** Recent activity dashboard
- View at: Firebase Console → Analytics → Real-Time

### Long-Term (24 Hours)

- **Full Analytics Dashboard:** Complete reports
- **Event Statistics:** Counts, trends, user paths
- **Demographic Data:** Countries, devices, browsers
- **Engagement Metrics:** Session duration, bounce rate

---

## Success Criteria

✅ **Testing Complete When:**

1. **Browser console shows:** `[Analytics] Initialized successfully`
2. **DebugView shows:** At least 3 different event types
3. **Upload test:** Photo uploads and events fire
4. **Moderation test:** Approve/flag/delete events fire
5. **Download test:** ZIP download event fires
6. **Navigation test:** Nav click events fire

If all 6 criteria pass: **Analytics is working perfectly!** 🎉

---

## Next Steps After Testing

### 1. Monitor for 24 Hours

Check Analytics dashboard tomorrow to see full reports:

- <https://console.firebase.google.com/project/theporadas-wedding/analytics>

### 2. Share with Wedding Guests

Send the link to family and friends:

- <https://theporadas.web.app>

### 3. Review Analytics Data

After guests use the site, analyze:

- Most popular features
- Upload patterns (when do guests upload?)
- Device types (mobile vs desktop)
- Geographic distribution

### 4. Optimize Based on Data

Use insights to improve:

- If mobile traffic is high → optimize mobile experience
- If uploads are low → improve upload UX
- If bounce rate is high → improve homepage engagement

---

## Quick Reference

### Links

- **Live Site:** <https://theporadas.web.app>
- **DebugView:** <https://console.firebase.google.com/project/theporadas-wedding/analytics/debugview>
- **Analytics Dashboard:** <https://console.firebase.google.com/project/theporadas-wedding/analytics>
- **Real-Time Reports:** <https://console.firebase.google.com/project/theporadas-wedding/analytics/realtime>

### Commands

```powershell
# Rebuild site
cd site
npm run build

# Redeploy
firebase deploy --only hosting

# View logs
firebase functions:log

# Open DebugView
Start-Process "https://console.firebase.google.com/project/theporadas-wedding/analytics/debugview"

# Open live site
Start-Process "https://theporadas.web.app"
```

---

## Testing Checklist

Use this checklist to track your testing:

- [ ] Browser console shows analytics initialized
- [ ] DebugView is open and connected
- [ ] Page view events appear on navigation
- [ ] Photo upload event fires with correct data
- [ ] Guest name collection event fires
- [ ] Moderation action events fire (approve/flag/delete)
- [ ] Gallery download event fires with photo count
- [ ] Navigation click events track correctly
- [ ] No errors in browser console
- [ ] Network tab shows requests to google-analytics.com

**When all checked:** Analytics is production-ready! ✅

---

**Created:** October 2, 2025  
**Status:** Ready for Testing  
**Version:** 1.0
