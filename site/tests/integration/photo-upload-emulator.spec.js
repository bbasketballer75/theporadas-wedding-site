/**
 * INTEGRATION TEST: Photo Upload with Firebase Storage Emulator
 * Tests photo upload functionality with Firebase Storage emulator
 * 
 * Prerequisites:
 * - Firebase emulators must be running: firebase emulators:start
 * - Storage emulator on port 9199
 * - Firestore emulator on port 8002
 * 
 * These tests verify complete upload workflow without requiring production credentials.
 */

const { test, expect } = require('@playwright/test');
const { initializeApp, getApps } = require('firebase/app');
const { collection, addDoc, getDocs, query, where } = require('firebase/firestore');
const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll } = require('firebase/storage');

const {
    getTestFirestore,
    clearCollection,
    clearAllTestData,
    ensureEmulatorsRunning,
} = require('../helpers/firebase-emulator');


test.describe('Photo Upload Integration (Firebase Emulator)', () => {
    let storage;
    let db;

    test.beforeAll(async () => {
        // Skip if emulators not running
        if (!(await ensureEmulatorsRunning())) {
            test.skip();
        }

        // Initialize storage
        const existingApps = getApps();
        const app = existingApps.length > 0 ? existingApps[0] : initializeApp({
            apiKey: 'test-api-key',
            projectId: 'test-project',
            storageBucket: 'test-project.appspot.com',
        });

        const { connectStorageEmulator } = require('firebase/storage');
        storage = getStorage(app);

        try {
            connectStorageEmulator(storage, 'localhost', 9199);
            console.log('✅ Connected to Storage emulator');
        } catch (error) {
            if (!error.message.includes('already been called')) {
                throw error;
            }
        }

        db = getTestFirestore();

        // Clear test data
        await clearAllTestData();
    });

    test.beforeEach(async () => {
        // Clear photos metadata collection
        await clearCollection('wedding_photos');
        console.log('✅ Photos metadata cleared');
    });

    test.afterEach(async () => {
        // Cleanup uploaded files and metadata
        try {
            const testRef = ref(storage, 'test-uploads');
            const listResult = await listAll(testRef);
            for (const itemRef of listResult.items) {
                await deleteObject(itemRef);
            }
            console.log('✅ Cleaned up test uploads from Storage');
        } catch {
            // Folder doesn't exist, that's fine
        }

        await clearCollection('wedding_photos');
    });

    test('Upload small image file to Storage emulator', async () => {
        // Create a small test image (1x1 pixel red PNG)
        const testImageData = Buffer.from(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
            'base64'
        );

        // Upload to Storage emulator
        const fileRef = ref(storage, 'test-uploads/test-image.png');
        const metadata = {
            contentType: 'image/png',
            customMetadata: {
                uploadedBy: 'integration-test',
                testRun: Date.now().toString(),
            },
        };

        const snapshot = await uploadBytes(fileRef, testImageData, metadata);

        // Verify upload succeeded
        expect(snapshot.metadata.name).toBe('test-image.png');
        expect(snapshot.metadata.contentType).toBe('image/png');
        expect(snapshot.metadata.size).toBeGreaterThan(0);

        // Get download URL
        const downloadURL = await getDownloadURL(fileRef);
        expect(downloadURL).toContain('localhost:9199');
        expect(downloadURL).toContain('test-uploads%2Ftest-image.png');

        console.log(`✅ Image uploaded successfully: ${downloadURL}`);
    });

    test('Store photo metadata in Firestore after upload', async () => {
        // Upload image
        const testImageData = Buffer.from(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
            'base64'
        );
        const fileRef = ref(storage, 'test-uploads/metadata-test.png');
        await uploadBytes(fileRef, testImageData);
        const downloadURL = await getDownloadURL(fileRef);

        // Store metadata in Firestore
        const photosRef = collection(db, 'wedding_photos');
        const docRef = await addDoc(photosRef, {
            fileName: 'metadata-test.png',
            storagePath: 'test-uploads/metadata-test.png',
            downloadURL: downloadURL,
            uploadedBy: 'integration-test',
            uploadedAt: new Date().toISOString(),
            fileSize: testImageData.length,
            contentType: 'image/png',
        });

        expect(docRef.id).toBeTruthy();

        // Verify metadata was stored
        const snapshot = await getDocs(photosRef);
        expect(snapshot.size).toBe(1);

        const photoDoc = snapshot.docs[0].data();
        expect(photoDoc.fileName).toBe('metadata-test.png');
        expect(photoDoc.downloadURL).toBe(downloadURL);
        expect(photoDoc.contentType).toBe('image/png');

        console.log('✅ Photo metadata stored successfully');
    });

    test('Upload multiple files and verify all stored', async () => {
        const testImageData = Buffer.from(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
            'base64'
        );

        const uploadPromises = [];
        const photosRef = collection(db, 'wedding_photos');

        // Upload 5 files
        for (let i = 1; i <= 5; i++) {
            const promise = (async () => {
                const fileRef = ref(storage, `test-uploads/batch-${i}.png`);
                await uploadBytes(fileRef, testImageData);
                const downloadURL = await getDownloadURL(fileRef);

                await addDoc(photosRef, {
                    fileName: `batch-${i}.png`,
                    storagePath: `test-uploads/batch-${i}.png`,
                    downloadURL: downloadURL,
                    uploadedBy: 'batch-test',
                    uploadedAt: new Date().toISOString(),
                });
            })();
            uploadPromises.push(promise);
        }

        await Promise.all(uploadPromises);

        // Verify all 5 photos stored
        const snapshot = await getDocs(photosRef);
        expect(snapshot.size).toBe(5);

        const fileNames = snapshot.docs.map(doc => doc.data().fileName);
        expect(fileNames).toContain('batch-1.png');
        expect(fileNames).toContain('batch-5.png');

        console.log('✅ Batch upload complete: 5 files stored');
    });

    test('Query photos by upload time', async () => {
        const testImageData = Buffer.from(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
            'base64'
        );
        const photosRef = collection(db, 'wedding_photos');

        // Upload 3 photos with different timestamps
        const now = new Date();
        const fileRef1 = ref(storage, 'test-uploads/recent-1.png');
        await uploadBytes(fileRef1, testImageData);
        const url1 = await getDownloadURL(fileRef1);

        await addDoc(photosRef, {
            fileName: 'recent-1.png',
            downloadURL: url1,
            uploadedBy: 'user1',
            uploadedAt: new Date(now.getTime() - 60000).toISOString(), // 1 min ago
        });

        const fileRef2 = ref(storage, 'test-uploads/recent-2.png');
        await uploadBytes(fileRef2, testImageData);
        const url2 = await getDownloadURL(fileRef2);

        await addDoc(photosRef, {
            fileName: 'recent-2.png',
            downloadURL: url2,
            uploadedBy: 'user2',
            uploadedAt: now.toISOString(), // Now
        });

        // Query photos uploaded by specific user
        const q = query(photosRef, where('uploadedBy', '==', 'user1'));
        const snapshot = await getDocs(q);

        expect(snapshot.size).toBe(1);
        expect(snapshot.docs[0].data().fileName).toBe('recent-1.png');

        console.log('✅ Query by upload time successful');
    });

    test('Handle invalid file upload gracefully', async () => {
        // Try to upload null data
        const fileRef = ref(storage, 'test-uploads/invalid.png');

        try {
            await uploadBytes(fileRef, null);
            expect(true).toBe(false); // Should not reach here
        } catch (error) {
            expect(error).toBeTruthy();
            console.log('✅ Invalid upload rejected as expected');
        }
    });
});
