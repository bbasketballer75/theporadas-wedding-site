# Integration Tests with Firebase Emulator

## Overview

Integration tests verify the wedding website's integration with Firebase (Firestore, Storage, Security Rules). These tests run against a local Firebase emulator rather than the live production database.

## Prerequisites

### Local Setup

1. **Java Runtime**: Firebase emulator requires Java
   - Download from: <https://www.java.com/en/download/> (external link)
   - Verify: `java -version`

2. **Firebase CLI**: Already installed in this project
   - Verify: `firebase --version`

3. **Project Configuration**: Already configured in `firebase.json`

## Running Integration Tests

### Option 1: Automatic Emulator (Recommended)

The Firebase emulator will start **automatically** before tests run:

```bash
npm test
```

This will:

1. ✅ Start Firebase emulator automatically (port 8002)
2. ✅ Run all test suites (critical, features, integration, ui, mobile)
3. ✅ Stop emulator after tests complete

### Option 2: Emulator-Only Tests

Run only integration tests with the emulator:

```bash
npm run test:integration
```

This runs tests in `tests/integration/**/*.spec.js` directory.

### Option 3: Manual Emulator Control

Start emulator separately for troubleshooting:

```bash
# Terminal 1: Start emulator
npm run emulator:start

# Terminal 2: Run tests
npm run test:features       # Or any test command
npm run test:integration    # Integration tests only
npm run test                # All tests
```

Stop the emulator:

```bash
npm run emulator:stop
```

### Option 4: Skip Emulator (E2E Tests Only)

If you want to run tests without starting the emulator:

```bash
SKIP_FIREBASE_EMULATOR=true npm test
```

This will skip all integration tests and run only E2E/feature tests.

## Integration Test Suites

| Suite | Location | Purpose |
|-------|----------|---------|
| **Gallery** | `tests/integration/gallery-emulator.spec.js` | Photo gallery Firestore operations |
| **Guestbook** | `tests/integration/guestbook-emulator.spec.js` | Guest message realtime sync |
| **Photo Upload** | `tests/integration/photo-upload-emulator.spec.js` | File upload to Storage |
| **Performance** | `tests/integration/performance-emulator.spec.js` | Stress tests with large datasets |
| **Security** | `tests/integration/security-emulator.spec.js` | Firestore/Storage security rules |

## Firebase Emulator Configuration

Emulator configuration is in `firebase.json`:

```json
{
  "emulators": {
    "firestore": {
      "port": 8002
    },
    "storage": {
      "port": 9199
    },
    "ui": {
      "enabled": true,
      "port": 4000
    }
  }
}
```

**Access Emulator UI**: <http://localhost:4000>

## Troubleshooting

### Emulator won't start

**Problem**: Firebase emulator fails to start or times out

**Solutions**:

```bash
# 1. Ensure Java is installed
java -version

# 2. Kill any lingering Java processes
taskkill /IM java.exe /F

# 3. Check if ports are available
# Port 8002 (Firestore), 9199 (Storage), 4000 (UI)

# 4. Clear emulator cache and restart
rm -r firebase-export
npm run emulator:start
```

### Tests are skipping

**Problem**: Integration tests show "Firebase emulators not running"

**Solutions**:

```bash
# 1. Make sure emulator has time to start (wait 2-3 seconds)

# 2. Check emulator is responsive
curl http://localhost:8002

# 3. Run tests with emulator already running
npm run emulator:start  # In one terminal
npm run test:integration  # In another terminal
```

### Collection clearing fails

**Problem**: Error: "Failed to clear collection - documents remain"

**Solutions**:

```bash
# 1. Restart the emulator with fresh state
npm run emulator:stop
npm run emulator:start

# 2. Clear emulator data directory
rm -r firebase-export

# 3. Re-run tests
npm test
```

### Performance tests timeout

**Problem**: "Timeout waiting for messages" or similar

**Solutions**:

1. Increase test timeout in `playwright.config.js` (integration project section)
2. Run performance tests separately:

   ```bash
   npm run emulator:start
   npx playwright test tests/integration/performance-emulator.spec.js
   ```

## CI/CD Integration

In GitHub Actions workflows, the emulator should be handled automatically by the test setup:

```yaml
- name: Run Tests
  run: npm test
  env:
    CI: true  # Enables CI mode in Playwright
```

The `global-setup.js` will automatically start the Firebase emulator before tests run.

## Test Structure

Each integration test file follows this pattern:

```javascript
test.describe('Feature Integration', () => {
  test.beforeAll(async () => {
    // Skip tests if emulator not running
    if (!(await ensureEmulatorsRunning())) {
      test.skip();
    }
    
    // Clear test data for clean state
    await clearAllTestData();
  });

  test.beforeEach(async () => {
    // Reset state before each test
    await clearCollection('collection_name');
  });

  test('test description', async () => {
    // Test implementation
  });
});
```

## Performance Notes

- First run may take longer (emulator startup: ~3-5 seconds)
- Subsequent runs reuse running emulator (faster)
- Emulator cleans up automatically after tests complete
- Full test suite (E2E + Integration): ~5-7 minutes locally

## Security & Privacy

- Integration tests only read/write to emulator (never production)
- Emulator data is ephemeral (cleared between runs)
- Test project ID: `demo-test` (isolated from production)
- Safe to run on any branch without affecting production

---

**Need help?** Check the test files directly or update this guide with new troubleshooting steps.
