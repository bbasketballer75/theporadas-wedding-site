# Optional Improvements Guide

**Date:** October 13, 2025  
**Status:** Low Priority Post-Deployment Tasks  
**Prerequisites:** Core improvements complete (22/25 items from 25-IMPROVEMENTS-EXECUTION-2025-10-13.md)

---

## 📋 OVERVIEW

This guide covers 4 optional, low-priority improvements identified during the October 13, 2025 optimization pass. These are quality-of-life enhancements that can be completed when time permits.

---

## 1. PWA Screenshots 📸

### Status: ⚠️ PARTIALLY COMPLETE

**Current State:**

- ✅ PWA icons present (icon-192x192.png, icon-512x512.png)
- ✅ manifest.json references screenshots
- ❌ Actual screenshot images missing

**Required Files:**

1. `site/public/screenshot-narrow.png` (540x720px) - Mobile screenshot
2. `site/public/screenshot-wide.png` (1280x720px) - Desktop screenshot

### Implementation Steps

#### Option A: Manual Screenshot Capture (5 minutes)

**Tools Needed:**

- Chrome DevTools or Firefox Developer Tools
- Image editor (Paint, GIMP, Photoshop, or online tool)

**Steps:**

1. **Capture Mobile Screenshot (540x720)**

   ```bash
   # Open production site
   Start-Process "https://wedding-website-sepia-ten.vercel.app"
   ```

   - Open Chrome DevTools (F12)
   - Click "Toggle Device Toolbar" (Ctrl+Shift+M)
   - Select device: "iPhone 12 Pro" (390x844)
   - Navigate to homepage with elegant sections visible
   - Take screenshot: Right-click → Capture screenshot
   - Resize to 540x720px (crop to portrait orientation)
   - Save as `screenshot-narrow.png`

2. **Capture Desktop Screenshot (1280x720)**

   - Set browser window to 1280x720 resolution
   - Navigate to homepage showing hero section + gallery preview
   - Capture screenshot: Windows+Shift+S or browser screenshot tool
   - Crop to exactly 1280x720px
   - Save as `screenshot-wide.png`

3. **Add to Project**

   ```powershell
   # Copy screenshots to public directory
   Copy-Item "path\to\screenshot-narrow.png" "f:\wedding-website\site\public\"
   Copy-Item "path\to\screenshot-wide.png" "f:\wedding-website\site\public\"

   # Verify files
   Get-ChildItem "f:\wedding-website\site\public\screenshot-*.png"

   # Commit
   cd f:\wedding-website
   git add site/public/screenshot-*.png
   git commit -m "feat: add PWA screenshots for app install preview"
   git push origin main
   ```

#### Option B: Automated Screenshot with Playwright (10 minutes)

**Prerequisites:** Install Playwright browsers first

```powershell
cd f:\wedding-website\site
npx playwright install chromium
```

**Script:** `site/scripts/generate-pwa-screenshots.js`

```javascript
const { chromium } = require('playwright');
const path = require('path');

async function generateScreenshots() {
  const browser = await chromium.launch();
  
  // Mobile screenshot (540x720)
  const mobileContext = await browser.newContext({
    viewport: { width: 540, height: 720 },
    deviceScaleFactor: 2,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000');
  await mobilePage.waitForLoadState('networkidle');
  await mobilePage.screenshot({
    path: path.join(__dirname, '../public/screenshot-narrow.png'),
    fullPage: false,
  });
  
  // Desktop screenshot (1280x720)
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto('http://localhost:3000');
  await desktopPage.waitForLoadState('networkidle');
  await desktopPage.screenshot({
    path: path.join(__dirname, '../public/screenshot-wide.png'),
    fullPage: false,
  });
  
  await browser.close();
  console.log('✅ PWA screenshots generated successfully');
}

generateScreenshots().catch(console.error);
```

**Usage:**

```powershell
# Start dev server (in separate terminal)
npm start

# Generate screenshots
node site/scripts/generate-pwa-screenshots.js
```

### Priority: LOW

**Impact:** Cosmetic only - improves PWA install dialog appearance  
**Effort:** 5-10 minutes  
**Blocker:** None  
**Deadline:** None (can be done anytime)

---

## 2. Dependency Updates for Node v24 📦

### Status: ⚠️ BLOCKED (Ecosystem Issue)

**Current Situation:**

- System: Node v24.10.0 (cutting edge, released October 2025)
- Blocker: Firebase `superstatic@9.2.0` requires Node 18/20/22
- npm error: `EBADENGINE - Not compatible with your version of node/npm`

