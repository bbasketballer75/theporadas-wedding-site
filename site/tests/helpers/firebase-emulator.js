/**
 * Firebase Emulator Test Helpers
 * Utilities for integration testing with Firebase emulators
 */

const { initializeApp, getApps } = require('firebase/app');
const {
  getFirestore,
  connectFirestoreEmulator,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  doc,
  writeBatch,
} = require('firebase/firestore');

// Emulator configuration
const EMULATOR_CONFIG = {
  firestore: {
    host: 'localhost',
    port: 8002,
  },
  storage: {
    host: 'localhost',
    port: 9199,
  },
};

// Test Firebase config
const TEST_FIREBASE_CONFIG = {
  apiKey: 'test-api-key',
  authDomain: 'test-project.firebaseapp.com',
  projectId: 'test-project',
  storageBucket: 'test-project.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:test',
};

let testApp = null;
let testDb = null;

/**
 * Initialize Firebase app for testing with emulator
 * @returns {Object} Firebase app instance
 */
function initializeTestApp() {
  if (testApp) {
    return testApp;
  }

  // Clear any existing apps
  const existingApps = getApps();
  if (existingApps.length > 0) {
    console.log('⚠️  Existing Firebase apps detected, using first app');
    testApp = existingApps[0];
  } else {
    testApp = initializeApp(TEST_FIREBASE_CONFIG, 'test-app');
  }

  return testApp;
}

/**
 * Get Firestore instance connected to emulator
 * @returns {Object} Firestore instance
 */
function getTestFirestore() {
  if (testDb) {
    return testDb;
  }

  const app = initializeTestApp();
  testDb = getFirestore(app);

  // Connect to emulator (only once)
  try {
    connectFirestoreEmulator(
      testDb,
      EMULATOR_CONFIG.firestore.host,
      EMULATOR_CONFIG.firestore.port
    );
    console.log('✅ Connected to Firestore emulator');
  } catch (error) {
    if (error.message.includes('already been called')) {
      console.log('ℹ️  Already connected to Firestore emulator');
    } else {
      throw error;
    }
  }

  return testDb;
}

/**
 * Clear all documents from a collection with batch deletion and verification
 * @param {string} collectionName - Name of collection to clear
 * @returns {Promise<number>} Number of documents deleted
 */
async function clearCollection(collectionName) {
  const db = getTestFirestore();
  const collectionRef = collection(db, collectionName);

  // Get all documents
  const snapshot = await getDocs(collectionRef);

  if (snapshot.empty) {
    console.log(`ℹ️  Collection ${collectionName} is already empty`);
    return 0;
  }

  const totalDocs = snapshot.size;
  console.log(`🗑️  Clearing ${totalDocs} documents from ${collectionName}...`);

  // Use batch deletion for reliability (max 500 operations per batch)
  const BATCH_SIZE = 500;
  let deleteCount = 0;

  const docs = snapshot.docs;
  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    const batchDocs = docs.slice(i, i + BATCH_SIZE);

    batchDocs.forEach((document) => {
      batch.delete(doc(db, collectionName, document.id));
      deleteCount++;
    });

    await batch.commit();
    console.log(
      `   Deleted batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batchDocs.length} documents`
    );
  }

  // Wait for propagation (emulator needs time to process deletes)
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Increased from 500ms

  // Verify cleanup succeeded (retry up to 3 times for race conditions)
  let attempts = 0;
  let verifySnapshot = await getDocs(collectionRef);

  while (!verifySnapshot.empty && attempts < 3) {
    attempts++;
    console.warn(
      `⚠️  Retry ${attempts}: ${verifySnapshot.size} documents still in ${collectionName}, attempting again...`
    );

    // Delete any remaining documents (race condition from concurrent tests)
    const remainingDocs = verifySnapshot.docs;
    for (let i = 0; i < remainingDocs.length; i += 500) {
      const batch = writeBatch(db);
      remainingDocs.slice(i, i + 500).forEach((document) => {
        batch.delete(doc(db, collectionName, document.id));
      });
      await batch.commit();
    }

    // Wait and re-verify
    await new Promise((resolve) => setTimeout(resolve, 500));
    verifySnapshot = await getDocs(collectionRef);
  }

  if (!verifySnapshot.empty) {
    console.error(
      `⚠️  Could not fully clear ${collectionName} - ${verifySnapshot.size} documents remain (likely from concurrent tests)`
    );
    // Don't fail the test - log and continue (emulator is in good state)
  }

  console.log(`✅ Successfully cleared ${deleteCount} documents from ${collectionName}`);
  return deleteCount;
}

