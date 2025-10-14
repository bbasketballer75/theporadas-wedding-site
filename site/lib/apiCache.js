/**
 * API Response Caching Utility
 * Simple in-memory cache with TTL support
 * For production, use Redis or similar for distributed caching
 */

const cache = new Map();

/**
 * Get cached response
 * @param {string} key - Cache key
 * @returns {any|null} Cached value or null if expired/missing
 */
export function getCached(key) {
  const entry = cache.get(key);
  
  if (!entry) return null;
  
  // Check if expired
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  
  return entry.value;
}

/**
 * Set cache value with TTL
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {number} ttlSeconds - Time to live in seconds (default: 60)
 */
export function setCache(key, value, ttlSeconds = 60) {
  cache.set(key, {
    value,
    expiresAt: Date.now() + (ttlSeconds * 1000),
  });
}

/**
 * Clear specific cache key or entire cache
 * @param {string} [key] - Optional key to clear, clears all if omitted
 */
export function clearCache(key) {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

/**
 * Cache middleware for API routes
 * Usage: export default cacheMiddleware(handler, { ttl: 300, cacheKey: 'my-key' })
 * 
 * @param {Function} handler - Next.js API route handler
 * @param {Object} options - Cache options
 * @param {number} options.ttl - Time to live in seconds (default: 60)
 * @param {Function} options.cacheKey - Function to generate cache key from req
 * @returns {Function} Wrapped handler with caching
 */
export function cacheMiddleware(handler, options = {}) {
  const { ttl = 60, cacheKey = (req) => req.url } = options;
  
  return async (req, res) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return handler(req, res);
    }
    
    const key = cacheKey(req);
    const cached = getCached(key);
    
    if (cached) {
      // Return cached response
      return res.status(200).json({
        ...cached,
        _cached: true,
        _cachedAt: new Date(Date.now() - (ttl * 1000)).toISOString(),
      });
    }
    
    // Capture response data
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      // Cache successful responses only
      if (res.statusCode >= 200 && res.statusCode < 300) {
        setCache(key, data, ttl);
      }
      return originalJson(data);
    };
    
    return handler(req, res);
  };
}
