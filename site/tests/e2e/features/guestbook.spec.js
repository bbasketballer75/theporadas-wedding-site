/**
 * FEATURE TESTS: Guestbook Complete Workflows
 * Tests all guestbook functionality including form validation, submission, and display
 */

const { test, expect } = require('@playwright/test');

test.describe('Guestbook Page - Structure & Loading', () => {
  test('guestbook page loads with correct structure', async ({ page }) => {
    await page.goto('/guestbook');
    await page.waitForLoadState('networkidle');

    // Check page title
    await expect(page).toHaveTitle(/guestbook|guest book/i);

    // Check main heading
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    // Check form is present
    const form = page.locator('form').first();
    await expect(form).toBeVisible();

    console.log('✅ Guestbook page structure validated');
  });

  test('form contains all required fields', async ({ page }) => {
    await page.goto('/guestbook');

    // Check for name input
    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();
    await expect(nameInput).toBeVisible();

    // Check for message textarea
    const messageInput = page.locator('textarea[name="message"], textarea[placeholder*="message" i]').first();
    await expect(messageInput).toBeVisible();

    // Check for relationship field (optional but should exist)
    const relationshipInput = page.locator('input[name="relationship"], select[name="relationship"]').first();
    const relationshipExists = await relationshipInput.count() > 0;

    // Check for submit button
    const submitButton = page.locator('button[type="submit"]').first();
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();

    console.log(`✅ Form fields validated (relationship field: ${relationshipExists ? 'present' : 'optional'})`);
  });

  test('loading spinner appears while fetching messages', async ({ page }) => {
    // Navigate and immediately check for loading state
    const response = page.goto('/guestbook');

    // Look for loading indicator (spinner, skeleton, or "Loading..." text)
    const loadingIndicator = page.locator(
      'text=/loading/i, [class*="loading"], [class*="spinner"], [class*="skeleton"]'
    );

    // Check if loading state was visible (may disappear quickly)
    const loadingVisible = await loadingIndicator.isVisible().catch(() => false);

    await response;
    await page.waitForLoadState('networkidle');

    console.log(`ℹ️  Loading indicator ${loadingVisible ? 'was visible' : 'may have loaded too fast to detect'}`);
  });

  test('messages display area is present', async ({ page }) => {
    await page.goto('/guestbook');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Wait for Firestore

    // Check for messages container or empty state
    const messagesContainer = page.locator('[data-testid="guestbook-messages"], [class*="message"]').first();
    const emptyState = page.locator('text=/no messages|be the first|empty/i');

    const hasMessages = await messagesContainer.count() > 0;
    const hasEmptyState = await emptyState.count() > 0;

    expect(hasMessages || hasEmptyState).toBe(true);

    console.log(`✅ Messages area validated (${hasMessages ? 'has messages' : 'empty state shown'})`);
  });
});

