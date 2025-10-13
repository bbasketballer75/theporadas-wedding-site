# Lighthouse Audit Instructions - October 13, 2025

**Goal:** Measure performance impact of 22 improvements completed on October 13, 2025  
**Target URL:** <https://wedding-website-sepia-ten.vercel.app>  
**Status:** ⏳ Awaiting manual execution

---

## 🎯 Quick Start (2 Minutes)

### Using PageSpeed Insights (Recommended)

1. **Open PageSpeed Insights:**

   ```powershell
   Start-Process "https://pagespeed.web.dev/"
   ```

2. **Enter URL:**

   ```text
   https://wedding-website-sepia-ten.vercel.app
   ```

3. **Click "Analyze"** and wait 30-60 seconds

4. **Screenshot Results** (Win+Shift+S) or click "Save Report"

5. **Document Scores** in this file (replace placeholders below)

---

## 📊 Expected Results

### Baseline (Pre-Improvements)

**Unknown** - No baseline audit performed before October 13 improvements

### Target Scores (Post-22 Improvements)

| Metric | Target | Rationale |
|--------|--------|-----------|
| **Performance** | 85-95 | font-display: swap, optimized images, Turbopack build |
| **Accessibility** | 90-100 | All images have alt text, proper ARIA labels |
| **Best Practices** | 90-100 | Console cleanup (20+ statements removed), CSP added |
| **SEO** | 95-100 | robots.txt updated, sitemap.xml present, meta tags |
| **PWA** | 85-95 | Service worker active, icons present, manifest.json |

---

## 📝 Results Template

**Once audit is complete, fill in:**

### Scores

- **Performance:** __/100
- **Accessibility:** __/100
- **Best Practices:** __/100
- **SEO:** __/100
- **PWA:** __/100

### Core Web Vitals

- **First Contentful Paint (FCP):** __.__ s
- **Largest Contentful Paint (LCP):** __.__ s (target: < 2.5s)
- **Total Blocking Time (TBT):** ___ ms
- **Cumulative Layout Shift (CLS):** 0.___ (target: < 0.1)
- **Speed Index:** __.__ s

### Improvements Validated

- [ ] Console cleanup → Best Practices score improved
- [ ] CSP meta tag → Security/Best Practices improved
- [ ] font-display: swap → Performance/FCP improved
- [ ] PWA icons → PWA score improved
- [ ] robots.txt updated → SEO/Crawlability improved

### Opportunities (From Lighthouse)

_List any suggestions here:_

- Example: "Reduce unused JavaScript"
- Example: "Serve images in next-gen formats"

### Diagnostics

_List any warnings or info items:_

- Example: "Largest Contentful Paint element: <img src='...'>"

---

## 🔍 Alternative Methods

### Option A: Chrome DevTools (Manual - 5 min)

**Best for:** Detailed debugging, specific page testing

1. Open production site:

   ```powershell
   Start-Process "https://wedding-website-sepia-ten.vercel.app"
   ```

2. Open DevTools (F12)
3. Click **Lighthouse** tab (if not visible: click >> → Lighthouse)
4. Configure:
   - Mode: **Navigation**
   - Device: **Desktop** (run once), then **Mobile** (run again)
   - Categories: **All** (Performance, Accessibility, Best Practices, SEO, PWA)
5. Click **"Analyze page load"**
6. Wait 30-60 seconds
7. Review results
8. Export report:
   - Click **"View Report"** (opens new tab)
   - Click **"Save as HTML"**
   - Save to: `docs/lighthouse-desktop-2025-10-13.html`
9. Repeat for Mobile device

**Pros:**

- Most detailed reports
- Can test specific pages
- Can test localhost (dev build)
- Offline capable

**Cons:**

- Manual process (not automatable without setup)
- Requires local Chrome installation

---

### Option B: Lighthouse CI (Automated - 15 min)

**Best for:** CI/CD integration, batch testing, historical tracking

**Prerequisites:**

1. Install Chrome:

   ```powershell
   winget install Google.Chrome
   ```

2. Install Lighthouse CI globally:

   ```powershell
   npm install -g @lhci/cli
   lhci --version
   ```

**Configuration:**

File: `lighthouserc.yml` (already present in repo root)

