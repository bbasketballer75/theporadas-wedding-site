/**
 * CRITICAL TEST: Console Error Monitoring
 * Global console error detection across all pages
 */

const { test, expect } = require('@playwright/test');

const { dismissAllDevOverlays } = require('../../helpers/dismiss-dev-overlay');
const { filterCriticalErrors, categorizeErrors } = require('../../helpers/error-filters');

// Shared error collection
let globalErrors = [];
let globalWarnings = [];

test.describe('Console Error Monitoring (CRITICAL)', () => {
    test.beforeEach(async ({ page }) => {
        // Reset error collections
        globalErrors = [];
        globalWarnings = [];

        // Dismiss dev overlays on page load
        page.on('load', async () => {
            await dismissAllDevOverlays(page);
        });

        // Set up global console monitoring
        page.on('console', (msg) => {
            const type = msg.type();
            const text = msg.text();

            if (type === 'error') {
                globalErrors.push({
                    text,
                    url: page.url(),
                    timestamp: new Date().toISOString(),
                });
            } else if (type === 'warning') {
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
        // Report collected errors after each test with categorization
        if (globalErrors.length > 0) {
            const criticalErrors = filterCriticalErrors(globalErrors.map((e) => e.text));
            const categories = categorizeErrors(globalErrors.map((e) => e.text));

            console.log(`\n⚠️  Collected ${globalErrors.length} total errors (${criticalErrors.length} critical):`);

            if (categories.critical.length > 0) {
                console.log(`   ❌ Critical: ${categories.critical.length}`);
            }
            if (categories.firestore.length > 0) {
                console.log(`   ℹ️  Firestore (expected): ${categories.firestore.length}`);
            }
            if (categories.expected && categories.expected.length > 0) {
                console.log(`   ℹ️  Development (expected): ${categories.expected.length}`);
            }
            if (categories.csp.length > 0) {
                console.log(`   ℹ️  CSP (acceptable): ${categories.csp.length}`);
            }
            if (categories.other && categories.other.length > 0) {
                console.log(`   ⚠️  Other: ${categories.other.length}`);
            }

            if (criticalErrors.length > 0) {
                criticalErrors.slice(0, 5).forEach((err, i) => {
                    console.log(`\n${i + 1}. ${err.substring(0, 300)}`);
                });
            }
        }

        if (globalWarnings.length > 0) {
            console.log(`\nℹ️  Collected ${globalWarnings.length} console warnings during test`);
        }
    });

    test('Homepage has NO critical console errors', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(5000); // Wait for all scripts

        // Use intelligent error filtering
        const criticalErrors = filterCriticalErrors(globalErrors.map((e) => e.text));

        expect(criticalErrors).toHaveLength(0);

        if (criticalErrors.length > 0) {
            console.log(`❌ ${criticalErrors.length} critical errors on homepage`);
            throw new Error('Critical console errors detected on homepage');
        } else {
            console.log(
                `✅ NO critical console errors on homepage (${globalErrors.length} total, ${globalErrors.length - criticalErrors.length} filtered)`
            );
        }
    });

    test('Guestbook page has NO critical console errors', async ({ page }) => {
        await page.goto('/#guestbook');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(10000); // Wait for Firestore

        const criticalErrors = filterCriticalErrors(globalErrors.map((e) => e.text));

        expect(criticalErrors).toHaveLength(0);

        if (criticalErrors.length > 0) {
            console.log(`❌ ${criticalErrors.length} critical errors on guestbook`);
            criticalErrors.slice(0, 3).forEach((err, i) => {
                console.log(`\n${i + 1}. ${err.substring(0, 200)}`);
            });
            throw new Error('Critical console errors on guestbook page');
        } else {
            console.log(
                `✅ NO critical console errors on guestbook page (${globalErrors.length} total, ${globalErrors.length - criticalErrors.length} filtered)`
            );
        }
    });

    test('Gallery page has NO critical console errors', async ({ page }) => {
        await page.goto('/gallery');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(5000);

        const criticalErrors = filterCriticalErrors(globalErrors.map((e) => e.text));

        expect(criticalErrors).toHaveLength(0);

        if (criticalErrors.length > 0) {
            console.log(`❌ ${criticalErrors.length} critical errors on gallery`);
        } else {
            console.log(
                `✅ NO critical console errors on gallery page (${globalErrors.length} total, ${globalErrors.length - criticalErrors.length} filtered)`
            );
        }
    });

    test('Map page has NO critical console errors', async ({ page }) => {
        await page.goto('/map');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(5000); // Wait for map tiles

        const criticalErrors = filterCriticalErrors(globalErrors.map((e) => e.text));

        expect(criticalErrors).toHaveLength(0);

        if (criticalErrors.length > 0) {
            console.log(`❌ ${criticalErrors.length} critical errors on map page`);
        } else {
            console.log(
                `✅ NO critical console errors on map page (${globalErrors.length} total, ${globalErrors.length - criticalErrors.length} filtered)`
            );
        }
    });

    test('NO CSP-related console errors across entire site', async ({ page }) => {
        const pages = ['/', '/#guestbook', '/gallery', '/map'];

        for (const pagePath of pages) {
            await page.goto(pagePath);
            await page.waitForLoadState('domcontentloaded');
            await page.waitForTimeout(5000);
        }

        // Use intelligent CSP filtering (acceptable CSP violations filtered out)
        const criticalErrors = filterCriticalErrors(globalErrors.map((e) => e.text));
        const cspErrors = criticalErrors.filter(
            (err) => err.includes('Content Security Policy') || err.includes('Refused to connect')
        );

        expect(cspErrors).toHaveLength(0);

        if (cspErrors.length > 0) {
            console.log(`❌ ${cspErrors.length} critical CSP errors detected across site:`);
            cspErrors.slice(0, 5).forEach((err, i) => {
                console.log(`\n${i + 1}. ${err.substring(0, 250)}`);
            });
            throw new Error('Critical CSP errors found across site');
        } else {
            const totalCSP = globalErrors.filter(
                (e) => e.text.includes('Content Security Policy') || e.text.includes('Refused to connect')
            ).length;
            console.log(
                `✅ NO critical CSP errors detected across entire site (${totalCSP} acceptable CSP messages filtered)`
            );
        }
    });

    test('NO uncaught JavaScript errors across site', async ({ page }) => {
        const pages = ['/', '/#guestbook', '/gallery', '/map'];

        for (const pagePath of pages) {
            await page.goto(pagePath);
            await page.waitForLoadState('domcontentloaded');
            await page.waitForTimeout(3000);
        }

        const criticalErrors = filterCriticalErrors(globalErrors.map((e) => e.text));
        const uncaughtErrors = criticalErrors.filter((err) => err.includes('Uncaught'));

        expect(uncaughtErrors).toHaveLength(0);

        if (uncaughtErrors.length > 0) {
            console.log(`❌ ${uncaughtErrors.length} uncaught errors detected:`);
            uncaughtErrors.forEach((err, i) => {
                console.log(`\n${i + 1}. ${err.substring(0, 200)}`);
            });
            throw new Error('Uncaught JavaScript errors found');
        } else {
            console.log('✅ NO uncaught JavaScript errors across site');
        }
    });

    test('Error threshold: <3 CRITICAL errors per page', async ({ page }) => {
        const pages = ['/', '/#guestbook', '/gallery', '/map'];
        const errorsByPage = {};

        for (const pagePath of pages) {
            globalErrors = []; // Reset for each page
            await page.goto(pagePath);
            await page.waitForLoadState('domcontentloaded');
            await page.waitForTimeout(5000);

            const criticalErrors = filterCriticalErrors(globalErrors.map((e) => e.text));
            errorsByPage[pagePath] = {
                total: globalErrors.length,
                critical: criticalErrors.length,
            };
        }

        // Check each page meets threshold for CRITICAL errors only
        const pagesOverThreshold = Object.entries(errorsByPage).filter(
            ([_pageKey, counts]) => counts.critical >= 3
        );

        expect(pagesOverThreshold).toHaveLength(0);

        console.log('\nError counts by page:');
        Object.entries(errorsByPage).forEach(([pagePath, counts]) => {
            const status = counts.critical === 0 ? '✅' : counts.critical < 3 ? '⚠️ ' : '❌';
            console.log(
                `   ${status} ${pagePath}: ${counts.critical} critical (${counts.total} total, ${counts.total - counts.critical} filtered)`
            );
        });

        if (pagesOverThreshold.length > 0) {
            console.log(`\n❌ ${pagesOverThreshold.length} pages exceed critical error threshold:`);
            pagesOverThreshold.forEach(([pagePath, counts]) => {
                console.log(`   ${pagePath}: ${counts.critical} critical errors (threshold: <3)`);
            });
            throw new Error('Critical error threshold exceeded on some pages');
        } else {
            console.log('\n✅ All pages meet critical error threshold (<3 critical errors)');
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

        await page.goto('/#guestbook');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(10000); // Full Firebase init cycle

        // Filter for CRITICAL Firebase errors (not connection warnings)
        const criticalFirebaseErrors = filterCriticalErrors(firebaseErrors);

        expect(criticalFirebaseErrors).toHaveLength(0);

        if (criticalFirebaseErrors.length > 0) {
            console.log(`❌ ${criticalFirebaseErrors.length} critical Firebase errors detected:`);
            criticalFirebaseErrors.slice(0, 3).forEach((err, i) => {
                console.log(`\n${i + 1}. ${err.substring(0, 300)}`);
            });
            throw new Error('Critical Firebase initialization errors found');
        } else {
            console.log(
                `✅ NO critical Firebase initialization errors (${firebaseErrors.length} total, ${firebaseErrors.length - criticalFirebaseErrors.length} expected warnings filtered)`
            );
        }
    });
});