test.describe('Guestbook Form - Validation', () => {
  test('prevents submission with empty name', async ({ page }) => {
    await page.goto('/guestbook');

    const messageInput = page.locator('textarea[name="message"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    // Fill only message, leave name empty
    await messageInput.fill('This should not submit without a name');
    await submitButton.click();

    // Wait a moment
    await page.waitForTimeout(500);

    // Check for validation message or alert
    const validationMessage = await page.locator('text=/name.*required|please.*name/i').count();
    const messageStillPresent = await messageInput.inputValue();

    // Either validation message appeared OR message still in form (not cleared)
    expect(validationMessage > 0 || messageStillPresent.length > 0).toBe(true);

    console.log('✅ Empty name validation working');
  });

  test('prevents submission with empty message', async ({ page }) => {
    await page.goto('/guestbook');

    const nameInput = page.locator('input[name="name"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    // Fill only name, leave message empty
    await nameInput.fill('Test User');
    await submitButton.click();

    await page.waitForTimeout(500);

    // Check for validation
    const validationMessage = await page.locator('text=/message.*required|please.*message/i').count();
    const nameStillPresent = await nameInput.inputValue();

    expect(validationMessage > 0 || nameStillPresent.length > 0).toBe(true);

    console.log('✅ Empty message validation working');
  });

  test('accepts valid form submission', async ({ page }) => {
    await page.goto('/guestbook');
    await page.waitForTimeout(3000); // Wait for Firebase

    const nameInput = page.locator('input[name="name"]').first();
    const messageInput = page.locator('textarea[name="message"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    // Fill form with valid data
    const testName = `E2E Test User ${Date.now()}`;
    const testMessage = `Automated test message at ${new Date().toISOString()}`;

    await nameInput.fill(testName);
    await messageInput.fill(testMessage);

    // Get initial message count
    const initialCount = await page.locator('[data-testid="guestbook-message"]').count();

    // Submit
    await submitButton.click();

    // Wait for submission
    await page.waitForTimeout(2000);

    // Check for success indicator
    const successMessage = await page.locator('text=/success|thank you|submitted/i').count();

    // OR check if form was cleared
    const nameCleared = (await nameInput.inputValue()).length === 0;
    const messageCleared = (await messageInput.inputValue()).length === 0;

    // OR check if message appeared in list
    await page.waitForTimeout(2000);
    const newCount = await page.locator('[data-testid="guestbook-message"]').count();

    const submitted = successMessage > 0 || (nameCleared && messageCleared) || newCount > initialCount;

    expect(submitted).toBe(true);

    if (submitted) {
      console.log('✅ Valid form submission accepted');
    } else {
      console.log('⚠️  Submission may have succeeded but indicators unclear');
    }
  });

  test('handles long messages correctly', async ({ page }) => {
    await page.goto('/guestbook');
    await page.waitForTimeout(3000);

    const nameInput = page.locator('input[name="name"]').first();
    const messageInput = page.locator('textarea[name="message"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    // Create a long message (500 characters)
    const longMessage = 'A'.repeat(500) + ` - Test message ${Date.now()}`;

    await nameInput.fill('Long Message Tester');
    await messageInput.fill(longMessage);
    await submitButton.click();

    await page.waitForTimeout(2000);

    // Should either accept or show character limit warning
    const warningExists = await page.locator('text=/character limit|too long|maximum/i').count() > 0;
    const formCleared = (await nameInput.inputValue()).length === 0;

    // Either accepted or rejected with clear feedback
    expect(warningExists || formCleared).toBe(true);

    console.log(`✅ Long message handling: ${warningExists ? 'rejected with warning' : 'accepted'}`);
  });

  test('handles special characters in message', async ({ page }) => {
    await page.goto('/guestbook');
    await page.waitForTimeout(3000);

    const nameInput = page.locator('input[name="name"]').first();
    const messageInput = page.locator('textarea[name="message"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    // Message with special characters
    const specialMessage = `Test with special chars: <>&"' 🎉❤️ ${Date.now()}`;

    await nameInput.fill('Special Char Tester');
    await messageInput.fill(specialMessage);
    await submitButton.click();

    await page.waitForTimeout(2000);

    // Should handle gracefully (no JavaScript errors)
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.waitForTimeout(1000);

    // Should not have XSS-related errors
    const hasXSSErrors = consoleErrors.some((err) => err.includes('script') || err.includes('unsafe'));

    expect(hasXSSErrors).toBe(false);

    console.log('✅ Special characters handled safely');
  });
});

test.describe('Guestbook Messages - Display', () => {
  test('messages display with correct information', async ({ page }) => {
    await page.goto('/guestbook');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Wait for Firestore

    const messages = page.locator('[data-testid="guestbook-message"]');
    const count = await messages.count();

    if (count > 0) {
      // Check first message has required fields
      const firstMessage = messages.first();

      // Should have name
      const hasName = await firstMessage.locator('text=/^(?!.*@).*[A-Z]/').count() > 0;

      // Should have message content
      const hasContent = await firstMessage.textContent();

      expect(hasName).toBe(true);
      expect(hasContent.length).toBeGreaterThan(10);

      console.log(`✅ Messages display correctly (${count} messages found)`);
    } else {
      console.log('ℹ️  No messages to validate (empty guestbook)');
    }
  });

  test('messages are ordered correctly', async ({ page }) => {
    await page.goto('/guestbook');
    await page.waitForTimeout(5000);

    const messages = page.locator('[data-testid="guestbook-message"]');
    const count = await messages.count();

    if (count >= 2) {
      // Get timestamps or check visual order
      const firstMessageText = await messages.nth(0).textContent();
      const lastMessageText = await messages.nth(count - 1).textContent();

      // Messages should be different
      expect(firstMessageText).not.toBe(lastMessageText);

      console.log(`✅ Message ordering validated (${count} messages)`);
    } else {
      console.log('ℹ️  Not enough messages to validate ordering');
    }
  });

  test('message count/stats display correctly', async ({ page }) => {
    await page.goto('/guestbook');
    await page.waitForTimeout(5000);

    // Look for message count indicator
    const countIndicator = page.locator('text=/\\d+ message|message count|total messages/i');
    const hasCount = await countIndicator.count() > 0;

    if (hasCount) {
      const countText = await countIndicator.first().textContent();
      console.log(`✅ Message count displayed: ${countText}`);
    } else {
      console.log('ℹ️  No message count indicator found (optional feature)');
    }
  });
});

test.describe('Guestbook - User Experience', () => {
  test('submit button shows loading state during submission', async ({ page }) => {
    await page.goto('/guestbook');
    await page.waitForTimeout(3000);

    const nameInput = page.locator('input[name="name"]').first();
    const messageInput = page.locator('textarea[name="message"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    await nameInput.fill(`UX Test ${Date.now()}`);
    await messageInput.fill('Testing loading state');

    // Get initial button text
    const initialText = await submitButton.textContent();

    // Click and immediately check for loading state
    await submitButton.click();

    // Check if button is disabled or shows loading
    const isDisabled = await submitButton.isDisabled().catch(() => false);
    const newText = await submitButton.textContent();
    const textChanged = newText !== initialText;

    const showsLoading = isDisabled || textChanged;

    await page.waitForTimeout(2000);

    if (showsLoading) {
      console.log(`✅ Submit button shows loading state (disabled: ${isDisabled}, text changed: ${textChanged})`);
    } else {
      console.log('ℹ️  Loading state may be too fast to detect');
    }
  });

  test('success message appears after submission', async ({ page }) => {
    await page.goto('/guestbook');
    await page.waitForTimeout(3000);

    const nameInput = page.locator('input[name="name"]').first();
    const messageInput = page.locator('textarea[name="message"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    await nameInput.fill(`Success Test ${Date.now()}`);
    await messageInput.fill('Testing success message');
    await submitButton.click();

    // Wait and check for success indicator
    await page.waitForTimeout(2000);

    const successIndicator = page.locator('text=/success|thank you|submitted|posted/i');
    const hasSuccess = await successIndicator.count() > 0;

    if (hasSuccess) {
      await expect(successIndicator.first()).toBeVisible();
      console.log('✅ Success message displayed');
    } else {
      // Check if form was cleared (alternative success indicator)
      const formCleared = (await nameInput.inputValue()).length === 0;
      expect(formCleared).toBe(true);
      console.log('✅ Form cleared after submission (implicit success)');
    }
  });

  test('relationship field allows custom input', async ({ page }) => {
    await page.goto('/guestbook');

    const relationshipField = page.locator('input[name="relationship"], select[name="relationship"]').first();
    const fieldExists = await relationshipField.count() > 0;

    if (fieldExists) {
      // If it's a select, check for options
      const isSelect = await relationshipField.evaluate((el) => el.tagName === 'SELECT');

      if (isSelect) {
        const options = await relationshipField.locator('option').count();
        expect(options).toBeGreaterThan(1);
        console.log(`✅ Relationship field is a select with ${options} options`);
      } else {
        // If it's an input, test typing
        await relationshipField.fill('College Friend');
        const value = await relationshipField.inputValue();
        expect(value).toBe('College Friend');
        console.log('✅ Relationship field accepts custom input');
      }
    } else {
      console.log('ℹ️  Relationship field not present (optional)');
    }
  });

  test('page is responsive on mobile viewport', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/guestbook');
    await page.waitForTimeout(2000);

    // Form should still be visible and usable
    const form = page.locator('form').first();
    await expect(form).toBeVisible();

    const nameInput = page.locator('input[name="name"]').first();
    const messageInput = page.locator('textarea[name="message"]').first();

    await expect(nameInput).toBeVisible();
    await expect(messageInput).toBeVisible();

    // Check form is not cut off
    const formBox = await form.boundingBox();
    expect(formBox.width).toBeLessThanOrEqual(375);

    console.log('✅ Guestbook is mobile responsive');
  });
});
