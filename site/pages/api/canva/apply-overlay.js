/**
 * Canva Apply Overlay API Route
 * Applies a Canva overlay template to a photo
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image, templateId } = req.body;

  if (!image || !templateId) {
    return res.status(400).json({ error: 'Missing image or templateId' });
  }

  try {
    // TODO: Implement actual Canva MCP server integration
    // Steps after authentication:
    // 1. Load the Canva overlay template
    // 2. Create a new design with the photo as background
    // 3. Apply the overlay template
    // 4. Export the composite image
    // 5. Return the image data URL

    // For now, return the original image (no overlay applied)
    // This will be replaced with actual Canva integration after Phase 1 & 2

    res.status(200).json({
      compositeImage: image,
      templateId,
      message: 'Canva overlay will be applied after authentication and template creation',
    });
  } catch (error) {
    console.error('Canva overlay application error:', error);
    res.status(500).json({
      error: error.message,
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Increase limit for base64 images
    },
  },
};
