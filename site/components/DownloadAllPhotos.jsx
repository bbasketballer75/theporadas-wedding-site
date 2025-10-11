/**
 * Download All Photos Component
 * Allows guests to download all wedding photos as a ZIP file
 */

import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function DownloadAllPhotos({ photos = [] }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const downloadAllPhotos = async () => {
    if (photos.length === 0) {
      alert('No photos available to download');
      return;
    }

    setIsDownloading(true);
    setProgress(0);

    try {
      const zip = new JSZip();
      const folder = zip.folder('theporadas-wedding-photos');

      // Download each photo
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        const response = await fetch(photo.url || photo.originalPath);
        const blob = await response.blob();

        // Generate filename
        const extension = blob.type.split('/')[1] || 'jpg';
        const filename = photo.name || `photo-${i + 1}.${extension}`;

        folder.file(filename, blob);

        // Update progress
        setProgress(Math.round(((i + 1) / photos.length) * 100));
      }

      // Generate ZIP file
      const content = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
      });

      // Save ZIP file
      saveAs(content, 'theporadas-wedding-photos.zip');

      setProgress(100);
      setTimeout(() => {
        setIsDownloading(false);
        setProgress(0);
      }, 2000);
    } catch (error) {
      console.error('Error downloading photos:', error);
      alert('Failed to download photos. Please try again.');
      setIsDownloading(false);
      setProgress(0);
    }
  };

  return (
    <div className="download-all-container">
      <button
        onClick={downloadAllPhotos}
        disabled={isDownloading || photos.length === 0}
        className="download-all-button"
      >
        {isDownloading ? (
          <>
            <span className="spinner"></span>
            Downloading... {progress}%
          </>
        ) : (
          <>
            <svg
              className="download-icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download All Photos ({photos.length})
          </>
        )}
      </button>

      {isDownloading && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      <style jsx>{`
        .download-all-container {
          margin: 2rem 0;
        }

        .download-all-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .download-all-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .download-all-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .download-icon {
          width: 1.5rem;
          height: 1.5rem;
        }

        .spinner {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .progress-bar {
          width: 100%;
          height: 0.5rem;
          background: #e2e8f0;
          border-radius: 0.25rem;
          margin-top: 1rem;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          transition: width 0.3s ease;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
