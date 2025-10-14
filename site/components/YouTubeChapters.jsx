import { useEffect, useState } from 'react';

/**
 * YouTubeChapters Component
 * Interactive chapter navigation for YouTube videos
 * Works with YouTube IFrame API for seeking
 */
export default function YouTubeChapters({ chapters = [], currentTime = 0, duration = 0, onSeek }) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

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

  if (chapters.length === 0) return null;

  return (
    <div className="card-elegant p-6 md:p-8">
      {/* Header */}
      <h3 className="text-2xl font-display text-gradient-sage mb-6">Chapters</h3>

      {/* Chapter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {chapters.map((chapter, index) => (
          <button
            key={index}
            onClick={() => onSeek(chapter.time)}
            className={`group relative flex items-start gap-4 p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
              index === activeChapterIndex
                ? 'bg-gradient-to-br from-sage-500 to-blush-500 border-sage-500 text-white shadow-lg scale-105'
                : 'bg-white border-sage-200 hover:border-sage-400 hover:shadow-md hover:scale-102'
            }`}
          >
            {/* Chapter Number */}
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                index === activeChapterIndex
                  ? 'bg-white/20 text-white'
                  : 'bg-sage-100 text-sage-700 group-hover:bg-sage-200'
              }`}
            >
              {index + 1}
            </div>

            {/* Chapter Info */}
            <div className="flex-1 min-w-0">
              <div
                className={`font-semibold mb-1 truncate ${
                  index === activeChapterIndex ? 'text-white' : 'text-charcoal'
                }`}
              >
                {chapter.title}
              </div>
              <div
                className={`text-sm mb-1 ${
                  index === activeChapterIndex ? 'text-white/90' : 'text-charcoal/60'
                }`}
              >
                {formatTime(chapter.time)}
              </div>
              {chapter.description && (
                <div
                  className={`text-xs line-clamp-2 ${
                    index === activeChapterIndex ? 'text-white/80' : 'text-charcoal/50'
                  }`}
                >
                  {chapter.description}
                </div>
              )}
            </div>

            {/* Playing Indicator */}
            {index === activeChapterIndex && (
              <div className="absolute top-2 right-2">
                <svg
                  className="w-5 h-5 text-white animate-pulse"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Progress Bar with Chapter Markers */}
      <div className="relative h-2 bg-sage-100 rounded-full overflow-visible">
        {/* Current Progress */}
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-sage-500 to-blush-500 rounded-full transition-all duration-300"
          style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
        />

        {/* Chapter Markers */}
        {chapters.map((chapter, index) => (
          <button
            key={index}
            onClick={() => onSeek(chapter.time)}
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-sage-500 rounded-full hover:scale-150 transition-transform shadow-lg cursor-pointer z-10"
            style={{ left: `${duration > 0 ? (chapter.time / duration) * 100 : 0}%` }}
            title={`${chapter.title} - ${formatTime(chapter.time)}`}
            aria-label={`Jump to ${chapter.title}`}
          />
        ))}
      </div>

      {/* Chapter Timeline (Mobile-friendly horizontal scroll) */}
      <div className="mt-6 overflow-x-auto pb-2 -mx-2 px-2">
        <div className="flex gap-2 min-w-max">
          {chapters.map((chapter, index) => (
            <button
              key={index}
              onClick={() => onSeek(chapter.time)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                index === activeChapterIndex
                  ? 'bg-gradient-to-r from-sage-500 to-blush-500 text-white shadow-md'
                  : 'bg-sage-50 text-sage-700 hover:bg-sage-100'
              }`}
            >
              {chapter.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
