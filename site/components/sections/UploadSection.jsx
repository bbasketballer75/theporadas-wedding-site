import SectionTransition from '../SectionTransition';

export default function UploadSection() {
  return (
    <section id="upload" className="w-full py-20 bg-gradient-to-br from-sage/10 to-mint/20">
      <div className="container mx-auto px-4 max-w-6xl">
        <SectionTransition>
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <div className="text-7xl mb-6">📤</div>
            <h2 className="text-5xl md:text-6xl font-display text-sage mb-6">Upload Photos</h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed mb-8">
              Share your favorite moments from the wedding! Upload photos and videos to our shared
              album.
            </p>

            <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10">
              <div className="bg-gradient-to-br from-sage/20 to-mint/30 rounded-2xl p-6">
                <div className="text-4xl mb-2">🖼️</div>
                <div className="font-semibold text-sage text-sm">Photos</div>
              </div>
              <div className="bg-gradient-to-br from-blush/20 to-cream/40 rounded-2xl p-6">
                <div className="text-4xl mb-2">🎥</div>
                <div className="font-semibold text-blush text-sm">Videos</div>
              </div>
              <div className="bg-gradient-to-br from-mint/30 to-sage/20 rounded-2xl p-6">
                <div className="text-4xl mb-2">📁</div>
                <div className="font-semibold text-sage text-sm">Drag & Drop</div>
              </div>
              <div className="bg-gradient-to-br from-cream/40 to-blush/20 rounded-2xl p-6">
                <div className="text-4xl mb-2">☁️</div>
                <div className="font-semibold text-blush text-sm">Cloud Storage</div>
              </div>
            </div>

            <a
              href="/upload"
              className="inline-block bg-gradient-sage-blush text-white px-10 py-5 rounded-full font-semibold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Upload Your Photos →
            </a>

            <p className="mt-6 text-sm text-gray-500">
              Drag-and-drop upload interface available on dedicated page
            </p>
          </div>
        </SectionTransition>
      </div>
    </section>
  );
}
