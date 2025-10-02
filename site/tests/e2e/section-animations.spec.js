const { test, expect } = require('@playwright/test');

test.describe('Section Animations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000); // Wait for React hydration
  });

  test('should trigger fade-in animation when section becomes visible', async ({ page }) => {
    // Scroll to Gallery section (should be off-screen initially)
    const gallerySection = page.locator('#gallery');

    // Check initial state - scroll to top first
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // Now scroll to gallery
    await page.evaluate(() => {
      document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
    });

    // Wait for animation to trigger (IntersectionObserver threshold 0.2)
    await page.waitForTimeout(1500);

    // Check that section is now visible (opacity 1)
    const opacity = await gallerySection.evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });

    expect(parseFloat(opacity)).toBeGreaterThan(0.9);
    console.log('✓ Gallery section animated in with fade');
  });

  test('should apply animations to all sections', async ({ page }) => {
    const sections = ['our-story', 'timeline', 'gallery', 'venue', 'photobooth'];

    for (const sectionId of sections) {
      await page.evaluate((id) => {
        document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
      }, sectionId);

      await page.waitForTimeout(1000);

      const section = page.locator(`#${sectionId}`);
      const opacity = await section.evaluate((el) => {
        return window.getComputedStyle(el).opacity;
      });

      expect(parseFloat(opacity)).toBeGreaterThan(0.9);
      console.log(`✓ ${sectionId} section animation triggered`);
    }
  });
});
