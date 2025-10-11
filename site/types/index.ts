/**
 * Type definitions for The Poradas Wedding Site
 * Phase 3A: TypeScript Migration
 */

/**
 * Represents a map pin (special memory location)
 */
export interface Pin {
  id: string;
  lat: number;
  lng: number;
  message?: string;
  createdAt: Date;
}

/**
 * Represents a photo/video in the gallery
 */
export interface GalleryItem {
  id: string;
  originalPath: string;
  thumbnailPath?: string; // Optional: not all items have thumbnails
  contentType: string;
  createdAt: Date;
  uploadedBy?: string;
}

/**
 * Standard response from Server Actions
 */
export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Firebase configuration
 */
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

/**
 * Timeline event data
 */
export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  image?: string;
}

/**
 * Button component props
 */
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'sage' | 'blush';
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

/**
 * Photo upload component props
 */
export interface PhotoUploadProps {
  onUploadComplete?: (item: GalleryItem) => void;
  onUploadError?: (error: string) => void;
}

/**
 * Video player component props
 */
export interface VideoPlayerProps {
  videoId: string;
  title?: string;
  autoplay?: boolean;
  className?: string;
}

/**
 * Skeleton component props
 */
export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

/**
 * Scroll reveal component props
 */
export interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * Timeline card component props
 */
export interface TimelineCardProps {
  event: TimelineEvent;
  index: number;
}

/**
 * Photo/Media item from Firestore 'wedding-photos' collection (Extended)
 */
export interface Photo extends GalleryItem {
  url: string;
  name: string;
  type: string; // MIME type: 'image/jpeg', 'video/mp4', etc.
  size: number; // File size in bytes
  originalSize?: number; // Original file size before compression
  path: string; // Supabase storage path
  compressed?: boolean;
  compressionSavings?: string; // Percentage saved: "45.2%"
  timestamp: FirebaseTimestamp;
  uploadStatus?: 'pending' | 'processing' | 'completed' | 'queued' | 'failed';
  uploadError?: string;
  
  // Video-specific fields
  youtubeId?: string | null;
  youtubeUrl?: string | null;
  processingStartedAt?: FirebaseTimestamp | null;
  processedAt?: FirebaseTimestamp | null;
  thumbnailUrl?: string;
  thumbnailPath?: string;
  thumbnailSize?: number;
}

/**
 * Comment on a photo from Firestore 'photoComments/{photoId}/comments' collection
 */
export interface Comment {
  id: string;
  photoId: string;
  guestName: string;
  comment: string;
  timestamp: FirebaseTimestamp;
}

/**
 * Upload progress tracking for UploadProgress component
 */
export interface Upload {
  file: File;
  progress: number; // 0-100
  status: 'uploading' | 'complete' | 'error';
  error?: string;
}

/**
 * Favorite photo stored in localStorage
 */
export interface Favorite {
  photoId: string;
  addedAt: string; // ISO date string
  photoUrl?: string;
  photoName?: string;
}

/**
 * Video chapter marker for VideoChapters component
 */
export interface Chapter {
  id: string;
  title: string;
  time: number; // Seconds from start
  icon?: string; // Emoji icon
}

/**
 * Gallery search/filter criteria from GallerySearch component
 */
export interface GalleryFilter {
  searchTerm: string;
  selectedDate?: string; // ISO date string or empty
  selectedCategory: 'all' | 'photos' | 'videos';
  sortBy: 'date' | 'name';
}

/**
 * Firebase Timestamp type (from Firestore)
 */
export interface FirebaseTimestamp {
  toDate(): Date;
  toMillis(): number;
  seconds: number;
  nanoseconds: number;
}

/**
 * Social share platform for SocialShare component
 */
export type SharePlatform = 'facebook' | 'twitter' | 'whatsapp' | 'linkedin' | 'email' | 'copy';

/**
 * Web Vitals metric for performance monitoring
 */
export interface WebVital {
  id: string;
  name: 'FCP' | 'LCP' | 'CLS' | 'FID' | 'TTFB' | 'INP';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  navigationType: 'navigate' | 'reload' | 'back-forward' | 'back-forward-cache';
}
