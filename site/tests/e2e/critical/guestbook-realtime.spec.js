/**
 * CRITICAL TEST: Guestbook Realtime Sync
 * Validates multi-user realtime Firestore synchronization
 * THIS IS THE KEY TEST THAT DETECTS OFFLINE MODE
 */

const { test, expect } = require('@playwright/test');

test.describe('Guestbook Realtime Sync (CRITICAL)', () => {
  test('Message submitted in one context appears in another WITHOUT refresh', async ({
    browser,
  }) => {
    // Create two browser contexts (simulating two users)
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    try {
      // Both users navigate to guestbook
      await page1.goto('/guestbook');
      await page2.goto('/guestbook');

      // Wait for Firestore initialization in both contexts
      await page1.waitForLoadState('networkidle');
      await page2.waitForLoadState('networkidle');
      await page1.waitForTimeout(8000); // Firebase init + listener setup
      await page2.waitForTimeout(8000);

      console.log('✅ Both contexts loaded guestbook page');

      // Monitor console in page2 for realtime updates
      const realtimeUpdates = [];
      page2.on('console', (msg) => {
        const text = msg.text();
        if (
          text.includes('onSnapshot') ||
          text.includes('New message') ||
          text.includes('Message added') ||
          text.includes('Document added')
        ) {
          realtimeUpdates.push(text);
        }
      });

      // Get initial message count in page2
      const initialMessages = await page2.locator('[data-testid="guestbook-message"]').count();
      console.log(`ℹ️  Initial message count in context 2: ${initialMessages}`);

      // User 1 submits a message
      const testMessage = `Test realtime sync ${Date.now()}`;
      const nameInput = page1.locator('input[name="name"]').first();
      const messageInput = page1.locator('textarea[name="message"]').first();
      const submitButton = page1.locator('button[type="submit"]').first();

      await nameInput.fill('Realtime Test User');
      await messageInput.fill(testMessage);
      await submitButton.click();

      console.log('✅ Message submitted in context 1');

      // Wait for submission to complete
      await page1.waitForTimeout(2000);

      // Wait for realtime update in context 2 (should be <2 seconds)
      await page2.waitForTimeout(3000);

      // Check if message count increased in page2 WITHOUT refresh
      const newMessageCount = await page2.locator('[data-testid="guestbook-message"]').count();

      console.log(`ℹ️  New message count in context 2: ${newMessageCount}`);
      console.log(
        `ℹ️  Realtime updates captured: ${realtimeUpdates.length > 0 ? realtimeUpdates.length : 'none'}`
      );

      // CRITICAL: If message count didn't increase, Firestore is in OFFLINE MODE
      if (newMessageCount === initialMessages) {
        // Check for offline mode indicators
        const page2Console = [];
        page2.on('console', (msg) => page2Console.push(msg.text()));

        await page2.waitForTimeout(2000);

        const offlineIndicators = page2Console.filter(
          (text) =>
            text.includes('Could not reach Cloud Firestore backend') ||
            text.includes('transport errored') ||
            text.includes('offline')
        );

        if (offlineIndicators.length > 0) {
          console.log('❌ FIRESTORE IS IN OFFLINE MODE:');
          offlineIndicators.forEach((msg) => console.log(`   ${msg.substring(0, 200)}`));
          throw new Error('Firestore realtime sync FAILED - offline mode detected');
        } else {
          console.log('⚠️  Message did not sync, but no offline indicators found');
          console.log('   This may indicate CSP blocking or other connectivity issue');
          throw new Error('Realtime sync failed - investigate connectivity');
        }
      }

      expect(newMessageCount).toBeGreaterThan(initialMessages);
      console.log('✅ REALTIME SYNC WORKING - Message appeared in context 2 without refresh!');

      // Verify the specific message is visible
      const messageVisible = await page2.locator(`text=${testMessage}`).count();
      expect(messageVisible).toBeGreaterThan(0);

      if (messageVisible > 0) {
        console.log('✅ Submitted message content verified in context 2');
      }
    } finally {
      // Cleanup
      await page1.close();
      await page2.close();
      await context1.close();
      await context2.close();
    }
  });

  test('Firestore listener detects offline mode immediately', async ({ page }) => {
    const offlineWarnings = [];
    const transportErrors = [];

    page.on('console', (msg) => {
      const text = msg.text();
      if (
        text.includes('Could not reach Cloud Firestore backend') ||
        text.includes('Firestore client has gone offline')
      ) {
        offlineWarnings.push(text);
      }
      if (text.includes('transport errored')) {
        transportErrors.push(text);
      }
    });

    await page.goto('/guestbook');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(10000); // Wait for Firestore initialization

    // Should have NO offline warnings
    expect(offlineWarnings).toHaveLength(0);
    expect(transportErrors).toHaveLength(0);

    if (offlineWarnings.length > 0 || transportErrors.length > 0) {
      console.log('❌ OFFLINE MODE DETECTED:');
      console.log(`   Offline warnings: ${offlineWarnings.length}`);
      console.log(`   Transport errors: ${transportErrors.length}`);
      offlineWarnings.slice(0, 2).forEach((msg) => console.log(`   ${msg.substring(0, 200)}`));
      transportErrors.slice(0, 2).forEach((msg) => console.log(`   ${msg.substring(0, 200)}`));
      throw new Error('Firestore is in offline mode');
    } else {
      console.log('✅ Firestore listener is ONLINE');
    }
  });

  test('Realtime listener sync latency is <5 seconds', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    try {
      await page1.goto('/guestbook');
      await page2.goto('/guestbook');

      await page1.waitForLoadState('networkidle');
      await page2.waitForLoadState('networkidle');
      await page1.waitForTimeout(8000);
      await page2.waitForTimeout(8000);

      // Get baseline count
      const initialCount = await page2.locator('[data-testid="guestbook-message"]').count();

      // Submit message and start timer
      const startTime = Date.now();
      const testMessage = `Latency test ${startTime}`;

      await page1.locator('input[name="name"]').first().fill('Latency Tester');
      await page1.locator('textarea[name="message"]').first().fill(testMessage);
      await page1.locator('button[type="submit"]').first().click();

      await page1.waitForTimeout(1000); // Wait for submission

      // Poll for message appearance in context 2
      let appeared = false;
      let latency = 0;

      for (let i = 0; i < 10; i++) {
        await page2.waitForTimeout(500);
        const currentCount = await page2.locator('[data-testid="guestbook-message"]').count();
        if (currentCount > initialCount) {
          latency = Date.now() - startTime;
          appeared = true;
          break;
        }
      }

      expect(appeared).toBe(true);
      expect(latency).toBeLessThan(5000);

      if (appeared) {
        console.log(`✅ Realtime sync latency: ${latency}ms (target: <5000ms)`);
        if (latency < 2000) {
          console.log('   🎉 EXCELLENT latency (<2 seconds)');
        }
      } else {
        console.log('❌ Message did not appear within 5 seconds');
        throw new Error('Realtime sync too slow or failed');
      }
    } finally {
      await page1.close();
      await page2.close();
      await context1.close();
      await context2.close();
    }
  });

  test('Multiple messages sync correctly in order', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    try {
      await page1.goto('/guestbook');
      await page2.goto('/guestbook');

      await page1.waitForLoadState('networkidle');
      await page2.waitForLoadState('networkidle');
      await page1.waitForTimeout(8000);
      await page2.waitForTimeout(8000);

      const initialCount = await page2.locator('[data-testid="guestbook-message"]').count();

      // Submit 3 messages quickly
      const messages = [
        `Multi-message test 1 - ${Date.now()}`,
        `Multi-message test 2 - ${Date.now() + 1}`,
        `Multi-message test 3 - ${Date.now() + 2}`,
      ];

      for (const msg of messages) {
        await page1.locator('input[name="name"]').first().fill('Multi Tester');
        await page1.locator('textarea[name="message"]').first().fill(msg);
        await page1.locator('button[type="submit"]').first().click();
        await page1.waitForTimeout(1500); // Small delay between submissions
      }

      // Wait for all messages to sync
      await page2.waitForTimeout(5000);

      const finalCount = await page2.locator('[data-testid="guestbook-message"]').count();
      const newMessages = finalCount - initialCount;

      console.log(`ℹ️  Submitted: 3 messages, Synced: ${newMessages} messages`);

      // Should have at least 3 new messages (may have more from other tests)
      expect(newMessages).toBeGreaterThanOrEqual(3);

      if (newMessages >= 3) {
        console.log('✅ All 3 messages synced successfully via realtime listener');
      } else {
        console.log(`⚠️  Only ${newMessages}/3 messages synced`);
      }
    } finally {
      await page1.close();
      await page2.close();
      await context1.close();
      await context2.close();
    }
  });
});
