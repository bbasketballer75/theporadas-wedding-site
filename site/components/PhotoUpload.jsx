import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useState } from 'react';

import Button from './Button';

/**
 * PhotoUpload Component
 * Allows guests to upload photos/videos to shared wedding album
 * Core feature for post-wedding website (2025 requirement)
 *
 * Supports:
 * - Image uploads (JPEG, PNG, WebP, HEIC)
 * - Video uploads (MP4, MOV, AVI)
 * - Progress tracking
 * - Error handling
 * - File size validation (max 100MB)
 */
export default function PhotoUpload({ onUploadComplete, onUploadError }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('File too large. Maximum size is 100MB.');
      return;
    }

    // Validate file type
    const validTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/heic',
      'video/mp4',
      'video/quicktime',
      'video/x-msvideo',
    ];

    if (!validTypes.includes(selectedFile.type)) {
      setError('Invalid file type. Please upload an image or video.');
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file || uploading) return;

    setUploading(true);
    setError(null);

    try {
      const storage = getStorage();
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storagePath = `uploads/${timestamp}-${sanitizedName}`;
      const storageRef = ref(storage, storagePath);

      const uploadTask = uploadBytesResumable(storageRef, file, {
        contentType: file.type,
        customMetadata: {
          uploadedAt: new Date().toISOString(),
          originalName: file.name,
        },
      });

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(prog);
        },
        (uploadError) => {
          console.error('Upload error:', uploadError);
          setError(uploadError.message || 'Upload failed. Please try again.');
          setUploading(false);
          onUploadError?.(uploadError);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            onUploadComplete?.({
              url: downloadURL,
              name: file.name,
              type: file.type,
              size: file.size,
              path: storagePath,
            });

            // Reset state
            setFile(null);
            setProgress(0);
            setUploading(false);
          } catch (getUrlError) {
            console.error('Failed to get download URL:', getUrlError);
            setError('Failed to get download URL');
            setUploading(false);
          }
        }
      );
    } catch (err) {
      console.error('Upload initialization error:', err);
      setError(err.message || 'Failed to start upload');
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl shadow-blush/20 p-8">
      <h3 className="font-display text-3xl text-sage mb-4">Share Your Photos & Videos</h3>
      <p className="font-body text-gray-600 mb-6">
        Help us relive the special day by uploading your favorite moments!
      </p>

      {/* File Input */}
      <div className="mb-6">
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-sage/30 rounded-2xl cursor-pointer hover:border-sage/60 hover:bg-mint/20 transition-all duration-300"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-12 h-12 mb-4 text-sage"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-600">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">Images or videos (Max 100MB)</p>
          </div>
          <input
            id="file-upload"
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Selected File Info */}
      {file && (
        <div className="mb-6 p-4 bg-cream/50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1 min-w-0">
              <p className="font-body text-sage font-semibold truncate">{file.name}</p>
              <p className="text-sm text-gray-600">
                {formatFileSize(file.size)} · {file.type.split('/')[0]}
              </p>
            </div>
            {!uploading && (
              <button
                onClick={() => setFile(null)}
                className="ml-4 text-blush hover:text-sage transition-colors"
                aria-label="Remove file"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="space-y-2">
              <div className="w-full bg-cream rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-sage to-blush h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-sage text-center font-medium">Uploading... {progress}%</p>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="font-body text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Upload Button */}
      <Button onClick={handleUpload} disabled={!file || uploading} variant="sage">
        {uploading ? `Uploading... ${progress}%` : 'Upload to Gallery'}
      </Button>

      {/* Info Text */}
      <p className="mt-4 text-xs text-gray-500 text-center">
        Your upload will be added to the shared wedding gallery. By uploading, you agree to share
        these memories with the wedding couple and guests.
      </p>
    </div>
  );
}
