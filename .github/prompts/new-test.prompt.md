---
mode: 'agent'
tools: ['codebase', 'findTestFiles', 'editFiles', 'runCommands']
description: 'Generate Playwright E2E tests for components and pages'
---

# Generate Playwright E2E Test

Your goal is to generate comprehensive Playwright E2E tests for The Poradas Wedding Site.

## Instructions

1. Ask for the component/page to test if not provided
2. Search for existing tests as reference
3. Search the codebase for the component/page implementation
4. Generate test file with comprehensive test cases

## Requirements

### Test Structure

- Create file in `tests/e2e/` directory
- Use `.spec.js` extension
- Group related tests with `test.describe()`
- Use descriptive test names

### Test Coverage

- Test page loads correctly
- Test key elements visible
- Test user interactions (clicks, form inputs)
- Test navigation
- Test responsive behavior (mobile/desktop)
- Test error states

### Selectors

- Prefer `data-testid` attributes
- Use `.first()` for strict mode (multiple matches)
- Use semantic selectors (text, role, label)
- Avoid brittle CSS selectors

### Assertions

- Use `expect(locator).toBeVisible()`
- Use `expect(locator).toHaveText()`
- Use `expect(page).toHaveURL()`
- Use `expect(page).toHaveTitle()`

## Test Template

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Component/Page Name', () => {
  test('loads correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/route');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify title
    await expect(page).toHaveTitle(/Expected Title/);

    // Verify key elements
    await expect(page.locator('h1')).toBeVisible();
  });

  test('displays key content', async ({ page }) => {
    await page.goto('http://localhost:3000/route');

    // Check for specific text
    await expect(page.locator('text=Expected Text')).toBeVisible();

    // Check for images
    await expect(page.locator('img[alt="Description"]')).toBeVisible();
  });

  test('handles user interactions', async ({ page }) => {
    await page.goto('http://localhost:3000/route');

    // Click button
    await page.click('button:has-text("Click Me")');

    // Verify action result
    await expect(page.locator('text=Success')).toBeVisible();
  });

  test('navigation works correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/route');

    // Click link
    await page.click('text=Home');

    // Verify redirect
    await expect(page).toHaveURL('http://localhost:3000/');
  });

  test('is responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('http://localhost:3000/route');

    // Verify mobile layout
    await expect(page.locator('nav')).toBeVisible();
  });

  test('handles errors gracefully', async ({ page }) => {
    await page.goto('http://localhost:3000/route');

    // Trigger error condition
    await page.click('button:has-text("Trigger Error")');

    // Verify error message
    await expect(page.locator('text=Error:')).toBeVisible();
  });
});
```

## Actions

1. **Search** existing tests: `#findTestFiles`
2. **Search** component/page: `#codebase site/`
3. **Create** test file: `tests/e2e/component-name.spec.js`
4. **Run** tests: `npx playwright test tests/e2e/component-name.spec.js`
5. **Debug** failures: `npx playwright test --debug`

## Best Practices

- Test user workflows, not implementation details
- Use `page.waitForSelector()` for dynamic content
- Use `page.waitForLoadState('networkidle')` for AJAX
- Avoid hard-coded waits (`page.waitForTimeout()`)
- Take screenshots on failure (automatic)
- Use `test.fail()` for known failing tests

## Example Usage

User: "Create tests for the gallery page"

Agent:

1. Search for gallery page implementation
2. Find existing gallery tests for reference
3. Create `tests/e2e/gallery.spec.js`
4. Test cases:
   - Gallery loads with photos
   - PhotoUpload component renders
   - Video player embeds YouTube
   - Grid layout responsive
   - Lazy loading works
5. Run tests: `npx playwright test tests/e2e/gallery.spec.js`
6. Debug any failures
7. Report results to user
