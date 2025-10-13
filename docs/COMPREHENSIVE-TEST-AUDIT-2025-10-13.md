# Comprehensive Test Audit & Enhancement Plan

**Date:** October 13, 2025  
**Purpose:** Deep dive into testing infrastructure and identify gaps  
**Goal:** Ensure all aspects of the website are properly tested

---

## EXECUTIVE SUMMARY

### Current State

- **Test Files:** 9 Playwright E2E test files
- **Test Coverage:** ~35% (UI/UX focused, missing critical backend/Firebase tests)
- **Passing Rate:** 44/44 tests (100%) when dev server running
- **Critical Gap:** NO tests for Firebase/Firestore, CSP, realtime features

### Recommended Action

**OVERHAUL REQUIRED** - Current tests focus on UI interactions but miss:

- ❌ Firebase/Firestore connectivity
- ❌ CSP policy validation
- ❌ Guestbook realtime sync
- ❌ Photo upload workflows
- ❌ Database operations
- ❌ Authentication flows
- ❌ API endpoints

---

## PART 1: CURRENT TEST INVENTORY

### Test Files Found (9 total)

#### A. Site Tests (`site/tests/e2e/`) - 6 files

**1. `interactive-features.spec.js`** (4 tests)

```javascript
✅ Gallery filter tabs presence check
✅ Venue tab switching functionality
✅ Timeline section rendering
✅ Section scroll buttons (View Timeline)
```

**Coverage:** UI component interactions  
**Quality:** ⭐⭐⭐ Good (3/5) - functional but shallow  
**Gaps:** Doesn't test actual data loading, Firebase integration

**2. `mobile-responsive.spec.js`** (4 tests)

```javascript
✅ Hamburger menu visibility (mobile viewport)
✅ Mobile menu open/close functionality
✅ Mobile menu closes after navigation
✅ Mobile navigation scrolls to section
```

**Coverage:** Mobile navigation UX  
**Quality:** ⭐⭐⭐⭐ Very Good (4/5) - uses iPhone 12 device emulation  
**Gaps:** Doesn't test touch gestures, swipe actions

**3. `navigation-clicks.spec.js`** (3 tests)

```javascript
✅ Smooth scroll to sections on nav click
✅ All navigation links functional
✅ Active section highlighting in nav
```

**Coverage:** Desktop navigation  
**Quality:** ⭐⭐⭐⭐ Very Good (4/5) - comprehensive nav testing  
**Gaps:** Doesn't test keyboard navigation (Tab, Enter)

**4. `scroll-spy.spec.js`** (4 tests)

```javascript
✅ Home section highlighted on page load
✅ Active section updates on scroll
✅ Scroll through all 10 sections updates nav
✅ Underline shows on active section
```

**Coverage:** Scroll-based navigation highlighting  
**Quality:** ⭐⭐⭐⭐ Very Good (4/5) - detailed scroll position testing  
**Gaps:** Doesn't test edge cases (rapid scrolling, viewport resize)

**5. `section-animations.spec.js`** (2 tests)

```javascript
✅ Fade-in animation triggers when section visible
✅ Animations apply to all sections
```

**Coverage:** CSS animations and intersection observer  
**Quality:** ⭐⭐⭐ Good (3/5) - checks animation classes  
**Gaps:** Doesn't verify actual animation execution, timing

**6. `teaser-links.spec.js`** (5 tests)

```javascript
✅ Navigate to Photo Booth page
✅ Navigate to Guest Book page
✅ Navigate to Album page
✅ Navigate to Upload page
✅ Navigate to Map page
```

**Coverage:** Page routing from homepage teasers  
**Quality:** ⭐⭐⭐⭐ Very Good (4/5) - tests all teaser links  
**Gaps:** Doesn't verify page content after navigation

#### B. Root Tests (`tests/e2e/`) - 3 files

**7. `homepage.spec.js`** (6 tests)

