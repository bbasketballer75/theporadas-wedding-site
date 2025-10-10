import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

import { logGalleryDownload } from '../lib/analytics';
import { downloadAllPhotos, estimateZipSize } from '../lib/downloadPhotos';
import { db } from '../lib/firebase';

/**
 * GalleryDisplay Component
 * Displays wedding photos and videos from Firestore
 *
 * Features:
 * - Real-time updates (new uploads appear automatically)
 * - Infinite scroll (loads 20 items at a time)
 * - Photos: Display from Supabase URLs
 * - Videos: Display from YouTube embeds (after processing)
 * - Status indicators: Show processing/queued/failed states
 * - Responsive grid layout
 * - Download all photos as ZIP
 */
export default function GalleryDisplay() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemsToShow, setItemsToShow] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    // Query Firestore for wedding photos/videos, sorted by newest first
    // Note: We query ALL items but only display first N (controlled by itemsToShow state)
    const q = query(collection(db, 'wedding-photos'), orderBy('timestamp', 'desc'));

    // Real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
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
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    setHasMore(media.length > itemsToShow);
  }, [media.length, itemsToShow]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setItemsToShow((prev) => {
            const newCount = prev + 20;
            setHasMore(media.length > newCount);
            return newCount;
          });
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasMore, media.length]);

  // Handle download all photos
  const handleDownloadAll = async () => {
    if (downloading) return;

    try {
      setDownloading(true);
      setDownloadProgress(0);

      await downloadAllPhotos(media, (progress) => {
        setDownloadProgress(progress);
      });

      // Track download in analytics
      const photos = media.filter((item) => !item.url?.includes('youtube'));
      const zipInfo = estimateZipSize(media);
      logGalleryDownload(photos.length, zipInfo.totalSize);

      // Success feedback
      setTimeout(() => {
        setDownloading(false);
        setDownloadProgress(0);
      }, 2000);
    } catch (err) {
      console.error('[GalleryDisplay] Download error:', err);
      alert(`Download failed: ${err.message}`);
      setDownloading(false);
      setDownloadProgress(0);
    }
  };

  const zipInfo = useMemo(() => estimateZipSize(media), [media]);

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
      {/* Header with Download Button */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <h2 className="text-3xl font-heading text-sage-800">Wedding Memories ({media.length})</h2>

        {/* Download All Button */}
        {media.length > 0 && (
          <button
            onClick={handleDownloadAll}
            disabled={downloading || zipInfo.photoCount === 0}
            className="px-6 py-3 bg-gradient-to-r from-sage to-sage/90 text-white rounded-xl font-body font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
          >
            {downloading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Downloading... {downloadProgress}%</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span>
                  Download All ({zipInfo.photoCount} photos · ~{zipInfo.estimatedZipSize})
                </span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Progress Bar during Download */}
      {downloading && (
        <div className="mb-6 bg-white rounded-xl p-4 shadow-md">
          <div className="w-full bg-cream rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-sage to-blush h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
          <p className="text-sm text-sage text-center mt-2 font-medium">
            {downloadProgress < 80
              ? `Downloading photos... ${downloadProgress}%`
              : downloadProgress < 95
                ? 'Compressing ZIP file...'
                : 'Almost done!'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {media.slice(0, itemsToShow).map((item) => (
          <MediaItem key={item.id} item={item} />
        ))}
      </div>

      {/* Infinite Scroll Trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
          <p className="ml-4 text-gray-600">Loading more...</p>
        </div>
      )}

      {/* End of Gallery Message */}
      {!hasMore && media.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          ✨ You&apos;ve reached the end! All {media.length} memories loaded.
        </div>
      )}
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
          <Image
            src={item.url}
            alt={item.name || 'Wedding photo'}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCXABmA/9k="
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

      {/* Video Thumbnail (while processing or if no YouTube yet) */}
      {isVideo && (!item.youtubeId || item.uploadStatus !== 'completed') && item.thumbnailUrl && (
        <div className="aspect-video relative bg-gray-100">
          <Image
            src={item.thumbnailUrl}
            alt={item.name || 'Video thumbnail'}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            quality={75}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCXABmA/9k="
            loading="lazy"
          />
          {/* Play Icon Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <svg
              className="w-16 h-16 text-white opacity-80"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
            </svg>
          </div>
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
        {/* Uploader Name (if available) */}
        {item.uploadedBy && (
          <div className="flex items-center gap-2 mb-2 text-sm text-sage font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>Shared by {item.uploadedBy}</span>
          </div>
        )}

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
