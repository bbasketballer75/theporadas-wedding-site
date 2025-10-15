import { useState } from 'react';
import Image from 'next/image';
import SectionTransition from '../SectionTransition';

export default function RingsSection() {
  const [activeRing, setActiveRing] = useState('both');

  const ringImages = {
    both: {
      src: '/images/rings/both-rings.jpg',
      alt: 'Austin and Jordyn wedding rings together',
      title: 'Our Rings Together',
      description: 'Two rings, one love, forever united',
    },
    bride: {
      src: '/images/rings/bride-ring.jpg',
      alt: "Jordyn's engagement and wedding rings",
      title: "Jordyn's Rings",
      description: 'A symbol of eternal love and commitment',
    },
    groom: {
      src: '/images/rings/groom-ring.jpg',
      alt: "Austin's wedding band",
      title: "Austin's Ring",
      description: 'Strength, unity, and forever',
    },
  };

  const ringOptions = [
    { id: 'both', label: 'Both Rings', icon: '💍💍' },
    { id: 'bride', label: "Jordyn's Ring", icon: '💎' },
    { id: 'groom', label: "Austin's Ring", icon: '💍' },
  ];

  return (
    <section
      id="rings"
      className="section-elegant bg-gradient-to-br from-gold-50 via-ivory to-gold-50"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <SectionTransition>
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center items-center mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
              <div className="mx-4 text-4xl">💎</div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
            </div>
            <h2 className="font-display text-5xl md:text-7xl text-gradient-elegant mb-4">
              Our Rings
            </h2>
            <p className="text-xl text-charcoal/70 max-w-2xl mx-auto leading-relaxed">
              Symbols of our eternal love and commitment to one another
            </p>
          </div>
        </SectionTransition>

        {/* Ring Selector */}
        <SectionTransition>
          <div className="flex justify-center mb-12">
            <div className="card-elegant p-2 inline-flex flex-wrap gap-2">
              {ringOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setActiveRing(option.id)}
                  className={`
                    px-6 py-3 rounded-xl font-semibold transition-all duration-300
                    ${
                      activeRing === option.id
                        ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-lg scale-105'
                        : 'text-charcoal/70 hover:text-gold-600 hover:bg-gold-50'
                    }
                  `}
                >
                  <span className="mr-2">{option.icon}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </SectionTransition>

        {/* Ring Display - Interactive with 3D Transform */}
        <SectionTransition>
          <div className="card-elegant p-8 md:p-12 overflow-hidden">
            <div className="relative aspect-[4/3] md:aspect-[16/9] max-w-4xl mx-auto">
              {/* Ring Image with Parallax Effect */}
              <div 
                className="relative w-full h-full transform transition-all duration-700 ease-out"
                style={{
                  transform: 'perspective(1000px) rotateX(2deg)',
                }}
              >
                <Image
                  src={ringImages[activeRing].src}
                  alt={ringImages[activeRing].alt}
                  fill
                  className="object-contain rounded-2xl transition-opacity duration-500"
                  priority
                  quality={95}
                />
                
                {/* Shine Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gold-200/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blush-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Ring Details */}
            <div className="mt-8 text-center">
              <h3 className="text-3xl font-display text-gradient-sage mb-3">
                {ringImages[activeRing].title}
              </h3>
              <p className="text-lg text-charcoal/70 max-w-xl mx-auto">
                {ringImages[activeRing].description}
              </p>
            </div>

            {/* Ring Story/Details */}
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-ivory to-gold-50 rounded-2xl">
                <div className="text-3xl mb-2">✨</div>
                <h4 className="font-semibold text-charcoal mb-2">Timeless Design</h4>
                <p className="text-sm text-charcoal/70">
                  Classic elegance meets modern craftsmanship
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-ivory to-blush-50 rounded-2xl">
                <div className="text-3xl mb-2">💎</div>
                <h4 className="font-semibold text-charcoal mb-2">Precious Metals</h4>
                <p className="text-sm text-charcoal/70">
                  Crafted with love and attention to detail
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-ivory to-sage-50 rounded-2xl">
                <div className="text-3xl mb-2">♾️</div>
                <h4 className="font-semibold text-charcoal mb-2">Eternal Promise</h4>
                <p className="text-sm text-charcoal/70">
                  Symbols of our unbreakable bond
                </p>
              </div>
            </div>
          </div>
        </SectionTransition>
      </div>
    </section>
  );
}
