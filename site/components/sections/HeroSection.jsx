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
      className="min-h-screen flex flex-col items-center justify-center px-4 pt-20"
    >
      <SectionTransition className="w-full max-w-5xl text-center">
        {/* Floral Accent Top */}
        <div className="flex justify-center items-center mb-8 animate-float">
          <div className="text-6xl">💐</div>
        </div>

        {/* Names */}
        <h1 className="font-display text-6xl md:text-8xl font-bold text-sage mb-4 tracking-wide drop-shadow-lg animate-fade-in">
          Austin & Jordyn
        </h1>

        {/* Wedding Date */}
        <p
          className="font-display text-3xl md:text-4xl text-blush mb-6 animate-fade-in"
          style={{ animationDelay: '200ms' }}
        >
          May 10, 2025
        </p>

        {/* Subtitle */}
        <p
          className="font-body text-xl md:text-2xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in"
          style={{ animationDelay: '400ms' }}
        >
          Celebrating love, family, and the beginning of our forever together.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-wrap gap-4 justify-center mb-12 animate-fade-in"
          style={{ animationDelay: '600ms' }}
        >
          <button
            onClick={() => scrollToSection('gallery')}
            className="px-8 py-4 bg-gradient-sage-blush text-white rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            📸 View Gallery
          </button>
          <button
            onClick={() => scrollToSection('upload')}
            className="px-8 py-4 bg-white text-sage border-2 border-sage rounded-full font-semibold text-lg hover:bg-sage hover:text-white hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            ⬆️ Upload Photos
          </button>
          <button
            onClick={() => scrollToSection('timeline')}
            className="px-8 py-4 bg-white text-blush border-2 border-blush rounded-full font-semibold text-lg hover:bg-blush hover:text-white hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            ⏰ Wedding Timeline
          </button>
        </div>

        {/* Quote Card */}
        <div
          className="max-w-3xl mx-auto rounded-3xl bg-white/80 backdrop-blur shadow-2xl p-8 animate-fade-in"
          style={{ animationDelay: '800ms' }}
        >
          <span className="font-body text-xl text-sage italic leading-relaxed">
            &ldquo;Two hearts, one love, forever intertwined.&rdquo;
          </span>
        </div>
      </SectionTransition>
    </section>
  );
}
