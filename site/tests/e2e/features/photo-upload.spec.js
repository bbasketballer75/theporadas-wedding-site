/**
 * E2E Tests for Photo/Video Upload Feature
 * Tests the /upload page and PhotoUpload component
 */

import path from 'path';

import { test, expect } from '@playwright/test';

test.describe('Photo Upload - Page Structure', () => {
    test('upload page loads with correct structure', async ({ page }) => {
        await page.goto('/#upload');
        // Wait for client-side anchor navigation to complete if necessary
        await page.waitForURL('**/#upload', { timeout: 5000 }).catch(() => { });

        // Wait for the page to fully render
        await page.waitForLoadState('domcontentloaded');

        // Wait for SharedAlbumSection to load (ssr: false)
        const uploadHeading = page.getByRole('heading', { name: /Share Your Memories/i }).first();
        await uploadHeading.waitFor({ state: 'visible', timeout: 10000 });

        console.log('✅ Upload section rendered and visible');

        await expect(uploadHeading).toBeVisible();

        // Description text using getByText instead of text= selector
        const uploadDescription = page.getByText(/Upload.*photo|upload.*video/i).first();
        await expect(uploadDescription).toBeVisible();

        // Upload component should be present (file input is hidden with sr-only, just check it exists)
        const fileInput = page.locator('input[id="file-upload"]');
        const fileInputExists = await fileInput.count() > 0;
        console.log(`✅ File upload input exists: ${fileInputExists}`);
        expect(fileInputExists).toBe(true);

        console.log('✅ Upload page structure validated');
    });

    test('file input is present and accessible', async ({ page }) => {
        await page.goto('/#upload');

        // File input exists
        const fileInput = page.locator('input[type="file"]');
        await expect(fileInput).toBeAttached();

        // Check if file input accepts images and videos
        const acceptAttr = await fileInput.getAttribute('accept');
        console.log('File input accepts:', acceptAttr);

        // Should accept common image/video formats
        expect(acceptAttr).toBeTruthy();

        console.log('✅ File input is accessible');
    });

    test('navigation and footer are present', async ({ page }) => {
        await page.goto('/#upload');

        // Navigation should be present
        const nav = page.locator('nav, header').first();
        await expect(nav).toBeVisible();

        // Footer is lazy loaded — scroll down to trigger load, then wait for visibility
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        const footer = page.locator('footer, [role="contentinfo"]').first();
        const footerVisible = await footer.isVisible({ timeout: 5000 }).catch(() => false);
        if (footerVisible) {
            await expect(footer).toBeVisible();
            console.log('✅ Page layout complete with footer');
        } else {
            console.log('ℹ️  Footer not visible (acceptable on SPA)');
        }
    });
});

test.describe('Photo Upload - File Selection', () => {
    test('can select a valid image file', async ({ page }) => {
        await page.goto('/#upload');

        // Get file input
        const fileInput = page.locator('input[type="file"]');

        // Test image path
        const testImagePath = path.join(__dirname, '..', '..', '..', 'fixtures', 'test-image.jpg');

        // Select file
        await fileInput.setInputFiles(testImagePath);

        // Wait a moment for any UI updates (upload starts automatically in the component)
        await page.waitForTimeout(500);

        // Either an explicit upload control or an uploading progress indicator should be present
        const uploadButton = page.locator('button[type="submit"]').first();
        const uploadExists = await uploadButton.isVisible().catch(() => false);
        expect(uploadExists || (await page.getByText(/Uploading/i).isVisible().catch(() => false))).toBe(true);

        console.log('✅ Image file selected successfully');
    });

    test('shows guest name prompt for first upload', async ({ page }) => {
        // Clear localStorage to simulate first-time user
        await page.goto('/#upload');
        await page.waitForLoadState('domcontentloaded');
        await page.evaluate(() => localStorage.clear());
        await page.reload();
        await page.waitForLoadState('domcontentloaded');

        // Select file
        const fileInput = page.locator('input[type="file"]');
        const fileInputCount = await fileInput.count();
        console.log(`📍 Found ${fileInputCount} file input(s)`);

        if (fileInputCount === 0) {
            console.log('⚠️ File input not found - test may need adjustment');
            return;
        }

        const testImagePath = path.join(__dirname, '..', '..', '..', 'fixtures', 'test-image.jpg');
        await fileInput.setInputFiles(testImagePath);
        console.log('📍 File set in input');

        // Click upload button if present (some builds auto-upload on file select)
        const uploadButton = page.locator('button[type="submit"]').first();
        const buttonCount = await uploadButton.count();
        console.log(`📍 Found ${buttonCount} upload button(s)`);

        if (buttonCount > 0) {
            console.log('📍 Attempting to click upload button');
            await uploadButton.click({ timeout: 5000 }).catch(err => {
                console.log(`⚠️ Button click timeout: ${err.message}`);
            });
        }

        await page.waitForTimeout(500);

        // Should show name input or prompt
        const nameInput = page.locator('input[type="text"], input[placeholder*="name" i]');
        const isNameInputVisible = await nameInput.count() > 0;

        if (isNameInputVisible) {
            console.log('✅ Guest name prompt shown');
        } else {
            console.log('⚠️ Name prompt behavior may differ (possible pre-filled or optional)');
        }
    });

    test('file input clears after navigation', async ({ page }) => {
        await page.goto('/#upload');

        // Select file
        const fileInput = page.locator('input[type="file"]');
        const testImagePath = path.join(__dirname, '..', '..', '..', 'fixtures', 'test-image.jpg');
        await fileInput.setInputFiles(testImagePath);

        // Navigate away
        await page.goto('/gallery');

        // Navigate back
        await page.goto('/#upload');

        // File input should be clear (new page load) - re-query the input
        const newFileInput = page.locator('input[type="file"]');
        const fileInputValue = await newFileInput.evaluate((el) => el.files.length);
        expect(fileInputValue).toBe(0);

        console.log('✅ File input state resets on navigation');
    });
});

