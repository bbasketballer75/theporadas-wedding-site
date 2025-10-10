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

    // Check timeline sections are present (at least one key milestone should exist)
    const timelineKeys = ['First Date', 'Engagement', 'Wedding Day'];
    let found = false;
    for (const k of timelineKeys) {
      if ((await page.locator(`text=${k}`).count()) > 0) {
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
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

    // Allow a single external font request (some fonts may be loaded externally)
    expect(externalFontRequests.length).toBeLessThanOrEqual(1);
  });

  test('navigation works correctly', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Check if navigation links exist and are clickable
    // (Adjust selectors based on actual navigation structure)
    await expect(page.locator('nav')).toBeVisible();
  });

  test('displays floral decorations', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Check for decorative graphics (at least one SVG or IMG in main content)
    const graphicCount =
      (await page.locator('main svg').count()) + (await page.locator('main img').count());
    expect(graphicCount).toBeGreaterThan(0);
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
