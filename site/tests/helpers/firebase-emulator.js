/**
 * Firebase Emulator Test Helpers
 * Utilities for integration testing with Firebase emulators
 */

const { getFirestore, connectFirestoreEmulator, collection, addDoc, serverTimestamp, getDocs, query, orderBy, onSnapshot, deleteDoc, doc } = require('firebase/firestore');
const { initializeApp, getApps } = require('firebase/app');

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
 * Clear all documents from a collection
 * @param {string} collectionName - Name of collection to clear
 * @returns {Promise<number>} Number of documents deleted
 */
async function clearCollection(collectionName) {
    const db = getTestFirestore();
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);

    let deleteCount = 0;
    const deletePromises = snapshot.docs.map((document) => {
        deleteCount++;
        return deleteDoc(doc(db, collectionName, document.id));
    });

    await Promise.all(deletePromises);
    console.log(`🗑️  Cleared ${deleteCount} documents from ${collectionName}`);
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
                reject(
                    new Error(
                        `Timeout waiting for ${expectedCount} messages (got ${messages.length})`
                    )
                );
            }
        });
    });
}

/**
 * Check if Firebase emulators are running
 * @returns {Promise<boolean>} True if emulators are running
 */
async function checkEmulatorsRunning() {
    try {
        const response = await fetch(
            `http://${EMULATOR_CONFIG.firestore.host}:${EMULATOR_CONFIG.firestore.port}`
        );
        return response.ok;
    } catch (error) {
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

module.exports = {
    EMULATOR_CONFIG,
    initializeTestApp,
    getTestFirestore,
    clearCollection,
    addTestMessage,
    getAllMessages,
    listenToMessages,
    waitForMessageCount,
    checkEmulatorsRunning,
    waitForEmulators,
};
