/**
 * Global Test Setup
 * Initializes Firebase emulator before tests run
 * This runs once before all tests
 */

import { spawn } from 'child_process';
import http from 'http';

// Helper to check if Firebase emulator is running
async function isFirebaseEmulatorRunning() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:8002', () => {
      resolve(true);
    });        req.on('error', () => {
            resolve(false);
        });

        req.setTimeout(1000);
    });
}

// Helper to start Firebase emulator
async function startFirebaseEmulator() {
    if (await isFirebaseEmulatorRunning()) {
        console.log('✅ Firebase emulator already running');
        return;
    }

    console.log('🚀 Starting Firebase emulator...');

    try {
        // Start emulator process (detached so it survives Node exit)
        const emulatorProcess = spawn('firebase', ['emulators:start', '--project', 'demo-test'], {
            detached: true,
            stdio: 'pipe',
            shell: process.platform === 'win32',
        });

        // Don't wait for process - let it run in background
        emulatorProcess.unref();

        // Wait for emulator to be ready
        let ready = false;
        let attempts = 0;
        const maxAttempts = 120; // 60 seconds with 500ms intervals

        while (attempts < maxAttempts && !ready) {
            await new Promise((r) => setTimeout(r, 500));
            ready = await isFirebaseEmulatorRunning();
            attempts++;

            if (attempts % 10 === 0) {
                process.stdout.write('.');
            }
        }

        if (ready) {
            console.log('\n✅ Firebase emulator is ready on port 8002');
        } else {
            console.warn('\n⚠️  Firebase emulator did not respond in time (may still be starting)');
        }
    } catch (error) {
        console.warn('⚠️  Could not auto-start Firebase emulator:', error.message);
    }
}

export default async function globalSetup() {
    // Only try to start emulator if not explicitly disabled
    if (process.env.SKIP_FIREBASE_EMULATOR !== 'true') {
        await startFirebaseEmulator();
    }
}
