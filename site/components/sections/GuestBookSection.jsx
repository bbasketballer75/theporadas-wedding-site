import SectionTransition from '../SectionTransition';

export default function GuestBookSection() {
  return (
    <section
      id="guestbook"
      className="section-elegant bg-gradient-to-br from-ivory via-blush-50/20 to-ivory"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <SectionTransition>
          <div className="card-elegant p-12 text-center">
            <div className="flex justify-center items-center mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
              <div className="mx-4 text-6xl">✍️</div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
            </div>
            <h2 className="font-display text-5xl md:text-7xl text-gradient-elegant mb-6">
              Guest Book
            </h2>
            <p className="text-xl text-charcoal/70 max-w-2xl mx-auto leading-relaxed mb-8">
              Leave us a heartfelt message! Your words will be transformed into beautiful
              Canva-designed cards.
            </p>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
              <div className="bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl p-6 text-left shadow-elegant hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-3">💌</div>
                <div className="font-semibold text-sage-700 mb-2 text-lg">Share Your Thoughts</div>
                <div className="text-sm text-charcoal/70">
                  Write a message, memory, or well-wishes for the newlyweds
                </div>
              </div>
              <div className="bg-gradient-to-br from-blush-100 to-blush-200 rounded-2xl p-6 text-left shadow-elegant hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-3">🎨</div>
                <div className="font-semibold text-blush-600 mb-2 text-lg">
                  Auto-Generated Cards
                </div>
                <div className="text-sm text-charcoal/70">
                  Your message becomes a beautiful wedding-themed card design
                </div>
              </div>
            </div>

            <a href="/guestbook" className="btn-primary inline-block">
              Sign the Guest Book →
            </a>

            <p className="mt-6 text-sm text-charcoal/60">
              View all messages and submit yours on the dedicated page
            </p>
          </div>
        </SectionTransition>
      </div>
    </section>
  );
}
