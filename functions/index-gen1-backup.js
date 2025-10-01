const fs = require('fs');
const os = require('os');
const path = require('path');

const { Storage: CloudStorage } = require('@google-cloud/storage');
const admin = require('firebase-admin');
const functions = require('firebase-functions/v1');
const Jimp = require('jimp');

admin.initializeApp();
const storage = new CloudStorage();
const db = admin.firestore();

exports.generateThumbnailOnUpload = functions.storage.object().onFinalize(async (object) => {
  try {
    const bucketName = object.bucket;
    const filePath = object.name; // e.g. uploads/image.jpg
    if (!filePath) return null;
    // Skip already-generated thumbnails
    if (filePath.startsWith('thumbnails/')) return null;
    // Skip metadata and folders
    if (object.contentType && !object.contentType.startsWith('image/')) return null;

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
      contentType: object.contentType || 'image/jpeg',
      size: object.size || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await db.collection('gallery').add(doc);

    // Clean up temp files
    fs.unlinkSync(tempFilePath);
    fs.unlinkSync(thumbFilePath);

    console.log('Thumbnail generated and gallery doc added for', filePath);
    return null;
  } catch (err) {
    console.error('Error generating thumbnail:', err);
    return null;
  }
});

// Minimal test function to verify builds
exports.ping = functions.https.onRequest((req, res) => {
  res.status(200).send('ok');
});
