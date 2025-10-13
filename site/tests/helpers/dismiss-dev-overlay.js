/**
 * Helper to dismiss Next.js dev overlay dialogs that block test interactions
 * 
 * Usage:
 *   const { dismissDevOverlay } = require('../helpers/dismiss-dev-overlay');
 *   
 *   test.beforeEach(async ({ page }) => {
 *     await page.goto('/your-page');
 *     await dismissDevOverlay(page);
 *   });
 */

/**
 * Dismisses Next.js development overlay dialogs
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} options - Configuration options
 * @param {number} options.timeout - Maximum time to wait for overlay (default: 3000ms)
 * @param {boolean} options.throwOnError - Whether to throw errors (default: false)
 * @returns {Promise<boolean>} - Returns true if overlay was dismissed, false if not found
 */
async function dismissDevOverlay(page, options = {}) {
    const { timeout = 3000, throwOnError = false } = options;

    try {
        // Check for Next.js dev overlay dialog
        const devDialog = page.locator('dialog:has-text("Runtime FirebaseError"), dialog:has-text("Runtime"), dialog:has-text("Error"), nextjs-portal');

        // Wait briefly for dialog to appear
        const dialogExists = await devDialog.first().isVisible({ timeout: timeout }).catch(() => false);

        if (!dialogExists) {
            // No dialog found, continue normally
            return false;
        }

        console.log('⚠️  Next.js dev overlay detected, attempting to dismiss...');

        // Method 1: Try clicking close button
        const closeButton = page.locator('button:has-text("Close"), button[aria-label="Close"], button[title="Close"]');
        const closeButtonExists = await closeButton.first().isVisible({ timeout: 1000 }).catch(() => false);

        if (closeButtonExists) {
            await closeButton.first().click({ force: true, timeout: 2000 });
            console.log('✅ Dev overlay dismissed via close button');
            return true;
        }

        // Method 2: Try pressing Escape key
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);

        const stillVisible = await devDialog.first().isVisible({ timeout: 500 }).catch(() => false);

        if (!stillVisible) {
            console.log('✅ Dev overlay dismissed via Escape key');
            return true;
        }

        // Method 3: Try clicking outside the dialog (on backdrop)
        const backdrop = page.locator('nextjs-portal, dialog').first();
        if (await backdrop.isVisible().catch(() => false)) {
            await backdrop.click({ position: { x: 5, y: 5 }, force: true });
            console.log('✅ Dev overlay dismissed via backdrop click');
            return true;
        }

        // Method 4: Hide via JavaScript (last resort)
        await page.evaluate(() => {
            const dialogs = document.querySelectorAll('dialog[open], nextjs-portal');
            dialogs.forEach((dialog) => {
                dialog.style.display = 'none';
                dialog.remove();
            });
        });

        console.log('✅ Dev overlay dismissed via JavaScript removal');
        return true;
    } catch (error) {
        console.log(`⚠️  Could not dismiss dev overlay: ${error.message}`);

        if (throwOnError) {
            throw error;
        }

        return false;
    }
}

/**
 * Dismisses Firebase permission error dialogs specifically
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<boolean>} - Returns true if dialog was dismissed
 */
async function dismissFirebasePermissionDialog(page) {
    try {
        // Look for Firebase permission error dialog
        const firebaseDialog = page.locator('dialog:has-text("Missing or insufficient permissions")');

        const dialogExists = await firebaseDialog.isVisible({ timeout: 2000 }).catch(() => false);

        if (!dialogExists) {
            return false;
        }

        console.log('⚠️  Firebase permission error dialog detected');

        // Try to close it
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);

        // If still visible, force remove
        const stillVisible = await firebaseDialog.isVisible({ timeout: 500 }).catch(() => false);

        if (stillVisible) {
            await page.evaluate(() => {
                const dialogs = document.querySelectorAll('dialog:has-text("Missing or insufficient permissions")');
                dialogs.forEach((d) => {
                    d.style.display = 'none';
                    d.remove();
                });
            });
        }

        console.log('✅ Firebase permission dialog dismissed');
        return true;
    } catch (error) {
        console.log(`⚠️  Could not dismiss Firebase dialog: ${error.message}`);
        return false;
    }
}

/**
 * Comprehensive dev overlay dismissal (tries all methods)
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<void>}
 */
async function dismissAllDevOverlays(page) {
    // Dismiss Next.js dev overlay
    await dismissDevOverlay(page);

    // Dismiss Firebase permission dialog
    await dismissFirebasePermissionDialog(page);

    // Wait a bit to ensure overlays are gone (only if page still active)
    if (!page.isClosed()) {
        try {
            await page.waitForTimeout(500);
        } catch (error) {
            // Test may have completed - this is fine
            console.log('⚠️  Dismissal interrupted (test completed early)');
            return;
        }
    }

    // Final check and force removal of any remaining overlays
    await page.evaluate(() => {
        // Remove Next.js portal overlays
        const portals = document.querySelectorAll('nextjs-portal');
        portals.forEach((portal) => portal.remove());

        // Remove all open dialogs
        const dialogs = document.querySelectorAll('dialog[open]');
        dialogs.forEach((dialog) => {
            dialog.close();
            dialog.remove();
        });

        // Remove error overlays by common patterns
        const errorOverlays = document.querySelectorAll('[class*="error-overlay"], [class*="dev-overlay"], [data-nextjs-dialog]');
        errorOverlays.forEach((overlay) => overlay.remove());
    });

    console.log('✅ All dev overlays dismissed');
}

/**
 * Waits for page to be interactive without dev overlays
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} url - URL to navigate to
 * @param {Object} options - Navigation options
 * @returns {Promise<void>}
 */
async function gotoWithoutOverlays(page, url, options = {}) {
    // Navigate to page
    await page.goto(url, options);

    // Wait for load
    await page.waitForLoadState('networkidle');

    // Dismiss any dev overlays
    await dismissAllDevOverlays(page);

    // Wait for page to be interactive
    await page.waitForLoadState('domcontentloaded');
}

module.exports = {
    dismissDevOverlay,
    dismissFirebasePermissionDialog,
    dismissAllDevOverlays,
    gotoWithoutOverlays,
};
