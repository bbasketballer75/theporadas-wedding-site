---
mode: 'agent'
tools: ['codebase', 'editFiles', 'findTestFiles']
description: 'Generate a new Next.js page with navigation and tests'
---

# Generate New Next.js Page

Your goal is to generate a new page for The Poradas Wedding Site using Next.js Pages Router.

## Instructions

1. Ask for the page name/route if not provided
2. Ask for page content/functionality if not provided
3. Search the codebase for existing pages as reference
4. Generate the page, update navigation, and create tests

## Requirements

### Page Structure

- Create file in `site/pages/` directory
- Use `.js` or `.jsx` extension (TypeScript .tsx if complex logic)
- Export default function component
- Include proper `<Head>` metadata

### Navigation

- Add link to navigation in `site/pages/index.js`
- Use Next.js `Link` component
- Update nav structure: `<nav> → <Link>`

### Styling

- Use Tailwind CSS with wedding theme
- Consistent layout with other pages
- Responsive design (mobile-first)

### Testing

- Create Playwright test in `tests/e2e/`
- Test page loads correctly
- Test key elements visible
- Test responsive behavior

## Page Template

```jsx
import Head from 'next/head';
import Link from 'next/link';

export default function PageName() {
  return (
    <>
      <Head>
        <title>Page Title - The Poradas</title>
        <meta name="description" content="Page description" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-mint to-cream p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display text-5xl font-bold text-sage text-center mb-8">
            Page Heading
          </h1>

          {/* Page content */}

          <div className="text-center mt-8">
            <Link
              href="/"
              className="font-body text-lg text-sage hover:text-blush transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
```

## Test Template

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Page Name', () => {
  test('page loads correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/page-route');

    // Verify page title
    await expect(page).toHaveTitle(/Page Title/);

    // Verify heading
    await expect(page.locator('h1')).toContainText('Page Heading');
  });

  test('navigation works', async ({ page }) => {
    await page.goto('http://localhost:3000/page-route');

    // Click back link
    await page.click('text=Back to Home');

    // Verify redirected to home
    await expect(page).toHaveURL('http://localhost:3000/');
  });
});
```

## Actions

1. **Search** existing pages: `#codebase site/pages/`
2. **Create** page file: `site/pages/page-name.js`
3. **Update** navigation in `site/pages/index.js`
4. **Create** test file: `tests/e2e/page-name.spec.js`
5. **Run** tests: `npx playwright test tests/e2e/page-name.spec.js`

## Example Usage

User: "Create a /memories page where guests can share their favorite wedding memories"

Agent:

1. Search for similar pages (gallery, map)
2. Create `site/pages/memories.js`
3. Add "Memories" link to navigation
4. Create `tests/e2e/memories.spec.js`
5. Run tests to verify
