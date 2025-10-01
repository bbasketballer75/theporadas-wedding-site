import Image from 'next/image';
import { useState } from 'react';

// ImageGallery component for displaying photo collections
// Supports grid layout, lightbox modal, and responsive sizing
export default function ImageGallery({ images = [], columns = 3 }) {
  const [selectedImage, setSelectedImage] = useState(null);

  // Define grid columns based on prop
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const gridClass = gridCols[columns] || gridCols[3];

  // Close lightbox modal
  const closeLightbox = () => setSelectedImage(null);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeLightbox();
  };

  return (
    <>
      {/* Image Grid */}
      <div className={`grid ${gridClass} gap-6`}>
        {images.map((image, index) => (
          <div
            key={image.id || index}
            className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedImage(image)}
          >
            {/* Image Container */}
            <div className="aspect-square relative">
              {image.url ? (
                <Image
                  src={image.url}
                  alt={image.caption || `Gallery image ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                // Placeholder for images without URL
                <div className="w-full h-full bg-gradient-to-br from-mint via-cream to-blush/30 flex items-center justify-center">
                  <span className="text-6xl">📷</span>
                </div>
              )}
            </div>

            {/* Caption Overlay */}
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="font-body text-white text-sm">{image.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-2xl transition-colors"
            onClick={closeLightbox}
            aria-label="Close"
          >
            ×
          </button>

          {/* Image */}
          <div className="max-w-5xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
            {selectedImage.url ? (
              <div className="relative w-full h-full">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.caption || 'Gallery image'}
                  width={1200}
                  height={800}
                  className="object-contain max-h-[80vh] w-auto mx-auto"
                />
              </div>
            ) : (
              <div className="w-96 h-96 bg-gradient-to-br from-mint via-cream to-blush/30 flex items-center justify-center rounded-2xl">
                <span className="text-9xl">📷</span>
              </div>
            )}

            {/* Caption */}
            {selectedImage.caption && (
              <div className="mt-4 text-center">
                <p className="font-body text-white text-lg">{selectedImage.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-16">
          <div className="w-32 h-32 bg-gradient-to-br from-mint via-cream to-blush/30 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-6xl">📸</span>
          </div>
          <p className="font-display text-2xl text-sage mb-2">No Photos Yet</p>
          <p className="font-body text-gray-600">Check back soon for beautiful memories!</p>
        </div>
      )}
    </>
  );
}
