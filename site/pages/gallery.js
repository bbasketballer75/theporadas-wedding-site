import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import DownloadAllPhotos from '../components/DownloadAllPhotos';
import FavoritePhotos from '../components/FavoritePhotos';
import Footer from '../components/Footer';
import GalleryDisplay from '../components/GalleryDisplay';
import GallerySearch from '../components/GallerySearch';
import Navigation from '../components/Navigation';
import PageTransition from '../components/PageTransition';
import PhotoComments from '../components/PhotoComments';
import PhotoMetadata from '../components/PhotoMetadata';
import PhotoSlideshow from '../components/PhotoSlideshow';
import ProgressiveImage from '../components/ProgressiveImage';
import SocialShare from '../components/SocialShare';
import VideoPlayer from '../components/VideoPlayer';
import { db } from '../lib/firebase';

export default function Gallery() {
  // Media state - fetched from Firestore
  const [allMedia, setAllMedia] = useState([]);
  const [filteredMedia, setFilteredMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [filter, setFilter] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);

  // Fetch media from Firestore
  useEffect(() => {
    const q = query(collection(db, 'wedding-photos'), orderBy('timestamp', 'desc'));

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

        setAllMedia(items);
        setFilteredMedia(items);
        setLoading(false);
      },
      (err) => {
        console.error('[Gallery] Error fetching media:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Handle GallerySearch filtering
  const handleFilteredPhotos = (filtered) => {
    setFilteredMedia(filtered);
  };

  const filters = [
    { id: 'all', label: 'All', icon: '📸' },
    { id: 'photos', label: 'Photos', icon: '🖼️' },
    { id: 'videos', label: 'Videos', icon: '🎥' },
  ];

  const handleMediaClick = (media) => {
    setSelectedMedia(media);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedMedia(null);
  };

  const openSlideshow = (index) => {
    setSlideshowIndex(index);
    setSlideshowOpen(true);
  };

  const closeSlideshow = () => {
    setSlideshowOpen(false);
  };

  // Get only photos for slideshow (exclude videos)
  const photos = filteredMedia.filter(item => item.type && item.type.startsWith('image/'));

  return (
    <PageTransition>
      <Head>
        <title>Photo Gallery | Austin & Jordyn Wedding</title>
        <meta name="description" content="View all the beautiful moments from our special day" />
      </Head>

      <div className="min-h-screen bg-white">
        <Navigation />

        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Compact Header */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-display text-sage mb-2">Our Wedding Gallery</h1>
            <p className="text-gray-600">May 10, 2025 • Beautiful moments from our special day</p>
          </div>

          {/* Compact Controls Bar */}
          <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50 rounded-xl p-4">
            {/* Search and Filters */}
            <div className="flex-1 w-full md:w-auto">
              <GallerySearch photos={allMedia} onFilteredPhotos={handleFilteredPhotos} />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={() => openSlideshow(0)}
                className="px-4 py-2 bg-sage text-white rounded-lg hover:bg-sage/90 transition-colors text-sm font-medium flex items-center gap-2"
                disabled={photos.length === 0}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
                Slideshow
              </button>
              {photos.length > 0 && (
                <DownloadAllPhotos
                  photos={photos.map(p => ({ url: p.url, originalPath: p.url, name: p.name }))}
                />
              )}
            </div>
          </div>

          {/* Gallery Component - HERO */}
          {loading ? (
            <div className="flex items-center justify-center p-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage"></div>
              <p className="ml-4 text-gray-600">Loading your memories...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-red-800 font-semibold mb-2">Unable to load gallery</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No photos match your search.</p>
            </div>
          ) : (
            <GalleryDisplay
              media={filteredMedia}
              onMediaClick={handleMediaClick}
            />
          )}

          {/* Optional: Wedding Video (Collapsed) */}
          <details className="mt-12 bg-gray-50 rounded-xl p-6">
            <summary className="text-xl font-display text-sage cursor-pointer hover:text-sage/80 transition-colors flex items-center gap-2">
              🎬 Watch Our Wedding Film
              <span className="text-sm text-gray-500 font-normal">(Click to expand)</span>
            </summary>
            <div className="mt-6">
              <VideoPlayer videoId="dQw4w9WgXcQ" title="Austin & Jordyn Wedding Film" showChapters={false} />
            </div>
          </details>

          {/* Compact Upload CTA */}
          <div className="mt-12 bg-sage/5 border border-sage/20 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-display text-sage mb-3">Share Your Photos</h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Have photos from our wedding? We&apos;d love to see them!
            </p>
            <Link
              href="/upload"
              className="inline-block bg-sage text-white px-6 py-3 rounded-lg font-medium hover:bg-sage/90 transition-colors"
            >
              Upload Photos
            </Link>
          </div>
        </main>

        {/* Lightbox Modal - Simplified */}
        {lightboxOpen && selectedMedia && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center animate-fade-in"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-all z-50"
              aria-label="Close"
            >
              ×
            </button>

            <div className="w-full h-full flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
              <div className="max-w-7xl w-full h-full flex flex-col md:flex-row gap-4">
                {/* Main Photo/Video - Takes up most space */}
                <div className="flex-1 flex items-center justify-center">
                  {selectedMedia.contentType?.startsWith('video') ? (
                    <video
                      src={selectedMedia.originalPath}
                      controls
                      autoPlay
                      className="max-w-full max-h-full rounded-lg"
                    />
                  ) : (
                    <ProgressiveImage
                      src={selectedMedia.originalPath || selectedMedia.url}
                      alt={selectedMedia.name || 'Wedding photo'}
                      className="max-w-full max-h-full object-contain rounded-lg"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCXABmA/9k="
                    />
                  )}
                </div>

                {/* Side Panel - Compact Info */}
                <div className="md:w-80 bg-white rounded-lg p-4 overflow-y-auto max-h-[90vh]">
                  {/* Quick Actions */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b">
                    <FavoritePhotos photoId={selectedMedia.id} />
                    <SocialShare
                      url={typeof window !== 'undefined' ? window.location.href : ''}
                      title={selectedMedia.name}
                      compact={true}
                    />
                  </div>

                  {/* Basic Info */}
                  <div className="mb-4 text-sm text-gray-600">
                    {selectedMedia.uploadedBy && (
                      <p className="mb-1">
                        <strong>By:</strong> {selectedMedia.uploadedBy}
                      </p>
                    )}
                    {selectedMedia.createdAt && (
                      <p>
                        <strong>Date:</strong>{' '}
                        {new Date(selectedMedia.createdAt.seconds * 1000).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Collapsible Metadata */}
                  {selectedMedia.type && selectedMedia.type.startsWith('image/') && (
                    <details className="mb-4">
                      <summary className="text-sm font-medium text-sage cursor-pointer hover:text-sage/80 mb-2">
                        📷 Photo Details
                      </summary>
                      <div className="pl-2">
                        <PhotoMetadata imageUrl={selectedMedia.url || selectedMedia.originalPath} />
                      </div>
                    </details>
                  )}

                  {/* Comments */}
                  {selectedMedia.id && (
                    <div className="border-t pt-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">💬 Comments</h3>
                      <PhotoComments photoId={selectedMedia.id} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Photo Slideshow */}
        {slideshowOpen && photos.length > 0 && (
          <PhotoSlideshow
            photos={photos.map(p => ({
              url: p.url || p.originalPath,
              name: p.name,
              uploadedBy: p.uploadedBy,
            }))}
            initialIndex={slideshowIndex}
            onClose={closeSlideshow}
          />
        )}

        <Footer />
      </div>
    </PageTransition>
  );
}
