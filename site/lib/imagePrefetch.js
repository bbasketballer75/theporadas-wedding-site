/**
 * Intelligent Prefetch Utility
 * Prefetches adjacent images in gallery for faster navigation
 * Uses Intersection Observer to prefetch visible items
 */

/**
 * Prefetch adjacent gallery items for faster lightbox navigation
 * @param {Array} media - Array of media items
 * @param {number} currentIndex - Currently viewing index
 * @param {number} prefetchCount - Number of adjacent items to prefetch (default: 2)
 */
export function prefetchAdjacentImages(media, currentIndex, prefetchCount = 2) {
    if (!media || media.length === 0) return;

    // Prefetch previous images
    for (let i = 1; i <= prefetchCount; i++) {
        const prevIndex = currentIndex - i;
        if (prevIndex >= 0) {
            prefetchImage(media[prevIndex]);
        }
    }

    // Prefetch next images
    for (let i = 1; i <= prefetchCount; i++) {
        const nextIndex = currentIndex + i;
        if (nextIndex < media.length) {
            prefetchImage(media[nextIndex]);
        }
    }
}

/**
 * Prefetch single image
 * @param {Object} mediaItem - Media item with originalPath or thumbnailPath
 */
function prefetchImage(mediaItem) {
    if (!mediaItem) return;

    // Only prefetch images, skip videos
    if (mediaItem.type === 'video' || mediaItem.videoUrl) return;

    const url = mediaItem.originalPath || mediaItem.thumbnailPath;
    if (!url) return;

    // Check if already prefetched
    if (typeof document === 'undefined') return;

    const existingLink = document.querySelector(`link[rel="prefetch"][href="${url}"]`);
    if (existingLink) return;

    // Create prefetch link
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
}

/**
 * Intersection Observer-based prefetching for gallery grid
 * Prefetches images as they approach viewport
 * @param {Array} media - Array of media items
 * @param {HTMLElement} containerRef - Gallery container element
 * @param {Object} options - Observer options
 */
export function observePrefetchGallery(media, containerRef, options = {}) {
    if (typeof window === 'undefined' || !containerRef) return null;

    const { rootMargin = '200px', threshold = 0.01 } = options;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = parseInt(entry.target.dataset.index, 10);
                    if (!isNaN(index) && media[index]) {
                        prefetchImage(media[index]);
                    }
                }
            });
        },
        { rootMargin, threshold }
    );

    // Observe all gallery items
    const items = containerRef.querySelectorAll('[data-index]');
    items.forEach((item) => observer.observe(item));

    return observer;
}

/**
 * Prefetch next page of infinite scroll
 * @param {Array} media - Full media array
 * @param {number} currentItemsShown - Current number of items shown
 * @param {number} itemsPerPage - Items per page (default: 20)
 */
export function prefetchNextPage(media, currentItemsShown, itemsPerPage = 20) {
    const nextPageStart = currentItemsShown;
    const nextPageEnd = Math.min(currentItemsShown + itemsPerPage, media.length);

    for (let i = nextPageStart; i < nextPageEnd; i++) {
        if (media[i]) {
            prefetchImage(media[i]);
        }
    }
}

/**
 * Clean up prefetch links to prevent memory leaks
 * Call this when component unmounts or gallery changes
 */
export function cleanupPrefetchLinks() {
    if (typeof document === 'undefined') return;

    const prefetchLinks = document.querySelectorAll('link[rel="prefetch"]');
    prefetchLinks.forEach((link) => link.remove());
}
