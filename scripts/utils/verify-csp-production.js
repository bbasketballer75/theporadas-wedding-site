/**
 * Quick CSP Verification Script
 * Captures console logs and checks for CSP violations
 */

import { chromium } from '@playwright/test';
import { writeFileSync } from 'fs';

async function verifyCsp() {
    console.log('🚀 Starting CSP Verification...\n');

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Collect console messages
    const consoleMessages = [];
    const cspViolations = [];
    const errors = [];
    const warnings = [];

    page.on('console', (msg) => {
        const text = msg.text();
        const type = msg.type();

        consoleMessages.push({ type, text, timestamp: new Date().toISOString() });

        if (text.includes('Content Security Policy') || text.includes('Refused to connect')) {
            cspViolations.push(text);
        }
        if (type === 'error') {
            errors.push(text);
        }
        if (type === 'warning') {
            warnings.push(text);
        }
    });

    // Monitor failed requests
    const failedRequests = [];
    page.on('requestfailed', (request) => {
        failedRequests.push({
            url: request.url(),
            failure: request.failure()?.errorText,
        });
    });

    try {
        console.log('📍 Navigating to: https://wedding-website-sepia-ten.vercel.app');
        await page.goto('https://wedding-website-sepia-ten.vercel.app', {
            waitUntil: 'networkidle',
            timeout: 30000,
        });

        console.log('✅ Page loaded successfully\n');
        console.log('⏳ Waiting 5 minutes to capture Firebase initialization...\n');

        // Wait 5 minutes to capture all Firebase activity
        await page.waitForTimeout(300000); // 5 minutes

        console.log('📊 Analysis Results:\n');
        console.log('='.repeat(60));

        // Analyze CSP Violations
        console.log('\n🔒 CSP VIOLATIONS:');
        if (cspViolations.length === 0) {
            console.log('   ✅ NO CSP violations detected!');
        } else {
            console.log(`   ❌ Found ${cspViolations.length} CSP violations:`);
            cspViolations.forEach((violation, i) => {
                console.log(`\n   ${i + 1}. ${violation.substring(0, 200)}...`);
            });
        }

        // Check for Firebase connectivity
        console.log('\n🔥 FIREBASE CONNECTIVITY:');
        const firebaseMessages = consoleMessages.filter((m) =>
            m.text.toLowerCase().includes('firebase') ||
            m.text.toLowerCase().includes('firestore')
        );

        const connectedMsg = firebaseMessages.find((m) =>
            m.text.includes('Connected to Cloud Firestore')
        );

        if (connectedMsg) {
            console.log('   ✅ Firestore connected successfully!');
            console.log(`   Time: ${connectedMsg.timestamp}`);
        } else {
            console.log('   ⚠️  No Firestore connection message detected');
        }

        const transportErrors = firebaseMessages.filter((m) =>
            m.text.includes('transport errored')
        );

        if (transportErrors.length > 0) {
            console.log(`   ❌ Found ${transportErrors.length} transport errors (offline mode)`);
        } else {
            console.log('   ✅ No transport errors detected');
        }

        // Check for 400 errors on Firestore
        const firestoreErrors = errors.filter((e) =>
            e.includes('firestore.googleapis.com') && e.includes('400')
        );

        if (firestoreErrors.length > 0) {
            console.log(`   ❌ Found ${firestoreErrors.length} Firestore 400 errors`);
        } else {
            console.log('   ✅ No Firestore 400 errors');
        }

        // Overall console health
        console.log('\n📝 CONSOLE HEALTH:');
        console.log(`   Total messages: ${consoleMessages.length}`);
        console.log(`   Errors: ${errors.length}`);
        console.log(`   Warnings: ${warnings.length}`);
        console.log(`   Failed requests: ${failedRequests.length}`);

        // Check for specific Firebase CSP issues
        console.log('\n🎯 FIREBASE CSP CHECK:');
        const firebaseCspErrors = cspViolations.filter(
            (v) =>
                v.includes('firebase.googleapis.com') ||
                v.includes('firebaseinstallations.googleapis.com')
        );

        if (firebaseCspErrors.length === 0) {
            console.log('   ✅ NO CSP violations for Firebase domains!');
            console.log('   ✅ Corrected CSP fix is WORKING! 🎉');
        } else {
            console.log(`   ❌ Found ${firebaseCspErrors.length} Firebase CSP violations`);
            console.log('   ❌ CSP fix may not be deployed yet');
        }

        // Final verdict
        console.log('\n' + '='.repeat(60));
        console.log('\n🏆 FINAL VERDICT:');

        const allGood =
            cspViolations.length === 0 &&
            connectedMsg &&
            transportErrors.length === 0 &&
            firestoreErrors.length === 0;

        if (allGood) {
            console.log('   ✅ ALL CHECKS PASSED!');
            console.log('   ✅ CSP fix is working correctly');
            console.log('   ✅ Firebase/Firestore fully operational');
            console.log('   ✅ Production site healthy! 🎉\n');
        } else {
            console.log('   ⚠️  SOME ISSUES DETECTED:');
            if (cspViolations.length > 0) console.log('      - CSP violations present');
            if (!connectedMsg) console.log('      - No Firestore connection');
            if (transportErrors.length > 0) console.log('      - Transport errors (offline mode)');
            if (firestoreErrors.length > 0) console.log('      - Firestore 400 errors');
            console.log();
        }

        // Save detailed log
        const logFile = 'csp-verification-log.json';
        writeFileSync(
            logFile,
            JSON.stringify(
                {
                    timestamp: new Date().toISOString(),
                    url: 'https://wedding-website-sepia-ten.vercel.app',
                    summary: {
                        totalMessages: consoleMessages.length,
                        cspViolations: cspViolations.length,
                        errors: errors.length,
                        warnings: warnings.length,
                        failedRequests: failedRequests.length,
                        firestoreConnected: !!connectedMsg,
                        transportErrors: transportErrors.length,
                        firestore400Errors: firestoreErrors.length,
                    },
                    cspViolations,
                    firebaseMessages: firebaseMessages.map((m) => m.text),
                    errors,
                    warnings: warnings.slice(0, 50), // Limit warnings
                    failedRequests,
                },
                null,
                2
            )
        );

        console.log(`📄 Detailed log saved to: ${logFile}\n`);

    } catch (error) {
        console.error('❌ Error during verification:', error.message);
    } finally {
        await browser.close();
    }
}

// Run verification
verifyCsp().catch(console.error);
