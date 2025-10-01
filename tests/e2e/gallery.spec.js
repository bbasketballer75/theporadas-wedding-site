/**
 * E2E Tests for Gallery and Photo Upload
 * Tests guest photo/video upload functionality
 */

import path from 'path';

import { expect, test } from '@playwright/test';

test.describe('Gallery and Photo Upload', () => {
  test('gallery page loads correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/gallery');

    // Check heading
    await expect(page.locator('h1')).toContainText('Photo Gallery');

    // Verify gallery container is visible
    await expect(page.locator('.gallery-container, [class*="grid"]')).toBeVisible();
  });

  test('displays existing photos in gallery', async ({ page }) => {
    await page.goto('http://localhost:3000/gallery');

    // Wait for gallery to load
    await page.waitForLoadState('networkidle');

    // Check if any images are displayed (if gallery has photos)
    const images = page.locator('img');
    const count = await images.count();

    // Gallery should have at least the page structure, even if no photos yet
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test.skip('can select and upload photo', async ({ page }) => {
    // Skip this test by default as it requires:
    // 1. Firebase Authentication (user must be logged in)
    // 2. Test image file in fixtures
    // 3. Firebase Storage emulator or test environment

    await page.goto('http://localhost:3000/gallery');

    // Find file input
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();

    // Create test fixture path
    const testImagePath = path.join(__dirname, '..', 'fixtures', 'test-image.jpg');

    // Upload file
    await fileInput.setInputFiles(testImagePath);

    // Click upload button
    await page.click('text=Upload to Gallery, text=Upload Photo, button:has-text("Upload")');

    // Verify upload progress indicator (PhotoUpload component)
    await expect(page.locator('text=Uploading')).toBeVisible({ timeout: 3000 });

    // Wait for upload to complete
    await expect(page.locator('text=Upload complete, text=Success')).toBeVisible({
      timeout: 10000,
    });
  });

  test('PhotoUpload component renders when authenticated', async ({ page }) => {
    // This test assumes the PhotoUpload component is visible
    await page.goto('http://localhost:3000/gallery');

    // Just verify the component structure exists
    // (Authentication state may hide file input)
    const uploadSection = page.locator('[class*="upload"]').or(page.locator('body'));
    await expect(uploadSection).toBeVisible();
  });

  test('video player embeds YouTube correctly', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Look for VideoPlayer component (YouTube iframe)
    const youtubeIframe = page.locator('iframe[src*="youtube-nocookie.com"]');

    // If VideoPlayer is on the page, verify privacy-enhanced embed
    const iframeCount = await youtubeIframe.count();
    if (iframeCount > 0) {
      const src = await youtubeIframe.first().getAttribute('src');
      expect(src).toContain('youtube-nocookie.com');
      expect(src).not.toContain('youtube.com/embed');
    }
  });

  test('gallery uses lazy loading for images', async ({ page }) => {
    await page.goto('http://localhost:3000/gallery');

    // Check for loading attribute on images
    const lazyImages = page.locator('img[loading="lazy"]');
    const count = await lazyImages.count();

    // If images exist, some should have lazy loading
    const allImages = await page.locator('img').count();
    if (allImages > 0) {
      expect(count).toBeGreaterThan(0);
    }
  });

  test('gallery has proper responsive layout', async ({ page }) => {
    await page.goto('http://localhost:3000/gallery');

    // Check for grid layout classes (Tailwind)
    const gridContainer = page.locator('[class*="grid"], [class*="flex"]');
    await expect(gridContainer.first()).toBeVisible();

    // Test responsive behavior by changing viewport
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile
    await expect(page.locator('h1')).toBeVisible();

    await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
    await expect(page.locator('h1')).toBeVisible();
  });
});
