# Automated Testing Suite for Single-Page Scroll Architecture

**Date Created**: October 2, 2025  
**Purpose**: Comprehensive automated testing for single-page scroll refactor  
**Status**: Ready to run

---

## 🎯 Test Suite Overview

This document provides automated tests using Playwright/Puppeteer that can be run to verify all aspects of the single-page scroll architecture.

---

## 📦 Installation

```bash
# If not already installed
cd site
npm install --save-dev @playwright/test
npx playwright install
```

---

## 🧪 Test Files

### Test 1: Navigation & Scroll-Spy

**File**: `site/tests/e2e/scroll-spy.spec.js`

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Scroll-Spy Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('should highlight Home section on page load', async ({ page }) => {
    const homeLink = page.locator('nav button:has-text("Home")');
    await expect(homeLink).toHaveClass(/font-semibold/);
  });

  test('should update active section on scroll', async ({ page }) => {
    // Scroll to Our Story section
    await page.evaluate(() => {
      document
        .getElementById('our-story')
        .scrollIntoView({ behavior: 'smooth' });
    });

    await page.waitForTimeout(1000); // Wait for scroll to complete

    const ourStoryLink = page.locator('nav button:has-text("Our Story")');
    await expect(ourStoryLink).toHaveClass(/font-semibold/);
  });

  test('should scroll through all 10 sections and update navigation', async ({
    page,
  }) => {
    const sections = [
      'hero',
      'our-story',
      'timeline',
      'gallery',
      'venue',
      'photobooth',
      'guestbook',
      'album',
      'upload',
      'map',
    ];

    for (const sectionId of sections) {
      await page.evaluate((id) => {
        document
          .getElementById(id)
          .scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, sectionId);

      await page.waitForTimeout(800);

      // Get the section label from the nav link
      const sectionLabels = {
        hero: 'Home',
        'our-story': 'Our Story',
        timeline: 'Timeline',
        gallery: 'Gallery',
        venue: 'Venue',
        photobooth: 'Photo Booth',
        guestbook: 'Guest Book',
        album: 'Album',
        upload: 'Upload',
        map: 'Map',
      };

      const navLink = page.locator(
        `nav button:has-text("${sectionLabels[sectionId]}")`
      );

      // Verify it has active styling (bold font)
      await expect(navLink).toHaveClass(/font-semibold/);

      console.log(`✓ ${sectionLabels[sectionId]} section: scroll-spy active`);
    }
  });

  test('should show underline on active section', async ({ page }) => {
    await page.evaluate(() => {
      document
        .getElementById('timeline')
        .scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    await page.waitForTimeout(1000);

    const timelineLink = page.locator('nav button:has-text("Timeline")');
    const underline = timelineLink.locator('span');

    await expect(underline).toHaveClass(/w-full/);
  });
});
```

---

### Test 2: Section Animations

**File**: `site/tests/e2e/section-animations.spec.js`

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Section Animations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('should trigger fade-in animation when section becomes visible', async ({
    page,
  }) => {
    // Scroll to Gallery section (should be off-screen initially)
    const gallerySection = page.locator('#gallery');

    // Check initial opacity (should be 0 or low before scroll)
    await page.evaluate(() => window.scrollTo(0, 0)); // Start at top

    // Now scroll to gallery
    await page.evaluate(() => {
      document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
    });

    // Wait for animation to trigger (IntersectionObserver threshold 0.2)
    await page.waitForTimeout(1500);

    // Check that section is now visible (opacity 1)
    const opacity = await gallerySection.evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });

    expect(parseFloat(opacity)).toBeGreaterThan(0.9);
    console.log('✓ Gallery section animated in with fade');
  });

  test('should apply animations to all sections', async ({ page }) => {
    const sections = [
      'our-story',
      'timeline',
      'gallery',
      'venue',
      'photobooth',
    ];

    for (const sectionId of sections) {
      await page.evaluate((id) => {
        document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
      }, sectionId);

      await page.waitForTimeout(1000);

      const section = page.locator(`#${sectionId}`);
      const opacity = await section.evaluate((el) => {
        return window.getComputedStyle(el).opacity;
      });

      expect(parseFloat(opacity)).toBeGreaterThan(0.9);
      console.log(`✓ ${sectionId} section animation triggered`);
    }
  });
});
```

---

### Test 3: Navigation Clicks & Smooth Scroll

**File**: `site/tests/e2e/navigation-clicks.spec.js`

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Navigation Click Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('should smooth scroll to section on nav link click', async ({
    page,
  }) => {
    // Start at top
    await page.evaluate(() => window.scrollTo(0, 0));

    // Click Timeline nav link
    await page.click('nav button:has-text("Timeline")');

    // Wait for scroll to complete
    await page.waitForTimeout(1500);

    // Verify Timeline section is in view
    const timelineSection = page.locator('#timeline');
    const isInViewport = await timelineSection.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.top < window.innerHeight / 2;
    });

    expect(isInViewport).toBe(true);
    console.log('✓ Timeline section scrolled into view');
  });

  test('should test all navigation links', async ({ page }) => {
    const links = [
      { text: 'Our Story', sectionId: 'our-story' },
      { text: 'Timeline', sectionId: 'timeline' },
      { text: 'Gallery', sectionId: 'gallery' },
      { text: 'Venue', sectionId: 'venue' },
      { text: 'Photo Booth', sectionId: 'photobooth' },
      { text: 'Guest Book', sectionId: 'guestbook' },
      { text: 'Album', sectionId: 'album' },
      { text: 'Upload', sectionId: 'upload' },
      { text: 'Map', sectionId: 'map' },
    ];

    for (const link of links) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);

      await page.click(`nav button:has-text("${link.text}")`);
      await page.waitForTimeout(1500);

      const section = page.locator(`#${link.sectionId}`);
      const isInViewport = await section.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top >= 0 && rect.top < window.innerHeight;
      });

      expect(isInViewport).toBe(true);
      console.log(`✓ ${link.text} navigation click works`);
    }
  });

  test('should activate clicked section in nav', async ({ page }) => {
    await page.click('nav button:has-text("Gallery")');
    await page.waitForTimeout(1500);

    const galleryLink = page.locator('nav button:has-text("Gallery")');
    await expect(galleryLink).toHaveClass(/font-semibold/);
    console.log('✓ Clicked nav link becomes active');
  });
});
```

---

### Test 4: Mobile Responsive Behavior

**File**: `site/tests/e2e/mobile-responsive.spec.js`

```javascript
const { test, expect, devices } = require('@playwright/test');

