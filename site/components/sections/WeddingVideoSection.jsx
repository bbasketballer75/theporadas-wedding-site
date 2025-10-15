import { useState } from 'react';
import SectionTransition from '../SectionTransition';
import YouTubePlayer from '../YouTubePlayer';

/**
 * Wedding Video Section
 * Main wedding film with intuitive chapter navigation
 */
export default function WeddingVideoSection() {
  const [activeChapter, setActiveChapter] = useState(null);

  // Wedding video chapters with precise timestamps
  const weddingChapters = [
    { title: 'Our Story Begins', time: 0, description: 'Welcome to our special day', icon: '🎬' },
    { title: 'Bachelor+ette Weekend', time: 44.64, description: 'Pre-wedding celebrations', icon: '🎉' },
    { title: '"Who Is It" Gameshow', time: 300.44, description: 'Fun and games with guests', icon: '🎮' },
    {
      title: 'Wedding Party Speeches',
      time: 863.36,
      description: 'Heartfelt words from our friends',
      icon: '💬',
    },
    { title: 'Our Vows', time: 1211, description: 'We promise forever', icon: '💍' },
    { title: 'The Ceremony', time: 1537.88, description: 'We tie the knot', icon: '💒' },
    { title: 'The Reception', time: 1688.92, description: 'Celebration begins', icon: '🍾' },
    { title: 'First Dance', time: 1814.88, description: 'Our first dance as husband and wife', icon: '💃' },
    {
      title: 'Behind The Scenes',
      time: 2165.28,
      description: 'Bloopers and fun moments',
      icon: '🎥',
    },
    { title: 'The Party', time: 2375.12, description: 'Dancing the night away', icon: '🕺' },
    { title: 'Thank You', time: 2643.24, description: 'Gratitude for our loved ones', icon: '❤️' },
    { title: 'One Final Surprise', time: 2683.84, description: 'A special ending', icon: '✨' },
  ];

  return (
    <section
      id="wedding-video"
      className="section-elegant bg-gradient-to-br from-charcoal/5 via-ivory to-charcoal/5"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <SectionTransition>
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center items-center mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
              <div className="mx-4 text-4xl">🎬</div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
            </div>
            <h2 className="font-display text-5xl md:text-7xl text-gradient-elegant mb-4">
              Our Wedding Film
            </h2>
            <p className="text-xl text-charcoal/70 max-w-2xl mx-auto leading-relaxed">
              Experience the complete journey of our unforgettable day, from start to finish
            </p>
          </div>
        </SectionTransition>

        {/* Main Video Player with Enhanced UI */}
        <SectionTransition>
          <div className="card-elegant p-6 md:p-12 max-w-6xl mx-auto">
            {/* Video Player */}
            <YouTubePlayer
              videoId="ZOIRb_ghdh0"
              title="Austin & Jordyn Wedding Film - May 10, 2025"
              chapters={weddingChapters}
              showChapters={true}
              onChapterChange={setActiveChapter}
            />

            {/* Video Stats */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-ivory to-gold-50 rounded-xl">
                <div className="text-2xl font-bold text-gold-600">12</div>
                <div className="text-sm text-charcoal/70">Chapters</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-ivory to-blush-50 rounded-xl">
                <div className="text-2xl font-bold text-blush-600">45min</div>
                <div className="text-sm text-charcoal/70">Full Film</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-ivory to-sage-50 rounded-xl">
                <div className="text-2xl font-bold text-sage-600">1080p</div>
                <div className="text-sm text-charcoal/70">HD Quality</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-ivory to-charcoal/10 rounded-xl">
                <div className="text-2xl font-bold text-charcoal">May 10</div>
                <div className="text-sm text-charcoal/70">Wedding Day</div>
              </div>
            </div>
          </div>
        </SectionTransition>

        {/* Chapter Quick Access Grid */}
        <SectionTransition>
          <div className="mt-12">
            <h3 className="text-2xl font-display text-center text-gradient-sage mb-8">
              Jump to Your Favorite Moments
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {weddingChapters.map((chapter, index) => (
                <button
                  key={index}
                  onClick={() => {
                    // This would trigger the YouTube player to seek to this time
                    const event = new CustomEvent('seekToChapter', { detail: chapter.time });
                    window.dispatchEvent(event);
                    setActiveChapter(chapter);
                  }}
                  className={`
                    group relative p-4 rounded-xl transition-all duration-300
                    ${
                      activeChapter?.title === chapter.title
                        ? 'bg-gradient-to-br from-gold-500 to-gold-600 text-white shadow-lg scale-105'
                        : 'bg-white hover:bg-gradient-to-br hover:from-gold-50 hover:to-gold-100 hover:shadow-md'
                    }
                  `}
                >
                  <div className="text-3xl mb-2">{chapter.icon}</div>
                  <div className={`text-sm font-semibold mb-1 ${activeChapter?.title === chapter.title ? 'text-white' : 'text-charcoal'}`}>
                    {chapter.title}
                  </div>
                  <div className={`text-xs ${activeChapter?.title === chapter.title ? 'text-white/80' : 'text-charcoal/60'}`}>
                    {Math.floor(chapter.time / 60)}:{String(Math.floor(chapter.time % 60)).padStart(2, '0')}
                  </div>
                  
                  {/* Play icon overlay on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10 rounded-xl">
                    <svg className="w-8 h-8 text-gold-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </SectionTransition>
      </div>
    </section>
  );
}
