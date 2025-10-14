import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useEffect } from 'react';

import ErrorBoundary from '../components/ErrorBoundary';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import SEOHead from '../components/SEOHead';
import { SectionLoadingSkeleton } from '../components/LoadingSkeleton';

// Dynamic imports with loading states for code splitting
const HeroSection = dynamic(() => import('../components/sections/HeroSection'), {
  loading: () => <SectionLoadingSkeleton />,
});

const GallerySection = dynamic(() => import('../components/sections/GallerySection'), {
  loading: () => <SectionLoadingSkeleton />,
  ssr: false, // Gallery is client-side only
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

        <main className="min-h-screen">
          {/* Hero Section - Welcome & Introduction */}
          <ErrorBoundary>
            <HeroSection />
          </ErrorBoundary>

          {/* Wedding Gallery - Photos & Video */}
          <ErrorBoundary>
            <GallerySection />
          </ErrorBoundary>
        </main>

        <Footer />
      </ErrorBoundary>
    </>
  );
}
