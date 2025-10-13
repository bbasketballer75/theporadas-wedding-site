import SectionTransition from '../SectionTransition';

export default function AlbumSection() {
  return (
    <section
      id="album"
      className="section-elegant bg-gradient-to-br from-ivory via-sage-50/20 to-ivory"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <SectionTransition>
          <div className="card-elegant p-12 text-center">
            <div className="flex justify-center items-center mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
              <div className="mx-4 text-6xl">📖</div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
            </div>
            <h2 className="font-display text-5xl md:text-7xl text-gradient-elegant mb-6">
              Album Generator
            </h2>
            <p className="text-xl text-charcoal/70 max-w-2xl mx-auto leading-relaxed mb-8">
              Create beautiful print-ready albums from your wedding photos with professional Canva
              layouts.
            </p>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
              <div className="bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl p-6 shadow-elegant hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-3">📤</div>
                <div className="font-semibold text-sage-700 mb-2">Upload Photos</div>
                <div className="text-sm text-charcoal/70">Add 5-20 photos with captions</div>
              </div>
              <div className="bg-gradient-to-br from-blush-100 to-blush-200 rounded-2xl p-6 shadow-elegant hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-3">🎨</div>
                <div className="font-semibold text-blush-600 mb-2">Choose Layout</div>
                <div className="text-sm text-charcoal/70">Grid, collage, or timeline styles</div>
              </div>
              <div className="bg-gradient-to-br from-gold-100 to-gold-200 rounded-2xl p-6 shadow-elegant hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-3">🖨️</div>
                <div className="font-semibold text-gold-700 mb-2">Export PDF</div>
                <div className="text-sm text-charcoal/70">Print-ready 8.5x11" pages</div>
              </div>
            </div>

            <a href="/album" className="btn-primary inline-block">
              Create an Album →
            </a>

            <p className="mt-6 text-sm text-charcoal/60">
              Full album creation tools available on dedicated page
            </p>
          </div>
        </SectionTransition>
      </div>
    </section>
  );
}
