# Asset Collection Guide - The Poradas Wedding Website

**Date:** October 15, 2025  
**Status:** 🔴 URGENT - Assets needed before final deployment  
**Deadline:** As soon as possible

---

## 📦 What We Need From You

Your new single-page wedding site is **complete and ready to go**, but we need **real photos and videos** to replace the placeholder images. Below is a checklist of every asset needed.

---

## ✅ Asset Checklist

### 1. Engagement Photos (6+ images)

**Section:** Engagement Gallery (Section 2)  
**Format:** JPEG, PNG, or HEIC  
**Quantity:** Minimum 6 images (more is better!)  
**Size:** 1200-2000px width recommended

**File Names:**

```
engagement-1.jpg
engagement-2.jpg
engagement-3.jpg
engagement-4.jpg
engagement-5.jpg
engagement-6.jpg
(+ any additional photos)
```

**Upload to:** `/site/public/images/engagement/`

**Tips:**

- Mix of close-ups and full-body shots work best
- Variety of locations/settings creates visual interest
- First image will be larger in the grid (feature photo)

---

### 2. Ring Photos (3 images)

**Section:** Rings Showcase (Section 3)  
**Format:** JPEG or PNG  
**Quantity:** Exactly 3 images  
**Size:** 800-1200px (square aspect ratio preferred)

**File Names:**

```
both-rings.jpg       (both rings together, main shot)
jordyn-ring.jpg      (bride's ring close-up)
austin-ring.jpg      (groom's ring close-up)
```

**Upload to:** `/site/public/images/rings/`

**Tips:**

- Clean background (white, black, or wood grain)
- Good lighting (natural light or professional)
- Sharp focus on ring details
- Square crop works best for layout

---

### 3. Couple Portraits (2 images)

**Section:** Wedding Tree - The Couple (Section 4a)  
**Format:** JPEG or PNG  
**Quantity:** Exactly 2 images  
**Size:** 600-800px (square headshots)

**File Names:**

```
austin-portrait.jpg
jordyn-portrait.jpg
```

**Upload to:** `/site/public/images/couple/`

**Tips:**

- Individual headshots (not together)
- Smiling, looking at camera
- Circular crop will be applied (heads centered)
- Same lighting/style preferred for consistency

---

### 4. Parent Photos (4 images) ⭐ CRITICAL

**Section:** Wedding Tree - Parents (Section 4b)  
**Format:** JPEG or PNG  
**Quantity:** Exactly 4 images  
**Size:** 600-800px (portrait aspect ratio)

**File Names:**

```
austin-mom.jpg
austin-dad.jpg
jordyn-mom.jpg
jordyn-dad.jpg
```

**Upload to:** `/site/public/images/parents/`

**Tips:**

- Individual portraits (not couples)
- Professional or high-quality casual photos
- Smiling preferred
- Will be displayed in a unified grid (all 4 parents together)

---

### 5. Parent Video Messages (4 videos) ⭐ CRITICAL

**Section:** Wedding Tree - Parents (Section 4b)  
**Format:** MP4 (H.264 codec)  
**Quantity:** Exactly 4 videos  
**Size:** Max 50MB per file  
**Duration:** 1-3 minutes each recommended  
**Resolution:** 720p or 1080p

**File Names:**

```
austin-mom-message.mp4
austin-dad-message.mp4
jordyn-mom-message.mp4
jordyn-dad-message.mp4
```

**Upload to:** `/site/public/videos/parent-messages/`

**Content Ideas:**

- Wedding day message to the couple
- Favorite memory of Austin/Jordyn
- Advice for marriage
- Well-wishes and blessings

**Tips:**

- Good audio quality is essential
- Horizontal (landscape) orientation preferred
- Stable camera (tripod or phone stand)
- Well-lit (natural light or indoor lighting)
- Background doesn't need to be fancy
- 1-3 minutes is perfect length

---

### 6. Wedding Party Photos (8+ images)

**Section:** Wedding Tree - Wedding Party (Section 4c)  
**Format:** JPEG or PNG  
**Quantity:** 4 bridesmaids + 4 groomsmen (8 minimum)  
**Size:** 600-800px (portrait aspect ratio)

**File Names:**

**Bridesmaids:**

```
bridesmaid-1.jpg
bridesmaid-2.jpg
bridesmaid-3.jpg
bridesmaid-4.jpg
```

**Groomsmen:**

```
groomsman-1.jpg
groomsman-2.jpg
groomsman-3.jpg
groomsman-4.jpg
```

**Upload to:**

- `/site/public/images/wedding-party/bridesmaids/`
- `/site/public/images/wedding-party/groomsmen/`

**Additional Info Needed:**

For each person, provide:

- **Full name** (e.g., "Sarah Johnson")
- **Role** (e.g., "Maid of Honor", "Best Man", "Bridesmaid", "Groomsman")

**Format:**

```
Bridesmaids:
1. Name: Sarah Johnson, Role: Maid of Honor
2. Name: Emily Chen, Role: Bridesmaid
3. Name: Jessica Smith, Role: Bridesmaid
4. Name: Amanda Lee, Role: Bridesmaid

Groomsmen:
1. Name: Michael Porada, Role: Best Man
2. Name: David Brown, Role: Groomsman
3. Name: Chris Wilson, Role: Groomsman
4. Name: Tom Davis, Role: Groomsman
```

