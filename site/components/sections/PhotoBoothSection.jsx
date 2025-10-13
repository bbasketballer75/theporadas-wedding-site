import SectionTransition from '../SectionTransition';

export default function PhotoBoothSection() {
  const _scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="photobooth"
      className="section-elegant bg-gradient-to-br from-ivory via-champagne/30 to-ivory"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <SectionTransition>
          <div className="card-elegant p-12 text-center">
            <div className="flex justify-center items-center mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
              <div className="mx-4 text-6xl float-elegant">📸</div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
            </div>
            <h2 className="font-display text-5xl md:text-7xl text-gradient-elegant mb-6">
              Photo Booth
            </h2>
            <p className="text-xl text-charcoal/70 max-w-2xl mx-auto leading-relaxed mb-8">
              Strike a pose! Take fun photos with filters, wedding-themed frames, and Canva
              overlays.
            </p>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
              <div className="bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl p-6 shadow-elegant hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-3">🎨</div>
                <div className="font-semibold text-sage-700 mb-2">6 Filters</div>
                <div className="text-sm text-charcoal/70">Vintage, B&W, Romantic & more</div>
              </div>
              <div className="bg-gradient-to-br from-blush-100 to-blush-200 rounded-2xl p-6 shadow-elegant hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-3">🖼️</div>
                <div className="font-semibold text-blush-600 mb-2">Canva Frames</div>
                <div className="text-sm text-charcoal/70">Wedding-themed overlay designs</div>
              </div>
              <div className="bg-gradient-to-br from-gold-100 to-gold-200 rounded-2xl p-6 shadow-elegant hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-3">💾</div>
                <div className="font-semibold text-gold-700 mb-2">Download & Share</div>
                <div className="text-sm text-charcoal/70">Save or share instantly</div>
              </div>
            </div>

            <a href="/photobooth" className="btn-primary inline-block">
              Launch Photo Booth →
            </a>

            <p className="mt-6 text-sm text-charcoal/60">
              Full camera, filters, and frame features available on dedicated page
            </p>
          </div>
        </SectionTransition>
      </div>
    </section>
  );
}
