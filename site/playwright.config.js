const { defineConfig, devices } = require('@playwright/test');

// Environment detection
const isProduction = !!process.env.BASE_URL;
const isDevelopment = !isProduction;
const isCI = !!process.env.CI;

// Base URL configuration
const baseURL = process.env.BASE_URL || 'http://localhost:3000';

/**
 * Playwright Test Configuration
 * 
 * Split configuration for Development vs Production:
 * - Development: More lenient timeouts, allows expected Firebase warnings
 * - Production: Strict validation, real-world performance testing
 * 
 * Environment Variables:
 * - BASE_URL: Set to production URL for production tests
 * - CI: Set to 'true' in CI/CD environments
 */
module.exports = defineConfig({
  testDir: './tests/e2e',

  // Timeouts: Development allows longer for debugging
  timeout: isDevelopment ? 60000 : 30000,
  expect: {
    timeout: isDevelopment ? 15000 : 10000,
  },

  fullyParallel: true,
  forbidOnly: isCI,

  // Retries: More aggressive in dev for flaky tests
  retries: isCI ? 2 : (isDevelopment ? 1 : 0),

  // Workers: Limit parallelism in CI
  workers: isCI ? 1 : (isDevelopment ? 2 : undefined),

  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ...(isCI ? [['junit', { outputFile: 'test-results/junit.xml' }]] : []),
  ],

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Action timeout: More lenient in development
    actionTimeout: isDevelopment ? 30000 : 15000,
  },

  projects: [
    // ============================================================================
    // CRITICAL TESTS (P0) - Must pass in both dev and production
    // ============================================================================
    {
      name: 'critical-dev',
      testMatch: /.*\/critical\/.*\.spec\.js/,
      use: {
        ...devices['Desktop Chrome'],
        // Development: Allow Firebase initialization warnings
        contextOptions: {
          ignoreHTTPSErrors: isDevelopment,
        },
      },
      // Only run in development
      grep: isDevelopment ? undefined : /$^/,
    },
    {
      name: 'critical-prod',
      testMatch: /.*\/critical\/.*\.spec\.js/,
      use: {
        ...devices['Desktop Chrome'],
      },
      // Only run in production (when BASE_URL is set)
      grep: isProduction ? undefined : /$^/,
    },

    // ============================================================================
    // FEATURE TESTS (P1) - User workflows and interactions
    // ============================================================================
    {
      name: 'features',
      testMatch: /.*\/features\/.*\.spec\.js/,
      use: {
        ...devices['Desktop Chrome'],
        // Retry flaky UI interactions
        actionTimeout: 45000,
      },
      retries: 2, // Feature tests can be flaky due to timing
    },

    // ============================================================================
    // UI/COMPONENT TESTS (P2) - Visual and layout validation
    // ============================================================================
    {
      name: 'ui',
      testMatch: /.*\/ui\/.*\.spec\.js/,
      use: { ...devices['Desktop Chrome'] },
    },

    // ============================================================================
    // PRODUCTION SMOKE TESTS - Only run against production BASE_URL
    // ============================================================================
    {
      name: 'production',
      testMatch: /.*\/production\/.*\.spec\.js/,
      use: {
        ...devices['Desktop Chrome'],
      },
      // Only run when BASE_URL is explicitly set
      grep: isProduction ? undefined : /$^/,
    },

    // ============================================================================
    // MOBILE TESTS - Responsive design validation
    // ============================================================================
    {
      name: 'mobile',
      testMatch: /.*\/(features|ui)\/.*\.spec\.js/,
      use: {
        ...devices['iPhone 12'],
        // Mobile needs longer timeouts for slower rendering
        actionTimeout: 30000,
      },
      // Skip in CI to save time (run manually or in scheduled jobs)
      grep: isCI ? /$^/ : undefined,
    },
  ],

  // ============================================================================
  // DEV SERVER - Only start for development tests
  // ============================================================================
  webServer: isDevelopment ? {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !isCI,
    timeout: 120000,
    env: {
      // Ensure Turbopack is enabled for faster dev server
      NEXT_TURBOPACK: '1',
    },
  } : undefined,
});
