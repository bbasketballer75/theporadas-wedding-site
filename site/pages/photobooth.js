import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';

import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import PageTransition from '../components/PageTransition';
import { applyCanvaOverlay, fetchCanvaTemplates, isCanvaAvailable } from '../utils/canvaService';

export default function PhotoBoothPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [selectedOverlay, setSelectedOverlay] = useState(null);
  const [overlayTemplates, setOverlayTemplates] = useState([]);
  const [canvaAvailable, setCanvaAvailable] = useState(false);
  const [applyingOverlay, setApplyingOverlay] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [error, setError] = useState('');

  const filters = {
    none: 'None',
    grayscale: 'Black & White',
    sepia: 'Vintage',
    saturate: 'Vibrant',
    romantic: 'Romantic',
    wedding: 'Wedding Glow',
  };

  const filterStyles = {
    none: '',
    grayscale: 'grayscale(100%)',
    sepia: 'sepia(80%) contrast(1.2)',
    saturate: 'saturate(200%) contrast(1.1)',
    romantic: 'sepia(40%) saturate(120%) brightness(110%) hue-rotate(330deg)',
    wedding: 'brightness(110%) contrast(90%) saturate(110%)',
  };

  useEffect(() => {
    // Check if Canva is available and load templates
    const initializeCanva = async () => {
      const available = await isCanvaAvailable();
      setCanvaAvailable(available);

      if (available) {
        const templates = await fetchCanvaTemplates('overlay');
        setOverlayTemplates(templates);
      }
    };

    initializeCanva();

    return () => {
      // Cleanup: stop camera when component unmounts
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      setStream(mediaStream);
      setCameraActive(true);
    } catch (err) {
      console.error('Camera error:', err);
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Apply filter
    context.filter = filterStyles[selectedFilter];

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Reset filter
    context.filter = 'none';

    // Get image data
    const imageData = canvas.toDataURL('image/png');
    setCapturedPhoto(imageData);

    // Flash effect
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 200);
  };

  const downloadPhoto = () => {
    if (!capturedPhoto) return;

    const link = document.createElement('a');
    link.href = capturedPhoto;
    link.download = `porada-wedding-photobooth-${Date.now()}.png`;
    link.click();
  };

  const applyOverlayToPhoto = async () => {
    if (!capturedPhoto || !selectedOverlay) return;

    setApplyingOverlay(true);
    try {
      const compositeImage = await applyCanvaOverlay(capturedPhoto, selectedOverlay);
      setCapturedPhoto(compositeImage);
      setError('');
    } catch (err) {
      console.error('Error applying overlay:', err);
      setError('Failed to apply overlay. Please try again.');
    } finally {
      setApplyingOverlay(false);
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
  };

  const sharePhoto = async () => {
    if (!capturedPhoto) return;

    try {
      const blob = await fetch(capturedPhoto).then((r) => r.blob());
      const file = new File([blob], 'photobooth.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Photo Booth - Austin & Jordyn',
          text: 'Check out this photo booth pic from the wedding!',
        });
      } else {
        // Fallback: download
        downloadPhoto();
      }
    } catch (err) {
      console.error('Share error:', err);
      downloadPhoto();
    }
  };

  return (
    <PageTransition>
      <Head>
        <title>Photo Booth | Austin & Jordyn</title>
        <meta name="description" content="Take fun photos with our virtual photo booth!" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-cream via-mint to-blush/20">
        <Navigation />

        <main className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-display text-sage mb-4">Photo Booth 📸</h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Strike a pose! Take fun photos with filters and share them with us.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Camera/Preview Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 animate-fade-in">
                <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden">
                  {/* Flash Effect */}
                  {showFlash && (
                    <div className="absolute inset-0 bg-white z-50 animate-fade-in"></div>
                  )}

                  {/* Video Feed */}
                  {cameraActive && !capturedPhoto && (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      style={{ filter: filterStyles[selectedFilter] }}
                    ></video>
                  )}

                  {/* Captured Photo */}
                  {capturedPhoto && (
                    
                    <img
                      src={capturedPhoto}
                      alt="Captured"
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Placeholder */}
                  {!cameraActive && !capturedPhoto && (
                    <div className="flex items-center justify-center h-full text-white">
                      <div className="text-center">
                        <svg
                          className="w-24 h-24 mx-auto mb-4 opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <p className="text-lg">Camera Ready</p>
                        <p className="text-sm opacity-75 mt-2">
                          Click &ldquo;Start Camera&rdquo; to begin
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Overlay Decoration */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
                    <div className="text-white/80 text-sm font-semibold bg-black/30 px-3 py-1 rounded-full backdrop-blur">
                      Austin & Jordyn
                    </div>
                    <div className="text-white/80 text-sm font-semibold bg-black/30 px-3 py-1 rounded-full backdrop-blur">
                      May 10, 2025
                    </div>
                  </div>
                </div>

                {/* Hidden Canvas for Capture */}
                <canvas ref={canvasRef} className="hidden"></canvas>

                {/* Error Message */}
                {error && (
                  <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-xl text-center">
                    {error}
                  </div>
                )}

                {/* Controls */}
                <div className="mt-6 flex flex-wrap gap-3 justify-center">
                  {!cameraActive && !capturedPhoto && (
                    <button
                      onClick={startCamera}
                      className="px-8 py-4 bg-gradient-sage-blush text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      📹 Start Camera
                    </button>
                  )}

                  {cameraActive && !capturedPhoto && (
                    <>
                      <button
                        onClick={capturePhoto}
                        className="px-8 py-4 bg-gradient-sage-blush text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        📸 Capture Photo
                      </button>
                      <button
                        onClick={stopCamera}
                        className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                      >
                        Stop Camera
                      </button>
                    </>
                  )}

                  {capturedPhoto && (
                    <>
                      <button
                        onClick={downloadPhoto}
                        className="px-6 py-4 bg-gradient-sage-blush text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        💾 Download
                      </button>
                      <button
                        onClick={sharePhoto}
                        className="px-6 py-4 bg-gradient-sage-blush text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        📤 Share
                      </button>
                      <button
                        onClick={retakePhoto}
                        className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                      >
                        🔄 Retake
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Filters and Overlays Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl shadow-2xl p-6 animate-fade-in">
                <h2 className="text-2xl font-display text-sage mb-4 text-center">Filters ✨</h2>
                <div className="space-y-3">
                  {Object.entries(filters).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedFilter(key)}
                      disabled={!!capturedPhoto}
                      className={`w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        selectedFilter === key
                          ? 'bg-gradient-sage-blush text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Canva Overlays Section */}
              {canvaAvailable && overlayTemplates.length > 0 && (
                <div className="bg-white rounded-3xl shadow-2xl p-6 animate-fade-in">
                  <h2 className="text-2xl font-display text-sage mb-4 text-center">Frames 🖼️</h2>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    <button
                      onClick={() => setSelectedOverlay(null)}
                      className={`w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        !selectedOverlay
                          ? 'bg-gradient-sage-blush text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      No Frame
                    </button>
                    {overlayTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedOverlay(template.id)}
                        className={`w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300 text-left ${
                          selectedOverlay === template.id
                            ? 'bg-gradient-sage-blush text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <div className="font-semibold">{template.name}</div>
                        <div className="text-xs opacity-75 mt-1">{template.description}</div>
                      </button>
                    ))}
                  </div>
                  {capturedPhoto && selectedOverlay && (
                    <button
                      onClick={applyOverlayToPhoto}
                      disabled={applyingOverlay}
                      className="w-full mt-4 px-4 py-3 bg-sage text-white rounded-xl font-semibold hover:bg-sage/90 transition-colors disabled:opacity-50"
                    >
                      {applyingOverlay ? '⏳ Applying...' : '✨ Apply Frame'}
                    </button>
                  )}
                </div>
              )}

              {!canvaAvailable && (
                <div className="bg-blush/10 rounded-2xl p-4 text-center text-sm text-gray-600">
                  <div className="text-2xl mb-2">🎨</div>
                  <div className="font-semibold mb-1">Canva Frames Coming Soon!</div>
                  <div className="text-xs">Authenticate Canva to unlock wedding-themed frames</div>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-gradient-to-br from-sage/10 to-blush/10 rounded-2xl p-6 backdrop-blur">
                <h3 className="font-display text-lg text-sage mb-3">How it works:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2">1️⃣</span>
                    <span>Click &ldquo;Start Camera&rdquo; and allow camera access</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">2️⃣</span>
                    <span>Choose a filter from the list</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">3️⃣</span>
                    <span>Strike a pose and click &ldquo;Capture Photo&rdquo;</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">4️⃣</span>
                    <span>Download or share your photo!</span>
                  </li>
                </ul>
              </div>

              {/* Fun Stats */}
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                <div className="text-3xl mb-2">🎉</div>
                <div className="text-sm text-gray-600">Photos make memories last forever!</div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
