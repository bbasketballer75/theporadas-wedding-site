import SectionTransition from '../SectionTransition';

export default function UploadSection() {
  return (
    <section
      id="upload"
      className="section-elegant bg-gradient-to-br from-ivory via-blush-50/20 to-ivory"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <SectionTransition>
          <div className="card-elegant p-12 text-center">
            <div className="flex justify-center items-center mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
              <div className="mx-4 text-6xl">📤</div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
            </div>
            <h2 className="font-display text-5xl md:text-7xl text-gradient-elegant mb-6">
              Upload Photos
            </h2>
            <p className="text-xl text-charcoal/70 max-w-2xl mx-auto leading-relaxed mb-8">
              Share your favorite moments from the wedding! Upload photos and videos to our shared
              album.
            </p>

            <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10">
              <div className="bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl p-6 shadow-elegant hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-2">🖼️</div>
                <div className="font-semibold text-sage-700 text-sm">Photos</div>
              </div>
              <div className="bg-gradient-to-br from-blush-100 to-blush-200 rounded-2xl p-6 shadow-elegant hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-2">🎥</div>
                <div className="font-semibold text-blush-600 text-sm">Videos</div>
              </div>
              <div className="bg-gradient-to-br from-gold-100 to-gold-200 rounded-2xl p-6 shadow-elegant hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-2">📁</div>
                <div className="font-semibold text-gold-700 text-sm">Drag & Drop</div>
              </div>
              <div className="bg-gradient-to-br from-champagne/50 to-champagne rounded-2xl p-6 shadow-elegant hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-2">☁️</div>
                <div className="font-semibold text-charcoal text-sm">Cloud Storage</div>
              </div>
            </div>

            <a href="/upload" className="btn-primary inline-block">
              Upload Your Photos →
            </a>

            <p className="mt-6 text-sm text-charcoal/60">
              Drag-and-drop upload interface available on dedicated page
            </p>
          </div>
        </SectionTransition>
      </div>
    </section>
  );
}
