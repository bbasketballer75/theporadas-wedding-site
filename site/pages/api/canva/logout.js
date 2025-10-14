/**
 * Canva Logout Endpoint
 * Clears Canva authentication cookies
 */

import { clearCanvaAuth } from '../../../utils/canvaAuth';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        clearCanvaAuth(res);

        res.status(200).json({
            success: true,
            message: 'Logged out from Canva successfully',
        });
    } catch (error) {
        console.error('Canva logout error:', error);
        res.status(500).json({
            error: 'Failed to logout',
            message: error.message,
        });
    }
}