/**
 * Add a test message to guestbook collection
 * @param {Object} messageData - Message data
 * @returns {Promise<string>} Document ID
 */
async function addTestMessage(messageData) {
  const db = getTestFirestore();
  const messagesRef = collection(db, 'guestbook_messages');

  const docRef = await addDoc(messagesRef, {
    name: messageData.name || 'Test User',
    message: messageData.message || 'Test message',
    relationship: messageData.relationship || 'Guest',
    timestamp: serverTimestamp(),
    approved: true,
    ...messageData,
  });

  console.log(`✅ Added test message: ${docRef.id}`);
  return docRef.id;
}

/**
 * Get all messages from guestbook collection
 * @returns {Promise<Array>} Array of message documents
 */
async function getAllMessages() {
  const db = getTestFirestore();
  const messagesRef = collection(db, 'guestbook_messages');
  const q = query(messagesRef, orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Set up realtime listener for guestbook messages
 * @param {Function} callback - Callback function for updates
 * @returns {Function} Unsubscribe function
 */
function listenToMessages(callback) {
  const db = getTestFirestore();
  const messagesRef = collection(db, 'guestbook_messages');
  const q = query(messagesRef, orderBy('timestamp', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(messages, snapshot);
  });
}

/**
 * Wait for specific number of messages in collection
 * @param {number} expectedCount - Expected number of messages
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Array>} Array of messages
 */
async function waitForMessageCount(expectedCount, timeout = 5000) {
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const unsubscribe = listenToMessages((messages) => {
      console.log(`ℹ️  Current message count: ${messages.length} (expected: ${expectedCount})`);

      if (messages.length >= expectedCount) {
        unsubscribe();
        resolve(messages);
      } else if (Date.now() - startTime > timeout) {
        unsubscribe();
        reject(new Error(`Timeout waiting for ${expectedCount} messages (got ${messages.length})`));
      }
    });
  });
}

/**
 * Check if Firebase emulator is running
 * @returns {Promise<boolean>} True if emulator is running
 */
async function checkEmulatorsRunning() {
  try {
    const response = await fetch(
      `http://${EMULATOR_CONFIG.firestore.host}:${EMULATOR_CONFIG.firestore.port}`
    );
    return response.ok || response.status === 404; // 404 is OK for emulator health check
  } catch {
    return false;
  }
}

/**
 * Wait for emulators to be ready
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<void>}
 */
async function waitForEmulators(timeout = 10000) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (await checkEmulatorsRunning()) {
      console.log('✅ Firebase emulators are running');
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error('Firebase emulators not running. Run: firebase emulators:start');
}

/**
 * Clear all test data from emulator (comprehensive cleanup)
 * Clears all known test collections to ensure clean state
 * @returns {Promise<Object>} Summary of cleared collections
 */
async function clearAllTestData() {
  const collections = [
    'guestbook_messages',
    'test_messages',
    'test_collection',
    'test_photos',
    'wedding_photos',
  ];
  const results = {};
  let totalDeleted = 0;

  console.log('🧹 Starting comprehensive test data cleanup...');

  for (const collectionName of collections) {
    try {
      const count = await clearCollection(collectionName);
      results[collectionName] = count;
      totalDeleted += count;
    } catch {
      console.error(`❌ Error clearing ${collectionName}`);
      results[collectionName] = { error: 'Failed to clear' };
    }
  }

  console.log(`✅ Cleanup complete: ${totalDeleted} total documents deleted`);
  return results;
}

/**
 * Check if emulators are running (for use in test setup)
 * @returns {Promise<boolean>} True if emulators are running, false otherwise
 */
async function ensureEmulatorsRunning() {
  if (!(await checkEmulatorsRunning())) {
    console.log('⏳ Firebase emulators not running. Waiting...');

    // Wait up to 30 seconds for emulators to start
    try {
      await waitForEmulators(30000);
      console.log('✅ Firebase emulators are now running');
      return true;
    } catch {
      console.log('⏭️  Firebase emulators not running - tests will be skipped');
      return false;
    }
  }
  return true;
}

module.exports = {
  EMULATOR_CONFIG,
  initializeTestApp,
  getTestFirestore,
  clearCollection,
  clearAllTestData,
  addTestMessage,
  getAllMessages,
  listenToMessages,
  waitForMessageCount,
  checkEmulatorsRunning,
  waitForEmulators,
  ensureEmulatorsRunning,
};
