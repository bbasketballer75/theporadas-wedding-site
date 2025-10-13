/**
 * Error Filtering Helpers for Playwright Tests
 * 
 * Provides intelligent filtering of expected warnings/errors to focus on
 * real issues while allowing normal Firebase/browser behavior.
 * 
 * Usage:
 * ```javascript
 * const { filterCriticalErrors, isExpectedWarning } = require('../helpers/error-filters');
 * 
 * const criticalErrors = filterCriticalErrors(consoleMessages);
 * expect(criticalErrors.length).toBe(0);
 * ```
 */

/**
 * Patterns for expected/allowed console messages in development
 * These are normal behaviors that shouldn't cause test failures
 */
const EXPECTED_DEV_PATTERNS = [
    // Firebase/Firestore connection warnings
    /Connection WebChannel transport errored/i,
    /Firestore.*offline/i,
    /Failed to establish connection/i,
    /WebSocket.*failed/i,
    /firestore.*UNAVAILABLE/i,
    /firestore.*PERMISSION_DENIED/i, // Expected during auth flow

    // Firebase initialization (transient warnings)
    /Firebase.*already exists/i,
    /Firebase.*already initialized/i,

    // CSP violations that are acceptable in dev
    /Refused to load.*localhost/i,
    /Content Security Policy.*localhost/i,

    // Next.js development warnings
    /Fast Refresh/i,
    /Webpack HMR/i,
    /dev server/i,

    // Browser extensions (don't affect functionality)
    /extension/i,
    /chrome-extension/i,

    // Resource loading timeouts (recoverable)
    /net::ERR_CONNECTION_TIMED_OUT/i,
    /net::ERR_CONNECTION_REFUSED/i,

    // Analytics/tracking (non-critical)
    /Google Analytics/i,
    /analytics\.js/i,

    // Source map warnings (dev-only)
    /Source map/i,
    /sourceMappingURL/i,
];

/**
 * Patterns for Firestore-specific expected behaviors
 */
const FIRESTORE_EXPECTED_PATTERNS = [
    /Firestore.*Using maximum backoff delay/i,
    /Firestore.*Stream.*closed/i,
    /Firestore.*Connection.*closed/i,
    /Firestore.*Retrying/i,
    /RPC.*failed.*UNAVAILABLE/i,
    /Listen.*UNAVAILABLE/i,
];

/**
 * Patterns that are ALWAYS critical (never filter these out)
 */
const ALWAYS_CRITICAL_PATTERNS = [
    /Uncaught \(in promise\)/i,
    /Unhandled Promise Rejection/i,
    /ReferenceError/i,
    /TypeError.*undefined/i,
    /Cannot read property.*undefined/i,
    /is not a function/i,
    /Failed to fetch/i, // API call failures
    /401.*Unauthorized/i, // Auth failures (unless expected)
    /403.*Forbidden/i, // Permission issues (unless expected)
    /500.*Internal Server Error/i, // Server errors
];

/**
 * CSP violation patterns that are acceptable
 */
const ACCEPTABLE_CSP_PATTERNS = [
    // Firebase domains (these are allowed and expected)
    /firestore\.googleapis\.com/i,
    /firebase\.googleapis\.com/i,
    /firebaseapp\.com/i,
    /googleapis\.com/i,

    // Vercel/Next.js domains
    /vercel\.app/i,
    /vercel\.com/i,
    /_next\//i,

    // Vercel Analytics (debug script is acceptable in dev mode)
    /va\.vercel-scripts\.com/i,

    // Analytics/monitoring (non-critical)
    /sentry/i,
    /analytics/i,
    /gtag/i,
];

/**
 * Check if a console message is an expected warning that should be filtered
 * @param {Object} message - Playwright console message object
 * @returns {boolean} - True if this is an expected warning
 */
function isExpectedWarning(message) {
    const text = message.text ? message.text() : String(message);
    const type = message.type ? message.type() : 'log';

    // Allow all 'log' and 'info' messages
    if (type === 'log' || type === 'info') {
        return true;
    }

    // Check against expected patterns
    const isExpected = EXPECTED_DEV_PATTERNS.some(pattern => pattern.test(text)) ||
        FIRESTORE_EXPECTED_PATTERNS.some(pattern => pattern.test(text));

    // Never filter critical errors
    const isCritical = ALWAYS_CRITICAL_PATTERNS.some(pattern => pattern.test(text));

    return isExpected && !isCritical;
}

/**
 * Check if a CSP violation is acceptable
 * @param {Object} message - Console message object
 * @returns {boolean} - True if this CSP violation is acceptable
 */
function isAcceptableCSPViolation(message) {
    const text = message.text ? message.text() : String(message);

    // Not a CSP violation
    if (!/Content Security Policy|CSP/i.test(text)) {
        return false;
    }

    // Check if it matches acceptable patterns
    return ACCEPTABLE_CSP_PATTERNS.some(pattern => pattern.test(text));
}

