/**
 * Performance Integration Tests for Firebase Emulator
 * 
 * Tests application performance with large datasets:
 * - 1000+ photos in gallery
 * - 500+ guestbook messages
 * - Concurrent uploads (10+ simultaneous)
 * - Query performance with filters and pagination
 * 
 * Prerequisites: Firebase emulators must be running
 * Run: npx playwright test --project=integration performance-emulator.spec.js
 */

const { test, expect } = require('@playwright/test');
const {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    Timestamp,
    writeBatch,
    doc
} = require('firebase/firestore');
const {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} = require('firebase/storage');
const { initializeApp } = require('firebase/app');
const {
    clearCollection,
    waitForEmulators,
    clearAllTestData
} = require('../helpers/firebase-emulator');

// Firebase config for emulator
const firebaseConfig = {
    projectId: 'demo-test',
    apiKey: 'fake-api-key',
    authDomain: 'demo-test.firebaseapp.com',
    storageBucket: 'demo-test.appspot.com'
};

let app, db, storage;

test.describe('Performance Integration (Firebase Emulator)', () => {
    test.beforeAll(async () => {
        // Initialize Firebase with emulator
        app = initializeApp(firebaseConfig, 'performance-test-app');
        db = getFirestore(app);
        storage = getStorage(app);

        // Connect to emulators
        const { connectFirestoreEmulator } = require('firebase/firestore');
        const { connectStorageEmulator } = require('firebase/storage');

        connectFirestoreEmulator(db, 'localhost', 8002);
        connectStorageEmulator(storage, 'localhost', 9199);

        await waitForEmulators();
    });

    test.beforeEach(async () => {
        // Clear test data before each test
        await clearAllTestData(db);
    });

    test.afterEach(async () => {
        // Clean up after each test
        await clearAllTestData(db);
    });

    test('Gallery performance with 1000+ photos', async () => {
        console.log('🚀 Creating 1000 test photos...');
        const startCreate = Date.now();

        // Create photos in batches of 500 (Firestore batch limit)
        const totalPhotos = 1000;
        const batchSize = 500;
        const batches = Math.ceil(totalPhotos / batchSize);

        for (let i = 0; i < batches; i++) {
            const batch = writeBatch(db);
            const startIdx = i * batchSize;
            const endIdx = Math.min(startIdx + batchSize, totalPhotos);

            for (let j = startIdx; j < endIdx; j++) {
                const photoRef = doc(collection(db, 'test_photos'));
                batch.set(photoRef, {
                    fileName: `photo-${j}.jpg`,
                    uploadedBy: j % 10 === 0 ? 'special_user' : 'test_user',
                    uploadedAt: Timestamp.fromDate(new Date(2025, 0, 1 + (j % 30))),
                    fileSize: 1024 * 1024 * (2 + (j % 3)), // 2-4 MB
                    caption: j % 5 === 0 ? `Wedding moment ${j}` : null,
                    tags: ['wedding', j % 2 === 0 ? 'ceremony' : 'reception'],
                    createdAt: Timestamp.now()
                });
            }

            await batch.commit();
            console.log(`   Batch ${i + 1}/${batches} committed (${endIdx} photos total)`);
        }

        const createDuration = Date.now() - startCreate;
        console.log(`✅ Created ${totalPhotos} photos in ${createDuration}ms`);
        console.log(`   Throughput: ${(totalPhotos / (createDuration / 1000)).toFixed(1)} photos/sec`);

        // Test 1: Query all photos (no filters)
        const startQueryAll = Date.now();
        const allPhotosQuery = query(
            collection(db, 'test_photos'),
            orderBy('uploadedAt', 'desc'),
            limit(50) // Pagination
        );
        const allPhotosSnapshot = await getDocs(allPhotosQuery);
        const queryAllDuration = Date.now() - startQueryAll;

        expect(allPhotosSnapshot.size).toBe(50);
        console.log(`✅ Query all (limit 50): ${queryAllDuration}ms`);
        expect(queryAllDuration).toBeLessThan(2000); // Should be < 2 seconds

        // Test 2: Filter by uploader
        const startFilterUser = Date.now();
        const userPhotosQuery = query(
            collection(db, 'test_photos'),
            where('uploadedBy', '==', 'special_user'),
            orderBy('uploadedAt', 'desc')
        );
        const userPhotosSnapshot = await getDocs(userPhotosQuery);
        const filterUserDuration = Date.now() - startFilterUser;

        expect(userPhotosSnapshot.size).toBe(100); // Every 10th photo
        console.log(`✅ Filter by user: ${filterUserDuration}ms (${userPhotosSnapshot.size} results)`);
        expect(filterUserDuration).toBeLessThan(2000);

        // Test 3: Pagination performance
        const startPagination = Date.now();
        let currentPage = allPhotosSnapshot;
        let totalPaginated = currentPage.size;

        for (let page = 1; page < 5; page++) {
            const lastDoc = currentPage.docs[currentPage.docs.length - 1];
            const nextPageQuery = query(
                collection(db, 'test_photos'),
                orderBy('uploadedAt', 'desc'),
                startAfter(lastDoc),
                limit(50)
            );
            currentPage = await getDocs(nextPageQuery);
            totalPaginated += currentPage.size;
        }

        const paginationDuration = Date.now() - startPagination;
        console.log(`✅ Paginated 5 pages (${totalPaginated} photos) in ${paginationDuration}ms`);
        expect(paginationDuration).toBeLessThan(5000); // 5 pages should be < 5 seconds

        // Test 4: Search by caption (where clause on string)
        const startSearch = Date.now();
        const searchQuery = query(
            collection(db, 'test_photos'),
            where('caption', '!=', null)
        );
        const searchSnapshot = await getDocs(searchQuery);
        const searchDuration = Date.now() - startSearch;

        expect(searchSnapshot.size).toBe(200); // Every 5th photo has caption
        console.log(`✅ Search with caption: ${searchDuration}ms (${searchSnapshot.size} results)`);
        expect(searchDuration).toBeLessThan(2000);

        // Performance summary
        console.log('\n📊 Performance Summary (1000 photos):');
        console.log(`   Create: ${(createDuration / 1000).toFixed(2)}s (${(totalPhotos / (createDuration / 1000)).toFixed(1)} photos/sec)`);
        console.log(`   Query all (limit 50): ${queryAllDuration}ms`);
        console.log(`   Filter by user: ${filterUserDuration}ms`);
        console.log(`   Pagination (5 pages): ${paginationDuration}ms`);
        console.log(`   Search with caption: ${searchDuration}ms`);
    });

    test('Guestbook performance with 500+ messages', async () => {
        console.log('🚀 Creating 500 test messages...');
        const startCreate = Date.now();

        const totalMessages = 500;
        const batch = writeBatch(db);

        for (let i = 0; i < totalMessages; i++) {
            const messageRef = doc(collection(db, 'test_messages'));
            batch.set(messageRef, {
                name: `Guest ${i % 50}`,
                email: `guest${i}@test.com`,
                message: `Test message ${i}. This is a longer message to simulate real content with multiple sentences and some detail about the wedding experience.`,
                createdAt: Timestamp.fromDate(new Date(2025, 0, 1, 10, i % 60)),
                approved: i % 10 !== 0 // 90% approved
            });
        }

        await batch.commit();
        const createDuration = Date.now() - startCreate;
        console.log(`✅ Created ${totalMessages} messages in ${createDuration}ms`);
        console.log(`   Throughput: ${(totalMessages / (createDuration / 1000)).toFixed(1)} messages/sec`);

        // Test 1: Query all messages with pagination
        const startQueryAll = Date.now();
        const allMessagesQuery = query(
            collection(db, 'test_messages'),
            orderBy('createdAt', 'desc'),
            limit(100)
        );
        const allMessagesSnapshot = await getDocs(allMessagesQuery);
        const queryAllDuration = Date.now() - startQueryAll;

        expect(allMessagesSnapshot.size).toBe(100);
        console.log(`✅ Query all (limit 100): ${queryAllDuration}ms`);
        expect(queryAllDuration).toBeLessThan(2000);

        // Test 2: Filter approved messages
        const startFilterApproved = Date.now();
        const approvedQuery = query(
            collection(db, 'test_messages'),
            where('approved', '==', true),
            orderBy('createdAt', 'desc')
        );
        const approvedSnapshot = await getDocs(approvedQuery);
        const filterApprovedDuration = Date.now() - startFilterApproved;

        expect(approvedSnapshot.size).toBe(450); // 90% approved
        console.log(`✅ Filter approved: ${filterApprovedDuration}ms (${approvedSnapshot.size} results)`);
        expect(filterApprovedDuration).toBeLessThan(2000);

        // Performance summary
        console.log('\n📊 Performance Summary (500 messages):');
        console.log(`   Create: ${(createDuration / 1000).toFixed(2)}s (${(totalMessages / (createDuration / 1000)).toFixed(1)} messages/sec)`);
        console.log(`   Query all (limit 100): ${queryAllDuration}ms`);
        console.log(`   Filter approved: ${filterApprovedDuration}ms`);
    });

    test('Concurrent uploads performance (10 simultaneous)', async () => {
        console.log('🚀 Simulating 10 concurrent uploads...');

        const numUploads = 10;
        const testImage = Buffer.from('test-image-data');

        const startUpload = Date.now();

        // Create 10 upload promises
        const uploadPromises = Array.from({ length: numUploads }, async (_, i) => {
            // Upload to Storage
            const storageRef = ref(storage, `test-uploads/concurrent-${i}.jpg`);
            await uploadBytes(storageRef, testImage);
            const downloadURL = await getDownloadURL(storageRef);

            // Write metadata to Firestore
            await addDoc(collection(db, 'test_photos'), {
                fileName: `concurrent-${i}.jpg`,
                uploadedBy: `user_${i % 3}`,
                uploadedAt: Timestamp.now(),
                downloadURL,
                fileSize: testImage.length,
                createdAt: Timestamp.now()
            });

            return i;
        });

        // Wait for all uploads to complete
        const results = await Promise.all(uploadPromises);
        const uploadDuration = Date.now() - startUpload;

        expect(results.length).toBe(numUploads);
        console.log(`✅ ${numUploads} concurrent uploads completed in ${uploadDuration}ms`);
        console.log(`   Average: ${(uploadDuration / numUploads).toFixed(1)}ms per upload`);
        console.log(`   Throughput: ${(numUploads / (uploadDuration / 1000)).toFixed(1)} uploads/sec`);

        // Verify all photos in Firestore
        const photosSnapshot = await getDocs(collection(db, 'test_photos'));
        expect(photosSnapshot.size).toBe(numUploads);

        // Performance expectations
        expect(uploadDuration).toBeLessThan(5000); // 10 uploads should be < 5 seconds
    });

    test('Query performance with complex filters', async () => {
        console.log('🚀 Testing complex query performance...');

        // Create 200 photos with varied metadata
        const batch = writeBatch(db);
        const totalPhotos = 200;

        for (let i = 0; i < totalPhotos; i++) {
            const photoRef = doc(collection(db, 'test_photos'));
            batch.set(photoRef, {
                fileName: `photo-${i}.jpg`,
                uploadedBy: ['user_a', 'user_b', 'user_c'][i % 3],
                uploadedAt: Timestamp.fromDate(new Date(2025, 0, 1 + (i % 10))),
                fileSize: 1024 * 1024 * (1 + (i % 5)), // 1-5 MB
                tags: i % 2 === 0 ? ['ceremony'] : ['reception'],
                approved: i % 5 !== 0, // 80% approved
                createdAt: Timestamp.now()
            });
        }

        await batch.commit();
        console.log(`✅ Created ${totalPhotos} photos with varied metadata`);

        // Test 1: Multiple where clauses
        const startMultiWhere = Date.now();
        const multiWhereQuery = query(
            collection(db, 'test_photos'),
            where('uploadedBy', '==', 'user_a'),
            where('approved', '==', true)
        );
        const multiWhereSnapshot = await getDocs(multiWhereQuery);
        const multiWhereDuration = Date.now() - startMultiWhere;

        console.log(`✅ Multi-where query: ${multiWhereDuration}ms (${multiWhereSnapshot.size} results)`);
        expect(multiWhereDuration).toBeLessThan(1000);

        // Test 2: Range query with orderBy
        const startRange = Date.now();
        const rangeQuery = query(
            collection(db, 'test_photos'),
            where('fileSize', '>=', 1024 * 1024 * 2),
            where('fileSize', '<=', 1024 * 1024 * 4),
            orderBy('fileSize', 'asc')
        );
        const rangeSnapshot = await getDocs(rangeQuery);
        const rangeDuration = Date.now() - startRange;

        console.log(`✅ Range query: ${rangeDuration}ms (${rangeSnapshot.size} results)`);
        expect(rangeDuration).toBeLessThan(1000);

        // Performance summary
        console.log('\n📊 Complex Query Performance:');
        console.log(`   Multi-where: ${multiWhereDuration}ms`);
        console.log(`   Range with orderBy: ${rangeDuration}ms`);
    });
});
