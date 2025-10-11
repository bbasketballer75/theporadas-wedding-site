/**
 * Favorite Photos Component
 * Allow guests to favorite photos and export their collection
 */

import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'theporadas_favorite_photos';

export default function FavoritePhotos({ photos = [] }) {
  const [favorites, setFavorites] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (err) {
        console.error('Error loading favorites:', err);
      }
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (photoId) => {
    setFavorites((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId]
    );
  };

  const exportFavorites = () => {
    const favoritePhotos = photos.filter((photo) => favorites.includes(photo.id));
    
    if (favoritePhotos.length === 0) {
      alert('No favorite photos to export');
      return;
    }

    // Create text file with photo URLs
    const text = favoritePhotos
      .map((photo, index) => `${index + 1}. ${photo.name || 'Untitled'}\n${photo.url || photo.originalPath}`)
      .join('\n\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'favorite-wedding-photos.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredPhotos = showFavoritesOnly
    ? photos.filter((photo) => favorites.includes(photo.id))
    : photos;

  return (
    <div className="favorite-photos">
      <div className="favorites-header">
        <div className="favorites-info">
          <h3 className="favorites-title">
            {favorites.length} Favorite{favorites.length !== 1 ? 's' : ''}
          </h3>
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className="filter-button"
          >
            {showFavoritesOnly ? 'Show All Photos' : 'Show Favorites Only'}
          </button>
        </div>

        {favorites.length > 0 && (
          <button onClick={exportFavorites} className="export-button">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export List
          </button>
        )}
      </div>

      <div className="photos-grid">
        {filteredPhotos.map((photo) => (
          <div key={photo.id} className="photo-item">
            <img
              src={photo.thumbnailUrl || photo.url || photo.originalPath}
              alt={photo.name || 'Wedding photo'}
              className="photo-image"
            />
            <button
              onClick={() => toggleFavorite(photo.id)}
              className={`favorite-button ${favorites.includes(photo.id) ? 'favorited' : ''}`}
              aria-label={favorites.includes(photo.id) ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg viewBox="0 0 24 24" fill={favorites.includes(photo.id) ? 'currentColor' : 'none'} stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {showFavoritesOnly && filteredPhotos.length === 0 && (
        <div className="empty-state">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <p>No favorite photos yet</p>
          <p className="empty-hint">Click the heart icon on photos to add them to your favorites</p>
        </div>
      )}

      <style jsx>{`
        .favorite-photos {
          width: 100%;
        }

        .favorites-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .favorites-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .favorites-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
        }

        .filter-button,
        .export-button {
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filter-button {
          background: #f3f4f6;
          border: 2px solid #e5e7eb;
          color: #1f2937;
        }

        .filter-button:hover {
          background: #e5e7eb;
        }

        .export-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
        }

        .export-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .export-button svg {
          width: 1.25rem;
          height: 1.25rem;
        }

        .photos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
        }

        .photo-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .photo-item:hover {
          transform: translateY(-4px);
        }

        .photo-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .favorite-button {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: none;
          border-radius: 50%;
          width: 3rem;
          height: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #9ca3af;
        }

        .favorite-button:hover {
          background: white;
          transform: scale(1.1);
        }

        .favorite-button.favorited {
          color: #ef4444;
        }

        .favorite-button svg {
          width: 1.75rem;
          height: 1.75rem;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #9ca3af;
        }

        .empty-state svg {
          width: 4rem;
          height: 4rem;
          margin: 0 auto 1rem;
          opacity: 0.5;
        }

        .empty-state p {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
        }

        .empty-hint {
          font-size: 0.95rem;
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .favorites-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .photos-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Heart Icon Button (standalone component for individual photos)
 */
export function FavoriteButton({ photoId, className = '' }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (saved) {
      try {
        const favorites = JSON.parse(saved);
        setIsFavorite(favorites.includes(photoId));
      } catch (err) {
        console.error('Error loading favorites:', err);
      }
    }
  }, [photoId]);

  const toggleFavorite = () => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    let favorites = [];
    
    if (saved) {
      try {
        favorites = JSON.parse(saved);
      } catch (err) {
        console.error('Error parsing favorites:', err);
      }
    }

    if (favorites.includes(photoId)) {
      favorites = favorites.filter((id) => id !== photoId);
      setIsFavorite(false);
    } else {
      favorites.push(photoId);
      setIsFavorite(true);
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`favorite-icon-button ${isFavorite ? 'favorited' : ''} ${className}`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>

      <style jsx>{`
        .favorite-icon-button {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: none;
          border-radius: 50%;
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #9ca3af;
        }

        .favorite-icon-button:hover {
          background: white;
          transform: scale(1.1);
        }

        .favorite-icon-button.favorited {
          color: #ef4444;
        }

        .favorite-icon-button svg {
          width: 1.5rem;
          height: 1.5rem;
        }
      `}</style>
    </button>
  );
}
