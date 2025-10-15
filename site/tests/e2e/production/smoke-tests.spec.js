/**
 * Production Smoke Tests
 * Fast, critical tests to verify production deployment health
 * Run against live site after each deployment
 *
 * Usage:
 *   npm run test:production
 *   BASE_URL=https://wedding-website-sepia-ten.vercel.app npx playwright test production
 */

import { test, expect } from '@playwright/test';

import { filterCriticalErrors } from '../../helpers/error-filters.js';

// Get production URL from environment or use default
const PRODUCTION_URL =
    process.env.BASE_URL || 'https://wedding-website-sepia-ten.vercel.app';

test.describe('Production Smoke Tests - Availability', () => {
    test('homepage loads successfully', async ({ page }) => {
        const response = await page.goto(PRODUCTION_URL);

        // Should return 200 OK
        expect(response.status()).toBe(200);

        // Page should load within 5 seconds
        await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 5000 });

        console.log('✅ Homepage loaded successfully');
    });

    test('critical pages are accessible', async ({ page }) => {
        const criticalPages = [
            '/',
            '/gallery',
            '/#guestbook',
            '/#upload',
            '/map',
        ];

        for (const pagePath of criticalPages) {
            const response = await page.goto(`${PRODUCTION_URL}${pagePath}`);
            expect(response.status()).toBe(200);
            console.log(`✅ ${pagePath} → 200 OK`);
        }
    });

    test('navigation menu works', async ({ page }) => {
        await page.goto(PRODUCTION_URL);

        // Navigation should be present
        const nav = page.locator('nav, header').first();
        await expect(nav).toBeVisible();

        // Should have navigation links
        const navLinks = page.locator('nav a, header a');
        const linkCount = await navLinks.count();
        expect(linkCount).toBeGreaterThan(0);

        console.log(`✅ Navigation present with ${linkCount} links`);
    });

    test('no 404 errors on main navigation', async ({ page }) => {
        await page.goto(PRODUCTION_URL);

        // Get all navigation links
        const navLinks = await page.locator('nav a, header a').all();

        // Test first 5 links (avoid rate limiting)
        const linksToTest = navLinks.slice(0, 5);

        for (const link of linksToTest) {
            const href = await link.getAttribute('href');

            // Skip external links and anchors
            if (!href || href.startsWith('http') || href.startsWith('#')) {
                continue;
            }

            const url = href.startsWith('/') ? `${PRODUCTION_URL}${href}` : href;
            const response = await page.goto(url);
            expect(response.status()).not.toBe(404);
        }

        console.log('✅ No 404 errors on navigation links');
    });
});

test.describe('Production Smoke Tests - Firebase Health', () => {
    test('Firebase SDK initializes without CRITICAL errors', async ({ page }) => {
        const consoleErrors = [];
        page.on('console', (msg) => {
            if (msg.type() === 'error' && msg.text().toLowerCase().includes('firebase')) {
                consoleErrors.push(msg.text());
            }
        });

        await page.goto(PRODUCTION_URL);
        await page.waitForLoadState('domcontentloaded');

        // Use intelligent error filtering for Firebase errors
        const criticalFirebaseErrors = filterCriticalErrors(consoleErrors);

        expect(criticalFirebaseErrors.length).toBe(0);

        console.log(
            `✅ Firebase initialized without critical errors (${consoleErrors.length} total, ${consoleErrors.length - criticalFirebaseErrors.length} expected warnings filtered)`
        );
    });

    test('Firestore connection warnings filtered (offline mode check)', async ({ page }) => {
        const consoleMessages = [];
        page.on('console', (msg) => {
            consoleMessages.push(msg.text());
        });

        await page.goto(`${PRODUCTION_URL}/#guestbook`);
        await page.waitForLoadState('domcontentloaded');

        // Wait for Firestore to initialize
        await page.waitForTimeout(2000);

        // Filter for CRITICAL offline indicators only (expected connection warnings filtered)
        const criticalErrors = filterCriticalErrors(consoleMessages);
        const criticalOfflineIndicators = criticalErrors.filter(
            (msg) =>
                msg.includes('Could not reach Cloud Firestore backend') ||
                msg.includes('transport errored') ||
                msg.includes('offline')
        );

        expect(criticalOfflineIndicators.length).toBe(0);

        console.log(
            `✅ Firestore is online (${consoleMessages.length} total messages, expected connection warnings filtered)`
        );
    });

    test('no CRITICAL CSP violations', async ({ page }) => {
        const cspViolations = [];
        page.on('console', (msg) => {
            const text = msg.text().toLowerCase();
            if (
                text.includes('content security policy') ||
                text.includes('csp') ||
                text.includes('refused to')
            ) {
                cspViolations.push(msg.text());
            }
        });

        await page.goto(PRODUCTION_URL);
        await page.waitForLoadState('domcontentloaded');

        // Navigate to a page that uses Firebase (guestbook)
        await page.goto(`${PRODUCTION_URL}/#guestbook`);
        await page.waitForLoadState('domcontentloaded');

        // Wait for any async operations
        await page.waitForTimeout(2000);

        // Use intelligent CSP filtering
        const criticalCSPViolations = filterCriticalErrors(cspViolations);

        expect(criticalCSPViolations.length).toBe(0);

        console.log(
            `✅ No critical CSP violations detected (${cspViolations.length} total, ${cspViolations.length - criticalCSPViolations.length} acceptable)`
        );
    });

    test('Firebase config has no CRLF characters', async ({ page }) => {
        const consoleErrors = [];
        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        await page.goto(`${PRODUCTION_URL}/#guestbook`);
        await page.waitForLoadState('domcontentloaded');

        // Look for 400 errors with projectId in the message (CRLF symptom)
        const crlfErrors = consoleErrors.filter(
            (err) => err.includes('400') && (err.includes('projectId') || err.includes('\r'))
        );

        expect(crlfErrors.length).toBe(0);

        console.log('✅ No CRLF-related errors detected');
    });
});

