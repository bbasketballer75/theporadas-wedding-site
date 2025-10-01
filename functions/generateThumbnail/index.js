const fs = require('fs');
const os = require('os');
const path = require('path');

const { Storage: GoogleStorage } = require('@google-cloud/storage');
const admin = require('firebase-admin');
const Jimp = require('jimp');

// Initialize Admin; in production the container will use application default credentials
admin.initializeApp();
const storage = new GoogleStorage();
const db = admin.firestore();

// CloudEvent handler for google.storage.object.v1.finalized
// The Functions Framework will call this function with the cloudevent as the first arg
async function generateThumbnailOnUpload(cloudevent) {
  try {
    const object = cloudevent.data || {};
    const bucketName = object.bucket;
    const filePath = object.name; // e.g. gallery/image.jpg

    if (!filePath || !bucketName) {
      console.log('No file or bucket in event');
      return;
    }

    // Skip already-generated thumbnails
    if (filePath.startsWith('thumbnails/')) return;

    // Only process files in /gallery/ folder
    if (!filePath.startsWith('gallery/')) return;

    // Skip non-image content types where available
    const contentType = object.contentType || '';
    if (contentType && !contentType.startsWith('image/')) return;

    const fileName = path.basename(filePath);
    const tempFilePath = path.join(os.tmpdir(), fileName);
    const thumbFileName = `${path.parse(fileName).name}-320.jpg`;
    const thumbFilePath = path.join(os.tmpdir(), thumbFileName);
    const thumbStoragePath = `thumbnails/${thumbFileName}`;

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filePath);

    // Download original
    await file.download({ destination: tempFilePath });

    // Resize using Jimp (pure JS)
    const image = await Jimp.read(tempFilePath);
    await image.resize(320, Jimp.AUTO).quality(80).writeAsync(thumbFilePath);

    // Upload thumbnail
    await bucket.upload(thumbFilePath, {
      destination: thumbStoragePath,
      metadata: { contentType: 'image/jpeg' },
    });

    // Write a Firestore doc in 'gallery' collection
    const doc = {
      originalPath: filePath,
      thumbnailPath: thumbStoragePath,
      contentType: contentType || 'image/jpeg',
      size: object.size || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await db.collection('gallery').add(doc);

    // Clean up temp files
    try {
      fs.unlinkSync(tempFilePath);
    } catch {
      /* ignore */
    }
    try {
      fs.unlinkSync(thumbFilePath);
    } catch {
      /* ignore */
    }

    console.log('Thumbnail generated and gallery doc added for', filePath);
  } catch (err) {
    console.error('Error generating thumbnail:', err);
  }
}

module.exports.generateThumbnailOnUpload = generateThumbnailOnUpload;
