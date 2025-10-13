import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useEffect } from 'react';

import ErrorBoundary from '../components/ErrorBoundary';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import SEOHead from '../components/SEOHead';
import { SectionLoadingSkeleton } from '../components/LoadingSkeleton';

// Dynamic imports with loading states for code splitting
// This reduces initial bundle size by ~60-70%
const HeroSection = dynamic(() => import('../components/sections/HeroSection'), {
  loading: () => <SectionLoadingSkeleton />,
});

const OurStorySection = dynamic(() => import('../components/sections/OurStorySection'), {
  loading: () => <SectionLoadingSkeleton />,
});

const TimelineSection = dynamic(() => import('../components/sections/TimelineSection'), {
  loading: () => <SectionLoadingSkeleton />,
});

const GallerySection = dynamic(() => import('../components/sections/GallerySection'), {
  loading: () => <SectionLoadingSkeleton />,
  ssr: false, // Gallery is client-side only
});

const VenueSection = dynamic(() => import('../components/sections/VenueSection'), {
  loading: () => <SectionLoadingSkeleton />,
});

const PhotoBoothSection = dynamic(() => import('../components/sections/PhotoBoothSection'), {
  loading: () => <SectionLoadingSkeleton />,
  ssr: false, // Camera requires client-side APIs
});

const GuestBookSection = dynamic(() => import('../components/sections/GuestBookSection'), {
  loading: () => <SectionLoadingSkeleton />,
});

const AlbumSection = dynamic(() => import('../components/sections/AlbumSection'), {
  loading: () => <SectionLoadingSkeleton />,
  ssr: false, // Album creation is client-side only
});

const UploadSection = dynamic(() => import('../components/sections/UploadSection'), {
  loading: () => <SectionLoadingSkeleton />,
  ssr: false, // File upload requires client-side APIs
});

const MapSection = dynamic(() => import('../components/sections/MapSection'), {
  loading: () => <SectionLoadingSkeleton />,
  ssr: false, // Leaflet maps are client-side only
});

export default function Home() {
  // Enable smooth scrolling globally
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  // Prefetch critical resources
  useEffect(() => {
    // Prefetch Firebase config (if not already loaded)
    if (typeof window !== 'undefined' && !window.firebase) {
      import('../lib/firebase').catch((err) => console.warn('Failed to prefetch Firebase:', err));
    }
  }, []);

  return (
    <>
      <SEOHead
        title="Austin & Jordyn - May 10, 2025"
        description="Celebrating the wedding of Austin & Jordyn Porada - May 10, 2025. View photos, videos, leave messages, and relive our special day!"
        url="https://theporadas.com"
        image="https://theporadas.com/og-image.jpg"
        type="website"
      />

      <Head>
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="preconnect" href="https://www.googleapis.com" />

        {/* DNS prefetch for additional domains */}
        <link rel="dns-prefetch" href="https://firebase.googleapis.com" />
        <link rel="dns-prefetch" href="https://firestore.googleapis.com" />
      </Head>

      <ErrorBoundary>
        <Navigation />

        <main className="min-h-screen bg-gradient-to-br from-cream via-mint to-blush/20">
          {/* Hero Section - Welcome & Introduction */}
          <ErrorBoundary>
            <HeroSection />
          </ErrorBoundary>

          {/* Our Story Section - Love Journey Timeline */}
          <ErrorBoundary>
            <OurStorySection />
          </ErrorBoundary>

          {/* Timeline Section - Wedding Day Events */}
          <ErrorBoundary>
            <TimelineSection />
          </ErrorBoundary>

          {/* Gallery Section - Photos & Videos */}
          <ErrorBoundary>
            <GallerySection />
          </ErrorBoundary>

          {/* Venue Section - Ceremony & Reception Locations */}
          <ErrorBoundary>
            <VenueSection />
          </ErrorBoundary>

          {/* Photo Booth Section - Interactive Camera Feature */}
          <ErrorBoundary>
            <PhotoBoothSection />
          </ErrorBoundary>

          {/* Guest Book Section - Messages & Well Wishes */}
          <ErrorBoundary>
            <GuestBookSection />
          </ErrorBoundary>

          {/* Album Section - Create Print Albums */}
          <ErrorBoundary>
            <AlbumSection />
          </ErrorBoundary>

          {/* Upload Section - Share Guest Photos */}
          <ErrorBoundary>
            <UploadSection />
          </ErrorBoundary>

          {/* Map Section - Viewer Locations */}
          <ErrorBoundary>
            <MapSection />
          </ErrorBoundary>
        </main>

        <Footer />
      </ErrorBoundary>
    </>
  );
}
