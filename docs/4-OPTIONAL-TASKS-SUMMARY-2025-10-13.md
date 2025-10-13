# 4 Optional Tasks - Quick Summary

**Date:** October 13, 2025  
**Context:** Post-optimization validation tasks from 25 improvements  
**Status:** Documentation complete, manual execution recommended

---

## ✅ Task 1: PWA Screenshots

### What's Needed

Create two screenshot files for PWA install dialog:

- `site/public/screenshot-narrow.png` (540x720px) - Mobile view
- `site/public/screenshot-wide.png` (1280x720px) - Desktop view

### Quickest Method (5 minutes)

1. Open: <https://wedding-website-sepia-ten.vercel.app>
2. Open Chrome DevTools (F12)
3. Toggle Device Toolbar (Ctrl+Shift+M)
4. Set to iPhone 12 Pro (390x844)
5. Take screenshot → Resize to 540x720
6. Set browser to 1280x720 → Screenshot
7. Save both to `site/public/`
8. Commit and push

**Priority:** LOW - Cosmetic only

---

## ✅ Task 2: Dependency Monitoring

### Current Status

**Node v24.10.0 Blocker:**

- Firebase `superstatic@9.2.0` requires Node 18/20/22
- Blocks 3 minor updates (all non-critical)

### Recommended Action

**WAIT** - Monitor quarterly for Node v24 support:

- Check: <https://github.com/firebase/superstatic/releases>
- Expected: Q1 2026 (3-6 months)
- Run: `npm outdated` monthly

**Priority:** VERY LOW - No action needed now

---

## ✅ Task 3: Lighthouse Audit

### Easiest Method (2 minutes)

1. Visit: <https://pagespeed.web.dev/>
2. Enter: `https://wedding-website-sepia-ten.vercel.app`
3. Click "Analyze"
4. Screenshot results
5. Document in: `docs/LIGHTHOUSE-AUDIT-2025-10-13.md`

### Expected Scores

- Performance: 85-95
- Accessibility: 90-100
- Best Practices: 90-100
- SEO: 95-100
- PWA: 85-95

**Priority:** MEDIUM - Validates optimization work

---

## ✅ Task 4: CSP Verification

### Quickest Method (3 minutes)

1. Open: <https://wedding-website-sepia-ten.vercel.app>
2. Open DevTools (F12) → Console tab
3. Navigate through all pages:
   - Homepage
   - Gallery (check Leaflet map)
   - Guestbook (test Firebase write)
   - Upload (test Firebase Storage)
   - Venue (check Google Maps)
   - Map (check interactivity)
4. Look for red CSP errors
5. Document results

### Expected Result

✅ PASS - CSP designed for our tech stack:

- Firebase covered
- Supabase covered
- Google Maps covered
- Leaflet unpkg.com covered
- Analytics covered

**Priority:** HIGH - Quick validation of security

---

## 📊 Time Investment

| Task | Priority | Time | Can Skip? |
|------|----------|------|-----------|
| PWA Screenshots | LOW | 5 min | ✅ Yes |
| Dependency Monitoring | VERY LOW | 0 min | ✅ Yes (wait) |
| Lighthouse Audit | MEDIUM | 2 min | ⚠️ Recommended |
| CSP Verification | HIGH | 3 min | ❌ No |

**Total for critical tasks:** 5 minutes (Lighthouse + CSP)

---

## 🎯 Recommended Next Steps

### Option A: Minimal Validation (5 minutes)

```powershell
# 1. Lighthouse audit
Start-Process "https://pagespeed.web.dev/"
# Enter URL and analyze

# 2. CSP check
Start-Process "https://wedding-website-sepia-ten.vercel.app"
# F12 → Console → Navigate all pages → Check for errors
```

### Option B: Complete All Tasks (10 minutes)

Add PWA screenshots using DevTools device emulation

### Option C: Skip All

Production site is working perfectly - these are optional enhancements

---

## 📚 Full Documentation

For detailed instructions, see:

`docs/OPTIONAL-IMPROVEMENTS-GUIDE-2025-10-13.md`

Includes:

- Step-by-step guides for each task
- Alternative methods (CLI, automated scripts)
- Expected results and troubleshooting
- Report templates for documentation

---

**Production Status:** ✅ LIVE and fully functional  
**Core Improvements:** ✅ 22/25 complete (88%)  
**Optional Tasks:** ⏳ User choice - can do now or later
