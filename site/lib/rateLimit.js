/**
 * API Rate Limiting Utility
 * Simple in-memory rate limiter based on IP address
 * For production, use Redis or similar for distributed rate limiting
 */

const requestCounts = new Map();
const CLEANUP_INTERVAL = 60000; // Clean up old entries every minute

// Periodic cleanup to prevent memory leaks
setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of requestCounts.entries()) {
        if (now > data.resetAt) {
            requestCounts.delete(ip);
        }
    }
}, CLEANUP_INTERVAL);

/**
 * Get client IP address from request
 * @param {Object} req - Next.js API request object
 * @returns {string} IP address
 */
export function getClientIP(req) {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(',')[0] : req.socket.remoteAddress;
    return ip || 'unknown';
}

/**
 * Rate limit middleware for API routes
 * Usage: export default rateLimitMiddleware(handler, { maxRequests: 10, windowMs: 60000 })
 * 
 * @param {Function} handler - Next.js API route handler
 * @param {Object} options - Rate limit options
 * @param {number} options.maxRequests - Max requests per window (default: 60)
 * @param {number} options.windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 * @param {string} options.message - Custom error message
 * @returns {Function} Wrapped handler with rate limiting
 */
export function rateLimitMiddleware(handler, options = {}) {
    const {
        maxRequests = 60,
        windowMs = 60000,
        message = 'Too many requests, please try again later.',
    } = options;

    return async (req, res) => {
        const ip = getClientIP(req);
        const now = Date.now();

        // Get or initialize request count for this IP
        let requestData = requestCounts.get(ip);

        if (!requestData || now > requestData.resetAt) {
            // New window, reset count
            requestData = {
                count: 0,
                resetAt: now + windowMs,
            };
            requestCounts.set(ip, requestData);
        }

        // Increment request count
        requestData.count += 1;

        // Check if over limit
        if (requestData.count > maxRequests) {
            const retryAfter = Math.ceil((requestData.resetAt - now) / 1000);

            res.setHeader('X-RateLimit-Limit', maxRequests);
            res.setHeader('X-RateLimit-Remaining', 0);
            res.setHeader('X-RateLimit-Reset', Math.ceil(requestData.resetAt / 1000));
            res.setHeader('Retry-After', retryAfter);

            return res.status(429).json({
                error: message,
                retryAfter,
            });
        }

        // Set rate limit headers
        res.setHeader('X-RateLimit-Limit', maxRequests);
        res.setHeader('X-RateLimit-Remaining', maxRequests - requestData.count);
        res.setHeader('X-RateLimit-Reset', Math.ceil(requestData.resetAt / 1000));

        // Continue to handler
        return handler(req, res);
    };
}

/**
 * Combined middleware for rate limiting + caching
 * Usage: export default rateLimitAndCache(handler, { rate: {...}, cache: {...} })
 * 
 * @param {Function} handler - Next.js API route handler
 * @param {Object} options - Combined options
 * @param {Object} options.rate - Rate limit options (see rateLimitMiddleware)
 * @param {Object} options.cache - Cache options (see cacheMiddleware from apiCache.js)
 * @returns {Function} Wrapped handler
 */
export function rateLimitAndCache(handler, options = {}) {
    const { rate = {}, cache = {} } = options;

    // Import cache middleware dynamically to avoid circular dependency
    const { cacheMiddleware } = require('./apiCache');

    // Apply rate limit first, then cache
    const rateLimited = rateLimitMiddleware(handler, rate);
    return cacheMiddleware(rateLimited, cache);
}
