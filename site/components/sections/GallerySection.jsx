import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';

import SectionTransition from '../SectionTransition';
import YouTubePlayer from '../YouTubePlayer';

const GalleryDisplay = dynamic(() => import('../GalleryDisplay'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-3xl shadow-2xl p-12 text-center text-gray-600">
      Loading gallery…
    </div>
  ),
});

export default function GallerySection() {
  const [filter, setFilter] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Wedding video chapters - ACTUAL timestamps from video
  const weddingChapters = [
    { title: 'Start', time: 0, description: 'Our story begins' }, // 0:00
    { title: 'Bachelor+ette Weekend', time: 44.64, description: 'Pre-wedding celebrations' }, // 0:44
    { title: '"Who Is It" Gameshow', time: 300.44, description: 'Fun and games with our guests' }, // 5:00
    {
      title: 'Words From Our Wedding Party',
      time: 863.36,
      description: 'Heartfelt messages from our friends',
    }, // 14:23
    { title: 'Our Vows', time: 1211, description: 'We promise forever' }, // 20:11
    { title: 'The Ceremony', time: 1537.88, description: 'We tie the knot' }, // 25:37
    { title: 'The Reception', time: 1688.92, description: 'Dinner and celebration begins' }, // 28:08
    { title: 'First Dance', time: 1814.88, description: 'Our first dance as husband and wife' }, // 30:14
    {
      title: 'Behind The Scenes & Bloopers',
      time: 2165.28,
      description: 'Outtakes and fun moments',
    }, // 36:05
    { title: 'The REAL Party', time: 2375.12, description: 'Dancing the night away' }, // 39:35
    { title: 'Thank You', time: 2643.24, description: 'Gratitude for our loved ones' }, // 44:03
    { title: 'One Final Clip...', time: 2683.84, description: 'A surprise ending' }, // 44:43
  ];

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

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="gallery"
      className="section-elegant bg-gradient-to-br from-ivory via-sage-50/20 to-ivory"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <SectionTransition>
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
              <div className="mx-4 text-4xl">📸</div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
            </div>
            <h2 className="font-display text-5xl md:text-7xl text-gradient-elegant mb-4">
              Wedding Gallery
            </h2>
            <p className="text-xl text-charcoal/70 max-w-2xl mx-auto leading-relaxed">
              Relive the magic of our special day through these beautiful photos and videos shared
              by our guests.
            </p>
          </div>
        </SectionTransition>

        {/* Wedding Video Section */}
        <SectionTransition>
          <div className="mb-16">
            <div className="card-elegant p-8 md:p-12">
              <div className="flex items-center justify-center mb-6">
                <h3 className="text-4xl font-display text-gradient-sage text-center">
                  🎬 Our Wedding Film
                </h3>
              </div>
              <p className="text-center text-charcoal/70 mb-6 max-w-2xl mx-auto">
                Watch the highlight reel of our unforgettable day
              </p>
              <YouTubePlayer
                videoId="ZOIRb_ghdh0"
                title="Austin & Jordyn Wedding Film"
                chapters={weddingChapters}
                showChapters={true}
              />
            </div>
          </div>
        </SectionTransition>

        {/* Filter Tabs */}
        <SectionTransition>
          <div className="flex justify-center mb-8">
            <div className="card-elegant p-2 inline-flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={
                    filter === f.id
                      ? 'btn-primary'
                      : 'px-6 py-3 rounded-xl font-semibold text-charcoal/70 hover:text-sage-600 hover:bg-sage-50 transition-all duration-300'
                  }
                >
                  <span className="mr-2">{f.icon}</span>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </SectionTransition>

        {/* Gallery Component */}
        <SectionTransition>
          <GalleryDisplay filter={filter} onMediaClick={handleMediaClick} />
        </SectionTransition>

        {/* Upload CTA */}
        <SectionTransition>
          <div className="mt-16 bg-gradient-to-r from-sage-500 via-blush-500 to-gold-500 rounded-3xl p-12 text-center shadow-elegant-lg">
            <h3 className="text-3xl font-display text-white mb-4">
              Have photos or videos to share?
            </h3>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Help us build our wedding album by uploading your favorite moments from our special
              day!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => scrollToSection('upload')}
                className="btn-accent cursor-pointer"
              >
                📤 Upload Your Photos
              </button>
              <button
                onClick={() => scrollToSection('timeline')}
                className="btn-secondary cursor-pointer"
              >
                ⏰ View Timeline
              </button>
            </div>
          </div>
        </SectionTransition>
      </div>

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
              <div className="relative max-w-full max-h-[90vh]">
                <Image
                  src={selectedMedia.originalPath}
                  alt="Full size gallery image"
                  width={1920}
                  height={1080}
                  className="rounded-lg object-contain"
                  style={{ maxWidth: '100%', maxHeight: '90vh', width: 'auto', height: 'auto' }}
                  priority
                  quality={95}
                  unoptimized={selectedMedia.originalPath?.includes('supabase')}
                />
              </div>
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
    </section>
  );
}