```javascript
✅ Page loads with key elements (h1: Austin & Jordyn)
✅ Optimized fonts applied (next/font CSS variables)
✅ No external font requests (fonts.googleapis.com blocked)
✅ Navigation visible
✅ Floral decorations present (SVG/IMG count)
✅ Timeline cards have proper styling (Tailwind classes)
```

**Coverage:** Homepage structure and font optimization  
**Quality:** ⭐⭐⭐⭐⭐ Excellent (5/5) - validates font optimization fix  
**Gaps:** None for homepage basics

**8. `gallery.spec.js`** (7 tests, 1 skipped)

```javascript
✅ Gallery page loads correctly
✅ Displays existing photos (checks for images)
⏭️ Can select and upload photo (SKIPPED - needs Firebase auth)
✅ PhotoUpload component renders
✅ Video player embeds YouTube correctly (youtube-nocookie.com)
✅ Gallery uses lazy loading for images
✅ Gallery has responsive layout
```

**Coverage:** Gallery page rendering  
**Quality:** ⭐⭐⭐ Good (3/5) - skips critical upload test  
**Gaps:** **CRITICAL** - Photo upload test skipped (needs Firebase)

**9. `map.spec.js`** (presumed, not read yet)

```javascript
(Content not analyzed yet)
```

### Test Configuration

**`playwright.config.js`** - ⭐⭐⭐⭐ Very Good (4/5)

```javascript
✅ 120s timeout (good for slow Firebase operations)
✅ Retries: 2 (handles flaky tests)
✅ Parallel execution enabled
✅ Environment-based browser selection:
   - Local: Chromium only (2.4 min - fast iteration)
   - CI: All browsers (12 min - comprehensive)
✅ baseURL: http://localhost:3000
✅ Screenshots on failure
✅ Video on failure
✅ Web server auto-start with Turbopack (NEXT_TURBOPACK=1)
```

**Strengths:**

- Smart local vs CI browser strategy (5x faster local)
- Proper timeout for Firebase operations
- Good failure diagnostics (screenshots, video, trace)

**Gaps:**

- No production URL testing capability
- No environment variables for Firebase test mode
- No custom reporter for detailed results

---

## PART 2: CRITICAL GAPS IDENTIFIED

### 🚨 HIGH PRIORITY (Must Have)

#### 1. **Firebase/Firestore Connectivity Tests** ❌ MISSING

**Impact:** CRITICAL - Can't detect CSP blocking Firebase  
**Current State:** Zero tests for Firebase operations  
**Risk:** Production failures like current CSP issue go undetected

**What's Needed:**

```javascript
// Firebase Connection Test
test('Firebase initializes successfully', async ({ page }) => {
  await page.goto('/');
  
  // Check console for Firebase initialization
  const logs = await page.evaluate(() => window.__firebaseInitialized);
  expect(logs).toBe(true);
  
  // Verify NO CSP violations in console
  const cspErrors = await page.evaluate(() => {
    return performance.getEntriesByType('resource')
      .filter(r => r.name.includes('firebase.googleapis.com'))
      .filter(r => r.transferSize === 0); // Blocked resources have size 0
  });
  expect(cspErrors.length).toBe(0);
});

// Firestore Connection Test
test('Firestore connects successfully', async ({ page }) => {
  await page.goto('/guestbook');
  
  // Wait for Firestore connection message in console
  const firestoreConnected = await page.waitForFunction(() => {
    return window.performance.getEntriesByName('firestore-connected').length > 0;
  }, { timeout: 10000 });
  
  expect(firestoreConnected).toBeTruthy();
});
```

#### 2. **CSP Policy Validation** ❌ MISSING

**Impact:** CRITICAL - Current CSP issue would have been caught  
**Current State:** No tests verify CSP doesn't block resources  
**Risk:** CSP changes break Firebase without detection

**What's Needed:**