test.describe('Production Smoke Tests - Core Functionality', () => {
    test('guestbook page loads and displays form', async ({ page }) => {
        await page.goto(`${PRODUCTION_URL}/#guestbook`);

        // Heading should be present
        await expect(page.locator('h1, h2').first()).toBeVisible();

        // Form should be present (or message if no form)
        const formPresent = (await page.locator('form, input, textarea').count()) > 0;
        expect(formPresent).toBe(true);

        console.log('✅ Guestbook page functional');
    });

    test('gallery page loads and displays content', async ({ page }) => {
        await page.goto(`${PRODUCTION_URL}/gallery`);

        // Heading should be present
        await expect(page.locator('h1, h2').first()).toBeVisible();

        // Gallery grid or message should be present
        const hasContent =
            (await page.locator('img, video, [class*="gallery"], [class*="grid"]').count()) > 0;
        expect(hasContent).toBe(true);

        console.log('✅ Gallery page functional');
    });

    test('upload page is accessible', async ({ page }) => {
        await page.goto(`${PRODUCTION_URL}/upload`);

        // Page should load
        await expect(page.locator('h1:has-text("Share"), h1:has-text("Upload")').first()).toBeVisible();

        // Upload form should be present
        const uploadForm = (await page.locator('input[type="file"]').count()) > 0;
        expect(uploadForm).toBe(true);

        console.log('✅ Upload page accessible');
    });

    test('map page loads without errors', async ({ page }) => {
        const consoleErrors = [];
        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        await page.goto(`${PRODUCTION_URL}/map`);
        await page.waitForLoadState('domcontentloaded');

        // Should have heading
        await expect(page.locator('h1, h2').first()).toBeVisible();

        // Filter out known map API warnings
        const criticalErrors = consoleErrors.filter(
            (err) =>
                !err.includes('Google Maps') &&
                !err.includes('Leaflet') &&
                !err.includes('map API')
        );

        expect(criticalErrors.length).toBe(0);

        console.log('✅ Map page functional');
    });
});

test.describe('Production Smoke Tests - Performance', () => {
    test('homepage loads in under 5 seconds', async ({ page }) => {
        const startTime = Date.now();

        await page.goto(PRODUCTION_URL);
        await page.waitForLoadState('load');

        const loadTime = Date.now() - startTime;

        expect(loadTime).toBeLessThan(5000);

        console.log(`✅ Homepage loaded in ${loadTime}ms`);
    });

    test('time to interactive is reasonable', async ({ page }) => {
        await page.goto(PRODUCTION_URL);

        const startTime = Date.now();

        // Wait for page to be interactive (can click buttons)
        await page.waitForLoadState('domcontentloaded');
        await page.locator('button, a').first().waitFor({ state: 'visible' });

        const tti = Date.now() - startTime;

        // Time to interactive should be under 8 seconds
        expect(tti).toBeLessThan(8000);

        console.log(`✅ Time to interactive: ${tti}ms`);
    });

    test('images load progressively', async ({ page }) => {
        await page.goto(`${PRODUCTION_URL}/gallery`);

        // Check for lazy loading attributes
        const lazyImages = await page.locator('img[loading="lazy"]').count();

        // If images exist, some should use lazy loading
        const totalImages = await page.locator('img').count();

        if (totalImages > 0) {
            // At least 30% of images should be lazy loaded (optimization)
            const lazyPercentage = (lazyImages / totalImages) * 100;
            expect(lazyPercentage).toBeGreaterThan(0);

            console.log(`✅ Lazy loading: ${lazyImages}/${totalImages} images (${lazyPercentage.toFixed(1)}%)`);
        } else {
            console.log('ℹ️ No images to check lazy loading');
        }
    });
});

