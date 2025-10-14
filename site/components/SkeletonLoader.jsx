/**
 * SkeletonLoader - Animated loading skeletons for better perceived performance
 */

export function GallerySkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Header skeleton */}
      <div className="text-center space-y-4">
        <div className="h-12 bg-sage-100 rounded-lg w-64 mx-auto" />
        <div className="h-6 bg-sage-50 rounded-lg w-96 mx-auto" />
      </div>

      {/* Gallery grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-square bg-sage-100 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export function VideoSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Video player skeleton */}
      <div className="aspect-video bg-sage-100 rounded-2xl" />
      
      {/* Chapters skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-24 bg-sage-50 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function SectionSkeleton({ lines = 3, hasImage = false }) {
  return (
    <div className="animate-pulse space-y-4">
      {hasImage && <div className="h-48 bg-sage-100 rounded-2xl mb-6" />}
      {[...Array(lines)].map((_, i) => (
        <div
          key={i}
          className="h-4 bg-sage-50 rounded"
          style={{ width: `${Math.random() * 30 + 70}%` }}
        />
      ))}
    </div>
  );
}

export default function SkeletonLoader({ type = 'section', ...props }) {
  switch (type) {
    case 'gallery':
      return <GallerySkeleton {...props} />;
    case 'video':
      return <VideoSkeleton {...props} />;
    case 'section':
    default:
      return <SectionSkeleton {...props} />;
  }
}