**Blocked Dependencies:**

1. `@supabase/supabase-js` - 2.74.0 → 2.75.0 (minor version, low priority)
2. `@types/node` - 24.7.1 → 24.7.2 (patch version, very low priority)
3. `lint-staged` - 16.2.3 → 16.2.4 (version doesn't exist, already on latest)

### Monitoring Strategy

**Option A: Wait for Ecosystem (RECOMMENDED)**

Monitor these sources weekly:

1. **Firebase superstatic releases:** <https://github.com/firebase/superstatic/releases>
   - Watch for Node v24 support announcement
   - Expected timeline: Q1 2026 (3-6 months)

2. **npm outdated check:**

   ```powershell
   cd f:\wedding-website\site
   npm outdated
   ```

3. **GitHub Dependabot alerts:**
   - <https://github.com/bbasketballer75/theporadas-wedding-site/security>
   - Currently: 1 low severity vulnerability (not blocking)

**Option B: Downgrade to Node 22 LTS**

⚠️ **Only if critical security updates are blocked**

```powershell
# Install Node 22 LTS via nvm-windows or official installer
# https://nodejs.org/en/download/

# Verify version
node --version  # Should show v22.x.x

# Update dependencies
cd f:\wedding-website\site
npm update @supabase/supabase-js @types/node

# Test build
npm run build
npm test
```

**Pros:**

- Enables dependency updates
- More stable ecosystem support
- LTS version (Long Term Support)

**Cons:**

- Loses Node v24 cutting-edge features
- Need to reinstall/manage Node versions

### Priority: VERY LOW

**Impact:** Minimal - current versions are secure and functional  
**Effort:** 0 minutes (wait) or 15 minutes (downgrade)  
**Blocker:** Firebase tooling ecosystem  
**Deadline:** When security updates become critical  
**Recommendation:** **WAIT** - no action needed now

---

## 3. Lighthouse Performance Audit 🚀

### Status: ✅ INSTRUCTIONS PROVIDED

**Goal:** Measure performance impact of October 13 improvements

**Baseline Metrics (Pre-Improvements):**

- Performance: Unknown (no baseline)
- Accessibility: Unknown
- Best Practices: Unknown
- SEO: Unknown

**Expected Improvements:**

- ✅ Console cleanup → Better Best Practices score
- ✅ CSP meta tag → Better Security score
- ✅ font-display: swap → Better Performance score
- ✅ PWA icons → Better PWA score

### Implementation Methods

#### Option A: Online Lighthouse (Easiest - 2 minutes)

**Tools:** PageSpeed Insights (Google's official Lighthouse service)

**Steps:**

1. Open PageSpeed Insights:

   ```powershell
   Start-Process "https://pagespeed.web.dev/"
   ```

2. Enter production URL:

   ```
   https://wedding-website-sepia-ten.vercel.app
   ```

3. Click "Analyze" and wait 30-60 seconds

4. Review Scores:
   - **Performance** (target: 90+)
   - **Accessibility** (target: 95+)
   - **Best Practices** (target: 95+)
   - **SEO** (target: 95+)

5. Document Results:

   ```powershell
   # Create audit report
   # Copy scores and save to docs/LIGHTHOUSE-AUDIT-2025-10-13.md
   ```

#### Option B: Lighthouse CI (Automated - 15 minutes)

**Prerequisites:** Install Chrome/Chromium

```powershell
# Install Chrome (if not present)
winget install Google.Chrome

# Install Lighthouse CI globally
npm install -g @lhci/cli

# Verify installation
lhci --version
```

**Configuration:** Update `lighthouserc.yml`

```yaml
ci:
  collect:
    url:
      - http://localhost:3000
      - http://localhost:3000/gallery
      - http://localhost:3000/guestbook
    numberOfRuns: 3
  assert:
    preset: 'lighthouse:recommended'
    assertions:
      performance: ['error', { minScore: 0.9 }]
      accessibility: ['error', { minScore: 0.95 }]
      best-practices: ['error', { minScore: 0.95 }]
      seo: ['error', { minScore: 0.95 }]
  upload:
    target: 'temporary-public-storage'
```

**Run Audit:**

```powershell
cd f:\wedding-website\site

# Start production build
npm run build
npm run start:prod  # Runs on port 3000

# In separate terminal: Run Lighthouse
npm run audit

# Results will be at:
# .lighthouseci/lhr-<timestamp>.html
```

#### Option C: Chrome DevTools (Manual - 5 minutes)

**Steps:**

1. Open production site:

   ```powershell
   Start-Process "https://wedding-website-sepia-ten.vercel.app"
   ```

2. Open DevTools (F12) → Lighthouse tab

3. Configure:
   - Mode: Navigation
   - Device: Desktop + Mobile (run twice)
   - Categories: All

4. Click "Analyze page load"

5. Export report:
   - Click "View Report" → "Save as HTML"
   - Save to `docs/lighthouse-desktop-2025-10-13.html`

### Expected Results (Post-Improvements)

**Performance:**

- Score: 85-95 (excellent)
- Improvements from font-display: swap
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1

**Accessibility:**

- Score: 90-100 (excellent)
- All images have alt text
- Proper ARIA labels
- Color contrast passing

**Best Practices:**

- Score: 90-100 (excellent)
- ✅ No console errors/warnings (cleaned up)
- ✅ HTTPS enforced
- ✅ CSP header present

**SEO:**

- Score: 95-100 (excellent)
- ✅ Meta descriptions present
- ✅ robots.txt correct
- ✅ Sitemap available

**PWA:**

- Score: 85-95 (installable)
- ✅ Service worker registered
- ✅ Icons present (192x192, 512x512)
- ⚠️ Screenshots missing (non-critical)

### Priority: MEDIUM

**Impact:** High visibility - validates optimization work  
**Effort:** 2-15 minutes (depending on method)  
**Blocker:** None (production site live)  
**Deadline:** This week (before next sprint)  
**Recommendation:** Use Option A (PageSpeed Insights) for quick validation

---

## 4. CSP Verification in Production 🔒

### Status: ✅ INSTRUCTIONS PROVIDED

**Goal:** Verify Content Security Policy doesn't block legitimate functionality

**CSP Policy Added (October 13, 2025):**

```html
<meta httpEquiv="Content-Security-Policy"
  content="default-src 'self'; 
           script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.google-analytics.com https://*.googletagmanager.com https://*.firebase.googleapis.com https://*.firebaseio.com; 
           style-src 'self' 'unsafe-inline' https://unpkg.com; 
           img-src 'self' data: https: blob:; 
           font-src 'self' data:; 
           connect-src 'self' https://*.supabase.co https://*.google-analytics.com https://*.firebase.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com; 
           frame-src 'self' https://*.google.com; 
           object-src 'none'; 
           base-uri 'self'; 
           form-action 'self';" 
/>
```

### Critical Functionality to Test

**1. Firebase Integration** ✅ EXPECTED TO WORK

- Firestore reads/writes (guestbook, timeline)
- Firebase Storage uploads (photo upload)
- Firebase Analytics
- Covered by: `https://*.firebase.googleapis.com`, `https://*.firebaseio.com`, `wss://*.firebaseio.com`

**2. Supabase Integration** ✅ EXPECTED TO WORK

- Image CDN (gallery photos)
- Covered by: `https://*.supabase.co`

**3. Google Maps/Embeds** ✅ EXPECTED TO WORK

- Venue page Google Maps iframes
- Covered by: `frame-src 'self' https://*.google.com`

**4. Analytics** ✅ EXPECTED TO WORK

- Google Analytics / Vercel Analytics
- Covered by: `https://*.google-analytics.com`, `https://*.googletagmanager.com`, `https://vercel.live`

**5. Leaflet Maps** ⚠️ CHECK REQUIRED

- Interactive venue map (uses unpkg.com for CSS)
- Covered by: `style-src 'self' 'unsafe-inline' https://unpkg.com`
- **Action:** Test map page interactivity

**6. External Images** ✅ EXPECTED TO WORK

- All external images allowed
- Covered by: `img-src 'self' data: https: blob:`

### Testing Methodology

#### Browser Console Check (5 minutes)

**Steps:**

1. Open production site with DevTools:

   ```powershell
   Start-Process "https://wedding-website-sepia-ten.vercel.app"
   # Press F12 to open DevTools
   ```

2. Navigate to Console tab

3. Test each page and check for CSP violations:
   - Homepage → Check analytics
   - Gallery → Check Supabase images + Leaflet map
   - Guestbook → Check Firebase write
   - Upload → Check Firebase Storage
   - Venue → Check Google Maps iframe
   - Map → Check Leaflet interactivity

4. Look for errors like:

   ```
   Refused to load the script '<URL>' because it violates the Content Security Policy directive
   ```

5. If violations found, document:
   - URL being blocked
   - Which CSP directive is blocking it
   - What functionality is broken

#### Automated Testing Script (15 minutes)

**Create:** `site/scripts/test-csp-production.js`

```javascript
const { chromium } = require('playwright');

const pages = [
  { url: '/', name: 'Homepage' },
  { url: '/gallery', name: 'Gallery' },
  { url: '/guestbook', name: 'Guestbook' },
  { url: '/upload', name: 'Upload' },
  { url: '/venue', name: 'Venue' },
  { url: '/map', name: 'Map' },
];

async function testCSP() {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const page of pages) {
    const context = await browser.newContext();
    const browserPage = await context.newPage();
    
    const violations = [];
    
    // Listen for CSP violations
    browserPage.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('Content Security Policy')) {
        violations.push(msg.text());
      }
    });

    try {
      await browserPage.goto(`https://wedding-website-sepia-ten.vercel.app${page.url}`, {
        waitUntil: 'networkidle',
        timeout: 10000,
      });

      // Wait for dynamic content
      await browserPage.waitForTimeout(2000);

      results.push({
        page: page.name,
        violations: violations.length,
        errors: violations,
        status: violations.length === 0 ? '✅ PASS' : '❌ FAIL',
      });
    } catch (error) {
      results.push({
        page: page.name,
        violations: 0,
        errors: [`Page load error: ${error.message}`],
        status: '⚠️ ERROR',
      });
    }

    await context.close();
  }

  await browser.close();

  console.log('\n📊 CSP VERIFICATION RESULTS\n');
  console.table(results);

  const totalViolations = results.reduce((sum, r) => sum + r.violations, 0);
  
  if (totalViolations === 0) {
    console.log('\n✅ All pages passed CSP verification!');
  } else {
    console.log(`\n❌ Found ${totalViolations} CSP violations across ${results.filter(r => r.violations > 0).length} pages`);
    console.log('\nDetails:');
    results.filter(r => r.violations > 0).forEach(r => {
      console.log(`\n${r.page}:`);
      r.errors.forEach(e => console.log(`  - ${e}`));
    });
  }
}

