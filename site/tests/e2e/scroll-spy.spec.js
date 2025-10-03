const { test, expect } = require('@playwright/test');

test.describe('Scroll-Spy Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000); // Wait for React hydration
  });

  test('should highlight Home section on page load', async ({ page }) => {
    const homeLink = page.locator('nav button:has-text("Home")');
    await expect(homeLink).toHaveClass(/font-semibold/);
  });

  test('should update active section on scroll', async ({ page }) => {
    // Scroll to Our Story section (use instant scroll to avoid timing issues)
    await page.evaluate(() => {
      document.getElementById('our-story').scrollIntoView({ behavior: 'auto', block: 'center' });
    });

    // Wait for IntersectionObserver to trigger (longer wait for chromium)
    await page.waitForTimeout(1000);

    const ourStoryLink = page.locator('nav button:has-text("Our Story")');
    await expect(ourStoryLink).toHaveClass(/font-semibold/);
  });

  test('should scroll through all 10 sections and update navigation', async ({ page }) => {
    const sections = [
      { id: 'hero', label: 'Home' },
      { id: 'our-story', label: 'Our Story' },
      { id: 'timeline', label: 'Timeline' },
      { id: 'gallery', label: 'Gallery' },
      { id: 'venue', label: 'Venue' },
      { id: 'photobooth', label: 'Photo Booth' },
      { id: 'guestbook', label: 'Guest Book' },
      { id: 'album', label: 'Album' },
      { id: 'upload', label: 'Upload' },
      { id: 'map', label: 'Map' },
    ];

    for (const section of sections) {
      await page.evaluate((id) => {
        document.getElementById(id).scrollIntoView({ behavior: 'auto', block: 'center' });
      }, section.id);

      // Wait for IntersectionObserver (longer for chromium)
      await page.waitForTimeout(600);

      const navLink = page.locator(`nav button:has-text("${section.label}")`);
      await expect(navLink).toHaveClass(/font-semibold/);

      console.log(`✓ ${section.label} section: scroll-spy active`);
    }
  });

  test('should show underline on active section', async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById('timeline').scrollIntoView({ behavior: 'auto', block: 'center' });
    });

    await page.waitForTimeout(500);

    const timelineLink = page.locator('nav button:has-text("Timeline")');
    const underline = timelineLink.locator('span');

    await expect(underline).toHaveClass(/w-full/);
  });
});
