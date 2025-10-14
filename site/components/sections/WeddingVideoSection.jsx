import { motion } from 'framer-motion';
import { useState } from 'react';

/**
 * Wedding Video Section
 * Displays the main wedding video with elegant presentation
 */
export default function WeddingVideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  // TODO: Replace with actual wedding video URL
  // Format: https://www.youtube.com/embed/VIDEO_ID or https://player.vimeo.com/video/VIDEO_ID
  const videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ'; // Placeholder

  return (
    <section
      id="video"
      className="relative py-20 bg-gradient-to-b from-blush/10 to-white dark:from-blush-900/10 dark:to-gray-900"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-float" />
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="heading-2 mb-4">Our Wedding Day</h2>
          <p className="text-sage-700 dark:text-sage-300 max-w-2xl mx-auto">
            Relive the magic of our special day
          </p>
        </motion.div>

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          {/* Decorative Frame */}
          <div className="relative p-4 md:p-8 bg-gradient-to-br from-sage/5 to-blush/5 rounded-3xl shadow-2xl">
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-gold/30 rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-gold/30 rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-gold/30 rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-gold/30 rounded-br-3xl" />

            {/* Video Player */}
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-xl">
              {/* Custom play button overlay (shown before video plays) */}
              {!isPlaying && (
                <motion.button
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-sm group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center shadow-2xl transition-all">
                    <svg
                      className="w-10 h-10 md:w-14 md:h-14 text-gold ml-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </motion.button>
              )}

              {/* Actual Video Embed */}
              <iframe
                src={`${videoUrl}?autoplay=${isPlaying ? 1 : 0}&rel=0&modestbranding=1`}
                title="Wedding Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            {/* Optional: Video caption or date */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-center"
            >
              <p className="font-serif text-sage-700 dark:text-sage-300">
                May 10, 2025 • Austin & Jordyn
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Optional: Additional video info or call-to-action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-sage-600 dark:text-sage-400">
            Thank you for celebrating with us! 💕
          </p>
        </motion.div>
      </div>
    </section>
  );
}
