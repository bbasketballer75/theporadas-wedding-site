import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';
import { db } from '../lib/firebase';
import { compressImage } from '../lib/imageCompression';
import { supabase } from '../lib/supabase';
import { compressVideo } from '../lib/videoCompression';

import Button from './Button';

/**
 * PhotoUpload Component
 * Allows guests to upload photos/videos to shared wedding album
 * Core feature for post-wedding website (2025 requirement)
 *
 * NOW USES SUPABASE (FREE - no billing required!)
 *
 * Supports:
 * - Image uploads (JPEG, PNG, WebP, HEIC)
 * - Video uploads (MP4, MOV, AVI)
 * - Progress tracking
 * - Error handling
 * - File size validation (max 50MB - Supabase free tier)
 */
export default function PhotoUpload({ onUploadComplete, onUploadError }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB (Supabase free tier limit)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file size (50MB for Supabase free tier)
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('File too large. Maximum size is 50MB.');
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
    setProgress(10);

    try {
      let uploadFile = file;

      // OPTIMIZE IMAGE BEFORE UPLOAD
      if (file.type.startsWith('image/')) {
        setProgress(15);
        console.log('[PhotoUpload] Compressing image...');
        uploadFile = await compressImage(file);
        setProgress(25);
      }
      // OPTIMIZE VIDEO BEFORE UPLOAD
      else if (file.type.startsWith('video/')) {
        console.log('[PhotoUpload] Compressing video...');
        uploadFile = await compressVideo(file, (videoProgress) => {
          // Map video compression progress (0-100) to upload progress (10-25)
          setProgress(10 + videoProgress * 0.15);
        });
        setProgress(25);
      } else {
        setProgress(25);
      }

      // Generate unique filename
      const timestamp = Date.now();
      const fileExt = uploadFile.name.split('.').pop();
      const fileName = `${timestamp}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      setProgress(30);

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('wedding-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      setProgress(70);

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('wedding-photos')
        .getPublicUrl(filePath);

      setProgress(80);

      // SAVE METADATA TO FIRESTORE
      // This triggers Firebase Function for video processing
      const isVideo = file.type.startsWith('video/');
      const uploadMetadata = {
        url: publicUrlData.publicUrl,
        name: file.name,
        type: uploadFile.type,
        size: uploadFile.size,
        originalSize: file.size,
        path: filePath,
        compressed: file.type.startsWith('image/') || isVideo,
        compressionSavings: file.type.startsWith('image/')
          ? `${(((file.size - uploadFile.size) / file.size) * 100).toFixed(1)}%`
          : isVideo && uploadFile.size !== file.size
            ? `${(((file.size - uploadFile.size) / file.size) * 100).toFixed(1)}%`
            : null,
        timestamp: serverTimestamp(),
        uploadStatus: isVideo ? 'pending' : 'completed', // Videos trigger YouTube upload
      };

      // If video, add placeholder fields for YouTube processing
      if (isVideo) {
        uploadMetadata.youtubeId = null;
        uploadMetadata.youtubeUrl = null;
        uploadMetadata.processingStartedAt = null;
        uploadMetadata.processedAt = null;
      }

      console.log('[PhotoUpload] Saving metadata to Firestore...');
      const docRef = await addDoc(collection(db, 'wedding-photos'), uploadMetadata);
      console.log('[PhotoUpload] Firestore document created:', docRef.id);

      if (isVideo) {
        console.log(
          '[PhotoUpload] Video will be automatically uploaded to YouTube by Firebase Function'
        );
      }

      setProgress(100);

      // Callback with upload details (include Firestore doc ID)
      onUploadComplete?.({
        ...uploadMetadata,
        firestoreId: docRef.id,
      });

      // Reset state
      setFile(null);
      setProgress(0);
      setUploading(false);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed. Please try again.');
      setUploading(false);
      setProgress(0);
      onUploadError?.(err);
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
            <p className="text-xs text-gray-500">Images or videos (Max 50MB - Supabase Free)</p>
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
