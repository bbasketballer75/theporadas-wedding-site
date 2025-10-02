import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg = null;
let ffmpegLoading = false;

/**
 * Initialize FFmpeg.wasm (loads ~30MB WASM file)
 * Only called once, then cached
 */
async function loadFFmpeg() {
  if (ffmpeg) return ffmpeg;

  // If already loading, wait for it
  if (ffmpegLoading) {
    while (ffmpegLoading) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return ffmpeg;
  }

  ffmpegLoading = true;

  try {
    ffmpeg = new FFmpeg();

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    console.log('[FFmpeg] Loaded successfully');
    ffmpegLoading = false;
    return ffmpeg;
  } catch (error) {
    console.error('[FFmpeg] Load failed:', error);
    ffmpegLoading = false;
    ffmpeg = null;
    throw error;
  }
}

/**
 * Compress video before upload
 * Reduces size by 50-70% while maintaining quality
 * Only compresses videos larger than 10MB
 *
 * @param {File} file - Original video file
 * @param {Function} onProgress - Progress callback (0-100)
 * @returns {Promise<File>} - Compressed video file
 */
export async function compressVideo(file, onProgress) {
  // Skip if not a video
  if (!file.type.startsWith('video/')) {
    return file;
  }

  // Skip if already small (< 10MB)
  if (file.size < 10 * 1024 * 1024) {
    console.log('[Video Compression] Video is small (<10MB), skipping compression');
    return file;
  }

  try {
    console.log(`[Video Compression] Original: ${(file.size / 1024 / 1024).toFixed(2)} MB`);

    onProgress?.(10);

    // Load FFmpeg (cached after first load)
    const ffmpegInstance = await loadFFmpeg();

    onProgress?.(20);

    // Write file to FFmpeg virtual filesystem
    await ffmpegInstance.writeFile('input.mp4', await fetchFile(file));

    onProgress?.(30);

    // Compress video with FFmpeg
    // H.264 codec, CRF 28 (good quality), 720p max, AAC audio
    await ffmpegInstance.exec([
      '-i',
      'input.mp4',
      '-c:v',
      'libx264', // H.264 video codec
      '-crf',
      '28', // Constant Rate Factor (23=high quality, 28=good quality, smaller)
      '-preset',
      'medium', // Encoding speed (faster = bigger file)
      '-vf',
      'scale=1280:-2', // Scale to 720p width (maintains aspect ratio)
      '-c:a',
      'aac', // AAC audio codec
      '-b:a',
      '128k', // Audio bitrate
      '-movflags',
      '+faststart', // Enable fast start (web streaming)
      'output.mp4',
    ]);

    onProgress?.(80);

    // Read compressed file from virtual filesystem
    const data = await ffmpegInstance.readFile('output.mp4');

    onProgress?.(90);

    // Convert to Blob then File
    const compressedBlob = new Blob([data.buffer], { type: 'video/mp4' });
    const compressedFile = new File([compressedBlob], file.name, {
      type: 'video/mp4',
      lastModified: Date.now(),
    });

    const savings = ((file.size - compressedFile.size) / file.size) * 100;
    console.log(
      `[Video Compression] Compressed: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`
    );
    console.log(`[Video Compression] Savings: ${savings.toFixed(1)}%`);

    onProgress?.(100);

    return compressedFile;
  } catch (error) {
    console.error('[Video Compression] Failed:', error);
    return file; // Fallback to original if compression fails
  }
}

/**
 * Generate video thumbnail (first frame)
 *
 * @param {File} file - Video file
 * @returns {Promise<File|null>} - Thumbnail image file or null if failed
 */
export async function createVideoThumbnail(file) {
  if (!file.type.startsWith('video/')) {
    return null;
  }

  try {
    console.log('[Video Thumbnail] Generating thumbnail...');

    const ffmpegInstance = await loadFFmpeg();

    await ffmpegInstance.writeFile('input.mp4', await fetchFile(file));

    // Extract first frame as JPEG
    await ffmpegInstance.exec([
      '-i',
      'input.mp4',
      '-vframes',
      '1', // Extract 1 frame
      '-vf',
      'scale=400:-2', // Resize to 400px width
      'thumbnail.jpg',
    ]);

    const data = await ffmpegInstance.readFile('thumbnail.jpg');
    const thumbnailBlob = new Blob([data.buffer], { type: 'image/jpeg' });
    const thumbnailFile = new File([thumbnailBlob], 'thumbnail.jpg', {
      type: 'image/jpeg',
    });

    console.log(`[Video Thumbnail] Created: ${(thumbnailFile.size / 1024).toFixed(1)} KB`);

    return thumbnailFile;
  } catch (error) {
    console.error('[Video Thumbnail] Failed:', error);
    return null;
  }
}