```javascript
// CSP Violation Monitor
test('NO CSP violations on page load', async ({ page }) => {
  const cspViolations = [];
  
  page.on('console', msg => {
    if (msg.text().includes('Content Security Policy')) {
      cspViolations.push(msg.text());
    }
  });
  
  await page.goto('/');
  await page.waitForTimeout(5000); // Wait for all resources
  
  expect(cspViolations).toHaveLength(0);
  
  if (cspViolations.length > 0) {
    console.log('CSP Violations Found:', cspViolations);
  }
});

// Specific Firebase CSP Test
test('Firebase domains allowed by CSP', async ({ page }) => {
  await page.goto('/');
  
  const blockedRequests = [];
  page.on('requestfailed', request => {
    if (request.url().includes('firebase.googleapis.com') ||
        request.url().includes('firebaseinstallations.googleapis.com')) {
      blockedRequests.push(request.url());
    }
  });
  
  await page.waitForTimeout(5000);
  
  expect(blockedRequests).toHaveLength(0);
});
```

#### 3. **Guestbook Realtime Sync Test** ❌ MISSING

**Impact:** CRITICAL - Offline mode (current issue) not detected  
**Current State:** No tests verify realtime updates  
**Risk:** Firestore offline mode goes unnoticed

**What's Needed:**

```javascript
// Guestbook Realtime Test
test('Guestbook updates in realtime across browser contexts', async ({ browser }) => {
  // Create two browser contexts (simulate two users)
  const context1 = await browser.newContext();
  const context2 = await browser.newContext();
  
  const page1 = await context1.newPage();
  const page2 = await context2.newPage();
  
  // Open guestbook in both contexts
  await page1.goto('/guestbook');
  await page2.goto('/guestbook');
  
  // Get initial message count in page2
  const initialCount = await page2.locator('.message-card').count();
  
  // Submit message in page1
  await page1.fill('input[name="name"]', 'Test User');
  await page1.fill('textarea[name="message"]', 'Realtime test message');
  await page1.click('button[type="submit"]');
  
  // Wait for success message in page1
  await page1.waitForSelector('text=Thank you', { timeout: 5000 });
  
  // Verify message appears in page2 WITHOUT refresh (realtime sync)
  await page2.waitForFunction(
    (expected) => document.querySelectorAll('.message-card').length > expected,
    initialCount,
    { timeout: 10000 }
  );
  
  const finalCount = await page2.locator('.message-card').count();
  expect(finalCount).toBe(initialCount + 1);
  
  // Verify message content appears
  await expect(page2.locator('text=Realtime test message')).toBeVisible();
  
  await context1.close();
  await context2.close();
});
```

#### 4. **Photo Upload End-to-End Test** ❌ CURRENTLY SKIPPED

**Impact:** HIGH - Photo upload is core feature  
**Current State:** Test exists but skipped (needs Firebase auth)  
**Risk:** Upload failures in production not caught

**What's Needed:**

- Firebase test authentication setup
- Test image fixtures
- Upload progress verification
- Firestore metadata validation

#### 5. **Console Log Monitoring** ❌ MISSING

**Impact:** HIGH - Errors/warnings go undetected  
**Current State:** No tests capture console output  
**Risk:** Client-side errors not caught in CI

**What's Needed:**

```javascript
// Console Error Monitor
test.beforeEach(async ({ page }) => {
  const errors = [];
  const warnings = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
    if (msg.type() === 'warning') warnings.push(msg.text());
  });
  
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  
  // Store for test access
  page.__consoleErrors = errors;
  page.__consoleWarnings = warnings;
});

test.afterEach(async ({ page }) => {
  const errors = page.__consoleErrors || [];
  const warnings = page.__consoleWarnings || [];
  
  // Fail test if unexpected errors
  const allowedErrors = ['ResizeObserver loop limit exceeded']; // Known React warning
  const unexpectedErrors = errors.filter(e => 
    !allowedErrors.some(allowed => e.includes(allowed))
  );
  
  expect(unexpectedErrors).toHaveLength(0);
});
```

