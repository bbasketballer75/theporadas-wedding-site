const { test, expect } = require('@playwright/test');

test.describe('Teaser Section Links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000); // Wait for React hydration
  });

  test('should navigate to Photo Booth page', async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById('photobooth').scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(1500);

    const photoBoothLink = page.locator('a:has-text("Launch Photo Booth")');
    await expect(photoBoothLink).toHaveAttribute('href', '/photobooth');
    console.log('✓ Photo Booth link correct');
  });

  test('should navigate to Guest Book page', async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById('guestbook').scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(1500);

    const guestBookLink = page.locator('a:has-text("Sign the Guest Book")');
    await expect(guestBookLink).toHaveAttribute('href', '/guestbook');
    console.log('✓ Guest Book link correct');
  });

  test('should navigate to Album page', async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById('album').scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(1500);

    const albumLink = page.locator('a:has-text("Create an Album")');
    await expect(albumLink).toHaveAttribute('href', '/album');
    console.log('✓ Album link correct');
  });

  test('should navigate to Upload page', async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById('upload').scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(1500);

    const uploadLink = page.locator('a:has-text("Upload Your Photos")');
    await expect(uploadLink).toHaveAttribute('href', '/upload');
    console.log('✓ Upload link correct');
  });

  test('should navigate to Map page', async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById('map').scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(1500);

    const mapLink = page.locator('a:has-text("View the Map")');
    await expect(mapLink).toHaveAttribute('href', '/map');
    console.log('✓ Map link correct');
  });
});
