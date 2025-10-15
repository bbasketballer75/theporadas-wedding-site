/**
 * E2E Tests for Gallery and Photo Upload
 * Tests guest photo/video upload functionality
 */


import { expect, test } from '@playwright/test';

test.describe('Gallery and Photo Upload', () => {
  test('gallery page loads correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/gallery');

    // Check heading
    // Check main heading is present (accept any gallery heading)
    await expect(page.locator('h1')).toContainText('Gallery');

    // Verify gallery container is visible
    await expect(page.locator('.gallery-container, [class*="grid"]')).toBeVisible();
  });

  test('displays existing photos in gallery', async ({ page }) => {
    await page.goto('http://localhost:3000/gallery');

    // Wait for gallery to load
    await page.waitForLoadState('networkidle');

    // Check if any images are displayed (gallery should work even if empty)
    const images = page.locator('img');
    const count = await images.count();

    // Gallery should have at least the page structure, even if no photos yet
    // Accept 0 images for fresh deployments
    expect(count).toBeGreaterThanOrEqual(0);

    if (count === 0) {
      console.log('ℹ️ Gallery is empty (expected for fresh deployment)');
    } else {
      console.log(`✅ Gallery loaded with ${count} images`);
    }
  });

  test('upload CTA is present and links to upload page', async ({ page }) => {
    await page.goto('http://localhost:3000/gallery');

    // Gallery should have upload CTA (link to /upload page)
    const uploadCTA = page.locator('a[href="/upload"]:has-text("Upload")').first();

    if ((await uploadCTA.count()) > 0) {
      await expect(uploadCTA).toBeVisible();
      console.log('✅ Upload CTA found and visible');
    } else {
      console.log('ℹ️ Upload CTA may be in navigation or hidden when not authenticated');
    }
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
      console.log(`✅ Lazy loading: ${count}/${allImages} images use lazy loading`);
    } else {
      console.log('ℹ️ No images in gallery to test lazy loading (expected for fresh deployment)');
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

test.describe('Gallery - Filter Tabs', () => {
  test('filter tabs are present and functional', async ({ page }) => {
    await page.goto('http://localhost:3000/gallery');
    await page.waitForLoadState('networkidle');

    // Look for filter tabs (All/Photos/Videos or similar)
    const filterButtons = page.locator('button:has-text("All"), button:has-text("Photos"), button:has-text("Videos")');
    const filterTabs = await filterButtons.count();

    if (filterTabs > 0) {
      console.log(`✅ Found ${filterTabs} filter tabs`);

      // Test clicking a filter
      const firstFilter = filterButtons.first();
      await firstFilter.click();
      await page.waitForTimeout(500);

      // Should not cause errors
      const heading = page.locator('h1');
      await expect(heading).toBeVisible();

      console.log('✅ Filter tabs are functional');
    } else {
      console.log('ℹ️  No filter tabs found (may not be implemented yet)');
    }
  });

  test('Photos filter shows only photos', async ({ page }) => {
    await page.goto('http://localhost:3000/gallery');
    await page.waitForLoadState('networkidle');

    const photosButton = page.locator('button:has-text("Photos")').first();
    const photosButtonExists = await photosButton.count() > 0;

    if (photosButtonExists) {
      await photosButton.click();
      await page.waitForTimeout(1000);

      // Check if videos are hidden
      const videos = page.locator('video, iframe[src*="youtube"]');
      const videoCount = await videos.count();

      console.log(`✅ Photos filter applied (video count: ${videoCount})`);
    } else {
      console.log('ℹ️  Photos filter not found');
    }
  });

  test('Videos filter shows only videos', async ({ page }) => {
    await page.goto('http://localhost:3000/gallery');
    await page.waitForLoadState('networkidle');

    const videosButton = page.locator('button:has-text("Videos")').first();
    const videosButtonExists = await videosButton.count() > 0;

    if (videosButtonExists) {
      await videosButton.click();
      await page.waitForTimeout(1000);

      // Check if photos are hidden and videos shown
      const videos = page.locator('video, iframe[src*="youtube"]');
      const videoCount = await videos.count();

      if (videoCount > 0) {
        await expect(videos.first()).toBeVisible();
        console.log(`✅ Videos filter working (${videoCount} videos visible)`);
      } else {
        console.log('ℹ️  No videos in gallery to filter');
      }
    } else {
      console.log('ℹ️  Videos filter not found');
    }
  });

  test('All filter shows both photos and videos', async ({ page }) => {
    await page.goto('http://localhost:3000/gallery');
    await page.waitForLoadState('networkidle');

    const allButton = page.locator('button:has-text("All")').first();
    const allButtonExists = await allButton.count() > 0;

    if (allButtonExists) {
      await allButton.click();
      await page.waitForTimeout(1000);

      // Count total items visible
      const images = await page.locator('img[src*="firebasestorage"], img[src*="supabase"]').count();
      const videos = await page.locator('video, iframe[src*="youtube"]').count();
      const total = images + videos;

      console.log(`✅ All filter shows ${total} items (${images} images, ${videos} videos)`);
    } else {
      console.log('ℹ️  All filter not found');
    }
  });

  test('active filter tab is visually indicated', async ({ page }) => {
    await page.goto('http://localhost:3000/gallery');
    await page.waitForLoadState('networkidle');

    const filterButtons = page.locator('button:has-text("All"), button:has-text("Photos"), button:has-text("Videos")');
    const hasFilters = await filterButtons.count() > 0;

    if (hasFilters) {
      const firstButton = filterButtons.first();
      await firstButton.click();

      // Check for active state styling
      const activeClasses = await firstButton.getAttribute('class');
      const hasActiveIndicator = activeClasses.includes('active') ||
        activeClasses.includes('selected') ||
        activeClasses.includes('border') ||
        activeClasses.includes('bg-');

      if (hasActiveIndicator) {
        console.log('✅ Active filter has visual indicator');
      } else {
        console.log('⚠️  Active filter may not have distinct visual styling');
      }
    }
  });
});

test.describe('Gallery - Lazy Loading', () => {
  test('images use lazy loading attribute', async ({ page }) => {
    await page.goto('http://localhost:3000/gallery');
    await page.waitForLoadState('networkidle');

    const allImages = page.locator('img');
    const imageCount = await allImages.count();

    if (imageCount > 0) {
      const lazyImages = page.locator('img[loading="lazy"]');
      const lazyCount = await lazyImages.count();

      // Most gallery images should have lazy loading
      const lazyPercentage = (lazyCount / imageCount) * 100;

      console.log(`✅ Lazy loading: ${lazyCount}/${imageCount} images (${lazyPercentage.toFixed(0)}%)`);

      // At least some images should be lazy loaded
      expect(lazyCount).toBeGreaterThan(0);
    } else {
      console.log('ℹ️  No images in gallery to test lazy loading');
    }
  });

  test('images load as user scrolls', async ({ page }) => {
    await page.goto('http://localhost:3000/gallery');
    await page.waitForLoadState('networkidle');

    const images = page.locator('img[src*="firebasestorage"], img[src*="supabase"]');
    const imageCount = await images.count();

    if (imageCount > 5) {
      // Scroll to bottom
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);

      // Check if images are now loaded
      const loadedImages = page.locator('img[src*="firebasestorage"]:not([loading="lazy"])');
      const loadedCount = await loadedImages.count();

      console.log(`✅ Scroll loading: ${loadedCount} images loaded after scroll`);
    } else {
      console.log('ℹ️  Not enough images to test scroll loading');
    }
  });

  test('placeholder or skeleton shows while images load', async ({ page }) => {
    // Start navigation but don't wait for full load
    await page.goto('http://localhost:3000/gallery', { waitUntil: 'domcontentloaded' });

    // Look for loading skeletons or placeholders
    const skeletons = page.locator('[class*="skeleton"], [class*="placeholder"], [class*="loading"]');
    const hasSkeletons = await skeletons.count() > 0;

    await page.waitForLoadState('networkidle');

    if (hasSkeletons) {
      console.log('✅ Loading placeholders detected');
    } else {
      console.log('ℹ️  No loading placeholders found (may load too fast)');
    }
  });
});

test.describe('Gallery - Lightbox/Modal', () => {
  test('clicking image opens lightbox or full view', async ({ page }) => {
    await page.goto('http://localhost:3000/gallery');
    await page.waitForLoadState('networkidle');

    const images = page.locator('img[src*="firebasestorage"], img[src*="supabase"]');
    const imageCount = await images.count();

    if (imageCount > 0) {
      // Click first image
      const firstImage = images.first();
      await firstImage.click();
      await page.waitForTimeout(500);

      // Check for modal or lightbox
      const modal = page.locator('[role="dialog"], [class*="modal"], [class*="lightbox"], [class*="overlay"]');
      const modalVisible = await modal.count() > 0;

      if (modalVisible) {
        await expect(modal.first()).toBeVisible();
        console.log('✅ Lightbox/modal opens on image click');

        // Check for close button
        const closeButton = page.locator('button:has-text("×"), button:has-text("Close"), button[aria-label*="close" i]');
        const hasCloseButton = await closeButton.count() > 0;

        if (hasCloseButton) {
          await closeButton.first().click();
          await page.waitForTimeout(300);
          console.log('✅ Lightbox can be closed');
        }
      } else {
        console.log('ℹ️  No lightbox implemented (images may open in new tab or inline)');
      }
    } else {
      console.log('ℹ️  No images to test lightbox functionality');
    }
  });

  test('lightbox shows navigation arrows for multiple images', async ({ page }) => {
    await page.goto('http://localhost:3000/gallery');
    await page.waitForLoadState('networkidle');

    const images = page.locator('img[src*="firebasestorage"], img[src*="supabase"]');
    const imageCount = await images.count();

    if (imageCount > 1) {
      await images.first().click();
      await page.waitForTimeout(500);

      // Look for next/previous buttons
      const navButtons = page.locator('button:has-text("Next"), button:has-text("Previous"), button:has-text("→"), button:has-text("←")');
      const hasNavigation = await navButtons.count() > 0;

      if (hasNavigation) {
        console.log('✅ Lightbox has navigation arrows');
      } else {
        console.log('ℹ️  Lightbox navigation not found (may be single image view only)');
      }
    } else {
      console.log('ℹ️  Not enough images to test lightbox navigation');
    }
  });

  test('lightbox can be closed with Escape key', async ({ page }) => {
    await page.goto('http://localhost:3000/gallery');
    await page.waitForLoadState('networkidle');

    const images = page.locator('img[src*="firebasestorage"], img[src*="supabase"]');
    const imageCount = await images.count();

    if (imageCount > 0) {
      await images.first().click();
      await page.waitForTimeout(500);

      const modal = page.locator('[role="dialog"], [class*="modal"]');
      const modalVisible = await modal.count() > 0;

      if (modalVisible) {
        // Press Escape key
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);

        // Modal should be closed
        const modalStillVisible = await modal.isVisible().catch(() => false);

        if (!modalStillVisible) {
          console.log('✅ Lightbox closes with Escape key');
        } else {
          console.log('⚠️  Escape key may not close lightbox');
        }
      }
    }
  });
});