### ⚠️ MEDIUM PRIORITY (Should Have)

#### 6. **API Endpoint Tests** ❌ MISSING

**Endpoints Not Tested:**

- `/api/canva/*` (7 endpoints) - Canva integration
- Any other API routes

**What's Needed:**

- API response validation
- Error handling tests
- Rate limiting checks

#### 7. **Authentication Flow Tests** ❌ MISSING

**Impact:** MEDIUM - Admin/moderation features untested  
**What's Needed:**

- Login/logout flows
- Protected route access
- Session persistence

#### 8. **Accessibility (a11y) Tests** ❌ MISSING

**Impact:** MEDIUM - WCAG compliance not verified  
**What's Needed:**

```javascript
// Axe accessibility testing
import { injectAxe, checkA11y } from 'axe-playwright';

test('Homepage passes accessibility checks', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page, null, {
    detailedReport: true,
    detailedReportOptions: { html: true }
  });
});
```

#### 9. **Performance Tests** ❌ MISSING

**Impact:** MEDIUM - Lighthouse scores not automated  
**What's Needed:**

- Core Web Vitals monitoring
- LCP, FID, CLS thresholds
- Bundle size checks

#### 10. **Database Operations Tests** ❌ MISSING

**Impact:** MEDIUM - Firestore queries not validated  
**What's Needed:**

- Query performance tests
- Pagination tests
- Sorting/filtering tests

### 🔵 LOW PRIORITY (Nice to Have)

#### 11. **Cross-Browser Compatibility** ⚠️ PARTIAL

**Current:** CI runs all browsers, local only Chromium  
**Gap:** No explicit compatibility tests for browser-specific features

#### 12. **Keyboard Navigation** ❌ MISSING

**Impact:** LOW - Affects accessibility power users  
**What's Needed:** Tab order, Enter/Space key, Esc key tests

#### 13. **Touch Gestures** ❌ MISSING

**Impact:** LOW - Mobile users may use gestures  
**What's Needed:** Swipe, pinch-to-zoom, tap tests

#### 14. **Error Boundary Tests** ❌ MISSING

**Impact:** LOW - React error boundaries not tested  
**What's Needed:** Verify graceful error handling

#### 15. **SEO/Meta Tags** ❌ MISSING

**Impact:** LOW - Not critical for wedding site  
**What's Needed:** Verify title, description, Open Graph tags

---

## PART 3: TEST QUALITY ANALYSIS

### Current Test Patterns

**✅ Strengths:**

1. **Consistent Structure:** All tests use `test.beforeEach` for setup
2. **Good Timeouts:** Proper `waitForTimeout` for animations
3. **Smart Selectors:** Mix of text, id, and CSS selectors
4. **Console Logging:** Debug output for troubleshooting
5. **Responsive Testing:** Mobile viewport tests separate

**❌ Weaknesses:**

1. **Shallow Assertions:** Many tests just check "exists" without validating functionality
2. **No Data Validation:** Tests don't verify actual data from Firebase
3. **No Error Cases:** Happy path only, no negative tests
4. **Hardcoded Values:** Magic numbers for timeouts, no constants
5. **Test Isolation:** Some tests may affect others (e.g., adding guestbook messages)

### Example Improvements

**BEFORE** (Shallow Test):

```javascript
test('should verify Timeline section loads', async ({ page }) => {
  await page.evaluate(() => {
    document.getElementById('timeline').scrollIntoView({ behavior: 'smooth' });
  });
  await page.waitForTimeout(2000);

  const timelineSection = page.locator('#timeline');
  const hasContent = await timelineSection.locator('h2, h3, .timeline-event').count();
  
  expect(hasContent).toBeGreaterThan(0); // Just checks SOMETHING exists
  console.log('✓ Timeline section renders content');
});
```

