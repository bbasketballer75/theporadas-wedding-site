import Image from 'next/image';
import { useState, useEffect, useCallback, useMemo } from 'react';

import SectionTransition from '../SectionTransition';

export default function EngagementGallerySection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Engagement photos - real photos from proposal
  const engagementPhotos = useMemo(
    () => [
      {
        id: 1,
        src: '/images/engagement/PoradaProposal-11.webp',
        alt: 'Austin and Jordyn engagement photo 1',
        caption: 'The Perfect Moment',
      },
      {
        id: 2,
        src: '/images/engagement/PoradaProposal-28.webp',
        alt: 'Austin and Jordyn engagement photo 2',
        caption: 'Pure Joy!',
      },
      {
        id: 3,
        src: '/images/engagement/PoradaProposal-146.webp',
        alt: 'Austin and Jordyn engagement photo 3',
        caption: 'Celebrating Our Love',
      },
      {
        id: 4,
        src: '/images/engagement/PoradaProposal-156.webp',
        alt: 'Austin and Jordyn engagement photo 4',
        caption: 'Forever Starts Now',
      },
      {
        id: 5,
        src: '/images/engagement/PoradaProposal-198.webp',
        alt: 'Austin and Jordyn engagement photo 5',
        caption: 'Our Adventure Begins',
      },
      {
        id: 6,
        src: '/images/engagement/PoradaProposal-255.webp',
        alt: 'Austin and Jordyn engagement photo 6',
        caption: 'She Said Yes!',
      },
      {
        id: 7,
        src: '/images/engagement/PoradaProposal-268.webp',
        alt: 'Austin and Jordyn engagement photo 7',
        caption: 'So Happy Together',
      },
      {
        id: 8,
        src: '/images/engagement/PoradaProposal-286.webp',
        alt: 'Austin and Jordyn engagement photo 8',
        caption: 'Beautiful Memories',
      },
      {
        id: 9,
        src: '/images/engagement/PoradaProposal-316.webp',
        alt: 'Austin and Jordyn engagement photo 9',
        caption: 'Love in the Air',
      },
      {
        id: 10,
        src: '/images/engagement/PoradaProposal-359.webp',
        alt: 'Austin and Jordyn engagement photo 10',
        caption: 'Perfect Day',
      },
      {
        id: 11,
        src: '/images/engagement/PoradaProposal-421.webp',
        alt: 'Austin and Jordyn engagement photo 11',
        caption: 'Engaged!',
      },
      {
        id: 12,
        src: '/images/engagement/PoradaProposal-482.webp',
        alt: 'Austin and Jordyn engagement photo 12',
        caption: 'Forever Love',
      },
    ],
    []
  );

  const openLightbox = (photo) => {
    setSelectedImage(photo);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
  };

  const navigateImage = useCallback(
    (direction) => {
      const currentIndex = engagementPhotos.findIndex((p) => p.id === selectedImage?.id);
      let newIndex;

      if (direction === 'next') {
        newIndex = (currentIndex + 1) % engagementPhotos.length;
      } else {
        newIndex = (currentIndex - 1 + engagementPhotos.length) % engagementPhotos.length;
      }

      setSelectedImage(engagementPhotos[newIndex]);
    },
    [selectedImage, engagementPhotos]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navigateImage('next');
      if (e.key === 'ArrowLeft') navigateImage('prev');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, navigateImage]);

  return (
    <section
      id="engagement"
      className="section-elegant bg-gradient-to-br from-blush-50 via-ivory to-blush-50"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <SectionTransition>
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center items-center mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-blush-500 to-transparent"></div>
              <div className="mx-4 text-4xl">💍</div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-blush-500 to-transparent"></div>
            </div>
            <h2 className="font-display text-5xl md:text-7xl text-gradient-elegant mb-4">
              Our Engagement
            </h2>
            <p className="text-xl text-charcoal/70 max-w-2xl mx-auto leading-relaxed">
              Where our forever began - relive the moment we said yes to a lifetime together
            </p>
          </div>
        </SectionTransition>

        {/* Photo Grid - Modern Masonry Layout */}
        <SectionTransition>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {engagementPhotos.map((photo, index) => (
              <div
                key={photo.id}
                className={`
                  group relative overflow-hidden rounded-2xl cursor-pointer
                  transform transition-all duration-500 hover:scale-105 hover:shadow-2xl
                  ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}
                  ${index === 3 ? 'md:row-span-2' : ''}
                `}
                onClick={() => openLightbox(photo)}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />

                  {/* Overlay with Caption */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p className="text-white font-semibold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {photo.caption}
                    </p>
                  </div>

                  {/* Click indicator */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg
                      className="w-5 h-5 text-charcoal"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionTransition>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
            aria-label="Close lightbox"
          >
            &times;
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('prev');
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300 transition-colors z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
            aria-label="Previous image"
          >
            ‹
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('next');
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300 transition-colors z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
            aria-label="Next image"
          >
            ›
          </button>

          {/* Image Container */}
          <div className="max-w-6xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
            <div className="relative max-w-full max-h-[90vh]">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={1920}
                height={1080}
                className="rounded-lg object-contain"
                style={{ maxWidth: '100%', maxHeight: '90vh', width: 'auto', height: 'auto' }}
                priority
                quality={95}
              />
            </div>

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
              <p className="text-white text-xl font-semibold text-center">
                {selectedImage.caption}
              </p>
              <p className="text-white/70 text-sm text-center mt-2">
                {engagementPhotos.findIndex((p) => p.id === selectedImage.id) + 1} /{' '}
                {engagementPhotos.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
