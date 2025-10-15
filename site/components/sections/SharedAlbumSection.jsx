import { useState } from 'react';
import Image from 'next/image';
import SectionTransition from '../SectionTransition';

/**
 * Shared Album Section
 * Guest photo/video upload and gallery display
 */
export default function SharedAlbumSection() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Placeholder guest-uploaded photos (will connect to Firebase Storage)
  const guestPhotos = [
    {
      id: 1,
      src: '/images/guest-photos/photo1.jpg',
      uploader: 'Sarah & Mike',
      caption: 'Beautiful ceremony! ❤️',
      type: 'photo',
    },
    {
      id: 2,
      src: '/images/guest-photos/photo2.jpg',
      uploader: 'The Johnson Family',
      caption: 'Amazing reception!',
      type: 'photo',
    },
    {
      id: 3,
      src: '/images/guest-photos/photo3.jpg',
      uploader: 'Emily',
      caption: 'Love this moment 💕',
      type: 'photo',
    },
    {
      id: 4,
      src: '/images/guest-photos/video1.jpg',
      uploader: 'Chris & Amy',
      caption: 'First dance video',
      type: 'video',
      videoUrl: '/videos/guest-videos/video1.mp4',
    },
    {
      id: 5,
      src: '/images/guest-photos/photo4.jpg',
      uploader: 'David',
      caption: 'Cheers to the newlyweds!',
      type: 'photo',
    },
    {
      id: 6,
      src: '/images/guest-photos/photo5.jpg',
      uploader: 'Jessica & Tom',
      caption: 'What a night! 🎉',
      type: 'photo',
    },
  ];

  // File upload handler (will integrate with Firebase Storage)
  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress (replace with actual Firebase upload)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
            alert('Upload successful! Thank you for sharing.');
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Lightbox navigation
  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % guestPhotos.length);
  };

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + guestPhotos.length) % guestPhotos.length);
  };

  return (
    <section
      id="shared-album"
      className="section-elegant bg-gradient-to-br from-blush-50/30 via-ivory to-sage-50/30"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <SectionTransition>
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center items-center mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-blush-500 to-transparent"></div>
              <div className="mx-4 text-4xl">📸</div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-blush-500 to-transparent"></div>
            </div>
            <h2 className="font-display text-5xl md:text-7xl text-gradient-elegant mb-4">
              Shared Wedding Album
            </h2>
            <p className="text-xl text-charcoal/70 max-w-2xl mx-auto leading-relaxed">
              Upload your photos and videos from our special day! See what moments our guests
              captured.
            </p>
          </div>
        </SectionTransition>

        {/* Upload Area */}
        <SectionTransition>
          <div className="card-elegant p-8 max-w-3xl mx-auto mb-12">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">☁️</div>
              <h3 className="text-2xl font-display text-gradient-sage mb-2">
                Share Your Memories
              </h3>
              <p className="text-charcoal/70">Upload photos or videos (max 50MB per file)</p>
            </div>

            {/* Upload Button */}
            <label
              htmlFor="file-upload"
              className="group relative block cursor-pointer overflow-hidden"
            >
              <div
                className="
                border-3 border-dashed border-sage-300 rounded-2xl p-12
                bg-gradient-to-br from-sage-50/50 to-blush-50/50
                hover:from-sage-100/70 hover:to-blush-100/70
                transition-all duration-300
                hover:border-sage-400 hover:shadow-lg
              "
              >
                <div className="text-center">
                  <svg
                    className="mx-auto h-16 w-16 text-sage-400 group-hover:text-sage-600 transition-colors duration-300"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="mt-4 text-lg font-semibold text-charcoal">
                    Click to upload or drag and drop
                  </p>
                  <p className="mt-2 text-sm text-charcoal/60">
                    Photos (PNG, JPG, HEIC) or Videos (MP4, MOV)
                  </p>
                </div>
              </div>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                accept="image/*,video/*"
                multiple
                className="sr-only"
                onChange={handleFileUpload}
              />
            </label>

            {/* Upload Progress */}
            {isUploading && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-charcoal">Uploading...</span>
                  <span className="text-sm font-medium text-sage-600">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-sage-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-sage-500 to-sage-600 h-3 rounded-full transition-all duration-300 animate-pulse"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </SectionTransition>

        {/* Photo Gallery */}
        <SectionTransition>
          <div className="mb-8">
            <h3 className="text-3xl font-display text-center text-gradient-blush mb-8">
              Guest Memories ({guestPhotos.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {guestPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  onClick={() => openLightbox(index)}
                  className="group relative aspect-square overflow-hidden rounded-2xl shadow-elegant cursor-pointer bg-gradient-to-br from-ivory to-blush-50"
                >
                  {/* Photo/Video Thumbnail */}
                  <Image
                    src={photo.src}
                    alt={photo.caption}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Video Indicator */}
                  {photo.type === 'video' && (
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      VIDEO
                    </div>
                  )}

                  {/* Hover Overlay with Caption */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <p className="text-white font-semibold text-sm">{photo.uploader}</p>
                    <p className="text-white/80 text-xs">{photo.caption}</p>
                  </div>

                  {/* Click indicator */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {photo.type === 'video' ? (
                      <svg
                        className="w-16 h-16 text-white drop-shadow-lg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-12 h-12 text-white drop-shadow-lg"
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
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionTransition>

        {/* Lightbox Modal */}
        {lightboxOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gold-400 transition-colors z-50"
              aria-label="Close"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevPhoto();
              }}
              className="absolute left-4 text-white hover:text-gold-400 transition-colors z-50"
              aria-label="Previous"
            >
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextPhoto();
              }}
              className="absolute right-4 text-white hover:text-gold-400 transition-colors z-50"
              aria-label="Next"
            >
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Image/Video Container */}
            <div className="relative max-w-6xl max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
              {guestPhotos[currentIndex].type === 'video' ? (
                <video
                  src={guestPhotos[currentIndex].videoUrl}
                  controls
                  autoPlay
                  className="max-h-[80vh] max-w-full rounded-lg"
                />
              ) : (
                <div className="relative">
                  <Image
                    src={guestPhotos[currentIndex].src}
                    alt={guestPhotos[currentIndex].caption}
                    width={1200}
                    height={800}
                    className="max-h-[80vh] w-auto rounded-lg"
                  />
                </div>
              )}

              {/* Caption */}
              <div className="mt-4 text-center text-white">
                <p className="font-semibold text-lg">{guestPhotos[currentIndex].uploader}</p>
                <p className="text-white/80">{guestPhotos[currentIndex].caption}</p>
                <p className="text-white/60 text-sm mt-2">
                  {currentIndex + 1} / {guestPhotos.length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
