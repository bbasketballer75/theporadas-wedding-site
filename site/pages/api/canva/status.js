/**
 * Canva Status API Route
 * Checks if Canva OAuth is authenticated and available
 */

import { getValidToken, canvaApiRequest } from '../../../utils/canvaAuth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = await getValidToken(req, res);

    if (!token) {
      return res.status(200).json({
        authenticated: false,
        available: true,
        message: 'Canva authentication required. Click "Connect to Canva" to get started.',
      });
    }

    // Verify token by fetching user profile
    const profileResponse = await canvaApiRequest('/v1/users/me/profile', req, res);

    if (!profileResponse.ok) {
      return res.status(200).json({
        authenticated: false,
        available: true,
        message: 'Canva token invalid. Please re-authenticate.',
      });
    }

    const profile = await profileResponse.json();

    res.status(200).json({
      authenticated: true,
      available: true,
      user: {
        displayName: profile.display_name,
        email: profile.email,
      },
      message: 'Canva connected successfully!',
    });
  } catch (error) {
    console.error('Canva status check error:', error);
    res.status(500).json({
      authenticated: false,
      available: false,
      error: error.message,
    });
  }
}
