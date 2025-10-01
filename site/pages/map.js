import Head from 'next/head';
import { useEffect, useRef, useState, useTransition } from 'react';

import Button from '../components/Button';
import { addPinAction } from '../lib/actions';
import { fetchViewerPins } from '../lib/firebaseClient';

export default function MapPage() {
  const mapRef = useRef(null);
  const [L, setL] = useState(null);
  const [pins, setPins] = useState([]);
  const mapContainerRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  useEffect(() => {
    // Dynamically import Leaflet on client to avoid SSR issues
    import('leaflet').then((leaflet) => {
      setL(leaflet);
    });
  }, []);

  useEffect(() => {
    if (!L || !mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current).setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
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

    // Add markers
    pins.forEach((pin) => {
      const marker = L.marker([pin.lat, pin.lng]);
      marker.addTo(mapRef.current).bindPopup(pin.message || 'Guest location');
    });
  }, [pins, L]);

  async function handleAddPin() {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser');
      return;
    }

    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        // Use React 19 transition for automatic pending state
        startTransition(async () => {
          const formData = new FormData();
          formData.append('lat', lat.toString());
          formData.append('lng', lng.toString());
          formData.append('message', 'Guest location');

          const result = await addPinAction(formData);

          if (result.success) {
            setPins(result.pins);
            alert('Thanks — your location was added!');
          } else {
            setError(result.error || 'Failed to add location');
            alert('Error: ' + (result.error || 'Failed to add location'));
          }
        });
      },
      (err) => {
        setError('Could not get location: ' + err.message);
        alert('Could not get location: ' + err.message);
      }
    );
  }

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity=""
          crossOrigin=""
        />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-mint to-cream p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display text-5xl font-bold text-sage text-center mb-4">Viewer Map</h1>
          <p className="font-body text-lg text-blush text-center mb-8">
            See where guests are viewing from around the world (opt-in)
          </p>

          <div className="bg-white rounded-3xl shadow-2xl mb-8 p-4">
            <div
              className="h-[60vh] min-h-[400px] w-full relative z-0 block"
              style={{
                visibility: 'visible',
                display: 'block',
                height: '60vh',
                minHeight: '400px',
              }}
              ref={mapContainerRef}
            />
          </div>

          <div className="text-center">
            {error && <p className="text-red-600 mb-4 font-body">{error}</p>}
            <Button variant="sage" onClick={handleAddPin} disabled={isPending}>
              {isPending ? 'Adding Location...' : 'Share My Location (opt-in)'}
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
