/**
 * Canva OAuth Authorization Endpoint
 * Redirects users to Canva's OAuth authorization page
 */

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const clientId = process.env.CANVA_CLIENT_ID;
        const redirectUri = encodeURIComponent(process.env.CANVA_REDIRECT_URI);
        const state = generateState(); // CSRF protection

        // Store state in session/cookie for validation in callback
        res.setHeader(
            'Set-Cookie',
            `canva_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`
        );

        // Canva OAuth authorization URL
        const authUrl = `https://www.canva.com/api/oauth/authorize?` +
            `response_type=code&` +
            `client_id=${clientId}&` +
            `redirect_uri=${redirectUri}&` +
            `scope=asset:read asset:write design:content:read design:content:write design:meta:read folder:read folder:write profile:read&` +
            `state=${state}`;

        // Redirect to Canva authorization page
        res.redirect(302, authUrl);
    } catch (error) {
        console.error('Canva authorization error:', error);
        res.status(500).json({
            error: 'Failed to initiate Canva authorization',
            message: error.message,
        });
    }
}

/**
 * Generate a random state value for CSRF protection
 * @returns {string} Random state string
 */
function generateState() {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}
