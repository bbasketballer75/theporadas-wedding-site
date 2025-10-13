import imageCompression from 'browser-image-compression';

/**
 * Compress image before upload to Supabase
 * Reduces size by 60-80% while maintaining quality
 * Converts to WebP format for maximum efficiency
 *
 * @param {File} file - Original image file
 * @returns {Promise<File>} - Compressed image file
 */
export async function compressImage(file) {
  // Skip if not an image
  if (!file.type.startsWith('image/')) {
    return file;
  }

  const options = {
    maxSizeMB: 1, // Target max size: 1MB per image
    maxWidthOrHeight: 1920, // Max dimension: 1920px (Full HD)
    useWebWorker: true, // Use web worker (faster, non-blocking)
    fileType: 'image/webp', // Convert to WebP (best compression)
    initialQuality: 0.85, // High quality (85%)
  };

  try {
    // Original size logged for debugging

    const compressedFile = await imageCompression(file, options);

    // const savings = ((file.size - compressedFile.size) / file.size) * 100;
    // Compression successful

    return compressedFile;
  } catch (error) {
    // Compression failed, return original
    return file; // Fallback to original if compression fails
  }
}

/**
 * Generate thumbnail for image (for gallery previews)
 * Much smaller, for fast loading in gallery
 *
 * @param {File} file - Original image file
 * @returns {Promise<File|null>} - Thumbnail file or null if failed
 */
export async function createThumbnail(file) {
  if (!file.type.startsWith('image/')) {
    return null;
  }

  const options = {
    maxSizeMB: 0.1, // Tiny: 100KB max
    maxWidthOrHeight: 400, // Small dimension
    useWebWorker: true,
    fileType: 'image/webp',
    initialQuality: 0.7,
  };

  try {
    console.log('[Thumbnail] Creating thumbnail...');
    const thumbnail = await imageCompression(file, options);
    console.log(`[Thumbnail] Created: ${(thumbnail.size / 1024).toFixed(1)} KB`);
    return thumbnail;
  } catch (error) {
    console.error('[Thumbnail] Failed:', error);
    return null;
  }
}
