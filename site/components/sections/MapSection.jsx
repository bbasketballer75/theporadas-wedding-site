import SectionTransition from '../SectionTransition';

export default function MapSection() {
  return (
    <section id="map" className="section-elegant bg-gradient-to-br from-ivory via-champagne/30 to-ivory">
      <div className="container mx-auto px-4 max-w-6xl">
        <SectionTransition>
          <div className="card-elegant p-12 text-center">
            <div className="flex justify-center items-center mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
              <div className="mx-4 text-6xl">🗺️</div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
            </div>
            <h2 className="font-display text-5xl md:text-7xl text-gradient-elegant mb-6">Viewer Map</h2>
            <p className="text-xl text-charcoal/70 max-w-2xl mx-auto leading-relaxed mb-8">
              See who's viewing the website from around the world! An interactive map showing all
              our guests.
            </p>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
              <div className="bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl p-6 shadow-elegant hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-3">🌍</div>
                <div className="font-semibold text-sage-700 mb-2">Live Map</div>
                <div className="text-sm text-charcoal/70">See viewers in real-time</div>
              </div>
              <div className="bg-gradient-to-br from-blush-100 to-blush-200 rounded-2xl p-6 shadow-elegant hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-3">📍</div>
                <div className="font-semibold text-blush-600 mb-2">Custom Markers</div>
                <div className="text-sm text-charcoal/70">Personalized location pins</div>
              </div>
              <div className="bg-gradient-to-br from-gold-100 to-gold-200 rounded-2xl p-6 shadow-elegant hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-3">📊</div>
                <div className="font-semibold text-gold-700 mb-2">Stats</div>
                <div className="text-sm text-charcoal/70">Visitor analytics</div>
              </div>
            </div>

            <a
              href="/map"
              className="btn-primary inline-block"
            >
              View the Map →
            </a>

            <p className="mt-6 text-sm text-charcoal/60">
              Full interactive map available on dedicated page
            </p>
          </div>
        </SectionTransition>
      </div>
    </section>
  );
}
