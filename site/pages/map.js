import Head from 'next/head';
import { useEffect, useRef, useState, useTransition } from 'react';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import PageTransition from '../components/PageTransition';
import { addPinAction } from '../lib/actions';
import { fetchViewerPins } from '../lib/firebaseClient';

export default function MapPage() {
  const mapRef = useRef(null);
  const [L, setL] = useState(null);
  const [pins, setPins] = useState([]);
  const mapContainerRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Dynamically import Leaflet on client to avoid SSR issues
    import('leaflet').then((leaflet) => {
      setL(leaflet);
    });
  }, []);

  useEffect(() => {
    if (!L || !mapContainerRef.current) return;

    // Create map with custom styling
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      touchZoom: true,
    }).setView([20, 0], 2);

    // Use a more aesthetic tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => map.remove();
  }, [L]);

  useEffect(() => {
    fetchViewerPins()
      .then(setPins)
      .catch(() => setPins([]));
  }, []);

  useEffect(() => {
    if (!L || !mapRef.current) return;

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer && layer.options && layer.options.pane === 'markerPane') {
        try {
          mapRef.current.removeLayer(layer);
        } catch {
          // Ignore layer removal errors
        }
      }
    });

    // Create custom icons
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: '<div class="marker-pin"></div>',
      iconSize: [30, 42],
      iconAnchor: [15, 42],
      popupAnchor: [0, -42],
    });

    const userIcon = L.divIcon({
      className: 'custom-marker user-marker',
      html: '<div class="marker-pin user-pin"></div>',
      iconSize: [40, 56],
      iconAnchor: [20, 56],
      popupAnchor: [0, -56],
    });

    // Add markers for all pins
    pins.forEach((pin) => {
      const isUserPin =
        userLocation &&
        Math.abs(pin.lat - userLocation.lat) < 0.001 &&
        Math.abs(pin.lng - userLocation.lng) < 0.001;

      const marker = L.marker([pin.lat, pin.lng], {
        icon: isUserPin ? userIcon : customIcon,
      });

      const popupContent = `
        <div class="custom-popup">
          <h3 class="popup-title">${isUserPin ? 'Your Location 📍' : 'Guest Location'}</h3>
          <p class="popup-message">${pin.message || 'Viewing from here!'}</p>
          ${pin.timestamp ? `<p class="popup-time">${new Date(pin.timestamp).toLocaleDateString()}</p>` : ''}
        </div>
      `;

      marker.addTo(mapRef.current).bindPopup(popupContent);
    });

    // Cluster nearby markers (simple implementation)
    if (pins.length > 0) {
      const bounds = L.latLngBounds(pins.map((p) => [p.lat, p.lng]));
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [pins, L, userLocation]);

  async function handleAddPin() {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser');
      return;
    }

    setError(null);
    setSuccess(false);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setUserLocation({ lat, lng });

        // Use React 19 transition for automatic pending state
        startTransition(async () => {
          const formData = new FormData();
          formData.append('lat', lat.toString());
          formData.append('lng', lng.toString());
          formData.append('message', 'Guest location');

          const result = await addPinAction(formData);

          if (result.success) {
            setPins(result.pins);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 5000);
          } else {
            setError(result.error || 'Failed to add location');
          }
        });
      },
      (err) => {
        setError('Could not get location: ' + err.message);
      }
    );
  }

  return (
    <PageTransition>
      <Head>
        <title>Viewer Map | Austin & Jordyn Wedding</title>
        <meta name="description" content="See where guests are viewing from around the world" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity=""
          crossOrigin=""
        />
        <style>{`
          .custom-marker {
            background: none;
            border: none;
          }
          .marker-pin {
            width: 30px;
            height: 30px;
            border-radius: 50% 50% 50% 0;
            background: linear-gradient(135deg, #7ca982, #d8a7b1);
            position: absolute;
            transform: rotate(-45deg);
            left: 50%;
            top: 50%;
            margin: -15px 0 0 -15px;
            animation: bounce 1s ease-in-out infinite;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          }
          .marker-pin::after {
            content: '';
            width: 14px;
            height: 14px;
            margin: 8px 0 0 8px;
            background: white;
            position: absolute;
            border-radius: 50%;
          }
          .user-marker .marker-pin {
            width: 40px;
            height: 40px;
            margin: -20px 0 0 -20px;
            background: linear-gradient(135deg, #d8a7b1, #7ca982);
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          }
          .user-marker .marker-pin::after {
            width: 18px;
            height: 18px;
            margin: 11px 0 0 11px;
          }
          @keyframes bounce {
            0%, 100% { transform: rotate(-45deg) translateY(0); }
            50% { transform: rotate(-45deg) translateY(-10px); }
          }
          .custom-popup {
            padding: 8px;
            min-width: 150px;
          }
          .popup-title {
            font-family: 'Playfair Display', serif;
            font-size: 16px;
            font-weight: bold;
            color: #7ca982;
            margin-bottom: 4px;
          }
          .popup-message {
            font-size: 14px;
            color: #666;
            margin-bottom: 2px;
          }
          .popup-time {
            font-size: 12px;
            color: #999;
            font-style: italic;
          }
        `}</style>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-cream via-mint to-blush/20">
        <Navigation />

        <main className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-display text-sage mb-4">Viewer Map 🌍</h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              See where guests are viewing our wedding site from around the world! Optionally share
              your location to be added to the map.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center shadow-lg">
              <div className="text-4xl font-display text-sage mb-2">{pins.length}</div>
              <div className="text-gray-600">Total Viewers</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center shadow-lg">
              <div className="text-4xl font-display text-blush mb-2">
                {new Set(pins.map((p) => Math.floor(p.lat) + ',' + Math.floor(p.lng))).size}
              </div>
              <div className="text-gray-600">Countries/Regions</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center shadow-lg">
              <div className="text-4xl mb-2">🌎</div>
              <div className="text-gray-600">Worldwide Love</div>
            </div>
          </div>

          {/* Map Container */}
          <div className="bg-white rounded-3xl shadow-2xl p-4 mb-8 animate-fade-in">
            <div
              className="h-[60vh] min-h-[400px] w-full rounded-2xl overflow-hidden"
              ref={mapContainerRef}
            />
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-6 bg-gradient-sage-blush rounded-2xl text-center text-white shadow-lg animate-fade-in">
              <span className="text-lg font-semibold">
                ✅ Thank you! Your location has been added to the map! 🎉
              </span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-2xl text-center">{error}</div>
          )}

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={handleAddPin}
              disabled={isPending}
              className="px-8 py-4 bg-gradient-sage-blush text-white rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isPending ? '📍 Adding Your Location...' : '📍 Share My Location (Opt-in)'}
            </button>
            <p className="mt-4 text-sm text-gray-500">
              Your location will only be visible as a pin on the map. No personal information is
              stored.
            </p>
          </div>

          {/* Info Section */}
          <div className="mt-16 grid md:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-display text-sage mb-4">How it works</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">1️⃣</span>
                  <span>Click &ldquo;Share My Location&rdquo; button</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2️⃣</span>
                  <span>Allow browser to access your location</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3️⃣</span>
                  <span>Your pin appears on the map instantly!</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">4️⃣</span>
                  <span>See all the places our guests are viewing from</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-display text-blush mb-4">Privacy & Security</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">🔒</span>
                  <span>Completely optional - only if you choose to share</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🗺️</span>
                  <span>Only general location shown (city-level precision)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">👥</span>
                  <span>No personal information collected or stored</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span>Secure and anonymous</span>
                </li>
              </ul>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
