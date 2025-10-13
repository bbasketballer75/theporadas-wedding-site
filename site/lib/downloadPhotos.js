import { saveAs } from 'file-saver';
import JSZip from 'jszip';

/**
 * Download All Photos Utility
 * Creates a ZIP archive of all photos in the gallery and downloads it
 *
 * Features:
 * - Downloads all photos from Supabase URLs
 * - Creates organized ZIP with filenames
 * - Shows progress during download and compression
 * - Handles errors gracefully
 * - Excludes videos (too large for client-side ZIP)
 *
 * @param {Array} media - Array of media items from Firestore
 * @param {Function} onProgress - Callback for progress updates (0-100)
 * @returns {Promise<void>}
 */
export async function downloadAllPhotos(media, onProgress = () => { }) {
  try {
    // Filter to only images (videos are too large)
    const photos = media.filter((item) => item.type && item.type.startsWith('image/'));

    if (photos.length === 0) {
      throw new Error('No photos available to download');
    }

    // Starting download of photos
    onProgress(0);

    // Create ZIP archive
    const zip = new JSZip();
    const folder = zip.folder('wedding-photos');

    // Download each photo and add to ZIP
    let completed = 0;

    for (const photo of photos) {
      try {
        // Downloading photo

        // Fetch photo from Supabase
        const response = await fetch(photo.url);
        if (!response.ok) {
          throw new Error(`Failed to download ${photo.name}`);
        }

        // Get file blob
        const blob = await response.blob();

        // Generate unique filename (prevent duplicates)
        const timestamp = photo.timestamp?.toDate?.()?.getTime() || Date.now();
        const uploaderName = photo.uploadedBy
          ? photo.uploadedBy.replace(/[^a-zA-Z0-9]/g, '_')
          : 'guest';
        const ext = photo.name.split('.').pop();
        const filename = `${timestamp}_${uploaderName}.${ext}`;

        // Add to ZIP
        folder.file(filename, blob);

        completed++;
        onProgress(Math.round((completed / photos.length) * 80)); // 0-80% for downloads
      } catch (err) {
        // Error downloading photo (continue with others)
        // Continue with other photos even if one fails
      }
    }

    // Compressing ZIP
    onProgress(85);

    // Generate ZIP file
    const zipBlob = await zip.generateAsync(
      {
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
      },
      (metadata) => {
        // Update progress during compression (85-95%)
        const compressionProgress = metadata.percent;
        onProgress(85 + Math.round(compressionProgress * 0.1));
      }
    );

    onProgress(100);

    // Trigger download
    const date = new Date().toISOString().split('T')[0];
    const filename = `wedding-photos-${date}.zip`;

    // Saving file
    saveAs(zipBlob, filename);

    // Download complete
    return { success: true, photoCount: completed, filename };
  } catch (err) {
    // Error during download process
    throw err;
  }
}

/**
 * Format bytes to human-readable size
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Estimate ZIP file size (rough estimate)
 * Compression ratio for images is typically 10-30% depending on format
 */
export function estimateZipSize(media) {
  const photos = media.filter((item) => item.type && item.type.startsWith('image/'));
  const totalSize = photos.reduce((sum, photo) => sum + (photo.size || 0), 0);
  const estimatedZipSize = totalSize * 0.85; // Assume 15% compression
  return {
    photoCount: photos.length,
    totalSize: formatBytes(totalSize),
    estimatedZipSize: formatBytes(estimatedZipSize),
  };
}
