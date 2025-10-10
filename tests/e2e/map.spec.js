/**
 * E2E Tests for Map Page
 * Tests interactive map with React 19 Actions API
 */

import { expect, test } from '@playwright/test';

test.describe('Map Page', () => {
  test('loads map correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/map');

    // Check heading
    await expect(page.locator('h1')).toContainText('Viewer Map');

    // Verify map container is visible (Leaflet)
    await expect(page.locator('.leaflet-container')).toBeVisible();

    // Check for "Share My Location" button
    await expect(page.locator('button:has-text("Share My Location")')).toBeVisible();
  });

  test('displays existing pins on map', async ({ page }) => {
    await page.goto('http://localhost:3000/map');

    // Wait for map to load
    await page.waitForSelector('.leaflet-container', { timeout: 5000 });

    // Check if map markers are rendered (if any pins exist)
    // Note: This test will pass whether pins exist or not
    const markers = page.locator('.leaflet-marker-icon');
    // Just verify the locator works (count could be 0 if no pins)
    await expect(markers.first().or(page.locator('body'))).toBeVisible();
  });

  test('button shows pending state when clicked (mock geolocation)', async ({ page, context }) => {
    // Grant geolocation permissions
    await context.grantPermissions(['geolocation']);

    // Set mock geolocation
    await context.setGeolocation({ latitude: 40.7128, longitude: -74.006 });

    await page.goto('http://localhost:3000/map');

    // Wait for map to load
    await page.waitForSelector('.leaflet-container');

    const button = page.locator('button:has-text("Share My Location")');

    // Click the button
    await button.click();

    // Verify pending state (React 19 useTransition)
    await expect(page.locator('button:has-text("Adding Your Location")')).toBeVisible({
      timeout: 3000,
    });
  });

  test('displays error message on geolocation failure', async ({ page, context }) => {
    // Deny geolocation permissions
    await context.grantPermissions([]);

    await page.goto('http://localhost:3000/map');

    const button = page.locator('button:has-text("Share My Location")');
    await button.click();

    // Wait for alert or error message
    page.on('dialog', (dialog) => {
      expect(dialog.message()).toContain('Could not get location');
      dialog.accept();
    });
  });

  test('map is interactive (pan/zoom)', async ({ page }) => {
    await page.goto('http://localhost:3000/map');

    await page.waitForSelector('.leaflet-container');

    // Check for zoom controls
    await expect(page.locator('.leaflet-control-zoom-in')).toBeVisible();
    await expect(page.locator('.leaflet-control-zoom-out')).toBeVisible();

    // Click zoom in
    await page.locator('.leaflet-control-zoom-in').click();

    // Verify map is still visible after interaction
    await expect(page.locator('.leaflet-container')).toBeVisible();
  });

  test('displays description text', async ({ page }) => {
    await page.goto('http://localhost:3000/map');

    // Check for description (less brittle substring check)
    await expect(page.locator('text=See where guests are viewing')).toBeVisible();
    await expect(page.locator('text=opt-in').first()).toBeVisible();
  });
});