testCSP().catch(console.error);
```

**Usage:**

```powershell
# Requires Playwright
cd f:\wedding-website\site
npx playwright install chromium

# Run CSP tests
node scripts/test-csp-production.js
```

### Known Safe Directives

These are intentional "relaxed" directives (security trade-off for functionality):

1. **`'unsafe-inline'` in script-src** - Required for:
   - Next.js inline scripts
   - React hydration
   - Vercel Analytics

2. **`'unsafe-eval'` in script-src** - Required for:
   - Next.js dynamic imports
   - Development hot reload

3. **`'unsafe-inline'` in style-src** - Required for:
   - Styled-jsx (Next.js)
   - Framer Motion animations
   - Tailwind inline styles

⚠️ **These are standard for Next.js applications and unavoidable without major refactoring.**

### Potential Issues & Fixes

#### Issue 1: Leaflet Map Not Loading

**Symptom:** Map page blank or tiles missing

**Cause:** Leaflet tiles from third-party CDN blocked

**Fix:** Add tile server to CSP

```diff
- connect-src 'self' https://*.supabase.co ...
+ connect-src 'self' https://*.supabase.co https://*.tile.openstreetmap.org ...
```

#### Issue 2: Google Fonts Blocked

**Symptom:** Fonts not loading (fallback fonts used)

**Cause:** Google Fonts API blocked (if using external fonts)

**Fix:** Using next/font (local optimization), should not be an issue

#### Issue 3: Vercel Analytics Not Tracking

**Symptom:** No analytics data in Vercel dashboard

**Cause:** Vercel script blocked

**Fix:** Already included `https://vercel.live` - should work

