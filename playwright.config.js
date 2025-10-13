/**
 * Playwright Test Configuration
 * E2E testing setup for theporadas_site
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test directory
  testDir: './tests/e2e',

  // Maximum time one test can run (120 seconds)
  timeout: 120000,

  // Run tests in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only
  forbidOnly: !!process.env.CI,

  // Retries for flaky tests (apply both locally and on CI for stability)
  retries: 2,

  // Reporter
  reporter: [['html', { outputFolder: 'playwright-report' }], ['list']],

  // Shared settings for all projects
  use: {
    // Base URL for tests
    baseURL: 'http://localhost:3000',

    // Collect trace when retrying failed tests
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',
  },

  // Configure projects for major browsers
  // Local: Fast iteration with Chromium only (2.4 min vs 12 min)
  // CI: Full coverage across all browsers and devices
  // Production: Smoke tests against live site
  projects: process.env.BASE_URL
    ? [
      // Production smoke tests: Run against live site
      {
        name: 'production',
        testMatch: '**/production/*.spec.js',
        use: {
          ...devices['Desktop Chrome'],
          baseURL: process.env.BASE_URL,
        },
        retries: 1, // Single retry for production tests
        timeout: 30000, // Longer timeout for production network calls
      },
    ]
    : process.env.CI
      ? [
        // CI: Test all browsers for comprehensive coverage
        {
          name: 'chromium',
          use: { ...devices['Desktop Chrome'] },
        },
        {
          name: 'firefox',
          use: { ...devices['Desktop Firefox'] },
        },
        {
          name: 'webkit',
          use: { ...devices['Desktop Safari'] },
        },
        {
          name: 'Mobile Chrome',
          use: { ...devices['Pixel 5'] },
        },
        {
          name: 'Mobile Safari',
          use: { ...devices['iPhone 12'] },
        },
      ]
      : [
        // Local: Fast iteration with Chromium only
        {
          name: 'chromium',
          use: { ...devices['Desktop Chrome'] },
        },
      ],

  // Web server configuration
  webServer: {
    // Use a simple command and rely on the `env` map to set NEXT_TURBOPACK for cross-shell compatibility
    command: 'cd site && npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    // Force NEXT_TURBOPACK=1 for the dev web server to silence the "Webpack is configured while Turbopack is not" warning
    env: { NEXT_TURBOPACK: '1' },
  },
});