test.describe('Mobile Responsive Navigation', () => {
  test.use({ ...devices['iPhone 12'] });

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('should show hamburger menu on mobile', async ({ page }) => {
    const hamburger = page.locator('nav button[aria-label="Toggle menu"]');
    await expect(hamburger).toBeVisible();
    console.log('✓ Hamburger menu visible on mobile');
  });

  test('should open mobile menu on click', async ({ page }) => {
    await page.click('nav button[aria-label="Toggle menu"]');
    await page.waitForTimeout(300);

    const mobileMenu = page.locator('nav div.md\\:hidden.mt-4');
    await expect(mobileMenu).toBeVisible();
    console.log('✓ Mobile menu opens');
  });

  test('should close mobile menu after navigation click', async ({ page }) => {
    // Open menu
    await page.click('nav button[aria-label="Toggle menu"]');
    await page.waitForTimeout(300);

    // Click a nav link
    await page.click('nav div.md\\:hidden button:has-text("Gallery")');
    await page.waitForTimeout(1500);

    // Check if menu is closed
    const mobileMenu = page.locator('nav div.md\\:hidden.mt-4');
    await expect(mobileMenu).not.toBeVisible();
    console.log('✓ Mobile menu closes after navigation');
  });

  test('should navigate correctly from mobile menu', async ({ page }) => {
    await page.click('nav button[aria-label="Toggle menu"]');
    await page.waitForTimeout(300);

    await page.click('nav div.md\\:hidden button:has-text("Venue")');
    await page.waitForTimeout(1500);

    const venueSection = page.locator('#venue');
    const isInViewport = await venueSection.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.top < window.innerHeight;
    });

    expect(isInViewport).toBe(true);
    console.log('✓ Mobile navigation scrolls to section');
  });
});
```

---

### Test 5: Interactive Features

**File**: `site/tests/e2e/interactive-features.spec.js`

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Interactive Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('should test Gallery filter tabs', async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(1500);

    // Test filter tabs exist
    const allTab = page.locator('button:has-text("All")').first();
    const photosTab = page.locator('button:has-text("Photos")').first();
    const videosTab = page.locator('button:has-text("Videos")').first();

    await expect(allTab).toBeVisible();
    await expect(photosTab).toBeVisible();
    await expect(videosTab).toBeVisible();

    console.log('✓ Gallery filter tabs present');
  });

  test('should test Venue tabs', async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById('venue').scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(1500);

    // Test venue tabs
    const ceremonyTab = page.locator('button:has-text("Ceremony")').first();
    const receptionTab = page.locator('button:has-text("Reception")').first();

    await expect(ceremonyTab).toBeVisible();
    await expect(receptionTab).toBeVisible();

    // Click reception tab
    await receptionTab.click();
    await page.waitForTimeout(500);

    // Verify reception content shows
    const receptionContent = page.locator('text=Grand Ballroom');
    await expect(receptionContent).toBeVisible();

    console.log('✓ Venue tabs functional');
  });

  test('should verify Firebase timeline loads', async ({ page }) => {
    await page.evaluate(() => {
      document
        .getElementById('timeline')
        .scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(2000);

    // Check for either loading state or events
    const hasEvents = await page
      .locator('#timeline .timeline-event, #timeline text=Ceremony')
      .count();

    expect(hasEvents).toBeGreaterThan(0);
    console.log('✓ Timeline section renders events');
  });

  test('should test scroll buttons in sections', async ({ page }) => {
    // Test "View Gallery" button in Hero
    const viewGalleryBtn = page
      .locator('button:has-text("View Gallery")')
      .first();
    await viewGalleryBtn.click();
    await page.waitForTimeout(1500);

    const gallerySection = page.locator('#gallery');
    const isInViewport = await gallerySection.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.top < window.innerHeight;
    });

    expect(isInViewport).toBe(true);
    console.log('✓ Section scroll buttons work');
  });
});
```

