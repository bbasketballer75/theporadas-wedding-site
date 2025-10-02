import SectionTransition from '../SectionTransition';

export default function AlbumSection() {
  return (
    <section id="album" className="w-full py-20 bg-gradient-to-br from-mint/20 to-cream/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <SectionTransition>
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <div className="text-7xl mb-6">📖</div>
            <h2 className="text-5xl md:text-6xl font-display text-sage mb-6">Album Generator</h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed mb-8">
              Create beautiful print-ready albums from your wedding photos with professional Canva
              layouts.
            </p>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
              <div className="bg-gradient-to-br from-sage/20 to-mint/30 rounded-2xl p-6">
                <div className="text-4xl mb-3">📤</div>
                <div className="font-semibold text-sage mb-2">Upload Photos</div>
                <div className="text-sm text-gray-600">Add 5-20 photos with captions</div>
              </div>
              <div className="bg-gradient-to-br from-blush/20 to-cream/40 rounded-2xl p-6">
                <div className="text-4xl mb-3">🎨</div>
                <div className="font-semibold text-blush mb-2">Choose Layout</div>
                <div className="text-sm text-gray-600">Grid, collage, or timeline styles</div>
              </div>
              <div className="bg-gradient-to-br from-mint/30 to-sage/20 rounded-2xl p-6">
                <div className="text-4xl mb-3">🖨️</div>
                <div className="font-semibold text-sage mb-2">Export PDF</div>
                <div className="text-sm text-gray-600">Print-ready 8.5x11" pages</div>
              </div>
            </div>

            <a
              href="/album"
              className="inline-block bg-gradient-sage-blush text-white px-10 py-5 rounded-full font-semibold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Create an Album →
            </a>

            <p className="mt-6 text-sm text-gray-500">
              Full album creation tools available on dedicated page
            </p>
          </div>
        </SectionTransition>
      </div>
    </section>
  );
}
