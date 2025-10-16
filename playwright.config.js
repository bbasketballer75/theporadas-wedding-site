/**
 * Playwright Test Configuration
 * E2E testing setup for theporadas_site
 */

import { spawn } from 'child_process';
import http from 'http';

import { defineConfig, devices } from '@playwright/test';

// Helper to check if Firebase emulator is running
async function isFirebaseEmulatorRunning() {
  try {
    await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:8002', (res) => {
        resolve(res.statusCode);
      });
      req.on('error', reject);
      req.setTimeout(1000);
    });
    return true;
  } catch {
    return false;
  }
}

// Helper to start Firebase emulator
async function startFirebaseEmulator() {
  if (await isFirebaseEmulatorRunning()) {
    console.log('✅ Firebase emulator already running');
    return;
  }

  console.log('🚀 Starting Firebase emulator...');

  // Use powershell to start emulator in background
  const emulatorProcess = spawn('firebase', ['emulators:start', '--project', 'demo-test'], {
    detached: true,
    stdio: 'ignore',
    shell: true,
  });

  emulatorProcess.unref(); // Allow Node process to exit without waiting

  // Wait for emulator to be ready
  let ready = false;
  let attempts = 0;
  while (attempts < 60 && !ready) {
    await new Promise((r) => setTimeout(r, 500));
    ready = await isFirebaseEmulatorRunning();
    attempts++;
  }

  if (!ready) {
    throw new Error('Firebase emulator failed to start');
  }

  console.log('✅ Firebase emulator is ready');
}

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

  // Global setup to start Firebase emulator
  globalSetup: async () => {
    if (process.env.SKIP_FIREBASE_EMULATOR !== 'true') {
      await startFirebaseEmulator();
    }
  },

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
