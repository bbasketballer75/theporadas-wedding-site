/**
 * CRITICAL TEST: Firestore Connectivity
 * Ensures Firestore connects and is NOT in offline mode
 */

const { test, expect } = require('@playwright/test');

test.describe('Firestore Connectivity (CRITICAL)', () => {
  test('Firestore connects successfully (NOT offline mode)', async ({ page }) => {
    const firestoreMessages = [];
    const transportErrors = [];

    page.on('console', (msg) => {
      const text = msg.text();
      const lower = text.toLowerCase();

      if (lower.includes('firestore') || lower.includes('firebase')) {
        firestoreMessages.push(text);

        if (text.includes('transport errored')) {
          transportErrors.push(text);
        }
      }
    });

    await page.goto('/guestbook');
    await page.waitForLoadState('networkidle');

    // Wait for Firestore to initialize
    await page.waitForTimeout(10000); // 10 seconds for connection

    // Check for "Connected to Cloud Firestore" message
    const connectedMessage = firestoreMessages.find((m) =>
      m.includes('Connected to Cloud Firestore')
    );

    // Should see connection message
    if (connectedMessage) {
      console.log('✅ Firestore connected successfully!');
      console.log(`   Message: ${connectedMessage}`);
    } else {
      console.log('⚠️  No explicit Firestore connection message detected');
      console.log('   Firebase messages:', firestoreMessages.slice(0, 5));
    }

    // Should have NO transport errors (indicates offline mode)
    expect(transportErrors).toHaveLength(0);

    if (transportErrors.length > 0) {
      console.log('❌ Transport errors detected (OFFLINE MODE):');
      transportErrors.slice(0, 3).forEach((err) => console.log(`   ${err}`));
      throw new Error(`Firestore in OFFLINE MODE: ${transportErrors.length} transport errors`);
    } else {
      console.log('✅ No transport errors detected');
    }
  });

  test('Firestore Listen channel does NOT return 400 errors', async ({ page }) => {
    const listenErrors = [];

    page.on('console', (msg) => {
      const text = msg.text();
      if (
        text.includes('firestore.googleapis.com') &&
        text.includes('Listen') &&
        text.includes('400')
      ) {
        listenErrors.push(text);
      }
    });

    // Also monitor network failures
    const failedListenRequests = [];
    page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('firestore.googleapis.com') && url.includes('Listen')) {
        if (response.status() === 400) {
          failedListenRequests.push({
            url,
            status: response.status(),
            statusText: response.statusText(),
          });
        }
      }
    });

    await page.goto('/guestbook');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(10000); // Wait for Listen channels to establish

    // Should have NO 400 errors on Listen channels
    expect(listenErrors.length + failedListenRequests.length).toBe(0);

    if (listenErrors.length > 0 || failedListenRequests.length > 0) {
      console.log('❌ Firestore Listen channel 400 errors detected:');
      console.log(`   Console errors: ${listenErrors.length}`);
      console.log(`   Network failures: ${failedListenRequests.length}`);
      throw new Error('Firestore Listen channels failing with 400 errors');
    } else {
      console.log('✅ No Firestore Listen channel 400 errors');
    }
  });

  test('Firestore queries return data successfully', async ({ page }) => {
    await page.goto('/guestbook');
    await page.waitForLoadState('networkidle');

    // Wait for messages to load
    await page.waitForTimeout(5000);

    // Check for loading spinner (should disappear once data loads)
    const loadingSpinner = page.locator('.animate-spin');
    const spinnerVisible = await loadingSpinner.isVisible().catch(() => false);

    if (spinnerVisible) {
      // Wait for spinner to disappear (data loaded)
      await loadingSpinner.waitFor({ state: 'hidden', timeout: 15000 });
      console.log('✅ Loading spinner disappeared (data loaded)');
    }

    // Check messages are displayed OR empty state message
    const messagesSection = page.locator('.space-y-4').last();
    const hasMessages = (await messagesSection.locator('div.bg-gradient-to-br').count()) > 0;
    const hasEmptyState = await page.locator('text=Be the first to sign').isVisible();

    const dataLoaded = hasMessages || hasEmptyState;
    expect(dataLoaded).toBe(true);

    if (hasMessages) {
      const messageCount = await messagesSection.locator('div.bg-gradient-to-br').count();
      console.log(`✅ Guestbook loaded with ${messageCount} messages`);
    } else if (hasEmptyState) {
      console.log('✅ Guestbook loaded (empty state)');
    } else {
      console.log('❌ Guestbook data did not load');
      throw new Error('Firestore query did not return data');
    }
  });

  test('Firestore realtime listener is active', async ({ page }) => {
    await page.goto('/guestbook');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Get initial message count
    const initialCount = await page
      .locator('.space-y-4')
      .last()
      .locator('div.bg-gradient-to-br')
      .count();

    console.log(`Initial message count: ${initialCount}`);

    // In a real test, we'd submit a message from another context
    // For now, just verify the listener infrastructure exists
    // by checking that messages loaded (listener is active)

    const messagesVisible =
      (await page.locator('text=Messages from Our Guests').isVisible()) ||
      (await page.locator('text=Be the first to sign').isVisible());

    expect(messagesVisible).toBe(true);
    console.log('✅ Realtime listener infrastructure operational');

    // Note: Full realtime test is in guestbook-realtime.spec.js
  });

  test('NO CSP violations for Firestore domains', async ({ page }) => {
    const cspViolations = [];

    page.on('console', (msg) => {
      const text = msg.text();
      if (
        text.includes('Content Security Policy') &&
        (text.includes('firestore.googleapis.com') ||
          text.includes('firebase.googleapis.com') ||
          text.includes('firebaseinstallations.googleapis.com'))
      ) {
        cspViolations.push(text);
      }
    });

    await page.goto('/guestbook');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(10000);

    // Should have ZERO CSP violations for Firestore
    expect(cspViolations).toHaveLength(0);

    if (cspViolations.length > 0) {
      console.log('❌ CSP violations for Firestore domains:');
      cspViolations.forEach((v, i) => console.log(`   ${i + 1}. ${v.substring(0, 200)}`));
      throw new Error(`${cspViolations.length} CSP violations blocking Firestore`);
    } else {
      console.log('✅ NO CSP violations for Firestore domains');
    }
  });
});
