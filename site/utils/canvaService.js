/**
 * Canva Service Utility
 * Handles interaction with Canva MCP server for design templates
 *
 * Note: This is a client-side wrapper. Actual Canva MCP calls happen server-side
 * via API routes that communicate with the MCP server.
 */

const WEDDING_THEME = {
  sage: '#7ca982',
  blush: '#d8a7b1',
  cream: '#fbeaea',
  mint: '#e9f5ec',
};

/**
 * Fetch available Canva templates of a specific type
 * @param {string} type - 'overlay' | 'guestbook' | 'album'
 * @returns {Promise<Array>} Array of template objects
 */
export async function fetchCanvaTemplates(type) {
  try {
    const response = await fetch(`/api/canva/templates?type=${type}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch templates: ${response.statusText}`);
    }
    const data = await response.json();
    return data.templates || [];
  } catch (error) {
    console.error('Error fetching Canva templates:', error);
    return [];
  }
}

/**
 * Apply a Canva overlay template to an image
 * @param {string} imageDataUrl - Base64 image data URL
 * @param {string} templateId - Canva template ID
 * @returns {Promise<string>} Composite image data URL
 */
export async function applyCanvaOverlay(imageDataUrl, templateId) {
  try {
    const response = await fetch('/api/canva/apply-overlay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageDataUrl,
        templateId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to apply overlay: ${response.statusText}`);
    }

    const data = await response.json();
    return data.compositeImage;
  } catch (error) {
    console.error('Error applying Canva overlay:', error);
    throw error;
  }
}

/**
 * Generate a Guest Book card with a message using Canva template
 * @param {Object} params - Parameters for card generation
 * @param {string} params.templateId - Canva template ID
 * @param {string} params.message - Guest message text
 * @param {string} params.author - Guest name
 * @returns {Promise<string>} Generated card image URL
 */
export async function generateGuestBookCard({ templateId, message, author }) {
  try {
    const response = await fetch('/api/canva/generate-card', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateId,
        message,
        author,
        theme: WEDDING_THEME,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate card: ${response.statusText}`);
    }

    const data = await response.json();
    return data.cardImage;
  } catch (error) {
    console.error('Error generating guest book card:', error);
    throw error;
  }
}

/**
 * Generate an album layout with multiple photos using Canva template
 * @param {Object} params - Parameters for album generation
 * @param {string} params.templateId - Canva template ID
 * @param {Array<string>} params.photos - Array of photo URLs/data URLs
 * @param {Array<string>} params.captions - Array of captions (optional)
 * @returns {Promise<Object>} Album pages with download URL
 */
export async function generateAlbumLayout({ templateId, photos, captions = [] }) {
  try {
    const response = await fetch('/api/canva/generate-album', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateId,
        photos,
        captions,
        theme: WEDDING_THEME,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate album: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      pages: data.pages,
      pdfUrl: data.pdfUrl,
    };
  } catch (error) {
    console.error('Error generating album:', error);
    throw error;
  }
}

/**
 * Create a new Canva design from scratch
 * @param {Object} params - Design parameters
 * @param {string} params.type - Design type
 * @param {number} params.width - Width in pixels
 * @param {number} params.height - Height in pixels
 * @returns {Promise<string>} Design ID
 */
export async function createCanvaDesign({ type, width, height }) {
  try {
    const response = await fetch('/api/canva/create-design', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        width,
        height,
        theme: WEDDING_THEME,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create design: ${response.statusText}`);
    }

    const data = await response.json();
    return data.designId;
  } catch (error) {
    console.error('Error creating Canva design:', error);
    throw error;
  }
}

/**
 * Export a Canva design as an image
 * @param {string} designId - Canva design ID
 * @param {string} format - Export format ('png' | 'jpg' | 'pdf')
 * @returns {Promise<string>} Export URL
 */
export async function exportCanvaDesign(designId, format = 'png') {
  try {
    const response = await fetch('/api/canva/export-design', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        designId,
        format,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to export design: ${response.statusText}`);
    }

    const data = await response.json();
    return data.exportUrl;
  } catch (error) {
    console.error('Error exporting Canva design:', error);
    throw error;
  }
}

/**
 * Check if Canva integration is available
 * @returns {Promise<boolean>} True if Canva is authenticated
 */
export async function isCanvaAvailable() {
  try {
    const response = await fetch('/api/canva/status');
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    return data.authenticated === true;
  } catch (error) {
    console.error('Error checking Canva availability:', error);
    return false;
  }
}

/**
 * Get wedding-themed template recommendations
 * @returns {Object} Recommended template IDs for each feature
 */
export function getTemplateRecommendations() {
  return {
    photoBoothOverlays: [
      // To be populated with actual Canva template IDs after Phase 2
      { id: 'TEMPLATE_ID_1', name: 'Elegant Frame', preview: '/assets/templates/frame1.png' },
      { id: 'TEMPLATE_ID_2', name: 'Floral Border', preview: '/assets/templates/frame2.png' },
      { id: 'TEMPLATE_ID_3', name: 'Minimal Sage', preview: '/assets/templates/frame3.png' },
    ],
    guestBookCards: [
      { id: 'TEMPLATE_ID_4', name: 'Classic Card', preview: '/assets/templates/card1.png' },
      { id: 'TEMPLATE_ID_5', name: 'Watercolor', preview: '/assets/templates/card2.png' },
    ],
    albumLayouts: [
      { id: 'TEMPLATE_ID_6', name: '2x2 Grid', preview: '/assets/templates/album1.png' },
      { id: 'TEMPLATE_ID_7', name: 'Collage', preview: '/assets/templates/album2.png' },
    ],
  };
}

const canvaService = {
  fetchCanvaTemplates,
  applyCanvaOverlay,
  generateGuestBookCard,
  generateAlbumLayout,
  createCanvaDesign,
  exportCanvaDesign,
  isCanvaAvailable,
  getTemplateRecommendations,
};

export default canvaService;