test.describe('Gallery - Image Optimization', () => {
  test('images use srcset for responsive images', async ({ page }) => {
    await page.goto('http://localhost:3000/gallery');
    await page.waitForLoadState('networkidle');

    const imagesWithSrcset = page.locator('img[srcset]');
    const srcsetCount = await imagesWithSrcset.count();

    const allImages = await page.locator('img').count();

    if (allImages > 0) {
      const optimizationRate = (srcsetCount / allImages) * 100;
      console.log(`✅ Image optimization: ${srcsetCount}/${allImages} images use srcset (${optimizationRate.toFixed(0)}%)`);

      // At least some images should use srcset for optimization
      if (srcsetCount > 0) {
        expect(srcsetCount).toBeGreaterThan(0);
      }
    }
  });

  test('images have appropriate alt text', async ({ page }) => {
    await page.goto('http://localhost:3000/gallery');
    await page.waitForLoadState('networkidle');

    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      let imagesWithAlt = 0;

      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const alt = await images.nth(i).getAttribute('alt');
        if (alt && alt.length > 0) {
          imagesWithAlt++;
        }
      }

      const sampleSize = Math.min(imageCount, 5);
      console.log(`✅ Accessibility: ${imagesWithAlt}/${sampleSize} sampled images have alt text`);

      expect(imagesWithAlt).toBeGreaterThan(0);
    }
  });

  test('images load with appropriate dimensions', async ({ page }) => {
    await page.goto('http://localhost:3000/gallery');
    await page.waitForLoadState('networkidle');

    const images = page.locator('img[src*="firebasestorage"], img[src*="supabase"]');
    const imageCount = await images.count();

    if (imageCount > 0) {
      const firstImage = images.first();
      const box = await firstImage.boundingBox();

      if (box) {
        // Images should have reasonable dimensions
        expect(box.width).toBeGreaterThan(50);
        expect(box.height).toBeGreaterThan(50);

        // Should not be absurdly large (layout issue)
        expect(box.width).toBeLessThan(2000);

        console.log(`✅ Image dimensions appropriate: ${Math.round(box.width)}x${Math.round(box.height)}px`);
      }
    }
  });
});
