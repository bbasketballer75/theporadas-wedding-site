/**
 * Video Chapters Component
 * Adds chapter markers and navigation to wedding video
 */

import { useState, useRef, useEffect } from 'react';

export default function VideoChapters({ videoSrc, chapters = [] }) {
  const videoRef = useRef(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Default chapters if none provided
  const defaultChapters = [
    { title: 'Pre-Ceremony', time: 0, description: 'Getting ready and arrival' },
    { title: 'Ceremony', time: 300, description: 'Wedding ceremony' },
    { title: 'Cocktail Hour', time: 1800, description: 'Drinks and mingling' },
    { title: 'Reception', time: 2700, description: 'Dinner and celebration' },
    { title: 'First Dance', time: 4200, description: 'Our first dance as married couple' },
    { title: 'Speeches', time: 4800, description: 'Toasts from friends and family' },
    { title: 'Party', time: 6000, description: 'Dancing and celebration' },
  ];

  const activeChapters = chapters.length > 0 ? chapters : defaultChapters;

  // Update current time
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);

      // Update current chapter based on time
      const chapterIndex = activeChapters.findIndex((chapter, idx) => {
        const nextChapter = activeChapters[idx + 1];
        return (
          video.currentTime >= chapter.time &&
          (!nextChapter || video.currentTime < nextChapter.time)
        );
      });

      if (chapterIndex !== -1 && chapterIndex !== currentChapter) {
        setCurrentChapter(chapterIndex);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [activeChapters, currentChapter]);

  const jumpToChapter = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="video-chapters">
      <div className="video-container">
        <video
          ref={videoRef}
          src={videoSrc}
          controls
          className="video-player"
          poster="/images/video-poster.jpg"
        />
      </div>

      <div className="chapters-list">
        <h3 className="chapters-title">Chapters</h3>

        <div className="chapters-grid">
          {activeChapters.map((chapter, index) => (
            <button
              key={index}
              onClick={() => jumpToChapter(chapter.time)}
              className={`chapter-item ${index === currentChapter ? 'active' : ''}`}
            >
              <div className="chapter-number">{index + 1}</div>
              <div className="chapter-info">
                <div className="chapter-title">{chapter.title}</div>
                <div className="chapter-time">{formatTime(chapter.time)}</div>
                {chapter.description && (
                  <div className="chapter-description">{chapter.description}</div>
                )}
              </div>
              {index === currentChapter && (
                <div className="playing-indicator">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            {activeChapters.map((chapter, index) => (
              <div
                key={index}
                className="chapter-marker"
                style={{ left: `${(chapter.time / duration) * 100}%` }}
                title={chapter.title}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .video-chapters {
          max-width: 1200px;
          margin: 0 auto;
        }

        .video-container {
          background: black;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          margin-bottom: 2rem;
        }

        .video-player {
          width: 100%;
          height: auto;
          display: block;
        }

        .chapters-list {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .chapters-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #1f2937;
        }

        .chapters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .chapter-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }

        .chapter-item:hover {
          border-color: #667eea;
          background: #f0f4ff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }

        .chapter-item.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: #667eea;
        }

        .chapter-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: #667eea;
          min-width: 2.5rem;
          text-align: center;
        }

        .chapter-item.active .chapter-number {
          color: white;
        }

        .chapter-info {
          flex: 1;
        }

        .chapter-title {
          font-weight: 600;
          font-size: 1.05rem;
          margin-bottom: 0.25rem;
        }

        .chapter-time {
          font-size: 0.9rem;
          opacity: 0.7;
        }

        .chapter-description {
          font-size: 0.85rem;
          margin-top: 0.25rem;
          opacity: 0.8;
        }

        .playing-indicator {
          color: white;
        }

        .playing-indicator svg {
          width: 1.5rem;
          height: 1.5rem;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .progress-container {
          margin-top: 1.5rem;
        }

        .progress-bar {
          position: relative;
          height: 0.5rem;
          background: #e5e7eb;
          border-radius: 0.25rem;
          overflow: visible;
        }

        .progress-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          border-radius: 0.25rem;
          transition: width 0.1s linear;
        }

        .chapter-marker {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 0.75rem;
          height: 0.75rem;
          background: white;
          border: 2px solid #667eea;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .chapter-marker:hover {
          transform: translate(-50%, -50%) scale(1.3);
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
        }

        @media (max-width: 768px) {
          .chapters-grid {
            grid-template-columns: 1fr;
          }

          .chapters-list {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
