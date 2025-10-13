/**
 * CRITICAL TEST: Console Error Monitoring
 * Global console error detection across all pages
 */

const { test, expect } = require('@playwright/test');

// Shared error collection
let globalErrors = [];
let globalWarnings = [];

test.describe('Console Error Monitoring (CRITICAL)', () => {
  test.beforeEach(async ({ page }) => {
    // Reset error collections
    globalErrors = [];
    globalWarnings = [];

    // Set up global console monitoring
    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();

      // Filter out known acceptable warnings
      const isAcceptableWarning =
        text.includes('ResizeObserver loop') ||
        text.includes('Download the React DevTools') ||
        text.includes('[HMR]') ||
        text.includes('[Fast Refresh]') ||
        text.includes('webpack-dev-server');

      if (type === 'error' && !isAcceptableWarning) {
        globalErrors.push({
          text,
          url: page.url(),
          timestamp: new Date().toISOString(),
        });
      } else if (type === 'warning' && !isAcceptableWarning) {
        globalWarnings.push({
          text,
          url: page.url(),
          timestamp: new Date().toISOString(),
        });
      }
    });

    // Monitor uncaught errors
    page.on('pageerror', (error) => {
      globalErrors.push({
        text: `Uncaught error: ${error.message}`,
        url: page.url(),
        timestamp: new Date().toISOString(),
        stack: error.stack,
      });
    });
  });

  test.afterEach(async () => {
    // Report collected errors after each test
    if (globalErrors.length > 0) {
      console.log(`\n⚠️  Collected ${globalErrors.length} console errors during test:`);
      globalErrors.slice(0, 5).forEach((err, i) => {
        console.log(`\n${i + 1}. [${err.url}]`);
        console.log(`   ${err.text.substring(0, 300)}`);
      });
    }

    if (globalWarnings.length > 0) {
      console.log(`\nℹ️  Collected ${globalWarnings.length} console warnings during test`);
    }
  });

  test('Homepage has NO critical console errors', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Wait for all scripts

    // Filter for CRITICAL errors only (CSP, network, JavaScript)
    const criticalErrors = globalErrors.filter(
      (err) =>
        err.text.includes('Content Security Policy') ||
        err.text.includes('Refused to connect') ||
        err.text.includes('net::ERR_') ||
        err.text.includes('Uncaught') ||
        err.text.includes('Firebase')
    );

    expect(criticalErrors).toHaveLength(0);

    if (criticalErrors.length > 0) {
      console.log(`❌ ${criticalErrors.length} critical errors on homepage`);
      throw new Error('Critical console errors detected on homepage');
    } else {
      console.log('✅ NO critical console errors on homepage');
    }
  });

  test('Guestbook page has NO critical console errors', async ({ page }) => {
    await page.goto('/guestbook');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(10000); // Wait for Firestore

    const criticalErrors = globalErrors.filter(
      (err) =>
        err.text.includes('Content Security Policy') ||
        err.text.includes('Refused to connect') ||
        err.text.includes('net::ERR_') ||
        err.text.includes('Uncaught') ||
        err.text.includes('Firebase') ||
        err.text.includes('Firestore')
    );

    expect(criticalErrors).toHaveLength(0);

    if (criticalErrors.length > 0) {
      console.log(`❌ ${criticalErrors.length} critical errors on guestbook`);
      criticalErrors.slice(0, 3).forEach((err, i) => {
        console.log(`\n${i + 1}. ${err.text.substring(0, 200)}`);
      });
      throw new Error('Critical console errors on guestbook page');
    } else {
      console.log('✅ NO critical console errors on guestbook page');
    }
  });

  test('Gallery page has NO critical console errors', async ({ page }) => {
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    const criticalErrors = globalErrors.filter(
      (err) =>
        err.text.includes('Content Security Policy') ||
        err.text.includes('net::ERR_') ||
        err.text.includes('Uncaught')
    );

    expect(criticalErrors).toHaveLength(0);

    if (criticalErrors.length > 0) {
      console.log(`❌ ${criticalErrors.length} critical errors on gallery`);
    } else {
      console.log('✅ NO critical console errors on gallery page');
    }
  });

  test('Map page has NO critical console errors', async ({ page }) => {
    await page.goto('/map');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Wait for map tiles

    const criticalErrors = globalErrors.filter(
      (err) =>
        err.text.includes('Content Security Policy') ||
        err.text.includes('net::ERR_') ||
        err.text.includes('Uncaught')
    );

    expect(criticalErrors).toHaveLength(0);

    if (criticalErrors.length > 0) {
      console.log(`❌ ${criticalErrors.length} critical errors on map page`);
    } else {
      console.log('✅ NO critical console errors on map page');
    }
  });

  test('NO CSP-related console errors across entire site', async ({ page }) => {
    const pages = ['/', '/guestbook', '/gallery', '/map'];
    const cspErrors = [];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);
    }

    // Collect all CSP errors
    const allCSPErrors = globalErrors.filter(
      (err) =>
        err.text.includes('Content Security Policy') || err.text.includes('Refused to connect')
    );

    expect(allCSPErrors).toHaveLength(0);

    if (allCSPErrors.length > 0) {
      console.log(`❌ ${allCSPErrors.length} CSP errors detected across site:`);
      allCSPErrors.slice(0, 5).forEach((err, i) => {
        console.log(`\n${i + 1}. [${err.url}]`);
        console.log(`   ${err.text.substring(0, 250)}`);
      });
      throw new Error('CSP errors found across site');
    } else {
      console.log('✅ NO CSP errors detected across entire site');
    }
  });

  test('NO uncaught JavaScript errors across site', async ({ page }) => {
    const pages = ['/', '/guestbook', '/gallery', '/map'];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
    }

    const uncaughtErrors = globalErrors.filter((err) => err.text.includes('Uncaught'));

    expect(uncaughtErrors).toHaveLength(0);

    if (uncaughtErrors.length > 0) {
      console.log(`❌ ${uncaughtErrors.length} uncaught errors detected:`);
      uncaughtErrors.forEach((err, i) => {
        console.log(`\n${i + 1}. [${err.url}]`);
        console.log(`   ${err.text.substring(0, 200)}`);
        if (err.stack) {
          console.log(`   Stack: ${err.stack.substring(0, 300)}`);
        }
      });
      throw new Error('Uncaught JavaScript errors found');
    } else {
      console.log('✅ NO uncaught JavaScript errors across site');
    }
  });

  test('Error threshold: <3 total errors per page', async ({ page }) => {
    const pages = ['/', '/guestbook', '/gallery', '/map'];
    const errorsByPage = {};

    for (const pagePath of pages) {
      globalErrors = []; // Reset for each page
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000);

      errorsByPage[pagePath] = globalErrors.length;
    }

    // Check each page meets threshold
    const pagesOverThreshold = Object.entries(errorsByPage).filter(([page, count]) => count >= 3);

    expect(pagesOverThreshold).toHaveLength(0);

    console.log('\nError counts by page:');
    Object.entries(errorsByPage).forEach(([pagePath, count]) => {
      const status = count === 0 ? '✅' : count < 3 ? '⚠️ ' : '❌';
      console.log(`   ${status} ${pagePath}: ${count} errors`);
    });

    if (pagesOverThreshold.length > 0) {
      console.log(`\n❌ ${pagesOverThreshold.length} pages exceed error threshold:`);
      pagesOverThreshold.forEach(([pagePath, count]) => {
        console.log(`   ${pagePath}: ${count} errors (threshold: <3)`);
      });
      throw new Error('Error threshold exceeded on some pages');
    } else {
      console.log('\n✅ All pages meet error threshold (<3 errors)');
    }
  });

  test('Firebase initialization errors are caught and logged', async ({ page }) => {
    const firebaseErrors = [];

    page.on('console', (msg) => {
      const text = msg.text();
      if (
        msg.type() === 'error' &&
        (text.includes('Firebase') || text.includes('Firestore') || text.includes('firebase'))
      ) {
        firebaseErrors.push(text);
      }
    });

    await page.goto('/guestbook');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(10000); // Full Firebase init cycle

    // Should have NO Firebase initialization errors
    expect(firebaseErrors).toHaveLength(0);

    if (firebaseErrors.length > 0) {
      console.log(`❌ ${firebaseErrors.length} Firebase errors detected:`);
      firebaseErrors.slice(0, 3).forEach((err, i) => {
        console.log(`\n${i + 1}. ${err.substring(0, 300)}`);
      });
      throw new Error('Firebase initialization errors found');
    } else {
      console.log('✅ NO Firebase initialization errors');
    }
  });
});
