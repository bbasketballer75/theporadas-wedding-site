/**
 * Video Thumbnail Generator
 * Extracts first frame from video file as thumbnail using canvas API
 *
 * Features:
 * - Client-side thumbnail generation (no server processing needed)
 * - Uses HTML5 video element and canvas API
 * - Generates optimized JPEG thumbnail
 * - Configurable thumbnail size
 * - Works with all major video formats (MP4, MOV, AVI)
 *
 * @param {File} videoFile - Video file to generate thumbnail from
 * @param {number} maxWidth - Maximum width for thumbnail (default: 480)
 * @param {number} maxHeight - Maximum height for thumbnail (default: 480)
 * @param {number} quality - JPEG quality 0-1 (default: 0.8)
 * @returns {Promise<Blob>} - Thumbnail as JPEG blob
 */
export async function generateVideoThumbnail(
  videoFile,
  maxWidth = 480,
  maxHeight = 480,
  quality = 0.8
) {
  return new Promise((resolve, reject) => {
    try {
      // Create video element
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;

      // Create object URL for video
      const videoUrl = URL.createObjectURL(videoFile);

      // Handle video loaded
      video.onloadedmetadata = () => {
        // Seek to 1 second (or 10% of duration, whichever is shorter)
        const seekTime = Math.min(1, video.duration * 0.1);
        video.currentTime = seekTime;
      };

      // Handle seek complete
      video.onseeked = () => {
        try {
          // Calculate dimensions maintaining aspect ratio
          let width = video.videoWidth;
          let height = video.videoHeight;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }

          // Create canvas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          // Draw video frame to canvas
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, width, height);

          // Convert canvas to blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to generate thumbnail blob'));
                return;
              }

              // Cleanup
              URL.revokeObjectURL(videoUrl);
              video.remove();

              resolve(blob);
            },
            'image/jpeg',
            quality
          );
        } catch (err) {
          reject(err);
        }
      };

      // Handle errors
      video.onerror = () => {
        URL.revokeObjectURL(videoUrl);
        video.remove();
        reject(new Error('Failed to load video for thumbnail generation'));
      };

      // Start loading video
      video.src = videoUrl;
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Upload video thumbnail to Supabase
 * @param {Blob} thumbnailBlob - Thumbnail image blob
 * @param {string} videoFilename - Original video filename (for naming)
 * @param {Object} supabase - Supabase client
 * @returns {Promise<string>} - Public URL of uploaded thumbnail
 */
export async function uploadVideoThumbnail(thumbnailBlob, videoFilename, supabase) {
  // Generate thumbnail filename
  const timestamp = Date.now();
  const baseName = videoFilename.split('.')[0];
  const thumbnailFilename = `${baseName}_thumb_${timestamp}.jpg`;
  const thumbnailPath = `thumbnails/${thumbnailFilename}`;

  // Upload to Supabase
  const { error } = await supabase.storage
    .from('wedding-photos')
    .upload(thumbnailPath, thumbnailBlob, {
      cacheControl: '3600',
      upsert: false,
      contentType: 'image/jpeg',
    });

  if (error) {
    throw error;
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('wedding-photos')
    .getPublicUrl(thumbnailPath);

  return {
    url: publicUrlData.publicUrl,
    path: thumbnailPath,
    size: thumbnailBlob.size,
  };
}

/**
 * Generate and upload thumbnail in one step
 * @param {File} videoFile - Video file
 * @param {Object} supabase - Supabase client
 * @returns {Promise<Object>} - Thumbnail metadata
 */
export async function processVideoThumbnail(videoFile, supabase) {
  console.log('[VideoThumbnail] Generating thumbnail...');

  // Generate thumbnail
  const thumbnailBlob = await generateVideoThumbnail(videoFile);

  console.log('[VideoThumbnail] Thumbnail generated:', {
    size: thumbnailBlob.size,
    type: thumbnailBlob.type,
  });

  // Upload to Supabase
  console.log('[VideoThumbnail] Uploading thumbnail...');
  const thumbnailData = await uploadVideoThumbnail(thumbnailBlob, videoFile.name, supabase);

  console.log('[VideoThumbnail] Thumbnail uploaded:', thumbnailData.url);

  return thumbnailData;
}
