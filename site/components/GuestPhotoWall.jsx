import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Masonry from 'react-masonry-css';

import { db } from '../lib/firebase';

/**
 * GuestPhotoWall Component
 * Displays guest-uploaded photos in a masonry grid layout
 *
 * Features:
 * - Responsive masonry layout (1-4 columns)
 * - Real-time updates from Firestore
 * - Shows only completed uploads
 * - Guest attribution
 */
export default function GuestPhotoWall() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Query only photos (not videos) with completed upload status
    const q = query(
      collection(db, 'wedding-photos'),
      where('type', '>=', 'image/'),
      where('type', '<=', 'image/\uf8ff'),
      orderBy('type'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          // Only include completed uploads
          if (!data.uploadStatus || data.uploadStatus === 'completed') {
            items.push({
              id: doc.id,
              ...data,
            });
          }
        });

        setPhotos(items);
        setLoading(false);
      },
      (err) => {
        console.error('[GuestPhotoWall] Error fetching photos:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const breakpointColumns = {
    default: 4,
    1280: 3,
    768: 2,
    640: 1,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage"></div>
        <p className="ml-4 text-gray-600">Loading photo wall...</p>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center p-12 bg-white/50 backdrop-blur rounded-3xl">
        <div className="w-20 h-20 bg-mint/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-10 h-10 text-sage"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-gray-600 text-lg">No guest photos yet. Be the first to share! 📸</p>
      </div>
    );
  }

  return (
    <div className="guest-photo-wall">
      <style jsx>{`
        .guest-photo-wall :global(.masonry-grid) {
          display: flex;
          margin-left: -1rem;
          width: auto;
        }

        .guest-photo-wall :global(.masonry-grid-column) {
          padding-left: 1rem;
          background-clip: padding-box;
        }

        .guest-photo-wall :global(.masonry-grid-column > div) {
          margin-bottom: 1rem;
        }
      `}</style>

      <Masonry
        breakpointCols={breakpointColumns}
        className="masonry-grid"
        columnClassName="masonry-grid-column"
      >
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </Masonry>
    </div>
  );
}

/**
 * PhotoCard Component
 * Individual photo in masonry grid
 */
function PhotoCard({ photo }) {
  const [imageHeight, setImageHeight] = useState(300);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 group">
      <div className="relative overflow-hidden">
        <Image
          src={photo.url}
          alt={photo.name || 'Guest photo'}
          width={400}
          height={imageHeight}
          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          quality={85}
          onLoadingComplete={(result) => {
            // Set actual image height for better masonry layout
            setImageHeight(result.naturalHeight);
          }}
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 w-full">
            {photo.uploadedBy && (
              <p className="text-white font-semibold flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {photo.uploadedBy}
              </p>
            )}
            {photo.timestamp && (
              <p className="text-white/80 text-xs mt-1">{formatTimestamp(photo.timestamp)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Helper: Format Firestore timestamp
 */
function formatTimestamp(timestamp) {
  if (!timestamp) return '';

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
