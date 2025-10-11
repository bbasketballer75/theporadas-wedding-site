import { useRef, useState } from 'react';

import VideoChapters from './VideoChapters';

/**
 * VideoPlayer Component
 * YouTube video embed with privacy-enhanced mode, custom styling, and chapters
 * 2025 Best Practice: Use youtube-nocookie.com for better privacy
 *
 * @param {string} videoId - YouTube video ID
 * @param {string} title - Video title for accessibility
 * @param {string} className - Additional CSS classes
 * @param {boolean} showChapters - Whether to show chapter navigation (default: true)
 */
export default function VideoPlayer({ videoId, title = 'Wedding Video', className = '', showChapters = true }) {
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);

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

  const handleSeek = (time) => {
    // For YouTube iframe, we need to use postMessage API
    // This is a simplified version - full implementation would use YouTube IFrame API
    console.log('[VideoPlayer] Seeking to:', time);
    setCurrentTime(time);
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-blush/20 ${className}`}
      >
        <iframe
          ref={videoRef}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&color=white&enablejsapi=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          loading="lazy"
        />
      </div>

      {showChapters && (
        <VideoChapters 
          videoRef={videoRef} 
          currentTime={currentTime}
          onSeek={handleSeek}
        />
      )}
    </div>
  );
}
