import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import PageTransition from '../components/PageTransition';

export default function VenuePage() {
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

  return (
    <PageTransition>
      <Head>
        <title>Venue Details | Austin & Jordyn Wedding</title>
        <meta name="description" content="Details about our ceremony and reception venues" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-cream via-mint to-blush/20">
        <Navigation />

        <main className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-display text-sage mb-4">Our Venues</h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Where we celebrated the most important day of our lives.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl p-2 inline-flex">
              <button
                onClick={() => setActiveTab('ceremony')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'ceremony'
                    ? 'bg-gradient-sage-blush text-white shadow-lg'
                    : 'text-gray-600 hover:text-sage'
                }`}
              >
                💍 Ceremony
              </button>
              <button
                onClick={() => setActiveTab('reception')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'reception'
                    ? 'bg-gradient-sage-blush text-white shadow-lg'
                    : 'text-gray-600 hover:text-sage'
                }`}
              >
                🎉 Reception
              </button>
            </div>
          </div>

          {/* Venue Content */}
          <div className="grid lg:grid-cols-2 gap-8 animate-fade-in">
            {/* Left Column - Info */}
            <div className="space-y-6">
              {/* Main Info Card */}
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <div className="text-5xl mb-4">{activeVenue.icon}</div>
                <h2 className="text-3xl font-display text-sage mb-2">{activeVenue.name}</h2>
                <p className="text-blush font-semibold text-lg mb-4">{activeVenue.time}</p>
                <p className="text-gray-700 leading-relaxed mb-6">{activeVenue.description}</p>

                {/* Address */}
                <div className="flex items-start gap-3 mb-6 p-4 bg-sage/10 rounded-xl">
                  <svg
                    className="w-6 h-6 text-sage flex-shrink-0 mt-1"
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
                    <p className="font-semibold text-sage mb-1">Address</p>
                    <p className="text-gray-700">{activeVenue.address}</p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeVenue.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sage hover:text-sage/80 font-semibold text-sm mt-2 inline-block underline"
                    >
                      Open in Google Maps →
                    </a>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="font-display text-xl text-sage mb-3">Features & Amenities</h3>
                  <ul className="space-y-2">
                    {activeVenue.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-700">
                        <svg
                          className="w-5 h-5 text-blush flex-shrink-0"
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
                <Link
                  href="/gallery"
                  className="bg-gradient-to-br from-sage to-mint text-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="text-3xl mb-2">📸</div>
                  <div className="font-semibold">View Photos</div>
                </Link>
                <Link
                  href="/timeline"
                  className="bg-gradient-to-br from-blush to-cream text-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="text-3xl mb-2">⏰</div>
                  <div className="font-semibold">See Timeline</div>
                </Link>
              </div>
            </div>

            {/* Right Column - Map */}
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
              <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg">
                <h3 className="font-display text-xl text-sage mb-4 flex items-center gap-2">
                  <span>🚗</span>
                  <span>Getting There</span>
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>
                    <strong className="text-sage">Parking:</strong> Ample free parking available
                    on-site
                  </p>
                  <p>
                    <strong className="text-sage">Public Transit:</strong> Accessible via local bus
                    routes
                  </p>
                  <p>
                    <strong className="text-sage">Rideshare:</strong> Uber & Lyft pickup/dropoff
                    area available
                  </p>
                  <p>
                    <strong className="text-sage">Hotels Nearby:</strong> Several hotels within 5
                    miles
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 bg-gradient-sage-blush rounded-3xl p-12 text-center shadow-2xl">
            <h2 className="text-3xl font-display text-white mb-4">Share Your Venue Photos!</h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Did you capture any beautiful shots of our venues? We&rsquo;d love to see your
              perspective!
            </p>
            <Link
              href="/upload"
              className="inline-block bg-white text-sage px-8 py-4 rounded-full font-semibold text-lg hover:bg-cream hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Upload Photos
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
