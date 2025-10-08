/**
 * Firebase Cloud Functions Gen 2
 * Thumbnail Generation for Uploaded Photos/Videos
 *
 * Gen 2 Benefits:
 * - Longer timeout (60min vs 9min)
 * - Larger instances (16GB RAM vs 8GB)
 * - Better cold start performance
 * - Concurrency control
 * - Traffic splitting
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const { Storage: CloudStorage } = require('@google-cloud/storage');
const admin = require('firebase-admin');
const { setGlobalOptions } = require('firebase-functions/v2');
const { onRequest } = require('firebase-functions/v2/https');
const { onObjectFinalized } = require('firebase-functions/v2/storage');
const Jimp = require('jimp');

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
  admin.initializeApp();
}

const storage = new CloudStorage();
const db = admin.firestore();

// Set global options for all Gen 2 functions
setGlobalOptions({
  region: 'us-central1',
  memory: '512MiB',
  timeoutSeconds: 300,
  maxInstances: 10,
});

/**
 * Generate thumbnail when image is uploaded to Firebase Storage
 * Triggered automatically on any file upload
 *
 * Gen 2 onObjectFinalized replaces Gen 1 storage.object().onFinalize()
 */
exports.generateThumbnail = onObjectFinalized(async (event) => {
  try {
    const object = event.data;
    const filePath = object.name; // e.g. uploads/image.jpg
    const bucketName = object.bucket;

    if (!filePath) return null;

    // Skip already-generated thumbnails
    if (filePath.startsWith('thumbnails/')) {
      console.log('Skipping thumbnail (already a thumbnail):', filePath);
      return null;
    }

    // Skip metadata and folders
    if (object.contentType && !object.contentType.startsWith('image/')) {
      console.log('Skipping non-image file:', filePath);
      return null;
    }

    const fileName = path.basename(filePath);
    const tempFilePath = path.join(os.tmpdir(), fileName);
    const thumbFileName = `${path.parse(fileName).name}-320.jpg`;
    const thumbFilePath = path.join(os.tmpdir(), thumbFileName);
    const thumbStoragePath = `thumbnails/${thumbFileName}`;

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filePath);

    console.log('Downloading original image:', filePath);
    // Download original
    await file.download({ destination: tempFilePath });

    console.log('Generating thumbnail...');
    // Resize using Jimp (pure JS, no external dependencies)
    const image = await Jimp.read(tempFilePath);
    await image.resize(320, Jimp.AUTO).quality(80).writeAsync(thumbFilePath);

    console.log('Uploading thumbnail to:', thumbStoragePath);
    // Upload thumbnail
    await bucket.upload(thumbFilePath, {
      destination: thumbStoragePath,
      metadata: {
        contentType: 'image/jpeg',
        metadata: {
          originalPath: filePath,
          generatedAt: new Date().toISOString(),
        },
      },
    });

    console.log('Creating Firestore gallery document...');
    // Write a Firestore doc in 'gallery' collection
    const doc = {
      originalPath: filePath,
      thumbnailPath: thumbStoragePath,
      contentType: object.contentType || 'image/jpeg',
      size: object.size || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await db.collection('gallery').add(doc);

    // Clean up temp files
    try {
      fs.unlinkSync(tempFilePath);
      fs.unlinkSync(thumbFilePath);
    } catch (cleanupError) {
      console.warn('Error cleaning up temp files:', cleanupError);
    }

    console.log('✓ Thumbnail generated successfully for', filePath);
    return null;
  } catch (err) {
    console.error('Error generating thumbnail:', err);
    // Don't throw - let function complete gracefully
    return null;
  }
});

/**
 * Health check endpoint
 * Simple ping to verify functions are deployed and working
 */
exports.ping = onRequest((req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Firebase Functions Gen 2 are running',
    timestamp: new Date().toISOString(),
  });
});
