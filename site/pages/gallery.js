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

      <div className="min-h-screen bg-gradient-to-br from-cream via-mint to-blush/20">
        <Navigation />

        <main className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-display text-sage mb-4">Wedding Gallery</h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Relive the magic of our special day through these beautiful photos and videos shared
              by our guests.
            </p>
          </div>

          {/* Wedding Video Section */}
          <div className="mb-16 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              <div className="flex items-center justify-center mb-6">
                <h2 className="text-4xl font-display text-sage text-center">🎬 Our Wedding Film</h2>
              </div>
              <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">
                Watch the highlight reel of our unforgettable day
              </p>
              <VideoPlayer videoId="dQw4w9WgXcQ" title="Austin & Jordyn Wedding Film" />
            </div>
          </div>

          {/* Gallery Search & Download Section */}
          <div className="mb-8 space-y-6">
            <GallerySearch photos={allMedia} onFilteredPhotos={handleFilteredPhotos} />
            
            {photos.length > 0 && (
              <div className="flex justify-center gap-4">
                <DownloadAllPhotos 
                  photos={photos.map(p => ({ url: p.url, originalPath: p.url, name: p.name }))} 
                />
                <button
                  onClick={() => openSlideshow(0)}
                  className="px-6 py-3 bg-gradient-to-r from-blush to-blush/90 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start Slideshow
                </button>
              </div>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl p-2 inline-flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    filter === f.id
                      ? 'bg-gradient-sage-blush text-white shadow-lg'
                      : 'text-gray-600 hover:text-sage hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{f.icon}</span>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Component */}
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage"></div>
              <p className="ml-4 text-gray-600">Loading gallery...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-red-800 font-semibold mb-2">Error Loading Gallery</h3>
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <GalleryDisplay 
                media={filteredMedia} 
                onMediaClick={handleMediaClick} 
              />
            </div>
          )}

          {/* Upload CTA */}
          <div className="mt-16 bg-gradient-sage-blush rounded-3xl p-12 text-center shadow-2xl animate-fade-in">
            <h2 className="text-3xl font-display text-white mb-4">
              Have photos or videos to share?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Help us build our wedding album by uploading your favorite moments from our special
              day!
            </p>
            <Link
              href="/upload"
              className="inline-block bg-white text-sage px-8 py-4 rounded-full font-semibold text-lg hover:bg-cream hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              📤 Upload Your Photos
            </Link>
          </div>
        </main>

        {/* Lightbox Modal */}
        {lightboxOpen && selectedMedia && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors z-10"
              aria-label="Close lightbox"
            >
              &times;
            </button>

            <div className="max-w-6xl max-h-[90vh] w-full relative flex flex-col" onClick={(e) => e.stopPropagation()}>
              {/* Media Display */}
              {selectedMedia.contentType?.startsWith('video') ? (
                <video
                  src={selectedMedia.originalPath}
                  controls
                  autoPlay
                  className="max-w-full max-h-[60vh] rounded-lg mb-4"
                />
              ) : (
                <ProgressiveImage
                  src={selectedMedia.originalPath || selectedMedia.url}
                  alt={selectedMedia.name || 'Wedding photo'}
                  className="max-h-[60vh] w-full rounded-lg object-contain mb-4"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCXABmA/9k="
                />
              )}

              {/* Media Info Panel */}
              <div className="bg-gradient-to-t from-black/90 to-black/60 p-6 rounded-b-lg max-h-[30vh] overflow-y-auto">
                {/* Social Share */}
                <div className="mb-4">
                  <SocialShare 
                    url={typeof window !== 'undefined' ? window.location.href : ''}
                    title={`${selectedMedia.name} - Austin & Jordyn Wedding`}
                    description="Check out this beautiful moment from our wedding!"
                    imageUrl={selectedMedia.url || selectedMedia.originalPath}
                  />
                </div>

                {/* Favorite Button */}
                <div className="mb-4">
                  <FavoritePhotos photoId={selectedMedia.id} />
                </div>

                {/* Metadata */}
                <div className="text-white text-sm mb-4">
                  {selectedMedia.uploadedBy && (
                    <p className="mb-2">
                      <span className="text-gray-400">Shared by:</span> {selectedMedia.uploadedBy}
                    </p>
                  )}
                  {selectedMedia.createdAt && (
                    <p className="mb-2">
                      <span className="text-gray-400">Uploaded:</span>{' '}
                      {selectedMedia.createdAt.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                </div>

                {/* EXIF Metadata (for photos) */}
                {selectedMedia.type && selectedMedia.type.startsWith('image/') && (
                  <div className="mb-4">
                    <PhotoMetadata imageUrl={selectedMedia.url || selectedMedia.originalPath} />
                  </div>
                )}

                {/* Photo Comments */}
                {selectedMedia.id && (
                  <PhotoComments photoId={selectedMedia.id} />
                )}
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
