import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

import Footer from '../components/Footer';
import GalleryDisplay from '../components/GalleryDisplay';
import Navigation from '../components/Navigation';
import PageTransition from '../components/PageTransition';
import VideoPlayer from '../components/VideoPlayer';

export default function Gallery() {
  const [filter, setFilter] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

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
          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <GalleryDisplay filter={filter} onMediaClick={handleMediaClick} />
          </div>

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

            <div className="max-w-6xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
              {selectedMedia.contentType?.startsWith('video') ? (
                <video
                  src={selectedMedia.originalPath}
                  controls
                  autoPlay
                  className="max-w-full max-h-[90vh] rounded-lg"
                />
              ) : (
                // eslint-disable-next-line next/no-img-element
                <img
                  src={selectedMedia.originalPath}
                  alt="Full size"
                  className="max-w-full max-h-[90vh] rounded-lg object-contain"
                />
              )}

              {/* Media Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <p className="text-white text-sm">
                  {selectedMedia.createdAt?.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </PageTransition>
  );
}