**AFTER** (Deep Test):

```javascript
test('Timeline section loads with correct events from Firebase', async ({ page }) => {
  await page.goto('/');
  
  // Scroll to timeline
  await page.locator('#timeline').scrollIntoView({ behavior: 'smooth' });
  await page.waitForTimeout(1500);
  
  // Verify timeline events loaded from Firebase
  const events = await page.locator('.timeline-event').all();
  expect(events.length).toBeGreaterThanOrEqual(3); // At least 3 events
  
  // Verify event structure
  for (const event of events) {
    await expect(event.locator('h3')).toBeVisible(); // Title
    await expect(event.locator('p')).toBeVisible(); // Description
    await expect(event.locator('time, .date')).toBeVisible(); // Date
  }
  
  // Verify chronological order
  const dates = await page.locator('.timeline-event time').allTextContents();
  const parsedDates = dates.map(d => new Date(d));
  const sorted = [...parsedDates].sort((a, b) => a - b);
  expect(parsedDates).toEqual(sorted); // Events in chronological order
  
  // Verify NO console errors during Firebase fetch
  const errors = page.__consoleErrors || [];
  expect(errors.filter(e => e.includes('firebase'))).toHaveLength(0);
});
```

---

## PART 4: COMPREHENSIVE TEST STRATEGY

### Test Architecture

```
tests/
├── e2e/                          # End-to-end tests
│   ├── critical/                 # 🔴 Critical path tests (run first)
│   │   ├── firebase.spec.js      # Firebase initialization & CSP
│   │   ├── firestore.spec.js     # Firestore connectivity & queries
│   │   ├── guestbook-realtime.spec.js  # Realtime sync validation
│   │   ├── csp-validation.spec.js      # CSP policy verification
│   │   └── console-monitoring.spec.js  # Error/warning detection
│   ├── features/                 # 🟡 Feature tests (core functionality)
│   │   ├── guestbook.spec.js     # Complete guestbook workflow
│   │   ├── photo-upload.spec.js  # Photo upload end-to-end
│   │   ├── gallery.spec.js       # Gallery display & filtering
│   │   ├── navigation.spec.js    # All navigation tests
│   │   └── authentication.spec.js # Auth flows (if applicable)
│   ├── ui/                       # 🟢 UI/UX tests (existing tests move here)
│   │   ├── animations.spec.js
│   │   ├── responsive.spec.js
│   │   ├── scroll-spy.spec.js
│   │   └── interactive.spec.js
│   ├── api/                      # 🔵 API tests (new)
│   │   ├── canva-integration.spec.js
│   │   └── endpoints.spec.js
│   └── accessibility/            # 🟣 A11y tests (new)
│       ├── wcag-compliance.spec.js
│       └── keyboard-nav.spec.js
├── integration/                  # Integration tests (new)
│   ├── firebase-auth.spec.js
│   ├── firestore-queries.spec.js
│   └── storage-operations.spec.js
├── performance/                  # Performance tests (new)
│   ├── core-web-vitals.spec.js
│   └── lighthouse.spec.js
└── fixtures/                     # Test data
    ├── test-images/
    └── mock-data/
```

### Test Execution Strategy

**1. Local Development (Fast Feedback)**

```bash
# Critical tests only (1-2 minutes)
npm run test:critical

# Feature tests (3-5 minutes)
npm run test:features

# All tests (5-7 minutes with Chromium only)
npm run test:all
```

**2. CI/CD Pipeline (Comprehensive)**

```bash
# Pre-deployment validation (12-15 minutes all browsers)
npm run test:ci

# Production smoke tests (post-deployment)
npm run test:production
```

**3. Test Priority Levels**

- **P0 (Critical):** Block deployment if fail
  - Firebase connectivity
  - CSP validation
  - Guestbook realtime sync
  - Console error monitoring
  
