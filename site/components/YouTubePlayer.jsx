import { useEffect, useRef, useState } from 'react';

import YouTubeChapters from './YouTubeChapters';

/**
 * YouTubePlayer Component with IFrame API
 * Supports programmatic control, chapter navigation, and time tracking
 * 
 * @param {string} videoId - YouTube video ID
 * @param {string} title - Video title for accessibility
 * @param {array} chapters - Array of chapter objects: [{ title, time, description }]
 * @param {boolean} showChapters - Whether to show chapter navigation
 */
export default function YouTubePlayer({
  videoId,
  title = 'Wedding Video',
  chapters = [],
  showChapters = false,
}) {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Load YouTube IFrame API
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      return;
    }

    // Load the IFrame Player API code asynchronously
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // API will call this function when ready
    window.onYouTubeIframeAPIReady = () => {
      console.log('[YouTubePlayer] API Ready');
    };
  }, []);

  // Initialize player when API is ready
  useEffect(() => {
    if (typeof window === 'undefined' || !videoId) return;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) {
        setTimeout(initPlayer, 100);
        return;
      }

      const newPlayer = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 0,
          rel: 0,
          modestbranding: 1,
          color: 'white',
          enablejsapi: 1,
        },
        events: {
          onReady: (event) => {
            console.log('[YouTubePlayer] Player Ready');
            setPlayer(event.target);
            setIsReady(true);
            setDuration(event.target.getDuration());
          },
          onStateChange: (event) => {
            // State: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (cued)
            if (event.data === window.YT.PlayerState.PLAYING) {
              // Start time tracking
              startTimeTracking(event.target);
            }
          },
        },
      });

      playerRef.current = newPlayer;
    };

    initPlayer();

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  // Time tracking interval
  const startTimeTracking = (playerInstance) => {
    const interval = setInterval(() => {
      if (playerInstance && playerInstance.getCurrentTime) {
        const time = playerInstance.getCurrentTime();
        setCurrentTime(time);

        // Stop tracking if paused or ended
        const state = playerInstance.getPlayerState();
        if (state !== window.YT.PlayerState.PLAYING) {
          clearInterval(interval);
        }
      }
    }, 500); // Update every 500ms
  };

  // Seek to specific time
  const handleSeek = (time) => {
    if (player && player.seekTo) {
      player.seekTo(time, true);
      player.playVideo();
    }
  };

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
    <div className="space-y-6">
      {/* Video Player */}
      <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-blush/20">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      </div>

      {/* Chapters Navigation */}
      {showChapters && chapters.length > 0 && isReady && (
        <YouTubeChapters
          chapters={chapters}
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
        />
      )}
    </div>
  );
}
