import SectionTransition from '../SectionTransition';

export default function GuestBookSection() {
  return (
    <section id="guestbook" className="w-full py-20 bg-gradient-to-br from-blush/10 to-sage/10">
      <div className="container mx-auto px-4 max-w-6xl">
        <SectionTransition>
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <div className="text-7xl mb-6">✍️</div>
            <h2 className="text-5xl md:text-6xl font-display text-sage mb-6">Guest Book</h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed mb-8">
              Leave us a heartfelt message! Your words will be transformed into beautiful
              Canva-designed cards.
            </p>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
              <div className="bg-gradient-to-br from-sage/20 to-mint/30 rounded-2xl p-6 text-left">
                <div className="text-4xl mb-3">💌</div>
                <div className="font-semibold text-sage mb-2 text-lg">Share Your Thoughts</div>
                <div className="text-sm text-gray-600">
                  Write a message, memory, or well-wishes for the newlyweds
                </div>
              </div>
              <div className="bg-gradient-to-br from-blush/20 to-cream/40 rounded-2xl p-6 text-left">
                <div className="text-4xl mb-3">🎨</div>
                <div className="font-semibold text-blush mb-2 text-lg">Auto-Generated Cards</div>
                <div className="text-sm text-gray-600">
                  Your message becomes a beautiful wedding-themed card design
                </div>
              </div>
            </div>

            <a
              href="/guestbook"
              className="inline-block bg-gradient-sage-blush text-white px-10 py-5 rounded-full font-semibold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Sign the Guest Book →
            </a>

            <p className="mt-6 text-sm text-gray-500">
              View all messages and submit yours on the dedicated page
            </p>
          </div>
        </SectionTransition>
      </div>
    </section>
  );
}