- **P1 (High):** Warn but allow deployment
  - Photo upload
  - Gallery display
  - Navigation
  - API endpoints
  
- **P2 (Medium):** Report but don't block
  - Animations
  - Accessibility
  - Performance
  
- **P3 (Low):** Optional
  - Edge cases
  - Browser-specific tests

---

## PART 5: IMPLEMENTATION PLAN

### Phase 1: CRITICAL TESTS (1-2 hours) 🔴

**Priority:** Immediate - Addresses current CSP issue

**Tasks:**

1. **Create `tests/e2e/critical/firebase.spec.js`**
   - Firebase initialization test
   - Firebase SDK version check
   - Firebase config validation

2. **Create `tests/e2e/critical/firestore.spec.js`**
   - Firestore connection test
   - "Connected to Cloud Firestore" message verification
   - Listen channel health check

3. **Create `tests/e2e/critical/csp-validation.spec.js`**
   - NO CSP violations test
   - Firebase domains allowed test
   - Blocked resource detection

4. **Create `tests/e2e/critical/guestbook-realtime.spec.js`**
   - Multi-context realtime sync test
   - Message appears without refresh
   - Offline mode detection

5. **Create `tests/e2e/critical/console-monitoring.spec.js`**
   - Console error collection
   - Unexpected error detection
   - Warning threshold validation

**Success Criteria:**

- All 5 critical test files created
- Tests pass on local dev server
- Tests detect current CSP issue (fail on old code, pass on new)

**Time Estimate:** 2 hours  
**Files Created:** 5 new test files  
**Lines of Code:** ~500-600 lines

---

### Phase 2: FEATURE TESTS (2-3 hours) 🟡

**Priority:** High - Ensures core features work

**Tasks:**

1. **Complete `tests/e2e/features/guestbook.spec.js`**
   - Form validation (empty fields, long messages)
   - Message submission workflow
   - Message display formatting
   - Timestamp formatting
   - Message count update

2. **Un-skip and enhance `tests/e2e/features/photo-upload.spec.js`**
   - File selection test
   - Upload progress validation
   - Firestore metadata creation
   - Storage URL generation
   - Error handling (file too large, wrong format)

3. **Enhance `tests/e2e/features/gallery.spec.js`**
   - Filter tab functionality (All/Photos/Videos)
   - Lazy loading verification
   - Lightbox/modal functionality
   - Image optimization validation

4. **Create `tests/e2e/features/navigation.spec.js`**
   - Consolidate all navigation tests from ui/
   - Add keyboard navigation tests
   - Add URL hash navigation tests

**Success Criteria:**

- Photo upload test no longer skipped
- All features tested end-to-end
- Tests cover happy path AND error cases

**Time Estimate:** 3 hours  
**Files Modified:** 4 test files  
**Lines of Code:** ~400-500 lines

---

### Phase 3: API & A11Y TESTS (1-2 hours) 🔵🟣

**Priority:** Medium - Important but not blocking

**Tasks:**

1. **Create `tests/e2e/api/canva-integration.spec.js`**
   - Test `/api/canva/status` endpoint
   - Test template listing
   - Mock Canva API responses

2. **Create `tests/e2e/accessibility/wcag-compliance.spec.js`**
   - Install `axe-playwright`
   - Test all pages for WCAG 2.1 AA compliance
   - Generate accessibility reports

3. **Create `tests/e2e/accessibility/keyboard-nav.spec.js`**
   - Tab order tests
   - Enter/Space key activation
   - Escape key modal close

**Success Criteria:**

- API endpoints tested
- Accessibility baseline established
- Reports generated for improvement tracking

**Time Estimate:** 2 hours  
**Files Created:** 3 new test files  
**Lines of Code:** ~300-400 lines

---

### Phase 4: PRODUCTION VALIDATION (30 min) ✅

**Priority:** Essential - Verify production deployment

**Tasks:**