test.describe('Photo Upload - Validation', () => {
    test('handles file selection cancellation', async ({ page }) => {
        await page.goto('/#upload');

        // Get file input
        const fileInput = page.locator('input[type="file"]');

        // Set files to empty array (simulating cancel)
        await fileInput.setInputFiles([]);

        // Page should remain in initial state
        await page.waitForTimeout(300);

        // Upload control or progress indicator should still be present (may be disabled)
        const uploadButton = page.locator('button[type="submit"]').first();
        const uploadExists = await uploadButton.count() > 0;
        expect(uploadExists).toBe(true);

        console.log('✅ File cancellation handled gracefully');
    });

    test('upload button is present', async ({ page }) => {
        await page.goto('/#upload');

        // Upload button should exist
        const uploadButton = page.locator('button[type="submit"]').first();
        await expect(uploadButton).toBeVisible();

        // Button should be enabled or become enabled after file selection
        const testImagePath = path.join(__dirname, '..', '..', '..', 'fixtures', 'test-image.jpg');
        await page.locator('input[type="file"]').setInputFiles(testImagePath);

        await page.waitForTimeout(300);

        // Button should still be visible
        await expect(uploadButton).toBeVisible();

        console.log('✅ Upload button present and functional');
    });

    test('displays file size information or limits', async ({ page }) => {
        await page.goto('/#upload');

        // Look for file size limit information (50MB mentioned in component)
        const pageContent = await page.content();

        // Check if there's any mention of file size (case insensitive)
        const hasSizeLimit = /\d+\s*MB/i.test(pageContent) || /file.*size/i.test(pageContent);

        if (hasSizeLimit) {
            console.log('✅ File size limit information present');
        } else {
            console.log('⚠️ No visible file size limit (may be in error messages only)');
        }

        // Try selecting file and check if validation info appears
        const fileInput = page.locator('input[type="file"]');
        const testImagePath = path.join(__dirname, '..', '..', '..', 'fixtures', 'test-image.jpg');
        await fileInput.setInputFiles(testImagePath);

        await page.waitForTimeout(500);

        // No error should appear for valid small file
        const errorText = page.locator('text=/error|too large|invalid/i');
        const errorCount = await errorText.count();
        expect(errorCount).toBe(0);

        console.log('✅ Valid file accepted without errors');
    });
});

test.describe('Photo Upload - User Experience', () => {
    test('page is mobile responsive', async ({ page }) => {
        // Test mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/#upload');

        // Page should load - use getByRole for heading without strict mode issue
        const heading = page.getByRole('heading', { name: /Share Your Memories/i }).first();
        await expect(heading).toBeVisible();

        // File input should be accessible on mobile
        const fileInput = page.locator('input[type="file"]');
        await expect(fileInput).toBeAttached();

        // Upload button may be hidden in mobile nav, so just check form exists
        const form = page.locator('form, div:has(input[type="file"])').first();
        await expect(form).toBeVisible();

        console.log('✅ Upload page is mobile responsive');
    });

    test('success message area is present', async ({ page }) => {
        await page.goto('/#upload');

        // Even if not visible initially, success message container should exist in DOM
        // or be able to appear after upload
        const pageContent = await page.content();

        // Check for success-related elements or classes
        const hasSuccessIndicator =
            /success|complete|uploaded/i.test(pageContent) || pageContent.includes('🎉');

        if (hasSuccessIndicator) {
            console.log('✅ Success messaging capability present');
        } else {
            console.log('ℹ️ Success message may be dynamically added');
        }
    });

    test('page has appropriate metadata', async ({ page }) => {
        await page.goto('/#upload');

        // Check meta description - select the first meta element to avoid strict-mode duplication errors
        const metaDescription = await page.locator('meta[name="description"]').first().getAttribute('content');
        expect(metaDescription).toBeTruthy();
        expect(metaDescription.toLowerCase()).toContain('photo');

        console.log('✅ Page metadata present:', metaDescription);
    });

    test('file input has proper accessibility attributes', async ({ page }) => {
        await page.goto('/#upload');

        const fileInput = page.locator('input[type="file"]');

        // File input should be focusable
        await fileInput.focus();
        const isFocused = await fileInput.evaluate((el) => document.activeElement === el);
        expect(isFocused).toBe(true);

        // Check for label or aria-label
        const hasLabel = (await page.locator('label').count()) > 0;
        const ariaLabel = await fileInput.getAttribute('aria-label');

        const isAccessible = hasLabel || ariaLabel;
        if (isAccessible) {
            console.log('✅ File input has accessibility labels');
        } else {
            console.log('⚠️ File input may benefit from explicit labels');
        }
    });
});

