/**
 * VideoPlayer Component
 * YouTube video embed with privacy-enhanced mode and custom styling
 * 2025 Best Practice: Use youtube-nocookie.com for better privacy
 *
 * @param {string} videoId - YouTube video ID
 * @param {string} title - Video title for accessibility
 * @param {string} className - Additional CSS classes
 */
export default function VideoPlayer({ videoId, title = 'Wedding Video', className = '' }) {
  if (!videoId) {
    return (
      <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-gradient-to-br from-mint via-cream to-blush/30 flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-2xl text-sage mb-2">Video Coming Soon</p>
          <p className="font-body text-gray-600">Check back later for our wedding video!</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-blush/20 ${className}`}
    >
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&color=white`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
        loading="lazy"
      />
    </div>
  );
}
