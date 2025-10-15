# Firebase Storage Setup Guide

## 🎯 Complete Setup Steps

### **Step 1: Enable Storage in Console** ⏰ **Do This First!**

**URL:** <https://console.firebase.google.com/project/the-poradas-2025-813c7/storage>

1. Click **"Get Started"**
2. Select **"Production mode"** → Click **"Next"**
3. Choose **"us-central1"** location → Click **"Done"**
4. Wait 30-60 seconds for bucket creation

**✅ Success:** You'll see empty Storage dashboard

---

### **Step 2: Deploy Storage Rules**

Run this command **after** enabling Storage:

```powershell
firebase deploy --only storage
```

**Expected Output:**

```
=== Deploying to 'the-poradas-2025-813c7'...

i  deploying storage
i  storage: uploading rules storage.rules...
✔  storage: released rules storage.rules to firebase.storage/the-poradas-2025-813c7.appspot.com

✔  Deploy complete!
```

---

### **Step 3: Test Upload Functionality**

Test that guests can upload files:

```powershell
# Option 1: Use Firebase Console
# Go to Storage → Files tab → Try uploading manually

# Option 2: Test from website
# Go to your gallery page and try uploading
```

---

## 📸 **What Your Storage Rules Do**

Your `storage.rules` file provides:

### ✅ **Gallery Uploads** (`/gallery/` folder)

- **Who can upload:** Anyone (guests don't need login)
- **File types:** Images and videos only
- **Max size:** 50 MB per file
- **Who can read:** Everyone (public gallery)

```javascript
// Example upload path:
// gs://the-poradas-2025-813c7.appspot.com/gallery/photo1.jpg
```

### ✅ **Thumbnails** (`/thumbnails/` folder)

- **Who can read:** Everyone
- **Who can write:** Only Firebase Functions (automatic)
- **Purpose:** Optimized smaller versions for performance

### 🔒 **Security Features**

- ✅ File size limit (50 MB) prevents abuse
- ✅ Content type validation (only images/videos)
- ✅ Public read (for guest viewing)
- ✅ All other paths blocked by default

---

## 🎨 **How Guests Will Use It**

### **Upload Flow:**

1. Guest visits: `https://the-poradas-2025-813c7.web.app/gallery`
2. Clicks **"Upload Photos"** button
3. Selects files from device
4. Files upload to `/gallery/` folder in Storage
5. Firebase Function automatically generates thumbnails
6. Gallery updates in real-time for all guests

### **Storage Structure:**

```
the-poradas-2025-813c7.appspot.com/
├── gallery/
│   ├── photo_001.jpg (original - 5 MB)
│   ├── photo_002.jpg (original - 3 MB)
│   ├── video_001.mp4 (original - 45 MB)
│   └── ...
└── thumbnails/
    ├── photo_001_thumb.jpg (optimized - 200 KB)
    ├── photo_002_thumb.jpg (optimized - 150 KB)
    └── ...
```

---

## 🚀 **Next Steps After Setup**

### **1. Deploy Firebase Functions** (Optional but Recommended)

Enables automatic thumbnail generation:

```powershell
firebase deploy --only functions
```

### **2. Test Gallery Upload**

1. Open: <https://the-poradas-2025-813c7.web.app/gallery>
2. Try uploading a test photo
3. Verify it appears in Firebase Console → Storage

### **3. Monitor Usage**

Check Storage usage in console:

- **Free tier:** 5 GB storage, 1 GB/day downloads
- **URL:** <https://console.firebase.google.com/project/the-poradas-2025-813c7/storage>

---

## 🆘 **Troubleshooting**

### **Error: "Firebase Storage has not been set up"**

**Fix:** Complete Step 1 (enable Storage in console first)

### **Error: "Permission denied" when uploading**

**Fix:** Deploy storage rules with `firebase deploy --only storage`

### **Uploads work but thumbnails don't generate**

**Fix:** Deploy functions with `firebase deploy --only functions`

### **"Storage quota exceeded"**

**Solution:** Upgrade to Blaze plan (pay-as-you-go, very affordable)

---

## 💰 **Pricing Estimates**

### **Free Tier (Spark Plan):**

- ✅ 5 GB storage
- ✅ 1 GB/day downloads
- ✅ ~50 operations/day

**Good for:** Testing, small weddings (~100 guests, ~500 photos)

### **Blaze Plan (Pay-as-you-go):**

- **Storage:** $0.026/GB/month
- **Download:** $0.12/GB
- **Operations:** $0.05/10,000 operations

**Example:** 200 guests, 2000 photos (10 GB total):

- Storage: $0.26/month
- Downloads (all guests view once): ~$2.40
- **Total:** ~$3/month

---

## ✅ **Completion Checklist**

- [ ] Step 1: Enable Storage in Firebase Console
- [ ] Step 2: Deploy storage rules (`firebase deploy --only storage`)
- [ ] Step 3: Test upload from website
- [ ] Step 4: (Optional) Deploy functions for thumbnails
- [ ] Step 5: Monitor usage and adjust rules if needed

---

**🎉 Once complete, guests will be able to upload wedding photos directly to your website!**
