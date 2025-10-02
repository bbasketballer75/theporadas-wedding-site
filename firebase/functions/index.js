// Load environment variables from .env file
require('dotenv').config();

const admin = require('firebase-admin');
const functions = require('firebase-functions');

const { uploadToYouTube } = require('./lib/youtubeUpload');

admin.initializeApp();
const db = admin.firestore();

/**
 * Firestore Trigger: Auto-upload videos to YouTube
 * Triggers when new document created in 'wedding-photos' collection
 *
 * Process:
 * 1. Check if upload is a video
 * 2. Update status to 'processing'
 * 3. Upload to YouTube (unlisted)
 * 4. Update Firestore with YouTube video ID
 * 5. Mark status as 'completed' or 'failed'/'queued'
 */
exports.processVideoUpload = functions.firestore
  .document('wedding-photos/{photoId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const photoId = context.params.photoId;

    console.log('📸 New upload detected:', photoId);
    console.log('Type:', data.type);

    // Only process videos
    if (!data.type || !data.type.startsWith('video/')) {
      console.log('⏭️ Not a video, skipping YouTube upload');
      return null;
    }

    console.log('🎬 Video detected, starting YouTube upload process...');

    try {
      // Update status to processing
      await snap.ref.update({
        uploadStatus: 'processing',
        processingStartedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Upload to YouTube
      const metadata = {
        title: data.title || `Guest Video - ${new Date().toLocaleDateString()}`,
        description: data.description || 'Video from The Poradas Wedding - uploaded by a guest',
        tags: ['wedding', 'theporadas', 'celebration', 'memories'],
      };

      const youtubeVideoId = await uploadToYouTube(data.url, metadata);

      // Update Firestore with YouTube video ID
      await snap.ref.update({
        youtubeId: youtubeVideoId,
        youtubeUrl: `https://www.youtube.com/watch?v=${youtubeVideoId}`,
        uploadStatus: 'completed',
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log('✅ Video processed successfully!');
      console.log('YouTube Video ID:', youtubeVideoId);
      console.log('YouTube URL: https://www.youtube.com/watch?v=' + youtubeVideoId);

      // Optional: Delete from Supabase to save storage
      // Implement Supabase delete logic here if needed
      // For now, keeping video in Supabase as backup

      return { success: true, youtubeVideoId };
    } catch (error) {
      console.error('❌ Error processing video:', error);

      // Update status to failed
      await snap.ref.update({
        uploadStatus: 'failed',
        uploadError: error.message,
        failedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // If quota exceeded, mark as queued instead of failed
      if (error.message && error.message.includes('QUOTA_EXCEEDED')) {
        await snap.ref.update({
          uploadStatus: 'queued',
          queuedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log('⏸️ Video queued due to YouTube API quota limits');
        console.log('💡 Video will automatically retry after quota resets (midnight PST)');
      }

      return { success: false, error: error.message };
    }
  });

/**
 * Scheduled Function: Retry queued videos
 * Runs daily at 1 AM PST (after quota reset at midnight)
 *
 * This handles videos that couldn't be uploaded due to quota limits
 * Processes up to 6 videos per run (daily quota limit)
 */
exports.retryQueuedVideos = functions.pubsub
  .schedule('0 1 * * *') // Cron: Every day at 1:00 AM
  .timeZone('America/Los_Angeles') // Pacific Time (quota resets at midnight PST)
  .onRun(async (context) => {
    console.log('🔄 Starting scheduled retry of queued videos...');
    console.log('Time:', new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));

    try {
      // Get queued videos (limit 6 = max uploads per day with default quota)
      const queuedVideos = await db
        .collection('wedding-photos')
        .where('uploadStatus', '==', 'queued')
        .where('type', '>=', 'video/')
        .where('type', '<=', 'video/\uf8ff')
        .orderBy('queuedAt', 'asc') // Process oldest first
        .limit(6)
        .get();

      console.log(`📊 Found ${queuedVideos.size} queued video(s) to retry`);

      if (queuedVideos.empty) {
        console.log('✅ No queued videos to process');
        return null;
      }

      // Process each queued video
      const results = await Promise.allSettled(
        queuedVideos.docs.map(async (doc) => {
          const data = doc.data();
          const docId = doc.id;

          console.log(`🎬 Processing queued video: ${docId}`);

          try {
            // Update status to processing
            await doc.ref.update({
              uploadStatus: 'processing',
              processingStartedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            // Upload to YouTube
            const metadata = {
              title: data.title || `Guest Video - ${new Date().toLocaleDateString()}`,
              description:
                data.description || 'Video from The Poradas Wedding - uploaded by a guest',
              tags: ['wedding', 'theporadas', 'celebration', 'memories'],
            };

            const youtubeVideoId = await uploadToYouTube(data.url, metadata);

            // Update with YouTube ID
            await doc.ref.update({
              youtubeId: youtubeVideoId,
              youtubeUrl: `https://www.youtube.com/watch?v=${youtubeVideoId}`,
              uploadStatus: 'completed',
              processedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            console.log(`✅ Successfully processed queued video: ${docId}`);
            console.log(`🔗 YouTube: https://www.youtube.com/watch?v=${youtubeVideoId}`);

            return { docId, success: true, youtubeVideoId };
          } catch (error) {
            console.error(`❌ Failed to process queued video ${docId}:`, error);

            // If quota exceeded again, keep as queued
            if (error.message && error.message.includes('QUOTA_EXCEEDED')) {
              await doc.ref.update({
                uploadStatus: 'queued',
                lastRetryAt: admin.firestore.FieldValue.serverTimestamp(),
              });
              console.log(`⏸️ Video ${docId} re-queued (quota exceeded again)`);
            } else {
              // Other errors: mark as failed
              await doc.ref.update({
                uploadStatus: 'failed',
                uploadError: error.message,
                failedAt: admin.firestore.FieldValue.serverTimestamp(),
              });
            }

            return { docId, success: false, error: error.message };
          }
        })
      );

      // Log summary
      const successful = results.filter((r) => r.status === 'fulfilled' && r.value.success).length;
      const failed = results.length - successful;

      console.log('📊 Retry Summary:');
      console.log(`   ✅ Successful: ${successful}`);
      console.log(`   ❌ Failed/Re-queued: ${failed}`);
      console.log('🔄 Retry process complete');

      return { processed: results.length, successful, failed };
    } catch (error) {
      console.error('❌ Error in retryQueuedVideos:', error);
      return { error: error.message };
    }
  });

/**
 * HTTP Function: Get upload stats (optional - for admin dashboard)
 * Returns statistics about uploads and quota usage
 */
exports.getUploadStats = functions.https.onRequest(async (req, res) => {
  // CORS
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send('');
    return;
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's uploads
    const todayUploads = await db
      .collection('wedding-photos')
      .where('timestamp', '>=', admin.firestore.Timestamp.fromDate(today))
      .get();

    // Count by status
    let completed = 0;
    let processing = 0;
    let queued = 0;
    let failed = 0;
    let videos = 0;
    let photos = 0;

    todayUploads.forEach((doc) => {
      const data = doc.data();

      // Count by type
      if (data.type && data.type.startsWith('video/')) {
        videos++;
      } else {
        photos++;
      }

      // Count by status
      switch (data.uploadStatus) {
        case 'completed':
          completed++;
          break;
        case 'processing':
          processing++;
          break;
        case 'queued':
          queued++;
          break;
        case 'failed':
          failed++;
          break;
      }
    });

    // Calculate quota usage (videos only, 1600 units each)
    const quotaUsed = completed * 1600;
    const quotaLimit = 10000; // Default quota
    const quotaRemaining = quotaLimit - quotaUsed;
    const remainingVideos = Math.floor(quotaRemaining / 1600);

    const stats = {
      today: {
        total: todayUploads.size,
        photos,
        videos,
        completed,
        processing,
        queued,
        failed,
      },
      quota: {
        used: quotaUsed,
        limit: quotaLimit,
        remaining: quotaRemaining,
        remainingVideos,
        percentUsed: Math.round((quotaUsed / quotaLimit) * 100),
      },
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error getting upload stats:', error);
    res.status(500).json({ error: error.message });
  }
});
