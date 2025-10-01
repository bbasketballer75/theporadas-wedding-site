import TimelineCard from '../components/TimelineCard';

export default function OurStory() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-cream via-mint to-blush/20 font-body p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-6xl font-bold text-sage text-center mb-6">Our Story</h1>
        <p className="font-body text-xl text-blush text-center mb-12 leading-relaxed">
          From our first meeting to this beautiful celebration, every moment has been part of our
          love story.
        </p>

        {/* Timeline Section */}
        <section className="bg-white/80 rounded-3xl shadow-2xl p-10 mb-12">
          <h2 className="font-display text-4xl text-sage text-center mb-8">Our Journey Together</h2>

          <div className="space-y-8">
            {/* First Date */}
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-shrink-0">
                <TimelineCard title="First Date" date="May 2018" bgColor="mint" />
              </div>
              <div className="flex-1">
                <p className="text-gray-700 leading-relaxed">
                  Our love story began with a chance meeting that felt like destiny. From our very
                  first conversation, we knew there was something special between us.
                </p>
              </div>
            </div>

            {/* First Anniversary */}
            <div className="flex flex-col md:flex-row-reverse gap-6 items-center">
              <div className="flex-shrink-0">
                <TimelineCard title="First Anniversary" date="May 2019" bgColor="cream" />
              </div>
              <div className="flex-1 text-right">
                <p className="text-gray-700 leading-relaxed">
                  Celebrating one amazing year together filled with adventures, laughter, and
                  growing love.
                </p>
              </div>
            </div>

            {/* Engagement */}
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-shrink-0">
                <TimelineCard title="Engagement" date="October 2023" bgColor="sage" />
              </div>
              <div className="flex-1">
                <p className="text-gray-700 leading-relaxed">
                  The moment we decided to spend forever together. A beautiful proposal surrounded
                  by love and tears of joy.
                </p>
              </div>
            </div>

            {/* Wedding Day */}
            <div className="flex flex-col md:flex-row-reverse gap-6 items-center">
              <div className="flex-shrink-0">
                <TimelineCard title="Wedding Day" date="June 2025" bgColor="blush" />
              </div>
              <div className="flex-1 text-right">
                <p className="text-gray-700 leading-relaxed">
                  Celebrating our love with family and friends as we begin our forever adventure
                  together.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Photo Placeholder Section */}
        <section className="bg-gradient-to-r from-sage/10 to-blush/10 rounded-3xl shadow-xl p-10">
          <h2 className="font-display text-4xl text-sage text-center mb-6">Our Memories</h2>
          <p className="text-center text-gray-600 mb-8">
            Photos, schedule, RSVP forms, and more coming soon!
          </p>

          {/* Placeholder for future photo gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="aspect-square bg-gradient-to-br from-mint to-sage/20 rounded-2xl shadow-lg flex items-center justify-center">
              <span className="text-sage/50 text-6xl">📷</span>
            </div>
            <div className="aspect-square bg-gradient-to-br from-cream to-blush/20 rounded-2xl shadow-lg flex items-center justify-center">
              <span className="text-blush/50 text-6xl">💕</span>
            </div>
            <div className="aspect-square bg-gradient-to-br from-blush/20 to-mint rounded-2xl shadow-lg flex items-center justify-center">
              <span className="text-sage/50 text-6xl">🎉</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
