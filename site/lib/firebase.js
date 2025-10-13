import { getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase configuration
 * Replace these values with your Firebase project credentials
 * Get from: Firebase Console → Project Settings → General → Your apps → Web app
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'your-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'your-project-id.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'your-project-id',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'your-project-id.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'your-sender-id',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'your-app-id',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'your-measurement-id',
};

/**
 * Initialize Firebase
 * Uses singleton pattern to prevent multiple initializations
 */
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

/**
 * Initialize Firestore
 * Used for storing photo/video metadata and triggering Cloud Functions
 */
const db = getFirestore(app);

/**
 * Connect to Firebase Emulators in development
 * Emulators must be running: firebase emulators:start
 * DISABLED: Using production Firestore for photo uploads
 */
// if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
//   // Only connect to emulators once
//   if (!db._settingsFrozen) {
//     connectFirestoreEmulator(db, '127.0.0.1', 8002);
//     console.log('🔧 Connected to Firestore Emulator');
//   }
// }
// Production Firestore active (console log removed for production)

export { app, db };
