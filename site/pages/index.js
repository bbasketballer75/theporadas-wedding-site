import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useEffect } from 'react';

import ErrorBoundary from '../components/ErrorBoundary';
import LazySection from '../components/LazySection';
import Navigation from '../components/Navigation';
import SEOHead from '../components/SEOHead';
import SectionErrorBoundary from '../components/SectionErrorBoundary';
import SkeletonLoader from '../components/SkeletonLoader';
import { SectionLoadingSkeleton } from '../components/LoadingSkeleton';

// Dynamic imports with loading states for code splitting
const HeroSection = dynamic(() => import('../components/sections/HeroSection'), {
  loading: () => <SectionLoadingSkeleton />,
});

const EngagementGallerySection = dynamic(() => import('../components/sections/EngagementGallerySection'), {
  loading: () => <SectionLoadingSkeleton />,
  ssr: false,
});

const RingsSection = dynamic(() => import('../components/sections/RingsSection'), {
  loading: () => <SectionLoadingSkeleton />,
});

const WeddingTreeSection = dynamic(() => import('../components/sections/WeddingTreeSection'), {
  loading: () => <SectionLoadingSkeleton />,
  ssr: false,
});

const WeddingVideoSection = dynamic(() => import('../components/sections/WeddingVideoSection'), {
  loading: () => <SectionLoadingSkeleton />,
  ssr: false,
});

const SharedAlbumSection = dynamic(() => import('../components/sections/SharedAlbumSection'), {
  loading: () => <SectionLoadingSkeleton />,
  ssr: false,
});

const GuestBookSection = dynamic(() => import('../components/sections/GuestBookSection'), {
  loading: () => <SectionLoadingSkeleton />,
  ssr: false,
});

const MapSection = dynamic(() => import('../components/sections/MapSection'), {
  loading: () => <SectionLoadingSkeleton />,
  ssr: false,
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
        {/* Font preloading for faster LCP - Playfair Display & Lora */}
        <link
          rel="preload"
          href="/_next/static/media/playfair-display-latin-700-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/_next/static/media/lora-latin-400-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="preconnect" href="https://www.googleapis.com" />
        <link rel="preconnect" href="https://www.youtube.com" />

        {/* DNS prefetch for additional domains */}
        <link rel="dns-prefetch" href="https://firebase.googleapis.com" />
        <link rel="dns-prefetch" href="https://firestore.googleapis.com" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
      </Head>

      <ErrorBoundary>
        <Navigation />

        <main className="min-h-screen">
          {/* 1. Short Intro - Welcome & Introduction */}
          <SectionErrorBoundary sectionName="Hero">
            <HeroSection />
          </SectionErrorBoundary>

          {/* 2. Engagement Gallery */}
          <SectionErrorBoundary sectionName="Engagement Gallery">
            <EngagementGallerySection />
          </SectionErrorBoundary>

          {/* 3. Pictures of Rings */}
          <SectionErrorBoundary sectionName="Rings">
            <RingsSection />
          </SectionErrorBoundary>

          {/* 4. Wedding Tree (Interactive) - Us, Parents (unified), Wedding Party */}
          <SectionErrorBoundary sectionName="Wedding Tree">
            <WeddingTreeSection />
          </SectionErrorBoundary>

          {/* 5. Main Wedding Video with Intuitive Chaptering */}
          <SectionErrorBoundary sectionName="Wedding Video">
            <WeddingVideoSection />
          </SectionErrorBoundary>

          {/* 6. Shared Wedding Album - Guest Photo/Video Upload */}
          <SectionErrorBoundary sectionName="Shared Album">
            <SharedAlbumSection />
          </SectionErrorBoundary>

          {/* 7. Interactive Guest Book */}
          <SectionErrorBoundary sectionName="Guest Book">
            <GuestBookSection />
          </SectionErrorBoundary>

          {/* 8. Interactive Map - Where Website Has Been Viewed */}
          <SectionErrorBoundary sectionName="Map">
            <MapSection />
          </SectionErrorBoundary>
        </main>

        {/* Footer - Lazy loaded below fold */}
        <LazySection
          importFunc={() => import('../components/Footer')}
          fallback={<SkeletonLoader type="section" lines={4} />}
        />
      </ErrorBoundary>
    </>
  );
}