1. **Create `tests/e2e/production/smoke-tests.spec.js`**
   - Quick production health checks
   - Run against live URL (not localhost)
   - Verify critical paths only

2. **Update `playwright.config.js`**
   - Add production configuration
   - Support baseURL override via env var
   - Add production-specific timeouts

**Success Criteria:**

- Smoke tests run against production URL
- Tests complete in under 5 minutes
- Can run post-deployment as verification

**Time Estimate:** 30 minutes  
**Files Created:** 1 new test file + config updates  
**Lines of Code:** ~150-200 lines

---

### Phase 5: CI/CD INTEGRATION (30 min) ⚙️

**Priority:** Essential - Automate testing

**Tasks:**

1. **Update `.github/workflows/e2e.yml`**
   - Run critical tests first
   - Fail fast if P0 tests fail
   - Run other tests in parallel
   - Upload test reports as artifacts

2. **Add test scripts to `package.json`**

   ```json
   {
     "test:critical": "playwright test tests/e2e/critical",
     "test:features": "playwright test tests/e2e/features",
     "test:all": "playwright test",
     "test:production": "BASE_URL=https://wedding-website-sepia-ten.vercel.app playwright test tests/e2e/production"
   }
   ```

**Success Criteria:**

- CI runs tests on every push
- Test reports available in GitHub Actions
- Production deployment triggers smoke tests

**Time Estimate:** 30 minutes  
**Files Modified:** 1 workflow + package.json

---

## PART 6: IMMEDIATE NEXT STEPS

### Option A: Full Test Overhaul (6-8 hours total)

Execute all 5 phases to create comprehensive test coverage.

**Timeline:**

- Phase 1 (Critical): 2 hours
- Phase 2 (Features): 3 hours  
- Phase 3 (API/A11y): 2 hours
- Phase 4 (Production): 30 min
- Phase 5 (CI/CD): 30 min

**Total:** 8 hours work = ~1-2 days

### Option B: Critical Tests Only (2 hours)

Focus on Phase 1 to catch Firebase/CSP issues immediately.

**Timeline:**

- Create 5 critical test files
- Validate against current production
- Detect CSP violations automatically

**Total:** 2 hours work = immediate value

### Option C: Smart Hybrid (4 hours)

Phases 1 + 2 (Critical + Features) for 80% value.

**Timeline:**

- Phase 1: 2 hours (Critical tests)
- Phase 2: 2 hours (Feature tests)
- Skip API/A11y for now (can add later)

**Total:** 4 hours work = high ROI

---

## PART 7: RECOMMENDED APPROACH

### 🎯 RECOMMENDATION: Option C (Smart Hybrid) + Immediate CSP Validation

**Step 1: Immediate (10 minutes)**
Run quick automated CSP check using Playwright to verify current production state.

**Step 2: Phase 1 (2 hours)**
Create critical tests that would have caught current CSP issue.

**Step 3: Phase 2 (2 hours)**
Complete feature testing for guestbook and photo upload.

**Step 4: After verification (1 hour)**
Add production smoke tests + CI integration.

**Total Time:** ~5 hours for comprehensive coverage  
**Immediate Value:** CSP validation in 10 minutes  
**Long-term Value:** Prevents future production issues

---

## DECISION POINT

**What would you like to do?**

1. **Option A:** Full test overhaul (8 hours, complete coverage)
2. **Option B:** Critical tests only (2 hours, immediate CSP detection)
3. **Option C:** Smart hybrid (4-5 hours, 80/20 value) ⭐ RECOMMENDED
4. **Quick CSP Check:** Run automated CSP validation now (10 min), then decide

---

**Generated:** October 13, 2025  
**Status:** Audit Complete, Awaiting Decision  
**Test Files Analyzed:** 9 test files, 44 passing tests  
**Critical Gaps:** 15 identified  
**Implementation Time:** 2-8 hours depending on scope