```yaml
ci:
  collect:
    url:
      - https://wedding-website-sepia-ten.vercel.app
      - https://wedding-website-sepia-ten.vercel.app/gallery
      - https://wedding-website-sepia-ten.vercel.app/guestbook
      - https://wedding-website-sepia-ten.vercel.app/upload
    numberOfRuns: 3
  assert:
    preset: 'lighthouse:recommended'
    assertions:
      performance: ['error', { minScore: 0.85 }]
      accessibility: ['error', { minScore: 0.90 }]
      best-practices: ['error', { minScore: 0.90 }]
      seo: ['error', { minScore: 0.95 }]
      pwa: ['warn', { minScore: 0.85 }]
  upload:
    target: 'temporary-public-storage'
```

**Run Audit:**

```powershell
cd f:\wedding-website\site

# Run Lighthouse CI
npm run audit

# Results saved to:
# .lighthouseci/lhr-<timestamp>.html
# Also uploaded to temporary public storage (URL in output)
```

**Pros:**

- Automated (can run in CI/CD)
- Tests multiple pages at once
- Uploads results to cloud for sharing
- Runs 3 times and averages (more reliable)

**Cons:**

- Requires Chrome installation
- More complex setup
- Currently blocked on this system (Chrome not found error)

---

### Option C: WebPageTest (Advanced - 10 min)

**Best for:** Real-world testing, multiple locations, network throttling

1. Visit: <https://www.webpagetest.org/>
2. Enter URL: `https://wedding-website-sepia-ten.vercel.app`
3. Configure:
   - Test Location: **Virginia, USA** (closest to Vercel US East)
   - Browser: **Chrome**
   - Connection: **Cable** (5 Mbps)
4. Click **"Start Test"**
5. Wait 2-3 minutes
6. Review filmstrip, waterfall, and metrics
7. Export results (PDF or screenshots)

**Metrics to check:**

- Load Time
- First Byte
- Start Render (similar to FCP)
- Speed Index
- Largest Contentful Paint
- Total Blocking Time
- Cumulative Layout Shift

**Pros:**

- Real-world testing (not simulated)
- Multiple global test locations
- Video filmstrip (visual timeline)
- Network throttling simulation

**Cons:**

- Slower (queue + test time)
- Less detailed than Lighthouse
- Different metrics (harder to compare)

---

## 📈 Interpreting Results

### Performance Score Breakdown

| Score | Grade | Status | Action |
|-------|-------|--------|--------|
| 90-100 | A | ✅ Excellent | Maintain current optimizations |
| 80-89 | B | ⚠️ Good | Minor optimizations possible |
| 70-79 | C | ⚠️ Fair | Address key opportunities |
| 50-69 | D | ❌ Poor | Significant work needed |
| 0-49 | F | ❌ Failed | Major performance issues |

### Core Web Vitals Thresholds (Google)

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | < 2.5s | 2.5-4.0s | > 4.0s |
| **FID** (First Input Delay) | < 100ms | 100-300ms | > 300ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 0.1-0.25 | > 0.25 |
| **FCP** (First Contentful Paint) | < 1.8s | 1.8-3.0s | > 3.0s |
| **TTI** (Time to Interactive) | < 3.8s | 3.8-7.3s | > 7.3s |

---

## 🎯 October 13 Improvements Expected Impact

### Direct Performance Improvements

1. **font-display: swap** (Already implemented pre-October 13)
   - Expected: +5 points Performance
   - Prevents invisible text during font loading

2. **outputFileTracingRoot** (October 13)
   - Expected: No direct score impact
   - Improves build accuracy

3. **Console cleanup** (20+ statements removed - October 13)
   - Expected: +3-5 points Best Practices
   - Reduces noise, improves debugging

### Indirect Improvements

4. **CSP meta tag** (October 13)
   - Expected: +2-5 points Best Practices
   - Improves security score

5. **robots.txt updated** (October 13)
   - Expected: +2 points SEO
   - Correctly points to production URL

6. **PWA icons** (icon-192x192, icon-512x512 - October 13)
   - Expected: +5-10 points PWA
   - Satisfies manifest icon requirements

7. **Service worker** (Generated automatically)
   - Expected: Significant PWA score boost
   - Enables offline capability, installability

---

## ⚠️ Known Issues (Non-Blocking)

### 1. 'unsafe-inline' CSP Directive

