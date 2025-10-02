const fs = require('fs');
const os = require('os');
const path = require('path');

const axios = require('axios');
const { google } = require('googleapis');

// Load credentials from Firebase secrets or environment variables
// Set these with: firebase functions:secrets:set YOUTUBE_CLIENT_ID
const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.YOUTUBE_REFRESH_TOKEN;

/**
 * Initialize OAuth2 client for YouTube API
 * Uses refresh token for long-term automated access
 */
function getYouTubeClient() {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    throw new Error(
      'Missing YouTube API credentials. Set YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, and YOUTUBE_REFRESH_TOKEN in Firebase secrets.'
    );
  }

  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    'http://localhost' // Not used for refresh token flow
  );

  oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN,
  });

  return google.youtube({
    version: 'v3',
    auth: oauth2Client,
  });
}

/**
 * Upload video to YouTube
 *
 * @param {string} videoUrl - Supabase public URL of the video
 * @param {object} metadata - Video metadata
 * @param {string} metadata.title - Video title
 * @param {string} metadata.description - Video description
 * @param {string[]} metadata.tags - Video tags
 * @returns {Promise<string>} - YouTube video ID
 *
 * @throws {Error} - If upload fails or quota exceeded
 *
 * Quota Cost: 1,600 units per upload
 * Default quota: 10,000 units/day = 6 videos max
 */
async function uploadToYouTube(videoUrl, metadata = {}) {
  let tempFilePath = null;

  try {
    console.log('🎥 Starting YouTube upload process...');
    console.log('Video URL:', videoUrl);

    // Initialize YouTube client
    const youtube = getYouTubeClient();

    // Download video from Supabase to temporary file
    console.log('⬇️ Downloading video from Supabase...');
    const response = await axios.get(videoUrl, {
      responseType: 'stream',
      timeout: 300000, // 5 minutes timeout for large videos
    });

    const tempDir = os.tmpdir();
    const timestamp = Date.now();
    const fileName = `wedding-video-${timestamp}.mp4`;
    tempFilePath = path.join(tempDir, fileName);

    const writer = fs.createWriteStream(tempFilePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    const stats = fs.statSync(tempFilePath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`✅ Video downloaded: ${fileSizeMB} MB`);
    console.log(`📁 Temp file: ${tempFilePath}`);

    // Prepare video metadata
    const videoTitle = metadata.title || `Wedding Video - ${new Date().toLocaleDateString()}`;
    const videoDescription =
      metadata.description ||
      'Video from The Poradas Wedding\n' +
        "Shared by a guest celebrating Austin & Jordyn's special day.\n\n" +
        'Thank you for being part of our celebration! ❤️';
    const videoTags = metadata.tags || [
      'wedding',
      'theporadas',
      'celebration',
      'memories',
      'love',
      'marriage',
    ];

    console.log('📤 Uploading to YouTube...');
    console.log('Title:', videoTitle);
    console.log('Privacy: Unlisted');

    // Upload to YouTube
    // Quota cost: 1,600 units
    const uploadResult = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: videoTitle,
          description: videoDescription,
          tags: videoTags,
          categoryId: '22', // Category: People & Blogs
          defaultLanguage: 'en',
          defaultAudioLanguage: 'en',
        },
        status: {
          privacyStatus: 'unlisted', // Unlisted = not searchable, shareable via link only
          selfDeclaredMadeForKids: false,
          embeddable: true, // Allow embedding in website
          publicStatsViewable: false, // Hide view count
        },
      },
      media: {
        body: fs.createReadStream(tempFilePath),
      },
    });

    const videoId = uploadResult.data.id;
    const videoUrl_youtube = `https://www.youtube.com/watch?v=${videoId}`;
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    console.log('✅ Upload successful!');
    console.log('📺 Video ID:', videoId);
    console.log('🔗 Watch URL:', videoUrl_youtube);
    console.log('📽️ Embed URL:', embedUrl);
    console.log('💾 Quota used: 1,600 units');

    // Clean up temporary file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
      console.log('🗑️ Temporary file deleted');
    }

    return videoId;
  } catch (error) {
    console.error('❌ YouTube upload failed:', error);

    // Clean up temporary file on error
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
        console.log('🗑️ Temporary file deleted after error');
      } catch (cleanupError) {
        console.error('⚠️ Failed to delete temp file:', cleanupError);
      }
    }

    // Handle quota exceeded error (403)
    if (error.code === 403) {
      const errorMessage = error.message || '';

      if (errorMessage.toLowerCase().includes('quota')) {
        console.error('🚨 QUOTA EXCEEDED: YouTube API daily limit reached');
        console.error('📊 Default quota: 10,000 units/day (6 videos)');
        console.error('⏰ Quota resets: Midnight Pacific Time');
        console.error('💡 Solutions:');
        console.error('   1. Wait until quota resets (midnight PST)');
        console.error(
          '   2. Request quota increase: https://support.google.com/youtube/contact/yt_api_form'
        );
        console.error('   3. Video will be queued and retried automatically');

        throw new Error(
          'QUOTA_EXCEEDED: YouTube API daily limit reached. Video will be queued for retry after quota reset.'
        );
      }
    }

    // Handle authentication errors (401)
    if (error.code === 401) {
      console.error('🔐 AUTHENTICATION ERROR: Invalid or expired credentials');
      console.error('💡 Solutions:');
      console.error('   1. Verify YOUTUBE_REFRESH_TOKEN is correct');
      console.error('   2. Generate new refresh token if expired');
      console.error('   3. Check YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET');

      throw new Error(
        'AUTHENTICATION_ERROR: YouTube API credentials invalid or expired. Check Firebase secrets.'
      );
    }

    // Handle rate limit errors (429)
    if (error.code === 429) {
      console.error('⏱️ RATE LIMIT: Too many requests');
      console.error('💡 Wait a few seconds and retry automatically');

      throw new Error('RATE_LIMIT: Too many YouTube API requests. Retry in a few seconds.');
    }

    // Re-throw with more context
    throw new Error(`YouTube upload failed: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Check current quota usage (estimate)
 * Note: This doesn't query actual quota from Google Cloud Console
 * It's just a helper for logging/monitoring
 *
 * @param {number} videosUploadedToday - Number of videos uploaded today
 * @returns {object} Quota information
 */
function getQuotaInfo(videosUploadedToday = 0) {
  const QUOTA_PER_VIDEO = 1600;
  const DEFAULT_DAILY_QUOTA = 10000;

  const quotaUsed = videosUploadedToday * QUOTA_PER_VIDEO;
  const quotaRemaining = DEFAULT_DAILY_QUOTA - quotaUsed;
  const remainingVideos = Math.floor(quotaRemaining / QUOTA_PER_VIDEO);
  const percentUsed = Math.round((quotaUsed / DEFAULT_DAILY_QUOTA) * 100);

  return {
    dailyQuota: DEFAULT_DAILY_QUOTA,
    quotaPerVideo: QUOTA_PER_VIDEO,
    videosUploadedToday,
    quotaUsed,
    quotaRemaining,
    remainingVideos,
    percentUsed,
    quotaExceeded: quotaUsed >= DEFAULT_DAILY_QUOTA,
    resetTime: 'Midnight Pacific Time (PST/PDT)',
  };
}

module.exports = {
  uploadToYouTube,
  getQuotaInfo,
};