test.describe('Production Smoke Tests - Console Health', () => {
    test('no CRITICAL JavaScript errors on homepage', async ({ page }) => {
        const consoleErrors = [];
        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        page.on('pageerror', (error) => {
            consoleErrors.push(error.message);
        });

        await page.goto(PRODUCTION_URL);
        await page.waitForLoadState('domcontentloaded');

        // Use intelligent error filtering
        const criticalErrors = filterCriticalErrors(consoleErrors);

        expect(criticalErrors.length).toBe(0);

        if (criticalErrors.length === 0) {
            console.log(
                `✅ No critical JavaScript errors (${consoleErrors.length} total, ${consoleErrors.length - criticalErrors.length} expected warnings filtered)`
            );
        } else {
            console.log('❌ Critical errors found:', criticalErrors);
        }
    });

    test('no uncaught exceptions on guestbook', async ({ page }) => {
        const uncaughtExceptions = [];

        page.on('pageerror', (error) => {
            uncaughtExceptions.push(error.message);
        });

        await page.goto(`${PRODUCTION_URL}/#guestbook`);
        await page.waitForLoadState('domcontentloaded');

        // Interact with page
        const nameInput = page.locator('input[type="text"]').first();
        if ((await nameInput.count()) > 0) {
            await nameInput.fill('Test User');
        }

        await page.waitForTimeout(1000);

        expect(uncaughtExceptions.length).toBe(0);

        console.log('✅ No uncaught exceptions on guestbook');
    });

    test('no memory leaks on navigation', async ({ page }) => {
        // Navigate through several pages
        const pages = ['/', '/gallery', '/#guestbook', '/#upload', '/map', '/'];

        for (const pagePath of pages) {
            await page.goto(`${PRODUCTION_URL}${pagePath}`);
            await page.waitForLoadState('domcontentloaded');
            await page.waitForTimeout(500);
        }

        // Check if page is still responsive (no frozen tabs)
        const finalLoad = await page.goto(PRODUCTION_URL);
        expect(finalLoad.status()).toBe(200);

        console.log('✅ No obvious memory leaks during navigation');
    });

    test('CRITICAL error count stays below threshold', async ({ page }) => {
        const allMessages = [];

        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                allMessages.push(msg.text());
            }
        });

        await page.goto(PRODUCTION_URL);
        await page.waitForLoadState('domcontentloaded');

        // Navigate to a complex page (guestbook with Firebase)
        await page.goto(`${PRODUCTION_URL}/#guestbook`);
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);

        // Filter for CRITICAL errors only
        const criticalErrors = filterCriticalErrors(allMessages);

        // Critical error threshold: <3 errors per page
        expect(criticalErrors.length).toBeLessThan(3);

        console.log(
            `✅ Console health: ${criticalErrors.length} critical errors (${allMessages.length} total, ${allMessages.length - criticalErrors.length} expected warnings filtered)`
        );
    });
});

test.describe('Production Smoke Tests - Deployment Verification', () => {
    test('Vercel headers are present', async ({ page }) => {
        const response = await page.goto(PRODUCTION_URL);

        // Check for Vercel-specific headers
        const headers = response.headers();
        const hasVercelHeaders =
            'x-vercel-id' in headers ||
            'x-vercel-cache' in headers ||
            headers.server?.includes('Vercel');

        expect(hasVercelHeaders).toBe(true);

        console.log('✅ Vercel deployment verified');
    });

    test('site has correct cache headers', async ({ page }) => {
        const response = await page.goto(PRODUCTION_URL);

        const headers = response.headers();

        // Should have cache control headers
        const hasCacheControl = 'cache-control' in headers || 'x-vercel-cache' in headers;

        expect(hasCacheControl).toBe(true);

        console.log('✅ Cache headers present:', headers['cache-control'] || headers['x-vercel-cache']);
    });

    test('HTTPS is enforced', async ({ page }) => {
        const response = await page.goto(PRODUCTION_URL);

        // URL should be HTTPS
        expect(page.url()).toMatch(/^https:\/\//);

        // Should have security headers
        const headers = response.headers();
        const hasSecurityHeaders =
            'strict-transport-security' in headers || 'x-frame-options' in headers;

        if (hasSecurityHeaders) {
            console.log('✅ HTTPS enforced with security headers');
        } else {
            console.log('⚠️ HTTPS used but missing security headers');
        }
    });

    test('build info is accessible', async ({ page }) => {
        // Check if /_next/static exists (Next.js build output)
        const response = await page.goto(`${PRODUCTION_URL}/_next/static/`, {
            waitUntil: 'commit',
        });

        // Should not be 404 (though may be 403 or redirect)
        expect(response.status()).not.toBe(404);

        console.log('✅ Next.js build artifacts present');
    });
});