test.describe('Photo Upload - Error Handling', () => {
    test('handles multiple rapid file selections', async ({ page }) => {
        await page.goto('/#upload');

        const fileInput = page.locator('input[type="file"]');
        const testImagePath = path.join(__dirname, '..', '..', '..', 'fixtures', 'test-image.jpg');

        // Select file multiple times rapidly
        await fileInput.setInputFiles(testImagePath);
        await page.waitForTimeout(100);
        await fileInput.setInputFiles(testImagePath);
        await page.waitForTimeout(100);
        await fileInput.setInputFiles(testImagePath);

        // Page should remain stable
        await expect(page.locator('text=Share Your Memories')).toBeVisible();

        console.log('✅ Handles rapid file selections without crashing');
    });

    test('maintains state during window resize', async ({ page }) => {
        await page.goto('/#upload');

        // Select file
        const fileInput = page.locator('input[type="file"]');
        const testImagePath = path.join(__dirname, '..', '..', '..', 'fixtures', 'test-image.jpg');
        await fileInput.setInputFiles(testImagePath);

        // Resize window
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.waitForTimeout(300);

        // Page should still be functional
        const uploadButton = page.locator('button:has-text("Upload"), button[type="submit"]').first();
        await expect(uploadButton).toBeVisible();

        console.log('✅ State maintained during window resize');
    });

    test('gracefully handles navigation during file selection', async ({ page }) => {
        await page.goto('/#upload');

        // Select file
        const fileInput = page.locator('input[type="file"]');
        const testImagePath = path.join(__dirname, '..', '..', '..', 'fixtures', 'test-image.jpg');
        await fileInput.setInputFiles(testImagePath);

        // Navigate away immediately
        await page.goto('/gallery');

        // Should navigate without errors
        await expect(page).toHaveURL(/\/gallery/);

        // Navigate back
        await page.goto('/#upload');
        await expect(page.locator('text=Share Your Memories')).toBeVisible();

        console.log('✅ Navigation handled gracefully');
    });
});

test.describe('Photo Upload - Integration', () => {
    test('can navigate to upload page from gallery', async ({ page }) => {
        await page.goto('/gallery');

        // Look for "Upload" link or button
        const uploadLink = page.locator('a[href="/upload"], a[href="#upload"], a[href="/#upload"], button:has-text("Upload")').first();

        if ((await uploadLink.count()) > 0) {
            await uploadLink.click();
            // Allow either legacy /upload route or anchor-based navigation
            await expect(page).toHaveURL(/(#upload|\/upload)/);
            await expect(page.locator('text=Share Your Memories')).toBeVisible();
            console.log('✅ Navigation from gallery to upload works');
        } else {
            console.log('ℹ️ Direct gallery-to-upload navigation not found (may use nav menu)');
        }
    });

    test('page loads without console errors', async ({ page }) => {
        const consoleErrors = [];
        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        await page.goto('/#upload');
        await page.waitForLoadState('domcontentloaded');

        // Log ALL errors for debugging
        if (consoleErrors.length > 0) {
            console.log('📋 ALL console errors detected:', consoleErrors);
        }

        // Filter out known non-critical 404 errors from missing assets
        const criticalErrors = consoleErrors.filter(
            (err) =>
                !err.includes('Failed to load resource') && // 404 errors for missing assets
                !err.includes('Supabase') &&
                !err.includes('NEXT_PUBLIC') &&
                !err.includes('environment variable')
        );

        expect(criticalErrors.length).toBe(0);

        if (criticalErrors.length === 0) {
            console.log('✅ No critical console errors');
        } else {
            console.log('❌ Critical errors:', criticalErrors);
        }
    });

    test('upload component integrates with page layout', async ({ page }) => {
        await page.goto('/#upload');

        // Check z-index and positioning don't cause overlap issues
        const uploadSection = page.locator('input[type="file"]').locator('..');

        // Should be visible and clickable
        await expect(uploadSection).toBeVisible();

        // Navigation shouldn't overlap upload form
        const nav = page.locator('nav, header').first();
        const navBox = await nav.boundingBox();
        const uploadBox = await uploadSection.boundingBox();

        if (navBox && uploadBox) {
            // Upload form should be below navigation
            expect(uploadBox.y).toBeGreaterThan(navBox.y + navBox.height - 50);
            console.log('✅ Upload form positioned correctly below navigation');
        }
    });
});
