/**
 * Canva Templates API Route
 * Fetches available Canva templates by type
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type } = req.query;

  if (!type || !['overlay', 'guestbook', 'album'].includes(type)) {
    return res.status(400).json({ error: 'Invalid template type' });
  }

  try {
    // TODO: Replace with actual Canva MCP server calls after authentication
    // For now, return mock templates that will be replaced with real template IDs from Phase 2

    const mockTemplates = {
      overlay: [
        {
          id: 'OVERLAY_TEMPLATE_1',
          name: 'Elegant Sage Frame',
          description: 'Classic frame with sage green accent',
          preview: '/api/placeholder/400/600',
          type: 'overlay',
        },
        {
          id: 'OVERLAY_TEMPLATE_2',
          name: 'Blush Floral Border',
          description: 'Romantic floral border in blush pink',
          preview: '/api/placeholder/400/600',
          type: 'overlay',
        },
        {
          id: 'OVERLAY_TEMPLATE_3',
          name: 'Minimal Monogram',
          description: 'Simple monogram with wedding date',
          preview: '/api/placeholder/400/600',
          type: 'overlay',
        },
      ],
      guestbook: [
        {
          id: 'GUESTBOOK_TEMPLATE_1',
          name: 'Classic Message Card',
          description: 'Traditional guest book card design',
          preview: '/api/placeholder/300/400',
          type: 'guestbook',
        },
        {
          id: 'GUESTBOOK_TEMPLATE_2',
          name: 'Watercolor Dreams',
          description: 'Watercolor background with elegant text',
          preview: '/api/placeholder/300/400',
          type: 'guestbook',
        },
      ],
      album: [
        {
          id: 'ALBUM_TEMPLATE_1',
          name: '2x2 Grid Layout',
          description: 'Clean 4-photo grid layout',
          preview: '/api/placeholder/800/600',
          type: 'album',
        },
        {
          id: 'ALBUM_TEMPLATE_2',
          name: 'Collage Style',
          description: 'Artistic collage with overlapping photos',
          preview: '/api/placeholder/800/600',
          type: 'album',
        },
      ],
    };

    res.status(200).json({
      templates: mockTemplates[type] || [],
      type,
      count: mockTemplates[type]?.length || 0,
    });
  } catch (error) {
    console.error('Canva templates fetch error:', error);
    res.status(500).json({
      error: error.message,
      templates: [],
    });
  }
}
