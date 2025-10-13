/**
 * CRITICAL TEST: CSP Policy Validation
 * Ensures Content Security Policy doesn't block required resources
 */

const { test, expect } = require('@playwright/test');
const { filterCriticalErrors } = require('../../helpers/error-filters');
const { dismissAllDevOverlays } = require('../../helpers/dismiss-dev-overlay');

test.describe('CSP Policy Validation (CRITICAL)', () => {
    test.beforeEach(async ({ page }) => {
        // Dismiss dev overlays on page load
        page.on('load', async () => {
            await dismissAllDevOverlays(page);
        });
    });
    test('NO CRITICAL CSP violations on homepage', async ({ page }) => {
        const cspViolations = [];

        page.on('console', (msg) => {
            const text = msg.text();
            if (text.includes('Content Security Policy') || text.includes('Refused to connect')) {
                cspViolations.push({
                    type: msg.type(),
                    text,
                    timestamp: new Date().toISOString(),
                });
            }
        });

        await page.goto('/');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(5000); // Wait for all resources

        // Use intelligent error filtering for CSP violations
        const criticalCSPViolations = filterCriticalErrors(cspViolations.map((v) => v.text));

        expect(criticalCSPViolations).toHaveLength(0);

        if (criticalCSPViolations.length > 0) {
            console.log(`❌ Found ${criticalCSPViolations.length} CRITICAL CSP violations:`);
            criticalCSPViolations.slice(0, 5).forEach((v, i) => {
                console.log(`\n${i + 1}. ${v.substring(0, 300)}`);
            });
            throw new Error(`${criticalCSPViolations.length} critical CSP violations detected`);
        } else {
            console.log(
                `✅ NO critical CSP violations on homepage (${cspViolations.length} total, ${cspViolations.length - criticalCSPViolations.length} acceptable)`
            );
        }
    });

    test('NO CRITICAL CSP violations on guestbook page', async ({ page }) => {
        const cspViolations = [];

        page.on('console', (msg) => {
            const text = msg.text();
            if (text.includes('Content Security Policy') || text.includes('Refused to connect')) {
                cspViolations.push(text);
            }
        });

        await page.goto('/guestbook');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(10000); // Wait for Firestore initialization

        const criticalCSPViolations = filterCriticalErrors(cspViolations);

        expect(criticalCSPViolations).toHaveLength(0);

        if (criticalCSPViolations.length > 0) {
            console.log(`❌ Found ${criticalCSPViolations.length} critical CSP violations on guestbook`);
            throw new Error('Critical CSP violations on guestbook page');
        } else {
            console.log(
                `✅ NO critical CSP violations on guestbook page (${cspViolations.length} total, ${cspViolations.length - criticalCSPViolations.length} acceptable)`
            );
        }
    });

    test('NO CRITICAL CSP violations on gallery page', async ({ page }) => {
        const cspViolations = [];

        page.on('console', (msg) => {
            const text = msg.text();
            if (text.includes('Content Security Policy')) {
                cspViolations.push(text);
            }
        });

        await page.goto('/gallery');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(5000);

        const criticalCSPViolations = filterCriticalErrors(cspViolations);

        expect(criticalCSPViolations).toHaveLength(0);

        if (criticalCSPViolations.length > 0) {
            console.log(`❌ Found ${criticalCSPViolations.length} critical CSP violations on gallery`);
        } else {
            console.log(
                `✅ NO critical CSP violations on gallery page (${cspViolations.length} total, ${cspViolations.length - criticalCSPViolations.length} acceptable)`
            );
        }
    });

    test('Firebase base domains allowed by CSP', async ({ page }) => {
        const blockedDomains = [];

        page.on('console', (msg) => {
            const text = msg.text();
            if (text.includes('Refused to connect')) {
                // Extract blocked domain from error message
                const match = text.match(/Refused to connect to '(https?:\/\/[^']+)'/);
                if (match) {
                    blockedDomains.push(match[1]);
                }
            }
        });

        await page.goto('/guestbook');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(10000);

        // Check specifically for Firebase base domains
        const firebaseBaseBlocked = blockedDomains.filter(
            (url) =>
                url.startsWith('https://firebase.googleapis.com') ||
                url.startsWith('https://firebaseinstallations.googleapis.com') ||
                url.startsWith('https://firestore.googleapis.com')
        );

        expect(firebaseBaseBlocked).toHaveLength(0);

        if (firebaseBaseBlocked.length > 0) {
            console.log('❌ Firebase base domains blocked by CSP:');
            firebaseBaseBlocked.forEach((url) => console.log(`   ${url}`));
            throw new Error('CSP blocking Firebase base domains');
        } else {
            console.log('✅ Firebase base domains allowed by CSP');
        }
    });

    test('CSP meta tag exists in document', async ({ page }) => {
        await page.goto('/');

        // Check for CSP meta tag
        const cspMetaTag = await page.locator('meta[http-equiv="Content-Security-Policy"]').first();
        const exists = await cspMetaTag.count();

        expect(exists).toBeGreaterThan(0);

        if (exists > 0) {
            const content = await cspMetaTag.getAttribute('content');
            console.log('✅ CSP meta tag found');

            // Verify it includes Firebase domains
            const includesFirebase =
                content.includes('firebase.googleapis.com') &&
                content.includes('firebaseinstallations.googleapis.com') &&
                content.includes('firestore.googleapis.com');

            expect(includesFirebase).toBe(true);

            if (includesFirebase) {
                console.log('✅ CSP includes all required Firebase domains');
            } else {
                console.log('❌ CSP missing required Firebase domains');
                console.log('CSP content:', content.substring(0, 500));
            }
        }
    });

    test('All third-party resources load without CSP blocking', async ({ page }) => {
        const blockedResources = [];

        page.on('requestfailed', (request) => {
            blockedResources.push({
                url: request.url(),
                failure: request.failure()?.errorText,
            });
        });

        await page.goto('/');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(5000);

        // Filter for resources that might be CSP-related failures
        const cspBlocked = blockedResources.filter((r) =>
            r.failure?.includes('ERR_BLOCKED_BY_CSP')
        );

        expect(cspBlocked).toHaveLength(0);

        if (cspBlocked.length > 0) {
            console.log('❌ Resources blocked by CSP:');
            cspBlocked.forEach((r) => console.log(`   ${r.url}`));
        } else if (blockedResources.length > 0) {
            console.log(`ℹ️  ${blockedResources.length} resources failed (non-CSP reasons)`);
        } else {
            console.log('✅ All resources loaded successfully');
        }
    });

    test('CSP allows required CDNs and services', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('domcontentloaded');

        // Check CSP policy includes required domains
        const cspContent = await page.evaluate(() => {
            const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
            return meta ? meta.getAttribute('content') : '';
        });

        // Required domains for the site
        const requiredDomains = [
            'firebase.googleapis.com',
            'firebaseinstallations.googleapis.com',
            'firestore.googleapis.com',
            '*.firebase.googleapis.com',
            '*.firebaseio.com',
            '*.supabase.co',
            '*.google-analytics.com',
            '*.googletagmanager.com',
            'maps.googleapis.com',
            'www.googleapis.com',
            '*.vercel.app',
            '*.vercel.com',
            '*.ingest.sentry.io',
            'youtube-nocookie.com',
        ];

        const missingDomains = requiredDomains.filter((domain) => !cspContent.includes(domain));

        expect(missingDomains).toHaveLength(0);

        if (missingDomains.length > 0) {
            console.log('❌ CSP missing required domains:');
            missingDomains.forEach((d) => console.log(`   ${d}`));
            throw new Error(`CSP policy incomplete: missing ${missingDomains.length} domains`);
        } else {
            console.log('✅ CSP includes all required domains');
        }
    });
});
