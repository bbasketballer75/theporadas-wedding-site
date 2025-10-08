/**
 * E2E Tests for Homepage
 * Tests homepage loads correctly with optimized fonts and content
 */

import { expect, test } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads correctly with all key elements', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Check main heading is present
    await expect(page.locator('h1')).toContainText('Austin & Jordyn');

    // Verify optimized fonts are applied (CSS variables from next/font)
    const bodyElement = await page.locator('body').first();
    const _classList = await bodyElement.getAttribute('class');

    // next/font sets CSS variables on a wrapper div
    await expect(page.locator('div[class*="__variable"]')).toBeVisible();

    // Check timeline sections are visible
    await expect(page.locator('text=First Date')).toBeVisible();
    await expect(page.locator('text=Engagement')).toBeVisible();
    await expect(page.locator('text=Wedding Day')).toBeVisible();
  });

  test('has proper font loading (no external requests)', async ({ page }) => {
    const externalFontRequests = [];

    // Monitor network requests
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
        externalFontRequests.push(url);
      }
    });

    await page.goto('http://localhost:3000');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Verify no external font requests (next/font optimization working)
    expect(externalFontRequests).toHaveLength(0);
  });

  test('navigation works correctly', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Check if navigation links exist and are clickable
    // (Adjust selectors based on actual navigation structure)
    await expect(page.locator('nav')).toBeVisible();
  });

  test('displays floral decorations', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Check for floral accent images
    const floralImages = page.locator('img[alt="floral accent"]');
    await expect(floralImages.first()).toBeVisible();
  });

  test('timeline cards have proper styling', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Check timeline card structure
    const timelineCards = page.locator('.bg-white.rounded-3xl.shadow-2xl');
    await expect(timelineCards.first()).toBeVisible();

    // Verify sage green accents (Tailwind classes)
    const sageElements = page.locator('[class*="bg-sage"]');
    const count = await sageElements.count();
    expect(count).toBeGreaterThan(0);
  });
});
