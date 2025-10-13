import { useState } from 'react';

import SectionTransition from '../SectionTransition';

export default function VenueSection() {
  const [activeTab, setActiveTab] = useState('ceremony');

  const venueInfo = {
    ceremony: {
      name: 'Ceremony Location',
      address: '123 Beautiful Lane, Wedding City, ST 12345',
      description:
        'Our ceremony took place in a stunning outdoor setting surrounded by nature. The perfect backdrop for our vows with lush greenery and gorgeous floral arrangements.',
      time: '4:00 PM',
      features: [
        'Outdoor Garden Setting',
        'Seating for 150 Guests',
        'Beautiful Natural Lighting',
        'Floral Arch',
        'Professional Photography Area',
      ],
      mapUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968459391!3d40.74844097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus',
      icon: '💍',
    },
    reception: {
      name: 'Reception Venue',
      address: '456 Celebration Ave, Wedding City, ST 12345',
      description:
        'The reception was held in an elegant ballroom with crystal chandeliers, perfect lighting, and amazing acoustics for dancing the night away!',
      time: '6:00 PM - 11:00 PM',
      features: [
        'Grand Ballroom',
        'Seated Dinner for 150',
        'Full Bar & Cocktails',
        'Professional DJ & Dance Floor',
        'Elegant Decor & Lighting',
      ],
      mapUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968459391!3d40.74844097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus',
      icon: '🎉',
    },
  };

  const activeVenue = venueInfo[activeTab];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="venue"
      className="section-elegant bg-gradient-to-br from-ivory via-sage-50/20 to-ivory"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <SectionTransition>
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
              <div className="mx-4 text-4xl">🏛️</div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
            </div>
            <h2 className="font-display text-5xl md:text-7xl text-gradient-elegant mb-4">
              Our Venues
            </h2>
            <p className="text-xl text-charcoal/70 max-w-2xl mx-auto leading-relaxed">
              Where we celebrated the most important day of our lives.
            </p>
          </div>
        </SectionTransition>

        {/* Tab Switcher */}
        <SectionTransition>
          <div className="flex justify-center mb-8">
            <div className="card-elegant p-2 inline-flex">
              <button
                onClick={() => setActiveTab('ceremony')}
                className={
                  activeTab === 'ceremony'
                    ? 'btn-primary'
                    : 'px-8 py-3 rounded-xl font-semibold text-charcoal/70 hover:text-sage-600 hover:bg-sage-50 transition-all duration-300'
                }
              >
                💍 Ceremony
              </button>
              <button
                onClick={() => setActiveTab('reception')}
                className={
                  activeTab === 'reception'
                    ? 'btn-primary'
                    : 'px-8 py-3 rounded-xl font-semibold text-charcoal/70 hover:text-sage-600 hover:bg-sage-50 transition-all duration-300'
                }
              >
                🎉 Reception
              </button>
            </div>
          </div>
        </SectionTransition>

        {/* Venue Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Info */}
          <SectionTransition>
            <div className="space-y-6">
              {/* Main Info Card */}
              <div className="card-elegant p-8">
                <div className="text-5xl mb-4">{activeVenue.icon}</div>
                <h3 className="text-3xl font-display text-sage-600 mb-2">{activeVenue.name}</h3>
                <p className="text-blush-500 font-semibold text-lg mb-4">{activeVenue.time}</p>
                <p className="text-charcoal/80 leading-relaxed mb-6">{activeVenue.description}</p>

                {/* Address */}
                <div className="flex items-start gap-3 mb-6 p-4 bg-sage-100 rounded-xl">
                  <svg
                    className="w-6 h-6 text-sage-600 flex-shrink-0 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold text-sage-700 mb-1">Address</p>
                    <p className="text-charcoal/80">{activeVenue.address}</p>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-display text-xl text-sage-600 mb-3">Features & Amenities</h4>
                  <ul className="space-y-2">
                    {activeVenue.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-charcoal/80">
                        <svg
                          className="w-5 h-5 text-blush-500 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => scrollToSection('gallery')}
                  className="bg-gradient-to-br from-sage-500 to-sage-600 text-white rounded-2xl p-6 text-center hover:shadow-elegant-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <div className="text-3xl mb-2">📸</div>
                  <div className="font-semibold">View Photos</div>
                </button>
                <button
                  onClick={() => scrollToSection('timeline')}
                  className="bg-gradient-to-br from-blush-500 to-blush-600 text-white rounded-2xl p-6 text-center hover:shadow-elegant-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <div className="text-3xl mb-2">⏰</div>
                  <div className="font-semibold">See Timeline</div>
                </button>
              </div>
            </div>
          </SectionTransition>

          {/* Right Column - Map */}
          <SectionTransition>
            <div className="space-y-6">
              {/* Map */}
              <div className="bg-white rounded-3xl shadow-2xl p-4 h-[500px]">
                <iframe
                  src={activeVenue.mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: '1rem' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of ${activeVenue.name}`}
                ></iframe>
              </div>

              {/* Travel Tips */}
              <div className="card-elegant p-6">
                <h4 className="font-display text-xl text-sage-600 mb-4 flex items-center gap-2">
                  <span>🚗</span>
                  <span>Getting There</span>
                </h4>
                <div className="space-y-3 text-sm text-charcoal/80">
                  <p>
                    <strong className="text-sage-700">Parking:</strong> Ample free parking available
                    on-site
                  </p>
                  <p>
                    <strong className="text-sage-700">Public Transit:</strong> Accessible via local
                    bus routes
                  </p>
                  <p>
                    <strong className="text-sage-700">Rideshare:</strong> Uber & Lyft pickup/dropoff
                    area available
                  </p>
                </div>
              </div>
            </div>
          </SectionTransition>
        </div>

        {/* Bottom CTA */}
        <SectionTransition>
          <div className="mt-16 bg-gradient-to-r from-sage-500 via-blush-500 to-gold-500 rounded-3xl p-12 text-center shadow-elegant-lg">
            <h3 className="text-3xl font-display text-white mb-4">Share Your Venue Photos!</h3>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Did you capture any beautiful shots of our venues? We&rsquo;d love to see your
              perspective!
            </p>
            <button onClick={() => scrollToSection('upload')} className="btn-accent cursor-pointer">
              Upload Photos
            </button>
          </div>
        </SectionTransition>
      </div>
    </section>
  );
}