---

### Test 6: Teaser Section Links

**File**: `site/tests/e2e/teaser-links.spec.js`

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Teaser Section Links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to Photo Booth page', async ({ page }) => {
    await page.evaluate(() => {
      document
        .getElementById('photobooth')
        .scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(1500);

    const photoBoothLink = page.locator('a:has-text("Open Photo Booth")');
    await expect(photoBoothLink).toHaveAttribute('href', '/photobooth');
    console.log('✓ Photo Booth link correct');
  });

  test('should navigate to Guest Book page', async ({ page }) => {
    await page.evaluate(() => {
      document
        .getElementById('guestbook')
        .scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(1500);

    const guestBookLink = page.locator('a:has-text("Open Guest Book")');
    await expect(guestBookLink).toHaveAttribute('href', '/guestbook');
    console.log('✓ Guest Book link correct');
  });

  test('should navigate to Album page', async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById('album').scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(1500);

    const albumLink = page.locator('a:has-text("Create Album")');
    await expect(albumLink).toHaveAttribute('href', '/album');
    console.log('✓ Album link correct');
  });

  test('should navigate to Upload page', async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById('upload').scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(1500);

    const uploadLink = page.locator('a:has-text("Upload Photos")');
    await expect(uploadLink).toHaveAttribute('href', '/upload');
    console.log('✓ Upload link correct');
  });

  test('should navigate to Map page', async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById('map').scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(1500);

    const mapLink = page.locator('a:has-text("View Map")');
    await expect(mapLink).toHaveAttribute('href', '/map');
    console.log('✓ Map link correct');
  });
});
```

---

## 🚀 Running the Tests

### Run All Tests

```bash
cd site
npx playwright test
```

### Run Specific Test Suite

```bash
npx playwright test tests/e2e/scroll-spy.spec.js
npx playwright test tests/e2e/section-animations.spec.js
npx playwright test tests/e2e/navigation-clicks.spec.js
npx playwright test tests/e2e/mobile-responsive.spec.js
npx playwright test tests/e2e/interactive-features.spec.js
npx playwright test tests/e2e/teaser-links.spec.js
```

### Run Tests with UI

```bash
npx playwright test --ui
```

### Run Tests in Headed Mode (See Browser)

```bash
npx playwright test --headed
```

### Generate HTML Report

```bash
npx playwright test --reporter=html
npx playwright show-report
```

---

## 📊 Expected Results

### All Tests Should Pass

- ✅ **Scroll-Spy Navigation** (4 tests)
  - Active section highlighting
  - Navigation updates on scroll
  - All 10 sections tested
  - Underline shows on active

- ✅ **Section Animations** (2 tests)
  - Fade-in animations trigger
  - All sections animate on scroll

- ✅ **Navigation Clicks** (3 tests)
  - Smooth scroll on click
  - All 9 nav links work
  - Clicked link becomes active

- ✅ **Mobile Responsive** (4 tests)
  - Hamburger menu visible
  - Menu opens on click
  - Menu closes after navigation
  - Mobile navigation works

- ✅ **Interactive Features** (4 tests)
  - Gallery filters present
  - Venue tabs functional
  - Timeline loads events
  - Scroll buttons work

- ✅ **Teaser Links** (5 tests)
  - Photo Booth link correct
  - Guest Book link correct
  - Album link correct
  - Upload link correct
  - Map link correct

**Total**: 22 automated tests

---

## 🐛 Troubleshooting

### Tests Fail to Start

```bash
# Ensure dev server is running
cd site
npm run dev

# In another terminal, run tests
npx playwright test
```

### Browser Not Installed

```bash
npx playwright install
```

### Tests Timeout

Increase timeout in `playwright.config.js`:

```javascript
module.exports = {
  timeout: 30000, // 30 seconds per test
  expect: {
    timeout: 10000, // 10 seconds for assertions
  },
};
```

---

## 📸 Screenshot Tests

Add screenshot capture to any test:

```javascript
await page.screenshot({ path: 'screenshots/hero-section.png' });
await page.screenshot({
  path: 'screenshots/full-page.png',
  fullPage: true,
});
```

---

## 🎯 Next Steps

After running automated tests:

1. Review test results
2. Fix any failing tests
3. Capture screenshots for documentation
4. Run performance audits with Lighthouse
5. Test on real mobile devices
6. Get user feedback

---

**Created**: October 2, 2025  
**Status**: Ready to run  
**Total Tests**: 22  
**Estimated Run Time**: 5-7 minutes
