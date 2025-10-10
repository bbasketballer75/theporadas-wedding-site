/**
 * Loading Skeleton Component
 * Displays animated placeholder content while data is loading
 * Improves perceived performance and provides visual feedback
 * 
 * @param {Object} props - Loading skeleton configuration
 * @param {string} props.variant - Type of skeleton ("text", "image", "section", "gallery")
 * @param {number} props.count - Number of skeleton items to render (default: 1)
 * @param {string} props.className - Additional CSS classes
 */
export default function LoadingSkeleton({ variant = 'text', count = 1, className = '' }) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  // Base animation class
  const animateClass = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200';

  // Variant-specific styles
  const variants = {
    text: 'h-4 rounded mb-2',
    image: 'h-64 rounded-lg',
    section: 'min-h-[400px] rounded-lg',
    gallery: 'aspect-square rounded-lg',
    card: 'h-48 rounded-lg',
  };

  return (
    <>
      {skeletons.map((index) => (
        <div key={index} className={`${animateClass} ${variants[variant]} ${className}`}>
          {/* Shimmer effect overlay */}
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      ))}
    </>
  );
}

/**
 * Gallery Loading Skeleton
 * Specialized skeleton for gallery grid layout
 */
export function GalleryLoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      <LoadingSkeleton variant="gallery" count={12} />
    </div>
  );
}

/**
 * Section Loading Skeleton
 * Full-section placeholder with header and content
 */
export function SectionLoadingSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header skeleton */}
      <div className="mb-6">
        <LoadingSkeleton variant="text" className="h-8 w-64 mb-2" />
        <LoadingSkeleton variant="text" className="h-4 w-96" />
      </div>

      {/* Content skeleton */}
      <div className="space-y-4">
        <LoadingSkeleton variant="text" className="w-full" />
        <LoadingSkeleton variant="text" className="w-5/6" />
        <LoadingSkeleton variant="text" className="w-4/6" />
      </div>
    </div>
  );
}