/**
 * Filter console messages to return only critical errors
 * @param {Array} messages - Array of Playwright console message objects
 * @param {Object} options - Filtering options
 * @param {boolean} options.allowFirestoreWarnings - Allow Firestore connection warnings
 * @param {boolean} options.allowCSPViolations - Allow acceptable CSP violations
 * @returns {Array} - Array of critical error messages
 */
function filterCriticalErrors(messages, options = {}) {
    const {
        allowFirestoreWarnings = true,
        allowCSPViolations = true,
    } = options;

    return messages.filter(msg => {
        const type = msg.type ? msg.type() : 'log';
        const text = msg.text ? msg.text() : String(msg);

        // Only consider errors and warnings
        if (type !== 'error' && type !== 'warning') {
            return false;
        }

        // Check if it's a critical error (never filter)
        const isCritical = ALWAYS_CRITICAL_PATTERNS.some(pattern => pattern.test(text));
        if (isCritical) {
            return true;
        }

        // Filter Firestore warnings if allowed
        if (allowFirestoreWarnings &&
            FIRESTORE_EXPECTED_PATTERNS.some(pattern => pattern.test(text))) {
            return false;
        }

        // Filter acceptable CSP violations if allowed
        if (allowCSPViolations && isAcceptableCSPViolation(msg)) {
            return false;
        }

        // Filter other expected warnings
        if (isExpectedWarning(msg)) {
            return false;
        }

        // If we get here, it's a critical error
        return true;
    });
}

/**
 * Get error counts by category
 * @param {Array} messages - Array of console messages
 * @returns {Object} - Error counts by category
 */
function categorizeErrors(messages) {
    const categories = {
        critical: [],
        firestore: [],
        csp: [],
        expected: [],
        other: [],
    };

    messages.forEach(msg => {
        const text = msg.text ? msg.text() : String(msg);
        const type = msg.type ? msg.type() : 'log';

        if (type !== 'error' && type !== 'warning') {
            return;
        }

        if (ALWAYS_CRITICAL_PATTERNS.some(pattern => pattern.test(text))) {
            categories.critical.push(msg);
        } else if (FIRESTORE_EXPECTED_PATTERNS.some(pattern => pattern.test(text))) {
            categories.firestore.push(msg);
        } else if (/CSP|Content Security Policy/i.test(text)) {
            categories.csp.push(msg);
        } else if (isExpectedWarning(msg)) {
            categories.expected.push(msg);
        } else {
            categories.other.push(msg);
        }
    });

    return categories;
}

/**
 * Create a detailed error report for debugging
 * @param {Array} messages - Array of console messages
 * @returns {string} - Formatted error report
 */
function createErrorReport(messages) {
    const categories = categorizeErrors(messages);

    let report = '=== Console Error Report ===\n\n';

    if (categories.critical.length > 0) {
        report += `🔴 CRITICAL ERRORS (${categories.critical.length}):\n`;
        categories.critical.forEach(msg => {
            const text = msg.text ? msg.text() : String(msg);
            report += `  - ${text}\n`;
        });
        report += '\n';
    }

    if (categories.other.length > 0) {
        report += `⚠️  OTHER ERRORS (${categories.other.length}):\n`;
        categories.other.forEach(msg => {
            const text = msg.text ? msg.text() : String(msg);
            report += `  - ${text}\n`;
        });
        report += '\n';
    }

    if (categories.firestore.length > 0) {
        report += `ℹ️  Firestore Warnings (${categories.firestore.length}) [Expected in dev]:\n`;
        categories.firestore.slice(0, 3).forEach(msg => {
            const text = msg.text ? msg.text() : String(msg);
            report += `  - ${text.substring(0, 100)}...\n`;
        });
        if (categories.firestore.length > 3) {
            report += `  ... and ${categories.firestore.length - 3} more\n`;
        }
        report += '\n';
    }

    if (categories.csp.length > 0) {
        report += `🔒 CSP Violations (${categories.csp.length}):\n`;
        categories.csp.slice(0, 3).forEach(msg => {
            const text = msg.text ? msg.text() : String(msg);
            report += `  - ${text.substring(0, 100)}...\n`;
        });
        if (categories.csp.length > 3) {
            report += `  ... and ${categories.csp.length - 3} more\n`;
        }
        report += '\n';
    }

    return report;
}

module.exports = {
    isExpectedWarning,
    isAcceptableCSPViolation,
    filterCriticalErrors,
    categorizeErrors,
    createErrorReport,
    // Export patterns for advanced usage
    EXPECTED_DEV_PATTERNS,
    FIRESTORE_EXPECTED_PATTERNS,
    ALWAYS_CRITICAL_PATTERNS,
    ACCEPTABLE_CSP_PATTERNS,
};
