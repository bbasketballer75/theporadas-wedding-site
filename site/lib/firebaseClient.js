// Minimal Firebase client initializer (modular SDK). Replace the placeholder config with your project's values.
import { getApps, initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  enableMultiTabIndexedDbPersistence,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '<YOUR_API_KEY>',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '<YOUR_AUTH_DOMAIN>',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '<YOUR_PROJECT_ID>',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '<YOUR_STORAGE_BUCKET>',
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '<YOUR_MESSAGING_SENDER_ID>',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '<YOUR_APP_ID>',
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const db = getFirestore();

// Simple in-memory cache for viewer pins (client-only)
let cachedPins = [];
let lastPinsFetch = 0;
let inflightPinsPromise = null;
const PINS_CACHE_TTL_MS = 60_000;

// Enable offline persistence (2025 Firebase best practice)
// Allows multi-tab support and offline-first functionality
if (typeof window !== 'undefined') {
  enableMultiTabIndexedDbPersistence(db).catch((err) => {
    // Persistence errors handled silently
    // Multiple tabs: only first tab gets persistence
    // Unimplemented: browser doesn't support IndexedDB
  });
}

// Enhanced error handling and validation (2025 best practices)
export async function addViewerPin({ lat, lng, message }) {
  try {
    // Validate input types
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      throw new Error('Invalid coordinates: must be numbers');
    }

    // Validate coordinate ranges
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw new Error('Coordinates out of range');
    }

    const col = collection(db, 'viewerPins');
    const docRef = await addDoc(col, {
      lat,
      lng,
      message: message || null,
      createdAt: new Date().toISOString(),
    });

    // Invalidate local cache so next fetch refreshes immediately
    cachedPins = [];
    lastPinsFetch = 0;
    inflightPinsPromise = null;

    return { success: true, id: docRef.id };
  } catch (error) {
    // Error adding viewer pin
    return { success: false, error: error.message };
  }
}

export async function fetchViewerPins() {
  try {
    // Serve from cache when within TTL to reduce repeated reads during navigation
    if (typeof window !== 'undefined') {
      const withinTtl = Date.now() - lastPinsFetch < PINS_CACHE_TTL_MS;
      if (withinTtl && cachedPins.length > 0) {
        return cachedPins;
      }

      if (inflightPinsPromise) {
        return inflightPinsPromise;
      }
    }

    const q = query(collection(db, 'viewerPins'), orderBy('createdAt', 'desc'));
    const fetchPromise = getDocs(q).then((snap) =>
      snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    );

    if (typeof window !== 'undefined') {
      inflightPinsPromise = fetchPromise;
    }

    const pins = await fetchPromise;

    if (typeof window !== 'undefined') {
      cachedPins = pins;
      lastPinsFetch = Date.now();
      inflightPinsPromise = null;
    }

    return pins;
  } catch (error) {
    // Error fetching viewer pins
    inflightPinsPromise = null;
    return [];
  }
}

export default db;