**Lighthouse Warning:** "Allows unsafe inline script execution"

**Reason:** Required for Next.js, React hydration, Vercel Analytics

**Impact:** -5 to -10 points Best Practices

**Mitigation:** Unavoidable without major framework change

---

### 2. 'unsafe-eval' CSP Directive

**Lighthouse Warning:** "Allows code evaluation (eval)"

**Reason:** Required for Next.js dynamic imports

**Impact:** -5 to -10 points Best Practices

**Mitigation:** Standard for Next.js apps, not a real security risk in this context

---

### 3. Third-Party Scripts

**Lighthouse Warning:** "Reduce impact of third-party code"

**Culprits:**

- Firebase SDK (~40-50 KB gzipped)
- Google Analytics (~30 KB)
- Supabase client (~20 KB)

**Impact:** -5 to -15 points Performance (TBT/TTI)

**Mitigation:**

- Already using dynamic imports where possible
- Firebase modular SDK (smaller)
- Could defer analytics loading (trade-off: less data)

---

### 4. Large First Load JS (240-350 KB)

**Lighthouse Warning:** "Reduce JavaScript execution time"

**Reason:**

- Next.js framework overhead (~80 KB)
- React (~40 KB)
- Firebase SDK (~50 KB)
- Supabase SDK (~20 KB)
- Framer Motion (~30 KB)
- Application code (~20-130 KB depending on page)

**Impact:** -10 to -20 points Performance

**Mitigation:**

- Already using code splitting (per-page bundles)
- Dynamic imports for heavy components
- Tree shaking enabled
- Further optimization: Remove unused libraries (trade-off: features)

---

## 📋 Action Items After Audit

### If Performance < 80

**Investigate:**

1. Check LCP element (usually hero image)
2. Review TBT (JavaScript execution time)
3. Check CLS (layout shifts during load)

**Optimize:**

1. Add priority loading to hero image: `<Image priority />`
2. Defer non-critical JavaScript
3. Add explicit width/height to all images

---

### If Accessibility < 90

**Check:**

1. All images have alt text
2. Color contrast passes WCAG AA
3. Interactive elements have ARIA labels
4. Heading hierarchy is correct

**Fix:**

1. Add missing alt attributes
2. Adjust colors if contrast fails
3. Add aria-label to buttons/links
4. Reorder heading levels

---

### If Best Practices < 90

**Check:**

1. Console errors/warnings (should be 0 after Oct 13 cleanup)
2. HTTPS enforced
3. CSP header present
4. No vulnerable libraries

**Fix:**

1. Remove remaining console statements
2. Update CSP if needed
3. Run `npm audit fix`

---

### If SEO < 95

**Check:**

1. robots.txt correct (updated Oct 13)
2. sitemap.xml present
3. Meta descriptions on all pages
4. Canonical URLs set

**Fix:**

1. Add missing meta descriptions
2. Verify canonical tags

---

### If PWA < 85

**Check:**

1. Service worker registered
2. Icons present (192x192, 512x512)
3. manifest.json correct
4. Screenshots (optional, improves score)

**Fix:**

1. Add PWA screenshots (540x720, 1280x720)
2. Verify manifest shortcuts work

---

## ✅ Completion Checklist

- [ ] Run Lighthouse audit (PageSpeed Insights or DevTools)
- [ ] Document scores in this file (replace "__" placeholders)
- [ ] Screenshot results
- [ ] Review opportunities and diagnostics
- [ ] Compare to targets (85/90/90/95/85)
- [ ] Document any action items
- [ ] Commit updated report: `git add docs/LIGHTHOUSE-AUDIT-2025-10-13.md`
- [ ] Optional: Share results with team

---

**Report Status:** ⏳ Template ready, awaiting execution  
**Estimated Time:** 2-5 minutes (depending on method)  
**Priority:** MEDIUM (validates optimization work)  
**Blocker:** None (production site is live and accessible)

---

## 🔗 Useful Links

- PageSpeed Insights: <https://pagespeed.web.dev/>
- Lighthouse Documentation: <https://developer.chrome.com/docs/lighthouse/>
- Core Web Vitals: <https://web.dev/vitals/>
- WebPageTest: <https://www.webpagetest.org/>
- Lighthouse CI: <https://github.com/GoogleChrome/lighthouse-ci>
