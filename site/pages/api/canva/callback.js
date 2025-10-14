/**
 * Canva OAuth Callback Endpoint
 * Handles the OAuth callback from Canva after user authorization
 */

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { code, state, error: oauthError } = req.query;

        // Check for OAuth errors
        if (oauthError) {
            console.error('Canva OAuth error:', oauthError);
            return res.redirect(`/album?error=canva_auth_failed&reason=${oauthError}`);
        }

        // Validate state (CSRF protection)
        const storedState = req.cookies?.canva_oauth_state;
        if (!state || state !== storedState) {
            console.error('Invalid OAuth state');
            return res.redirect('/album?error=invalid_state');
        }

        if (!code) {
            console.error('No authorization code received');
            return res.redirect('/album?error=no_code');
        }

        // Exchange authorization code for access token
        const tokenResponse = await fetch('https://api.canva.com/rest/v1/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                client_id: process.env.CANVA_CLIENT_ID,
                client_secret: process.env.CANVA_CLIENT_SECRET,
                redirect_uri: process.env.CANVA_REDIRECT_URI,
            }),
        });

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json();
            console.error('Canva token exchange failed:', errorData);
            return res.redirect('/album?error=token_exchange_failed');
        }

        const tokenData = await tokenResponse.json();
        const { access_token, refresh_token, expires_in } = tokenData;

        // Store tokens securely (in production, use encrypted database/session store)
        // For now, we'll use HTTP-only cookies
        const expiresAt = Date.now() + expires_in * 1000;

        res.setHeader('Set-Cookie', [
            `canva_access_token=${access_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${expires_in}`,
            `canva_refresh_token=${refresh_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`, // 30 days
            `canva_token_expires=${expiresAt}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${expires_in}`,
        ]);

        // Clear the state cookie
        res.setHeader(
            'Set-Cookie',
            `canva_oauth_state=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
        );

        // Fetch user profile to verify authentication
        const profileResponse = await fetch('https://api.canva.com/rest/v1/users/me/profile', {
            headers: {
                'Authorization': `Bearer ${access_token}`,
            },
        });

        if (profileResponse.ok) {
            const profile = await profileResponse.json();
            console.log('Canva user authenticated:', profile.display_name);
        }

        // Redirect back to album page with success message
        res.redirect('/album?canva_connected=true');
    } catch (error) {
        console.error('Canva callback error:', error);
        res.redirect('/album?error=callback_failed');
    }
}