---

## 📁 File Organization

**Total files needed:**

- 6+ engagement photos
- 3 ring photos
- 2 couple portraits
- 4 parent photos
- 4 parent videos (⭐ CRITICAL)
- 8+ wedding party photos

**Total:** 27+ assets

**Folder structure:**

```
site/public/
├── images/
│   ├── engagement/
│   │   ├── engagement-1.jpg
│   │   ├── engagement-2.jpg
│   │   └── ... (6+ total)
│   ├── rings/
│   │   ├── both-rings.jpg
│   │   ├── jordyn-ring.jpg
│   │   └── austin-ring.jpg
│   ├── couple/
│   │   ├── austin-portrait.jpg
│   │   └── jordyn-portrait.jpg
│   ├── parents/
│   │   ├── austin-mom.jpg
│   │   ├── austin-dad.jpg
│   │   ├── jordyn-mom.jpg
│   │   └── jordyn-dad.jpg
│   └── wedding-party/
│       ├── bridesmaids/
│       │   └── bridesmaid-1.jpg ... bridesmaid-4.jpg
│       └── groomsmen/
│           └── groomsman-1.jpg ... groomsman-4.jpg
└── videos/
    └── parent-messages/
        ├── austin-mom-message.mp4
        ├── austin-dad-message.mp4
        ├── jordyn-mom-message.mp4
        └── jordyn-dad-message.mp4
```

---

## 🚀 How to Send Assets

### Option 1: Google Drive (RECOMMENDED for videos)

1. Create a Google Drive folder
2. Upload all files with proper names (as listed above)
3. Set sharing to "Anyone with the link can view"
4. Send link to developer

**Why this works:**

- Handles large video files (4 videos at ~50MB each = 200MB total)
- No file size limits
- Easy organization

### Option 2: Dropbox

Same as Google Drive - create folder, upload, share link

### Option 3: WeTransfer (for large files)

1. Go to wetransfer.com
2. Upload files (free up to 2GB)
3. Send transfer link

### Option 4: Email (small files only)

- Only works for photos (not videos - too large)
- Max 25MB per email
- Would need multiple emails

**Recommended:** Use Google Drive or Dropbox for everything

---

## ⏱️ Timeline

**Once we receive assets:**

1. **Day 1:** Replace placeholder images with real photos/videos (1-2 hours)
2. **Day 1-2:** Test all sections, verify quality, adjust if needed
3. **Day 2:** Deploy to production (Vercel auto-deploys from GitHub)
4. **Day 2:** Final testing on live site
5. **Day 3:** Share live site with guests! 🎉

**Total turnaround:** 2-3 days after receiving assets

---

## 📋 Pre-Deployment Checklist

Once assets are received, we'll:

- [ ] Replace all placeholder images
- [ ] Update wedding party names/roles
- [ ] Test all lightboxes/modals
- [ ] Verify video playback
- [ ] Test mobile responsiveness
- [ ] Run performance audit (Lighthouse)
- [ ] Test on multiple browsers
- [ ] Deploy to production
- [ ] Test live site
- [ ] Share URL with you!

---

## 🎯 Priority Assets

**If you can't provide everything at once, prioritize:**

1. **HIGHEST:** Parent videos (4 files) - most time-consuming to film
2. **HIGH:** Parent photos (4 files) - needed for same section
3. **HIGH:** Engagement photos (6 files) - large gallery section
4. **MEDIUM:** Ring photos (3 files) - smaller section
5. **MEDIUM:** Couple portraits (2 files) - smaller section
6. **LOW:** Wedding party photos (8 files) - can add later if needed

**Strategy:** Send high-priority assets first, we'll deploy with those, then add wedding party photos in a second deployment

---

## ❓ Questions?

**Common questions:**

**Q: What if I have more than 6 engagement photos?**  
A: Perfect! Send all of them. We can display 10-15 photos easily. More variety = better gallery.

**Q: What if parent videos are longer than 3 minutes?**  
A: That's fine! 3-5 minutes is still good. Just keep file size under 50MB (we can compress if needed).

**Q: Can I use iPhone photos?**  
A: Absolutely! Modern iPhones have excellent cameras. Just use the highest quality setting.

**Q: What if I don't have professional photos?**  
A: No problem! High-quality casual photos work great. The site design makes everything look elegant.

**Q: What format should videos be?**  
A: MP4 is best. iPhone videos are usually .MOV which also works. We'll convert if needed.

**Q: Can I update photos later?**  
A: Yes! We can swap photos anytime. Just send new files with same names.

---

## 📧 Send Assets To

**Developer:** GitHub Copilot (via Austin Porada)  
**Share link via:** Your preferred communication method (Slack, email, text, etc.)

---

**Let's get your beautiful wedding site live! 🎉💕**

Send those assets whenever you're ready, and we'll have your site deployed in 2-3 days! ✨

---

_Generated: October 15, 2025_  
_Wedding Site Developer: GitHub Copilot_
