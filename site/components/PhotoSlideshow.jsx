/**
 * Photo Slideshow Component
 * Fullscreen slideshow mode for viewing photos
 */

import { useState, useEffect, useCallback } from 'react';

export default function PhotoSlideshow({ photos = [], startIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [interval, setIntervalDuration] = useState(3000);

  // Navigate to next photo
  const nextPhoto = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  // Navigate to previous photo
  const prevPhoto = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Auto-advance slideshow
  useEffect(() => {
    if (isPlaying && photos.length > 1) {
      const timer = setTimeout(nextPhoto, interval);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isPlaying, interval, nextPhoto, photos.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          prevPhoto();
          break;
        case 'ArrowRight':
          nextPhoto();
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying((prev) => !prev);
          break;
        case 'Escape':
          onClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextPhoto, prevPhoto, onClose]);

  if (!photos || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <div className="slideshow-overlay">
      <button className="close-button" onClick={onClose} aria-label="Close slideshow">
        ✕
      </button>

      <div className="slideshow-content">
        <img
          src={currentPhoto.url || currentPhoto.originalPath}
          alt={currentPhoto.name || 'Wedding photo'}
          className="slideshow-image"
        />

        {currentPhoto.description && (
          <div className="photo-caption">{currentPhoto.description}</div>
        )}
      </div>

      <div className="slideshow-controls">
        <button onClick={prevPhoto} className="control-button" aria-label="Previous photo">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="control-button"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 9v6m4-6v6"
              />
            </svg>
          ) : (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7-7 7"
              />
            </svg>
          )}
        </button>

        <div className="photo-counter">
          {currentIndex + 1} / {photos.length}
        </div>

        <select
          value={interval}
          onChange={(e) => setIntervalDuration(Number(e.target.value))}
          className="speed-select"
        >
          <option value={2000}>Fast (2s)</option>
          <option value={3000}>Normal (3s)</option>
          <option value={5000}>Slow (5s)</option>
        </select>

        <button onClick={nextPhoto} className="control-button" aria-label="Next photo">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        .slideshow-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .close-button {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        .slideshow-content {
          max-width: 90vw;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .slideshow-image {
          max-width: 100%;
          max-height: 70vh;
          object-fit: contain;
          border-radius: 0.5rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .photo-caption {
          margin-top: 1rem;
          color: white;
          font-size: 1.1rem;
          text-align: center;
          max-width: 600px;
        }

        .slideshow-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 2rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 1rem 2rem;
          border-radius: 2rem;
          backdrop-filter: blur(10px);
        }

        .control-button {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 0.5rem;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .control-button:hover {
          transform: scale(1.2);
        }

        .control-button svg {
          width: 2rem;
          height: 2rem;
        }

        .photo-counter {
          color: white;
          font-size: 1.1rem;
          font-weight: 500;
          min-width: 80px;
          text-align: center;
        }

        .speed-select {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .speed-select option {
          background: #333;
          color: white;
        }

        @media (max-width: 768px) {
          .slideshow-controls {
            flex-wrap: wrap;
            justify-content: center;
          }

          .speed-select {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
