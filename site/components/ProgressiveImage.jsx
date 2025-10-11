/**
 * Progressive Image Loading with LQIP (Low Quality Image Placeholder)
 * Provides blur-up effect for better perceived performance
 */

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ProgressiveImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`progressive-image ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        placeholder="blur"
        blurDataURL={generateBlurDataURL(width, height)}
        onLoad={() => setIsLoaded(true)}
        className={`image ${isLoaded ? 'loaded' : ''}`}
        {...props}
      />

      <style jsx>{`
        .progressive-image {
          position: relative;
          overflow: hidden;
          background: #f3f4f6;
        }

        .image {
          transition:
            opacity 0.5s ease-in-out,
            filter 0.5s ease-in-out;
          opacity: 0;
          filter: blur(10px);
        }

        .image.loaded {
          opacity: 1;
          filter: blur(0);
        }
      `}</style>
    </div>
  );
}

/**
 * Generate a tiny blur placeholder
 * This creates a base64 encoded SVG with gradient
 */
function generateBlurDataURL(width, height) {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#e5e7eb;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#d1d5db;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#gradient)" />
    </svg>
  `;

  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * For images fetched from Firebase Storage or external sources,
 * use this component with automatic blur detection
 */
export function ProgressiveFirebaseImage({ src, alt, ...props }) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Preload the image
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      setIsLoading(false);
    };
    img.onerror = () => {
      setImageSrc('/images/placeholder.jpg');
      setIsLoading(false);
    };
  }, [src]);

  return (
    <div className="progressive-firebase-image">
      {isLoading && <div className="image-placeholder" />}
      <img src={imageSrc} alt={alt} className={`image ${!isLoading ? 'loaded' : ''}`} {...props} />

      <style jsx>{`
        .progressive-firebase-image {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .image-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 50%, #d1d5db 100%);
          background-size: 400% 400%;
          animation: shimmer 2s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          filter: blur(10px);
          transition:
            opacity 0.5s ease-in-out,
            filter 0.5s ease-in-out;
        }

        .image.loaded {
          opacity: 1;
          filter: blur(0);
        }
      `}</style>
    </div>
  );
}

/**
 * Gallery Grid with Progressive Loading
 * Example usage in gallery pages
 */
export function ProgressiveGalleryGrid({ photos = [] }) {
  return (
    <div className="progressive-gallery">
      {photos.map((photo, index) => (
        <div key={photo.id || index} className="gallery-item">
          <ProgressiveFirebaseImage
            src={photo.url || photo.originalPath}
            alt={photo.name || `Wedding photo ${index + 1}`}
          />
        </div>
      ))}

      <style jsx>{`
        .progressive-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
          padding: 1rem;
        }

        .gallery-item {
          aspect-ratio: 1;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .gallery-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        @media (max-width: 768px) {
          .progressive-gallery {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
