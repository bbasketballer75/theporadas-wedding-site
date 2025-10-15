import { useState } from 'react';
import SectionTransition from '../SectionTransition';

/**
 * Map Section
 * Interactive world map showing visitor locations with custom pin creation
 */
export default function MapSection() {
  const [showPinForm, setShowPinForm] = useState(false);
  const [pinData, setPinData] = useState({
    name: '',
    location: '',
    color: '#FFD700',
    icon: '📍',
  });

  // Placeholder visitor pins (will connect to geolocation + Firebase)
  const [visitorPins, setVisitorPins] = useState([
    { id: 1, name: 'Sarah & Mike', location: 'New York, USA', color: '#FFD700', icon: '🗽', lat: 40.7128, lng: -74.006 },
    { id: 2, name: 'The Johnsons', location: 'London, UK', color: '#FF69B4', icon: '🇬🇧', lat: 51.5074, lng: -0.1278 },
    { id: 3, name: 'Emily', location: 'Tokyo, Japan', color: '#87CEEB', icon: '🗼', lat: 35.6762, lng: 139.6503 },
    { id: 4, name: 'David & Amanda', location: 'Sydney, Australia', color: '#32CD32', icon: '🦘', lat: -33.8688, lng: 151.2093 },
    { id: 5, name: 'Chris', location: 'Paris, France', color: '#FF4500', icon: '🗼', lat: 48.8566, lng: 2.3522 },
    { id: 6, name: 'Jessica & Tom', location: 'Toronto, Canada', color: '#DA70D6', icon: '🍁', lat: 43.6532, lng: -79.3832 },
  ]);

  const colorOptions = [
    { value: '#FFD700', label: 'Gold' },
    { value: '#FF69B4', label: 'Pink' },
    { value: '#87CEEB', label: 'Sky Blue' },
    { value: '#32CD32', label: 'Green' },
    { value: '#FF4500', label: 'Orange' },
    { value: '#DA70D6', label: 'Orchid' },
  ];

  const iconOptions = ['📍', '❤️', '🗼', '🌟', '🎉', '✨', '🏠', '✈️', '🌍'];

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (!pinData.name || !pinData.location) return;

    const newPin = {
      id: Date.now(),
      ...pinData,
      lat: 0, // Would be fetched from geocoding API
      lng: 0,
    };

    setVisitorPins([...visitorPins, newPin]);
    setPinData({ name: '', location: '', color: '#FFD700', icon: '📍' });
    setShowPinForm(false);
  };

  return (
    <section
      id="map"
      className="section-elegant bg-gradient-to-br from-ivory via-champagne/30 to-ivory"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <SectionTransition>
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center items-center mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
              <div className="mx-4 text-4xl">🗺️</div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
            </div>
            <h2 className="font-display text-5xl md:text-7xl text-gradient-elegant mb-4">
              Visitor Map
            </h2>
            <p className="text-xl text-charcoal/70 max-w-2xl mx-auto leading-relaxed">
              See who's viewing from around the world! Drop your custom pin to share your location.
            </p>
          </div>
        </SectionTransition>

        {/* Stats Grid */}
        <SectionTransition>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl p-6 shadow-elegant hover:-translate-y-1 transition-all duration-300 text-center">
              <div className="text-4xl mb-3">🌍</div>
              <div className="font-semibold text-sage-700 mb-2 text-2xl">{visitorPins.length}</div>
              <div className="text-sm text-charcoal/70">Total Visitors</div>
            </div>
            <div className="bg-gradient-to-br from-blush-100 to-blush-200 rounded-2xl p-6 shadow-elegant hover:-translate-y-1 transition-all duration-300 text-center">
              <div className="text-4xl mb-3">📍</div>
              <div className="font-semibold text-blush-600 mb-2 text-2xl">
                {new Set(visitorPins.map((p) => p.location.split(',')[1]?.trim())).size}
              </div>
              <div className="text-sm text-charcoal/70">Countries</div>
            </div>
            <div className="bg-gradient-to-br from-gold-100 to-gold-200 rounded-2xl p-6 shadow-elegant hover:-translate-y-1 transition-all duration-300 text-center">
              <div className="text-4xl mb-3">✨</div>
              <div className="font-semibold text-gold-700 mb-2 text-2xl">Live</div>
              <div className="text-sm text-charcoal/70">Real-time Updates</div>
            </div>
          </div>
        </SectionTransition>

        {/* Map Placeholder + Pin List */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Display (2/3 width) */}
          <SectionTransition className="lg:col-span-2">
            <div className="card-elegant p-4">
              {/* Placeholder Map - Will integrate Leaflet.js or Google Maps */}
              <div className="relative w-full h-[500px] bg-gradient-to-br from-sage-100/30 to-blush-100/30 rounded-2xl overflow-hidden">
                {/* Simple world map SVG or image placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🗺️</div>
                    <p className="text-charcoal/70 font-semibold">Interactive Map Loading...</p>
                    <p className="text-sm text-charcoal/50 mt-2">
                      (Map integration with Leaflet.js or Google Maps API)
                    </p>
                  </div>
                </div>

                {/* Pin markers overlay (simplified visual) */}
                <div className="absolute inset-0 pointer-events-none">
                  {visitorPins.slice(0, 6).map((pin, index) => (
                    <div
                      key={pin.id}
                      className="absolute animate-bounce"
                      style={{
                        left: `${15 + index * 12}%`,
                        top: `${20 + (index % 3) * 20}%`,
                        animationDelay: `${index * 0.2}s`,
                      }}
                    >
                      <div
                        className="text-3xl drop-shadow-lg"
                        style={{ filter: `drop-shadow(0 0 8px ${pin.color})` }}
                      >
                        {pin.icon}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Pin Button */}
              <button
                onClick={() => setShowPinForm(!showPinForm)}
                className="mt-4 w-full btn-primary py-3 flex items-center justify-center gap-2"
              >
                <span className="text-xl">📍</span>
                {showPinForm ? 'Cancel' : 'Drop Your Pin on the Map'}
              </button>
            </div>
          </SectionTransition>

          {/* Pin List / Form (1/3 width) */}
          <SectionTransition>
            {showPinForm ? (
              /* Custom Pin Creation Form */
              <div className="card-elegant p-6">
                <h3 className="text-xl font-display text-gradient-sage mb-4 text-center">
                  Create Your Custom Pin
                </h3>

                <form onSubmit={handlePinSubmit} className="space-y-4">
                  {/* Name Input */}
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={pinData.name}
                      onChange={(e) => setPinData({ ...pinData, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-lg border-2 border-sage-200 focus:border-sage-400 focus:outline-none"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Location Input */}
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={pinData.location}
                      onChange={(e) => setPinData({ ...pinData, location: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-lg border-2 border-sage-200 focus:border-sage-400 focus:outline-none"
                      placeholder="City, Country"
                    />
                  </div>

                  {/* Icon Selector */}
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                      Pin Icon
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {iconOptions.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setPinData({ ...pinData, icon })}
                          className={`p-2 rounded-lg border-2 transition-all ${
                            pinData.icon === icon
                              ? 'border-sage-500 bg-sage-100 scale-110'
                              : 'border-sage-200 hover:border-sage-300'
                          }`}
                        >
                          <span className="text-2xl">{icon}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Selector */}
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                      Pin Color
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setPinData({ ...pinData, color: color.value })}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            pinData.color === color.value
                              ? 'border-charcoal scale-105'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          style={{ backgroundColor: color.value }}
                        >
                          <span className="text-xs font-semibold text-white drop-shadow">
                            {color.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="bg-gradient-to-br from-ivory to-champagne/50 rounded-lg p-4 text-center">
                    <p className="text-xs text-charcoal/60 mb-2">Preview:</p>
                    <div
                      className="text-4xl inline-block"
                      style={{ filter: `drop-shadow(0 0 8px ${pinData.color})` }}
                    >
                      {pinData.icon}
                    </div>
                    <p className="text-sm font-semibold text-charcoal mt-2">{pinData.name || '...'}</p>
                    <p className="text-xs text-charcoal/60">{pinData.location || '...'}</p>
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="w-full btn-primary py-3">
                    Drop My Pin! 📍
                  </button>
                </form>
              </div>
            ) : (
              /* Visitor Pin List */
              <div>
                <h3 className="text-xl font-display text-gradient-blush mb-4 text-center">
                  Recent Visitors
                </h3>
                <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                  {visitorPins.map((pin) => (
                    <div
                      key={pin.id}
                      className="card-elegant p-4 flex items-center gap-3 hover:shadow-lg transition-shadow"
                    >
                      <div
                        className="text-3xl flex-shrink-0"
                        style={{ filter: `drop-shadow(0 0 6px ${pin.color})` }}
                      >
                        {pin.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-charcoal truncate">{pin.name}</p>
                        <p className="text-xs text-charcoal/60 truncate">{pin.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </SectionTransition>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #a0c4a3, #d4a5a5);
          border-radius: 10px;
        }
      `}</style>
    </section>
  );
}
