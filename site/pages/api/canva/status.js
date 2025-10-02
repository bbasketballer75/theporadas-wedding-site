/**
 * Canva Status API Route
 * Checks if Canva MCP server is authenticated and available
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // In a real implementation, this would check the Canva MCP server connection
    // For now, we'll return a placeholder response
    // TODO: Implement actual Canva MCP server status check after authentication

    res.status(200).json({
      authenticated: false, // Will be true after OAuth authentication
      available: true,
      message: 'Canva MCP server configured. Authentication required.',
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
