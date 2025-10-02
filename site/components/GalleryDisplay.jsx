import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';

/**
 * GalleryDisplay Component
 * Displays wedding photos and videos from Firestore
 *
 * Features:
 * - Real-time updates (new uploads appear automatically)
 * - Photos: Display from Supabase URLs
 * - Videos: Display from YouTube embeds (after processing)
 * - Status indicators: Show processing/queued/failed states
 * - Responsive grid layout
 */
export default function GalleryDisplay() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('[GalleryDisplay] Setting up real-time listener...');

    // Query Firestore for wedding photos/videos, sorted by newest first
    const q = query(collection(db, 'wedding-photos'), orderBy('timestamp', 'desc'));

    // Real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log('[GalleryDisplay] Received update:', snapshot.size, 'items');

        const items = [];
        snapshot.forEach((doc) => {
          items.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setMedia(items);
        setLoading(false);
      },
      (err) => {
        console.error('[GalleryDisplay] Error fetching media:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => {
      console.log('[GalleryDisplay] Cleaning up listener');
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600"></div>
        <p className="ml-4 text-gray-600">Loading gallery...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-4">
        <h3 className="text-red-800 font-semibold mb-2">Error Loading Gallery</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="text-center p-12">
        <p className="text-gray-600 text-lg">
          No photos or videos yet. Be the first to share a memory! 📸
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-heading text-sage-800 mb-8 text-center">
        Wedding Memories ({media.length})
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {media.map((item) => (
          <MediaItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

/**
 * MediaItem Component
 * Renders a single photo or video
 */
function MediaItem({ item }) {
  const isVideo = item.type && item.type.startsWith('video/');
  const isImage = item.type && item.type.startsWith('image/');

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Media Display */}
      {isImage && (
        <div className="aspect-square relative bg-gray-100">
          <img
            src={item.url}
            alt={item.name || 'Wedding photo'}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {isVideo && item.uploadStatus === 'completed' && item.youtubeId && (
        <div className="aspect-video relative bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${item.youtubeId}`}
            title={item.name || 'Wedding video'}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {isVideo && item.uploadStatus === 'processing' && (
        <div className="aspect-video bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-3"></div>
            <p className="text-gray-600 font-medium">Processing video...</p>
            <p className="text-gray-500 text-sm">Uploading to YouTube</p>
          </div>
        </div>
      )}

      {isVideo && item.uploadStatus === 'queued' && (
        <div className="aspect-video bg-yellow-50 flex items-center justify-center">
          <div className="text-center p-4">
            <svg
              className="w-12 h-12 text-yellow-600 mx-auto mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-yellow-800 font-medium">Video Queued</p>
            <p className="text-yellow-700 text-sm">Will process within 24 hours</p>
          </div>
        </div>
      )}

      {isVideo && item.uploadStatus === 'failed' && (
        <div className="aspect-video bg-red-50 flex items-center justify-center">
          <div className="text-center p-4">
            <svg
              className="w-12 h-12 text-red-600 mx-auto mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-800 font-medium">Upload Failed</p>
            <p className="text-red-600 text-sm">{item.uploadError || 'Please try again'}</p>
          </div>
        </div>
      )}

      {isVideo && item.uploadStatus === 'pending' && (
        <div className="aspect-video bg-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse rounded-full h-12 w-12 bg-blue-200 mx-auto mb-3"></div>
            <p className="text-blue-800 font-medium">Upload Complete</p>
            <p className="text-blue-600 text-sm">Processing starting...</p>
          </div>
        </div>
      )}

      {/* Metadata Footer */}
      <div className="p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="truncate flex-1">{item.name || 'Untitled'}</span>
          <span className="ml-2 whitespace-nowrap">{formatFileSize(item.size)}</span>
        </div>

        {item.compressed && item.compressionSavings && (
          <div className="mt-2 text-xs text-green-600">
            ✓ Compressed ({item.compressionSavings} smaller)
          </div>
        )}

        {isVideo && item.uploadStatus === 'completed' && (
          <a
            href={item.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            Watch on YouTube
          </a>
        )}

        {item.timestamp && (
          <div className="mt-2 text-xs text-gray-400">{formatTimestamp(item.timestamp)}</div>
        )}
      </div>
    </div>
  );
}

/**
 * Helper: Format file size
 */
function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/**
 * Helper: Format Firestore timestamp
 */
function formatTimestamp(timestamp) {
  if (!timestamp) return '';

  // Firestore Timestamp has .toDate() method
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}
