import SectionTransition from '../SectionTransition';

export default function HeroSection() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 overflow-hidden"
    >
      {/* Elegant Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-ivory via-champagne/30 to-ivory"></div>
      <div className="absolute inset-0 pattern-dots opacity-40"></div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gold-200/20 rounded-full blur-3xl animate-float"></div>
      <div
        className="absolute bottom-40 right-20 w-40 h-40 bg-sage-200/20 rounded-full blur-3xl animate-float"
        style={{ animationDelay: '1s' }}
      ></div>
      <div
        className="absolute top-1/3 right-10 w-24 h-24 bg-blush-200/20 rounded-full blur-2xl animate-float"
        style={{ animationDelay: '2s' }}
      ></div>

      <SectionTransition className="relative z-10 w-full max-w-6xl text-center">
        {/* Decorative Top Border */}
        <div className="flex justify-center items-center mb-8">
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
          <div
            className="mx-4 text-5xl animate-float"
            style={{ filter: 'drop-shadow(0 4px 8px rgba(212, 175, 55, 0.3))' }}
          >
            💐
          </div>
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
        </div>

        {/* Names with Elegant Typography */}
        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold mb-6 animate-fade-in">
          <span
            className="bg-gradient-to-r from-sage-600 via-sage-500 to-blush-500 bg-clip-text text-transparent"
            style={{ textShadow: '0 2px 20px rgba(74, 140, 102, 0.2)' }}
          >
            Austin
          </span>
          <span className="text-gold-500 mx-3 md:mx-6">&</span>
          <span
            className="bg-gradient-to-r from-blush-500 via-blush-400 to-gold-500 bg-clip-text text-transparent"
            style={{ textShadow: '0 2px 20px rgba(212, 85, 109, 0.2)' }}
          >
            Jordyn
          </span>
        </h1>

        {/* Wedding Date - Elegant Style */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="inline-block px-8 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-elegant border border-gold-200/50">
            <p className="font-display text-2xl md:text-3xl text-charcoal tracking-wider">
              <span className="text-gold-500 font-bold">May 10</span>
              <span className="mx-2 text-dusty">•</span>
              <span className="text-sage-600 font-bold">2025</span>
            </p>
          </div>
        </div>

        {/* Subtitle - Refined Spacing */}
        <p
          className="font-body text-lg md:text-xl text-charcoal/80 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in px-4"
          style={{ animationDelay: '400ms' }}
        >
          Celebrating love, family, and the beautiful memories of our special day.
          <br />
          <span className="text-sage-600 font-semibold">
            Thank you for being part of our journey.
          </span>
        </p>

        {/* CTA Buttons - Sophisticated Design */}
        <div
          className="flex flex-wrap gap-4 justify-center mb-12 animate-fade-in"
          style={{ animationDelay: '600ms' }}
        >
          <button
            onClick={() => scrollToSection('gallery')}
            className="btn-primary group"
            aria-label="View our wedding gallery"
          >
            <span className="flex items-center gap-2">
              <span className="text-2xl group-hover:scale-110 transition-transform">📸</span>
              <span>View Gallery</span>
            </span>
          </button>
          <button
            onClick={() => scrollToSection('upload')}
            className="btn-secondary group"
            aria-label="Upload your photos from the wedding"
          >
            <span className="flex items-center gap-2">
              <span className="text-2xl group-hover:scale-110 transition-transform">⬆️</span>
              <span>Share Photos</span>
            </span>
          </button>
          <button
            onClick={() => scrollToSection('guestbook')}
            className="btn-accent group"
            aria-label="Leave a message in our guestbook"
          >
            <span className="flex items-center gap-2">
              <span className="text-2xl group-hover:scale-110 transition-transform">💌</span>
              <span>Guest Book</span>
            </span>
          </button>
        </div>

        {/* Elegant Quote Card with Enhanced Design */}
        <div className="max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '800ms' }}>
          <div className="card-elegant p-8 md:p-12 relative">
            {/* Decorative Corners */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-gold-400/50 rounded-tl-lg"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-gold-400/50 rounded-tr-lg"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-gold-400/50 rounded-bl-lg"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-gold-400/50 rounded-br-lg"></div>

            <div className="text-6xl text-gold-400 opacity-30 mb-2">&ldquo;</div>
            <p className="font-display text-xl md:text-2xl text-sage-700 italic leading-relaxed mb-2">
              Two hearts, one love, forever intertwined
            </p>
            <div className="text-6xl text-gold-400 opacity-30 text-right">&rdquo;</div>
          </div>
        </div>

        {/* Decorative Bottom Separator */}
        <div className="mt-16 flex justify-center items-center opacity-50">
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-gold-400 to-transparent"></div>
        </div>
      </SectionTransition>
    </section>
  );
}
