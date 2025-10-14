/**
 * Canva Authentication Utilities
 * Helper functions for managing Canva OAuth tokens
 */

/**
 * Get the current Canva access token from cookies
 * @param {Object} req - Next.js request object
 * @returns {string|null} Access token or null if not authenticated
 */
export function getCanvaAccessToken(req) {
    return req.cookies?.canva_access_token || null;
}

/**
 * Check if the Canva access token is expired
 * @param {Object} req - Next.js request object
 * @returns {boolean} True if token is expired
 */
export function isTokenExpired(req) {
    const expiresAt = req.cookies?.canva_token_expires;
    if (!expiresAt) return true;
    return Date.now() >= parseInt(expiresAt);
}

/**
 * Refresh the Canva access token using refresh token
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 * @returns {Promise<string|null>} New access token or null if refresh failed
 */
export async function refreshCanvaToken(req, res) {
    const refreshToken = req.cookies?.canva_refresh_token;
    if (!refreshToken) {
        console.error('No refresh token available');
        return null;
    }

    try {
        const tokenResponse = await fetch('https://api.canva.com/rest/v1/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: process.env.CANVA_CLIENT_ID,
                client_secret: process.env.CANVA_CLIENT_SECRET,
            }),
        });

        if (!tokenResponse.ok) {
            console.error('Token refresh failed:', await tokenResponse.text());
            return null;
        }

        const tokenData = await tokenResponse.json();
        const { access_token, refresh_token: newRefreshToken, expires_in } = tokenData;

        // Update cookies with new tokens
        const expiresAt = Date.now() + expires_in * 1000;
        res.setHeader('Set-Cookie', [
            `canva_access_token=${access_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${expires_in}`,
            `canva_refresh_token=${newRefreshToken || refreshToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`,
            `canva_token_expires=${expiresAt}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${expires_in}`,
        ]);

        return access_token;
    } catch (error) {
        console.error('Token refresh error:', error);
        return null;
    }
}

/**
 * Get a valid Canva access token, refreshing if necessary
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 * @returns {Promise<string|null>} Valid access token or null
 */
export async function getValidToken(req, res) {
    let token = getCanvaAccessToken(req);

    if (!token) {
        return null;
    }

    if (isTokenExpired(req)) {
        token = await refreshCanvaToken(req, res);
    }

    return token;
}

/**
 * Make an authenticated request to Canva API
 * @param {string} endpoint - API endpoint (e.g., '/v1/users/me/profile')
 * @param {Object} req - Next.js request object
 * @param {Object} res - Next.js response object
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} Fetch response
 */
export async function canvaApiRequest(endpoint, req, res, options = {}) {
    const token = await getValidToken(req, res);

    if (!token) {
        throw new Error('Not authenticated with Canva');
    }

    const url = `https://api.canva.com/rest${endpoint}`;
    const response = await fetch(url, {
        ...options,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    return response;
}

/**
 * Clear all Canva authentication cookies
 * @param {Object} res - Next.js response object
 */
export function clearCanvaAuth(res) {
    res.setHeader('Set-Cookie', [
        'canva_access_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
        'canva_refresh_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
        'canva_token_expires=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
    ]);
}
