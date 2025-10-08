import SectionTransition from '../SectionTransition';

export default function PhotoBoothSection() {
  const _scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="photobooth" className="w-full py-20 bg-gradient-to-br from-cream/50 to-blush/20">
      <div className="container mx-auto px-4 max-w-6xl">
        <SectionTransition>
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <div className="text-7xl mb-6 animate-bounce">📸</div>
            <h2 className="text-5xl md:text-6xl font-display text-sage mb-6">Photo Booth</h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed mb-8">
              Strike a pose! Take fun photos with filters, wedding-themed frames, and Canva
              overlays.
            </p>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
              <div className="bg-gradient-to-br from-sage/20 to-mint/30 rounded-2xl p-6">
                <div className="text-4xl mb-3">🎨</div>
                <div className="font-semibold text-sage mb-2">6 Filters</div>
                <div className="text-sm text-gray-600">Vintage, B&W, Romantic & more</div>
              </div>
              <div className="bg-gradient-to-br from-blush/20 to-cream/40 rounded-2xl p-6">
                <div className="text-4xl mb-3">🖼️</div>
                <div className="font-semibold text-blush mb-2">Canva Frames</div>
                <div className="text-sm text-gray-600">Wedding-themed overlay designs</div>
              </div>
              <div className="bg-gradient-to-br from-mint/30 to-sage/20 rounded-2xl p-6">
                <div className="text-4xl mb-3">💾</div>
                <div className="font-semibold text-sage mb-2">Download & Share</div>
                <div className="text-sm text-gray-600">Save or share instantly</div>
              </div>
            </div>

            <a
              href="/photobooth"
              className="inline-block bg-gradient-sage-blush text-white px-10 py-5 rounded-full font-semibold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Launch Photo Booth →
            </a>

            <p className="mt-6 text-sm text-gray-500">
              Full camera, filters, and frame features available on dedicated page
            </p>
          </div>
        </SectionTransition>
      </div>
    </section>
  );
}
