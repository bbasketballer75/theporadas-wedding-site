/**
 * Upload Progress Component
 * Display progress bar for photo uploads
 */

import { useState, useEffect } from 'react';

export default function UploadProgress({ uploads = [] }) {
  return (
    <div className="upload-progress-container">
      {uploads.map((upload) => (
        <UploadItem key={upload.id} upload={upload} />
      ))}

      <style jsx>{`
        .upload-progress-container {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 400px;
          max-width: 90vw;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          z-index: 1000;
        }

        @media (max-width: 768px) {
          .upload-progress-container {
            bottom: 1rem;
            right: 1rem;
            left: 1rem;
            width: auto;
          }
        }
      `}</style>
    </div>
  );
}

function UploadItem({ upload }) {
  const [progress, setProgress] = useState(upload.progress || 0);
  const [status, setStatus] = useState(upload.status || 'uploading');

  useEffect(() => {
    setProgress(upload.progress || 0);
    setStatus(upload.status || 'uploading');
  }, [upload.progress, upload.status]);

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      default:
        return (
          <svg className="spinner" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        );
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return '#10b981';
      case 'error':
        return '#ef4444';
      default:
        return '#667eea';
    }
  };

  return (
    <div className={`upload-item ${status}`}>
      <div className="upload-header">
        <div className="file-info">
          <div className="status-icon">{getStatusIcon()}</div>
          <div className="file-details">
            <div className="file-name">{upload.fileName}</div>
            <div className="file-size">
              {status === 'uploading' && `${progress}% • `}
              {formatBytes(upload.fileSize)}
            </div>
          </div>
        </div>
        {status === 'uploading' && (
          <button className="cancel-button" aria-label="Cancel upload">
            ✕
          </button>
        )}
      </div>

      {status === 'uploading' && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}

      {status === 'error' && upload.error && (
        <div className="error-message">{upload.error}</div>
      )}

      <style jsx>{`
        .upload-item {
          background: white;
          border-radius: 0.75rem;
          padding: 1rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .upload-item.success {
          border-left: 4px solid #10b981;
        }

        .upload-item.error {
          border-left: 4px solid #ef4444;
        }

        .upload-item.uploading {
          border-left: 4px solid #667eea;
        }

        .upload-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }

        .file-info {
          display: flex;
          gap: 0.75rem;
          flex: 1;
        }

        .status-icon {
          width: 2rem;
          height: 2rem;
          flex-shrink: 0;
          color: ${getStatusColor()};
        }

        .status-icon svg {
          width: 100%;
          height: 100%;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .file-details {
          flex: 1;
          min-width: 0;
        }

        .file-name {
          font-weight: 600;
          color: #1f2937;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-size {
          font-size: 0.85rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        .cancel-button {
          background: #f3f4f6;
          border: none;
          border-radius: 50%;
          width: 1.75rem;
          height: 1.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease;
          color: #6b7280;
          flex-shrink: 0;
        }

        .cancel-button:hover {
          background: #e5e7eb;
        }

        .progress-bar {
          height: 0.5rem;
          background: #e5e7eb;
          border-radius: 0.25rem;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          transition: width 0.3s ease;
          border-radius: 0.25rem;
        }

        .error-message {
          margin-top: 0.5rem;
          color: #ef4444;
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Usage example with Firebase Storage upload
 */
export function useUploadProgress() {
  const [uploads, setUploads] = useState([]);

  const addUpload = (id, fileName, fileSize) => {
    setUploads((prev) => [
      ...prev,
      {
        id,
        fileName,
        fileSize,
        progress: 0,
        status: 'uploading',
      },
    ]);
  };

  const updateProgress = (id, progress) => {
    setUploads((prev) =>
      prev.map((upload) =>
        upload.id === id ? { ...upload, progress: Math.round(progress) } : upload
      )
    );
  };

  const setSuccess = (id) => {
    setUploads((prev) => prev.map((upload) => (upload.id === id ? { ...upload, status: 'success' } : upload)));

    // Auto-remove after 3 seconds
    setTimeout(() => {
      setUploads((prev) => prev.filter((upload) => upload.id !== id));
    }, 3000);
  };

  const setError = (id, error) => {
    setUploads((prev) =>
      prev.map((upload) => (upload.id === id ? { ...upload, status: 'error', error } : upload))
    );

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setUploads((prev) => prev.filter((upload) => upload.id !== id));
    }, 5000);
  };

  const cancelUpload = (id) => {
    setUploads((prev) => prev.filter((upload) => upload.id !== id));
  };

  return {
    uploads,
    addUpload,
    updateProgress,
    setSuccess,
    setError,
    cancelUpload,
  };
}
