/**
 * Firebase Analytics Setup
 * Track page views, photo uploads, and gallery interactions
 *
 * Features:
 * - Automatic page view tracking
 * - Custom event tracking for uploads, downloads, moderation
 * - User engagement metrics
 * - Wedding-specific analytics
 *
 * Privacy: All analytics are anonymous and aggregated
 */

// Initialize Firebase Analytics
import { logEvent as firebaseLogEvent, getAnalytics } from 'firebase/analytics';

import { app } from './firebase';

let analytics = null;

/**
 * Initialize analytics (client-side only)
 */
export function initAnalytics() {
  if (typeof window !== 'undefined' && !analytics) {
    try {
      analytics = getAnalytics(app);
      // Analytics initialized successfully
    } catch (err) {
      // Analytics initialization failed
    }
  }
  return analytics;
}

/**
 * Log custom event
 * @param {string} eventName - Event name (use snake_case)
 * @param {Object} params - Event parameters
 */
export function logEvent(eventName, params = {}) {
  if (!analytics && typeof window !== 'undefined') {
    initAnalytics();
  }

  if (analytics) {
    try {
      firebaseLogEvent(analytics, eventName, params);
      // Event logged successfully (console removed for production)
    } catch (err) {
      // Event logging failed silently (console removed for production)
    }
  }
}

/**
 * Track page view
 * @param {string} pageTitle - Page title
 * @param {string} pagePath - Page path (optional)
 */
export function logPageView(pageTitle, pagePath = null) {
  logEvent('page_view', {
    page_title: pageTitle,
    page_path: pagePath || (typeof window !== 'undefined' ? window.location.pathname : '/'),
  });
}

/**
 * Track photo upload
 * @param {string} fileType - 'image' or 'video'
 * @param {number} fileSize - File size in bytes
 * @param {number} compressionSavings - Compression percentage (optional)
 * @param {string} uploaderName - Guest name
 */
export function logPhotoUpload(fileType, fileSize, compressionSavings = 0, uploaderName = null) {
  logEvent('photo_upload', {
    file_type: fileType,
    file_size: fileSize,
    compression_savings: compressionSavings,
    uploader_name: uploaderName || 'anonymous',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track gallery download
 * @param {number} photoCount - Number of photos downloaded
 * @param {number} zipSize - ZIP file size in bytes
 */
export function logGalleryDownload(photoCount, zipSize) {
  logEvent('gallery_download', {
    photo_count: photoCount,
    zip_size: zipSize,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track photo moderation action
 * @param {string} action - 'approve', 'flag', or 'delete'
 * @param {string} photoId - Photo document ID
 */
export function logModerationAction(action, photoId) {
  logEvent('moderation_action', {
    action,
    photo_id: photoId,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track video processing
 * @param {string} status - 'started', 'completed', or 'failed'
 * @param {string} videoId - Video document ID
 */
export function logVideoProcessing(status, videoId) {
  logEvent('video_processing', {
    status,
    video_id: videoId,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track guest name collection
 * @param {boolean} nameProvided - Whether guest provided name
 */
export function logGuestNameCollection(nameProvided) {
  logEvent('guest_name_collection', {
    name_provided: nameProvided,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track viewer pin on map
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 */
export function logViewerPin(lat, lng) {
  logEvent('viewer_pin', {
    latitude: lat.toFixed(4), // Anonymize exact location
    longitude: lng.toFixed(4),
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track navigation click
 * @param {string} sectionId - Section ID clicked
 */
export function logNavigation(sectionId) {
  logEvent('navigation_click', {
    section_id: sectionId,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track gallery filter change
 * @param {string} filter - 'all', 'photos', or 'videos'
 */
export function logGalleryFilter(filter) {
  logEvent('gallery_filter', {
    filter,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track lightbox interaction
 * @param {string} action - 'open', 'next', 'previous', 'download', 'share', 'close'
 * @param {string} photoId - Photo document ID
 */
export function logLightbox(action, photoId) {
  logEvent('lightbox_interaction', {
    action,
    photo_id: photoId,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track guestbook message submission (conversion goal)
 * @param {number} messageLength - Length of message
 * @param {boolean} hasRelationship - Whether relationship was provided
 */
export function logGuestbookSubmission(messageLength, hasRelationship = false) {
  logEvent('guestbook_submission', {
    message_length: messageLength,
    has_relationship: hasRelationship,
    conversion: true, // Mark as conversion
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track video chapter click (engagement metric)
 * @param {string} chapterTitle - Chapter title
 * @param {number} chapterIndex - Chapter index (0-based)
 * @param {number} timestamp - Video timestamp in seconds
 */
export function logVideoChapterClick(chapterTitle, chapterIndex, timestamp) {
  logEvent('video_chapter_click', {
    chapter_title: chapterTitle,
    chapter_index: chapterIndex,
    video_timestamp: timestamp,
    engagement: true, // Mark as engagement
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track social share (conversion goal)
 * @param {string} platform - 'facebook', 'twitter', 'whatsapp', 'copy_link'
 * @param {string} contentType - 'photo', 'video', 'page'
 */
export function logSocialShare(platform, contentType) {
  logEvent('social_share', {
    platform,
    content_type: contentType,
    conversion: true, // Mark as conversion
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track PWA install prompt (conversion goal)
 * @param {string} action - 'shown', 'accepted', 'dismissed'
 */
export function logPWAInstall(action) {
  logEvent('pwa_install', {
    action,
    conversion: action === 'accepted', // Only count accepted as conversion
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track error
 * @param {string} errorType - Error category
 * @param {string} errorMessage - Error message
 * @param {string} location - Where error occurred
 */
export function logError(errorType, errorMessage, location) {
  logEvent('app_error', {
    error_type: errorType,
    error_message: errorMessage,
    location,
    timestamp: new Date().toISOString(),
  });
}
