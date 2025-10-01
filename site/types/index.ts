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
  thumbnailPath: string;
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
