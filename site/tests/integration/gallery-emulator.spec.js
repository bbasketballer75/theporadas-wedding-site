/**
 * INTEGRATION TEST: Photo Gallery with Firebase Firestore Emulator
 * Tests gallery display and filtering functionality
 * 
 * Prerequisites:
 * - Firebase emulators must be running: firebase emulators:start
 * - Firestore emulator on port 8002
 * 
 * These tests verify gallery queries, pagination, and filtering.
 */

const { test, expect } = require('@playwright/test');
const {
    getTestFirestore,
    clearCollection,
    clearAllTestData,
    waitForEmulators,
} = require('../helpers/firebase-emulator');
const { collection, addDoc, getDocs, query, where, orderBy, limit, startAfter } = require('firebase/firestore');

test.describe('Photo Gallery Integration (Firebase Emulator)', () => {
    let db;

    test.beforeAll(async () => {
        // Ensure emulators are running
        await waitForEmulators();
        db = getTestFirestore();

        // Clear test data
        await clearAllTestData();
    });

    test.beforeEach(async () => {
        // Clear gallery data before each test
        await clearCollection('wedding_photos');
        console.log('✅ Gallery photos cleared');
    });

    test.afterEach(async () => {
        // Cleanup after each test
        await clearCollection('wedding_photos');
    });

    test('Display all photos in gallery', async () => {
        const photosRef = collection(db, 'wedding_photos');

        // Add 10 test photos
        for (let i = 1; i <= 10; i++) {
            await addDoc(photosRef, {
                fileName: `photo-${i}.jpg`,
                downloadURL: `https://example.com/photo-${i}.jpg`,
                uploadedBy: 'test-user',
                uploadedAt: new Date().toISOString(),
                caption: `Test photo ${i}`,
            });
        }

        // Query all photos
        const snapshot = await getDocs(photosRef);

        expect(snapshot.size).toBe(10);
        expect(snapshot.empty).toBe(false);

        const photos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        expect(photos[0].fileName).toContain('photo-');
        expect(photos[0].downloadURL).toContain('https://');

        console.log(`✅ Gallery loaded ${photos.length} photos`);
    });

    test('Filter photos by uploader', async () => {
        const photosRef = collection(db, 'wedding_photos');

        // Add photos from different users
        await addDoc(photosRef, {
            fileName: 'alice-photo.jpg',
            uploadedBy: 'alice',
            uploadedAt: new Date().toISOString(),
        });

        await addDoc(photosRef, {
            fileName: 'bob-photo-1.jpg',
            uploadedBy: 'bob',
            uploadedAt: new Date().toISOString(),
        });

        await addDoc(photosRef, {
            fileName: 'bob-photo-2.jpg',
            uploadedBy: 'bob',
            uploadedAt: new Date().toISOString(),
        });

        // Query Bob's photos only
        const q = query(photosRef, where('uploadedBy', '==', 'bob'));
        const snapshot = await getDocs(q);

        expect(snapshot.size).toBe(2);

        const bobPhotos = snapshot.docs.map(doc => doc.data());
        expect(bobPhotos.every(photo => photo.uploadedBy === 'bob')).toBe(true);
        expect(bobPhotos.some(photo => photo.fileName === 'bob-photo-1.jpg')).toBe(true);
        expect(bobPhotos.some(photo => photo.fileName === 'bob-photo-2.jpg')).toBe(true);

        console.log('✅ Filtered photos by uploader successfully');
    });

    test('Sort photos by upload date (newest first)', async () => {
        const photosRef = collection(db, 'wedding_photos');
        const now = Date.now();

        // Add photos with different timestamps
        await addDoc(photosRef, {
            fileName: 'oldest.jpg',
            uploadedAt: new Date(now - 60000 * 3).toISOString(), // 3 min ago
            uploadOrder: 1,
        });

        await addDoc(photosRef, {
            fileName: 'middle.jpg',
            uploadedAt: new Date(now - 60000 * 2).toISOString(), // 2 min ago
            uploadOrder: 2,
        });

        await addDoc(photosRef, {
            fileName: 'newest.jpg',
            uploadedAt: new Date(now).toISOString(), // Now
            uploadOrder: 3,
        });

        // Query sorted by uploadedAt descending
        const q = query(photosRef, orderBy('uploadedAt', 'desc'));
        const snapshot = await getDocs(q);

        const photos = snapshot.docs.map(doc => doc.data());

        expect(photos[0].fileName).toBe('newest.jpg');
        expect(photos[1].fileName).toBe('middle.jpg');
        expect(photos[2].fileName).toBe('oldest.jpg');

        console.log('✅ Photos sorted by date correctly');
    });

    test('Paginate gallery results (limit and startAfter)', async () => {
        const photosRef = collection(db, 'wedding_photos');

        // Add 15 photos
        for (let i = 1; i <= 15; i++) {
            await addDoc(photosRef, {
                fileName: `photo-${String(i).padStart(2, '0')}.jpg`,
                uploadedAt: new Date(Date.now() + i * 1000).toISOString(),
                pageTest: true,
            });
        }

        // First page: Get first 5 photos
        const firstPageQuery = query(
            photosRef,
            where('pageTest', '==', true),
            orderBy('uploadedAt', 'asc'),
            limit(5)
        );
        const firstPage = await getDocs(firstPageQuery);

        expect(firstPage.size).toBe(5);

        const firstPagePhotos = firstPage.docs.map(doc => doc.data());
        expect(firstPagePhotos[0].fileName).toBe('photo-01.jpg');
        expect(firstPagePhotos[4].fileName).toBe('photo-05.jpg');

        // Second page: Get next 5 photos
        const lastVisible = firstPage.docs[firstPage.docs.length - 1];
        const secondPageQuery = query(
            photosRef,
            where('pageTest', '==', true),
            orderBy('uploadedAt', 'asc'),
            startAfter(lastVisible),
            limit(5)
        );
        const secondPage = await getDocs(secondPageQuery);

        expect(secondPage.size).toBe(5);

        const secondPagePhotos = secondPage.docs.map(doc => doc.data());
        expect(secondPagePhotos[0].fileName).toBe('photo-06.jpg');
        expect(secondPagePhotos[4].fileName).toBe('photo-10.jpg');

        console.log('✅ Pagination working correctly');
    });

    test('Filter photos by date range', async () => {
        const photosRef = collection(db, 'wedding_photos');
        const now = Date.now();
        const oneDayAgo = now - (24 * 60 * 60 * 1000);
        const twoDaysAgo = now - (2 * 24 * 60 * 60 * 1000);

        // Add photos from different days
        await addDoc(photosRef, {
            fileName: 'old-photo.jpg',
            uploadedAt: new Date(twoDaysAgo).toISOString(),
        });

        await addDoc(photosRef, {
            fileName: 'yesterday-photo.jpg',
            uploadedAt: new Date(oneDayAgo).toISOString(),
        });

        await addDoc(photosRef, {
            fileName: 'today-photo.jpg',
            uploadedAt: new Date(now).toISOString(),
        });

        // Query photos from last 24 hours
        const cutoffDate = new Date(oneDayAgo).toISOString();
        const recentQuery = query(
            photosRef,
            where('uploadedAt', '>=', cutoffDate),
            orderBy('uploadedAt', 'desc')
        );
        const recentPhotos = await getDocs(recentQuery);

        expect(recentPhotos.size).toBe(2);

        const photoNames = recentPhotos.docs.map(doc => doc.data().fileName);
        expect(photoNames).toContain('yesterday-photo.jpg');
        expect(photoNames).toContain('today-photo.jpg');
        expect(photoNames).not.toContain('old-photo.jpg');

        console.log('✅ Date range filter working');
    });

    test('Handle empty gallery gracefully', async () => {
        const photosRef = collection(db, 'wedding_photos');

        // Query empty collection
        const snapshot = await getDocs(photosRef);

        expect(snapshot.empty).toBe(true);
        expect(snapshot.size).toBe(0);

        console.log('✅ Empty gallery handled correctly');
    });

    test('Search photos by caption', async () => {
        const photosRef = collection(db, 'wedding_photos');

        // Add photos with different captions
        await addDoc(photosRef, {
            fileName: 'ceremony.jpg',
            caption: 'Beautiful wedding ceremony',
            uploadedAt: new Date().toISOString(),
        });

        await addDoc(photosRef, {
            fileName: 'reception.jpg',
            caption: 'Reception dance floor',
            uploadedAt: new Date().toISOString(),
        });

        await addDoc(photosRef, {
            fileName: 'cake.jpg',
            caption: 'Wedding cake cutting ceremony',
            uploadedAt: new Date().toISOString(),
        });

        // Query photos with "ceremony" in caption
        // Note: Firestore doesn't support full-text search, so we'd need to use
        // a more sophisticated approach in production (like Algolia or custom indexing)
        // For this test, we'll just demonstrate a simple contains check
        const allPhotos = await getDocs(photosRef);
        const ceremonyPhotos = allPhotos.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(photo => photo.caption.toLowerCase().includes('ceremony'));

        expect(ceremonyPhotos.length).toBe(2);
        expect(ceremonyPhotos.some(p => p.fileName === 'ceremony.jpg')).toBe(true);
        expect(ceremonyPhotos.some(p => p.fileName === 'cake.jpg')).toBe(true);

        console.log('✅ Caption search working');
    });

    test('Get photo count for gallery stats', async () => {
        const photosRef = collection(db, 'wedding_photos');

        // Add various photos
        await addDoc(photosRef, { fileName: 'photo1.jpg', uploadedBy: 'user1', uploadedAt: new Date().toISOString() });
        await addDoc(photosRef, { fileName: 'photo2.jpg', uploadedBy: 'user2', uploadedAt: new Date().toISOString() });
        await addDoc(photosRef, { fileName: 'photo3.jpg', uploadedBy: 'user1', uploadedAt: new Date().toISOString() });

        // Get total count
        const totalSnapshot = await getDocs(photosRef);
        expect(totalSnapshot.size).toBe(3);

        // Get count by specific user
        const user1Query = query(photosRef, where('uploadedBy', '==', 'user1'));
        const user1Snapshot = await getDocs(user1Query);
        expect(user1Snapshot.size).toBe(2);

        console.log('✅ Gallery stats calculated correctly');
    });
});
