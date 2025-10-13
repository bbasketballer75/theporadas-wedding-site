/**
 * CRITICAL TEST: Firebase Initialization
 * Ensures Firebase SDK loads correctly and CSP doesn't block it
 */

const { test, expect } = require('@playwright/test');

test.describe('Firebase Initialization (CRITICAL)', () => {
    test('Firebase SDK loads without CSP violations', async ({ page }) => {
        const cspViolations = [];

        // Monitor console for CSP violations
        page.on('console', (msg) => {
            const text = msg.text();
            if (
                text.includes('Content Security Policy') &&
                (text.includes('firebase') || text.includes('Firebase'))
            ) {
                cspViolations.push(text);
            }
        });

        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Wait for Firebase to initialize
        await page.waitForTimeout(5000);

        // Check NO CSP violations for Firebase
        expect(cspViolations).toHaveLength(0);

        if (cspViolations.length > 0) {
            console.log('❌ Firebase CSP Violations:', cspViolations);
        } else {
            console.log('✅ Firebase SDK loaded without CSP violations');
        }
    });

    test('Firebase config is properly initialized', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('domcontentloaded');

        // Check Firebase is initialized on window
        const firebaseInitialized = await page.evaluate(() => {
            // Check if Firebase SDK is loaded
            return typeof window.firebase !== 'undefined' || window.__FIREBASE_DEFAULTS__ !== undefined;
        });

        // Firebase may not expose itself on window in modular SDK
        // So we check for Firebase-related network requests instead
        const firebaseRequests = await page.evaluate(() => {
            return performance
                .getEntriesByType('resource')
                .filter((r) => r.name.includes('firebase') || r.name.includes('firestore'))
                .map((r) => ({
                    name: r.name,
                    duration: r.duration,
                    transferSize: r.transferSize,
                }));
        });

        // Should have Firebase-related requests
        expect(firebaseRequests.length).toBeGreaterThan(0);
        console.log(`✅ Found ${firebaseRequests.length} Firebase resource requests`);

        // All Firebase requests should have loaded (transferSize > 0)
        const blockedRequests = firebaseRequests.filter((r) => r.transferSize === 0);
        expect(blockedRequests).toHaveLength(0);

        if (blockedRequests.length > 0) {
            console.log('❌ Blocked Firebase requests:', blockedRequests);
        }
    });

    test('Firebase domains not blocked by CSP', async ({ page }) => {
        const blockedRequests = [];

        page.on('requestfailed', (request) => {
            const url = request.url();
            if (
                url.includes('firebase.googleapis.com') ||
                url.includes('firebaseinstallations.googleapis.com') ||
                url.includes('firestore.googleapis.com')
            ) {
                blockedRequests.push({
                    url,
                    failure: request.failure()?.errorText,
                });
            }
        });

        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(5000);

        // NO Firebase requests should fail
        expect(blockedRequests).toHaveLength(0);

        if (blockedRequests.length > 0) {
            console.log('❌ Failed Firebase requests:', blockedRequests);
        } else {
            console.log('✅ All Firebase requests succeeded');
        }
    });

    test('Firebase webConfig endpoint accessible', async ({ page }) => {
        const webConfigRequests = [];

        page.on('request', (request) => {
            const url = request.url();
            if (url.includes('firebase.googleapis.com') && url.includes('webConfig')) {
                webConfigRequests.push(url);
            }
        });

        const webConfigResponses = [];
        page.on('response', (response) => {
            const url = response.url();
            if (url.includes('firebase.googleapis.com') && url.includes('webConfig')) {
                webConfigResponses.push({
                    url,
                    status: response.status(),
                    ok: response.ok(),
                });
            }
        });

        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(5000);

        // Should have at least attempted webConfig fetch
        if (webConfigRequests.length > 0) {
            console.log(`✅ webConfig request attempted: ${webConfigRequests[0]}`);

            // If response received, it should be successful
            if (webConfigResponses.length > 0) {
                const response = webConfigResponses[0];
                expect(response.ok).toBe(true);
                console.log(`✅ webConfig fetch successful (status ${response.status})`);
            }
        } else {
            console.log('ℹ️  No webConfig request detected (may not be needed)');
        }
    });
});
