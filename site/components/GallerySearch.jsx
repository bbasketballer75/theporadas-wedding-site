/**
 * Gallery Search and Filter Component
 * Allows guests to search and filter photos by date, category, and keywords
 */

import { useState, useMemo } from 'react';

export default function GallerySearch({ photos = [], onFilteredPhotos }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  // Extract unique categories from photos
  const categories = useMemo(() => {
    const cats = new Set(['all']);
    photos.forEach((photo) => {
      if (photo.category) cats.add(photo.category);
    });
    return Array.from(cats);
  }, [photos]);

  // Filter and sort photos
  const filteredPhotos = useMemo(() => {
    let filtered = [...photos];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (photo) =>
          photo.name?.toLowerCase().includes(term) ||
          photo.description?.toLowerCase().includes(term) ||
          photo.category?.toLowerCase().includes(term)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((photo) => photo.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.createdAt || b.uploadedAt) - new Date(a.createdAt || a.uploadedAt);
        case 'date-asc':
          return new Date(a.createdAt || a.uploadedAt) - new Date(b.createdAt || b.uploadedAt);
        case 'name-asc':
          return (a.name || '').localeCompare(b.name || '');
        case 'name-desc':
          return (b.name || '').localeCompare(a.name || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [photos, searchTerm, selectedCategory, sortBy]);

  // Update parent component
  useMemo(() => {
    if (onFilteredPhotos) {
      onFilteredPhotos(filteredPhotos);
    }
  }, [filteredPhotos, onFilteredPhotos]);

  return (
    <div className="gallery-search">
      <div className="search-bar">
        <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search photos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="clear-button">
            ✕
          </button>
        )}
      </div>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort">Sort by:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="date-desc">Date (Newest First)</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
          </select>
        </div>
      </div>

      <div className="results-count">
        Showing {filteredPhotos.length} of {photos.length} photos
      </div>

      <style jsx>{`
        .gallery-search {
          margin-bottom: 2rem;
          background: white;
          padding: 1.5rem;
          border-radius: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .search-bar {
          position: relative;
          margin-bottom: 1rem;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 1.25rem;
          height: 1.25rem;
          color: #9ca3af;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 3rem 0.75rem 3rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .clear-button {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: #e5e7eb;
          border: none;
          border-radius: 50%;
          width: 1.5rem;
          height: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .clear-button:hover {
          background: #d1d5db;
        }

        .filters {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filter-group label {
          font-weight: 500;
          color: #4b5563;
        }

        .filter-select {
          padding: 0.5rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-select:focus {
          outline: none;
          border-color: #667eea;
        }

        .results-count {
          font-size: 0.9rem;
          color: #6b7280;
          text-align: center;
        }

        @media (max-width: 768px) {
          .filters {
            flex-direction: column;
          }

          .filter-group {
            width: 100%;
          }

          .filter-select {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}
