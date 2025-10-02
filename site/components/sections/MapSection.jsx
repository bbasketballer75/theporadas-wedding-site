import SectionTransition from '../SectionTransition';

export default function MapSection() {
  return (
    <section id="map" className="w-full py-20 bg-gradient-to-br from-blush/10 to-cream/20">
      <div className="container mx-auto px-4 max-w-6xl">
        <SectionTransition>
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <div className="text-7xl mb-6">🗺️</div>
            <h2 className="text-5xl md:text-6xl font-display text-sage mb-6">Viewer Map</h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed mb-8">
              See who's viewing the website from around the world! An interactive map showing all
              our guests.
            </p>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
              <div className="bg-gradient-to-br from-sage/20 to-mint/30 rounded-2xl p-6">
                <div className="text-4xl mb-3">🌍</div>
                <div className="font-semibold text-sage mb-2">Live Map</div>
                <div className="text-sm text-gray-600">See viewers in real-time</div>
              </div>
              <div className="bg-gradient-to-br from-blush/20 to-cream/40 rounded-2xl p-6">
                <div className="text-4xl mb-3">📍</div>
                <div className="font-semibold text-blush mb-2">Custom Markers</div>
                <div className="text-sm text-gray-600">Personalized location pins</div>
              </div>
              <div className="bg-gradient-to-br from-mint/30 to-sage/20 rounded-2xl p-6">
                <div className="text-4xl mb-3">📊</div>
                <div className="font-semibold text-sage mb-2">Stats</div>
                <div className="text-sm text-gray-600">Visitor analytics</div>
              </div>
            </div>

            <a
              href="/map"
              className="inline-block bg-gradient-sage-blush text-white px-10 py-5 rounded-full font-semibold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              View the Map →
            </a>

            <p className="mt-6 text-sm text-gray-500">
              Full interactive map available on dedicated page
            </p>
          </div>
        </SectionTransition>
      </div>
    </section>
  );
}