### Expected Outcome

**✅ PASS (High Confidence):**

- CSP policy was designed specifically for this tech stack
- All known external services included
- Standard Next.js directives present

**If violations found:**

1. Document the error in `docs/CSP-VIOLATIONS-2025-10-13.md`
2. Update `site/pages/_document.js` CSP meta tag
3. Commit and redeploy
4. Re-test

### Priority: HIGH (But Quick)

**Impact:** Critical - could block core functionality  
**Effort:** 5-15 minutes  
**Blocker:** None (can test immediately)  
**Deadline:** Before next production changes  
**Recommendation:** Test ASAP using browser console method (easiest)

---

## 📊 PRIORITY MATRIX

| Task | Priority | Effort | Impact | Deadline | Status |
|------|----------|--------|--------|----------|--------|
| **CSP Verification** | 🔴 HIGH | 5-15 min | Critical functionality | This week | Ready to test |
| **Lighthouse Audit** | 🟡 MEDIUM | 2-15 min | Validates optimization | This week | Ready to run |
| **PWA Screenshots** | 🟢 LOW | 5-10 min | Cosmetic only | No deadline | Can do anytime |
| **Dependency Updates** | ⚪ VERY LOW | 0 min | Minimal | When ecosystem ready | Wait & monitor |

---

## ✅ QUICK START CHECKLIST

