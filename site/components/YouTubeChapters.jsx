import { useEffect, useState } from 'react';

/**
 * YouTubeChapters Component - Enhanced Interactive Version
 * Interactive chapter navigation with thumbnails, hover effects, and animations
 * Works with YouTube IFrame API for seeking
 */
export default function YouTubeChapters({ chapters = [], currentTime = 0, duration = 0, onSeek }) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [hoveredChapter, setHoveredChapter] = useState(null);

  // Update active chapter based on current time
  useEffect(() => {
    const index = chapters.findIndex((chapter, idx) => {
      const nextChapter = chapters[idx + 1];
      return currentTime >= chapter.time && (!nextChapter || currentTime < nextChapter.time);
    });

    if (index !== -1 && index !== activeChapterIndex) {
      setActiveChapterIndex(index);
    }
  }, [currentTime, chapters, activeChapterIndex]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getChapterDuration = (index) => {
    const nextChapter = chapters[index + 1];
    if (!nextChapter) return duration - chapters[index].time;
    return nextChapter.time - chapters[index].time;
  };

  const getChapterProgress = (index) => {
    if (index !== activeChapterIndex) return 0;
    const chapterStart = chapters[index].time;
    const chapterDuration = getChapterDuration(index);
    const progress = ((currentTime - chapterStart) / chapterDuration) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight' && activeChapterIndex < chapters.length - 1) {
        onSeek(chapters[activeChapterIndex + 1].time);
      } else if (e.key === 'ArrowLeft' && activeChapterIndex > 0) {
        onSeek(chapters[activeChapterIndex - 1].time);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeChapterIndex, chapters, onSeek]);

  if (chapters.length === 0) return null;

  return (
    <div className="card-elegant p-6 md:p-8 space-y-6">
      {/* Header with Navigation Hint */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-display text-gradient-sage">✨ Video Chapters</h3>
        <div className="hidden md:flex items-center gap-2 text-xs text-charcoal/50">
          <span>Use ← → arrow keys to navigate</span>
        </div>
      </div>

      {/* Chapter Grid with Enhanced Interactions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chapters.map((chapter, index) => {
          const isActive = index === activeChapterIndex;
          const isHovered = hoveredChapter === index;
          const chapterDuration = getChapterDuration(index);
          const progress = getChapterProgress(index);

          return (
            <button
              key={index}
              onClick={() => onSeek(chapter.time)}
              onMouseEnter={() => setHoveredChapter(index)}
              onMouseLeave={() => setHoveredChapter(null)}
              className={`group relative overflow-hidden flex flex-col p-5 rounded-2xl border-2 transition-all duration-500 text-left ${
                isActive
                  ? 'bg-gradient-to-br from-sage-500 via-blush-400 to-gold-500 border-sage-500 text-white shadow-2xl shadow-sage-300/50 scale-105 animate-float'
                  : 'bg-white border-sage-200 hover:border-sage-400 hover:shadow-xl hover:scale-105 hover:-translate-y-1'
              }`}
            >
              {/* Animated Background Glow */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent animate-shimmer" />
              )}

              {/* Progress Bar for Active Chapter */}
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              {/* Chapter Number Badge */}
              <div className="flex items-start gap-4 mb-3">
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-white/30 text-white shadow-lg backdrop-blur-sm'
                      : 'bg-gradient-to-br from-sage-100 to-blush-100 text-sage-700 group-hover:scale-110 group-hover:rotate-6'
                  }`}
                >
                  {index + 1}
                </div>

                {/* Duration Badge */}
                <div
                  className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-white/20 text-white backdrop-blur-sm'
                      : 'bg-sage-50 text-sage-600 group-hover:bg-sage-100'
                  }`}
                >
                  {formatTime(chapterDuration)}
                </div>
              </div>

              {/* Chapter Info */}
              <div className="relative z-10 flex-1">
                <div
                  className={`font-bold text-lg mb-2 leading-tight ${
                    isActive ? 'text-white' : 'text-charcoal group-hover:text-sage-700'
                  }`}
                >
                  {chapter.title}
                </div>

                <div
                  className={`text-sm mb-2 flex items-center gap-2 ${
                    isActive ? 'text-white/90' : 'text-charcoal/60 group-hover:text-charcoal/80'
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z" />
                  </svg>
                  {formatTime(chapter.time)}
                </div>

                {chapter.description && (
                  <div
                    className={`text-sm leading-relaxed transition-all duration-300 ${
                      isActive ? 'text-white/90' : 'text-charcoal/60 group-hover:text-charcoal/80'
                    } ${isHovered ? 'line-clamp-none' : 'line-clamp-2'}`}
                  >
                    {chapter.description}
                  </div>
                )}
              </div>

              {/* Playing Indicator with Animation */}
              {isActive && (
                <div className="absolute top-4 right-4">
                  <div className="relative">
                    <svg
                      className="w-6 h-6 text-white animate-pulse"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <div className="absolute inset-0 animate-ping opacity-75">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Hover Effect - Gradient Overlay */}
              {!isActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-sage-500/0 to-blush-500/0 group-hover:from-sage-500/10 group-hover:to-blush-500/10 transition-all duration-500 pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>

      {/* Enhanced Progress Bar with Chapter Markers */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-charcoal/60">
          <span>
            {chapters[activeChapterIndex]?.title} • {formatTime(currentTime)}
          </span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="relative h-3 bg-gradient-to-r from-sage-100 via-blush-50 to-gold-100 rounded-full overflow-visible shadow-inner">
          {/* Current Progress with Gradient */}
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-sage-500 via-blush-500 to-gold-500 rounded-full transition-all duration-300 shadow-lg"
            style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
          />

          {/* Animated Progress Head */}
          {duration > 0 && (
            <div
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-xl border-2 border-sage-500 transition-all duration-300 animate-pulse"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            />
          )}

          {/* Interactive Chapter Markers */}
          {chapters.map((chapter, index) => {
            const isActive = index === activeChapterIndex;
            const position = duration > 0 ? (chapter.time / duration) * 100 : 0;

            return (
              <button
                key={index}
                onClick={() => onSeek(chapter.time)}
                onMouseEnter={() => setHoveredChapter(index)}
                onMouseLeave={() => setHoveredChapter(null)}
                className="group absolute top-1/2 -translate-y-1/2 transition-all duration-300 z-20"
                style={{ left: `${position}%` }}
                aria-label={`Jump to ${chapter.title}`}
              >
                {/* Marker Dot */}
                <div
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                    isActive
                      ? 'bg-white border-sage-600 scale-125 shadow-lg'
                      : 'bg-sage-200 border-sage-400 hover:scale-150 hover:bg-white hover:shadow-md'
                  }`}
                />

                {/* Tooltip on Hover */}
                {hoveredChapter === index && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-2 bg-charcoal/90 text-white text-xs rounded-lg whitespace-nowrap pointer-events-none backdrop-blur-sm animate-fade-in shadow-xl">
                    <div className="font-semibold">{chapter.title}</div>
                    <div className="text-white/70">{formatTime(chapter.time)}</div>
                    {/* Tooltip Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-charcoal/90" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Navigation Pills - Mobile Optimized */}
      <div className="overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          {chapters.map((chapter, index) => {
            const isActive = index === activeChapterIndex;
            return (
              <button
                key={index}
                onClick={() => onSeek(chapter.time)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-sage-500 via-blush-500 to-gold-500 text-white shadow-lg shadow-sage-300/50 scale-110'
                    : 'bg-sage-50 text-sage-700 hover:bg-gradient-to-r hover:from-sage-100 hover:to-blush-100 hover:shadow-md hover:scale-105'
                }`}
              >
                {isActive && '▶ '}
                {chapter.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 justify-center pt-2">
        <button
          onClick={() => activeChapterIndex > 0 && onSeek(chapters[activeChapterIndex - 1].time)}
          disabled={activeChapterIndex === 0}
          className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 ${
            activeChapterIndex === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border-2 border-sage-300 text-sage-700 hover:bg-sage-50 hover:border-sage-500 hover:shadow-lg hover:scale-105'
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
          Previous
        </button>

        <button
          onClick={() =>
            activeChapterIndex < chapters.length - 1 &&
            onSeek(chapters[activeChapterIndex + 1].time)
          }
          disabled={activeChapterIndex === chapters.length - 1}
          className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 ${
            activeChapterIndex === chapters.length - 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-sage-500 to-blush-500 text-white hover:shadow-xl hover:scale-105'
          }`}
        >
          Next
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
