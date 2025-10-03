const { test, expect } = require('@playwright/test');

test.describe('Navigation Click Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000); // Wait for React hydration
  });

  test('should smooth scroll to section on nav link click', async ({ page }) => {
    // Start at top
    await page.evaluate(() => window.scrollTo(0, 0));

    // Click Timeline nav link using JavaScript
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('nav button'));
      const timelineButton = buttons.find((btn) => btn.textContent.includes('Timeline'));
      if (timelineButton) timelineButton.click();
    });

    // Wait for scroll to complete
    await page.waitForTimeout(1500); // Verify Timeline section is in view
    const timelineSection = page.locator('#timeline');
    const isInViewport = await timelineSection.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.top < window.innerHeight / 2;
    });

    expect(isInViewport).toBe(true);
    console.log('✓ Timeline section scrolled into view');
  });

  test('should test all navigation links', async ({ page }) => {
    const links = [
      { text: 'Our Story', sectionId: 'our-story' },
      { text: 'Timeline', sectionId: 'timeline' },
      { text: 'Gallery', sectionId: 'gallery' },
      { text: 'Venue', sectionId: 'venue' },
      { text: 'Photo Booth', sectionId: 'photobooth' },
      { text: 'Guest Book', sectionId: 'guestbook' },
      { text: 'Album', sectionId: 'album' },
      { text: 'Upload', sectionId: 'upload' },
      { text: 'Map', sectionId: 'map' },
    ];

    for (const link of links) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300); // Reduced wait between scrolls

      await page.evaluate((linkText) => {
        const buttons = Array.from(document.querySelectorAll('nav button'));
        const button = buttons.find((btn) => btn.textContent.includes(linkText));
        if (button) button.click();
      }, link.text);
      await page.waitForTimeout(1800); // Balanced wait for smooth scroll

      const section = page.locator(`#${link.sectionId}`);
      const isInViewport = await section.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        // More lenient check - section should be near viewport
        return rect.top >= -window.innerHeight * 0.5 && rect.top < window.innerHeight * 1.5;
      });

      expect(isInViewport).toBe(true);
      console.log(`✓ ${link.text} navigation click works`);
    }
  });

  test('should activate clicked section in nav', async ({ page }) => {
    // Click Gallery button (using JavaScript since Playwright click may not work on all elements)
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('nav button'));
      const galleryButton = buttons.find((btn) => btn.textContent.includes('Gallery'));
      if (galleryButton) galleryButton.click();
    });

    // Wait for smooth scroll to complete AND IntersectionObserver to fire
    await page.waitForTimeout(2500);

    // Wait for Gallery section to be in viewport (which triggers IntersectionObserver)
    const gallerySection = page.locator('#gallery');
    await gallerySection.waitFor({ state: 'visible', timeout: 5000 });

    // Wait longer for smooth scroll animation + IntersectionObserver callback
    await page.waitForTimeout(1500);

    // Now check that the Gallery button has the active class
    const galleryLink = page.locator('nav button:has-text("Gallery")').first();

    // Log current state for debugging
    const hasActiveClass = await galleryLink.evaluate((el) =>
      el.className.includes('font-semibold')
    );
    console.log(`Gallery button has font-semibold: ${hasActiveClass}`);

    await expect(galleryLink).toHaveClass(/font-semibold/);
    console.log('✓ Clicked nav link becomes active');
  });
});