**15-Minute Validation Sprint:**

```powershell
# 1. CSP Verification (5 minutes)
Start-Process "https://wedding-website-sepia-ten.vercel.app"
# Open DevTools (F12) → Console tab → Navigate all pages → Check for CSP errors

# 2. Lighthouse Audit (5 minutes)
Start-Process "https://pagespeed.web.dev/"
# Enter URL: https://wedding-website-sepia-ten.vercel.app → Analyze → Screenshot results

# 3. PWA Screenshots (5 minutes)
# DevTools → Toggle Device Toolbar → iPhone 12 Pro → Capture screenshot (540x720)
# Resize browser to 1280x720 → Capture screenshot
# Save to site/public/ and commit

# DONE! ✅
```

---

## 📝 DOCUMENTATION TEMPLATES

### Lighthouse Audit Report Template

**File:** `docs/LIGHTHOUSE-AUDIT-2025-10-13.md`

```markdown
# Lighthouse Audit Report - October 13, 2025

**URL:** https://wedding-website-sepia-ten.vercel.app  
**Date:** October 13, 2025  
**Tool:** PageSpeed Insights / Lighthouse CI  
**Context:** Post-optimization validation (after 22/25 improvements)

## Scores

- **Performance:** XX/100
- **Accessibility:** XX/100
- **Best Practices:** XX/100
- **SEO:** XX/100
- **PWA:** XX/100

## Key Metrics

- **First Contentful Paint (FCP):** X.Xs
- **Largest Contentful Paint (LCP):** X.Xs
- **Total Blocking Time (TBT):** XXXms
- **Cumulative Layout Shift (CLS):** 0.XXX
- **Speed Index:** X.Xs

## Improvements Validated

✅ Console cleanup → Best Practices improved
✅ CSP meta tag → Security improved
✅ font-display: swap → Performance improved
✅ PWA icons → PWA score improved

## Opportunities

- [List any suggestions from Lighthouse]

## Diagnostics

- [List any warnings or info items]
```

### CSP Verification Report Template

**File:** `docs/CSP-VERIFICATION-2025-10-13.md`

```markdown
# CSP Verification Report - October 13, 2025

**URL:** https://wedding-website-sepia-ten.vercel.app  
**Date:** October 13, 2025  
**Method:** Browser Console / Automated Script

## Test Results

| Page | Status | Violations | Notes |
|------|--------|------------|-------|
| Homepage | ✅ PASS | 0 | All functionality working |
| Gallery | ✅ PASS | 0 | Images and map loading |
| Guestbook | ✅ PASS | 0 | Firebase writes working |
| Upload | ✅ PASS | 0 | Firebase Storage working |
| Venue | ✅ PASS | 0 | Google Maps iframe working |
| Map | ✅ PASS | 0 | Leaflet interactivity working |

## Overall Result

✅ **PASS** - All pages tested successfully, no CSP violations detected

## Tested Functionality

- ✅ Firebase Firestore (read/write)
- ✅ Firebase Storage (uploads)
- ✅ Firebase Analytics
- ✅ Supabase CDN (images)
- ✅ Google Maps (iframes)
- ✅ Leaflet maps (interactive)
- ✅ Vercel Analytics

## Conclusion

Content Security Policy is correctly configured and does not block any legitimate functionality.
```

---

## 🎯 SUCCESS CRITERIA

**All tasks considered complete when:**

1. ✅ CSP verification shows 0 violations across all pages
2. ✅ Lighthouse audit shows Performance 85+, Best Practices 90+
3. ✅ PWA screenshots present and referenced correctly in manifest.json
4. ✅ Dependency monitoring strategy documented (no action needed now)

**Estimated Total Time:** 30 minutes for all tasks

---

**End of Optional Improvements Guide**
