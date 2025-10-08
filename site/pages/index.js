import Head from 'next/head';
import { useEffect } from 'react';

import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
// Import all section components
import AlbumSection from '../components/sections/AlbumSection';
import GallerySection from '../components/sections/GallerySection';
import GuestBookSection from '../components/sections/GuestBookSection';
import HeroSection from '../components/sections/HeroSection';
import MapSection from '../components/sections/MapSection';
import OurStorySection from '../components/sections/OurStorySection';
import PhotoBoothSection from '../components/sections/PhotoBoothSection';
import TimelineSection from '../components/sections/TimelineSection';
import UploadSection from '../components/sections/UploadSection';
import VenueSection from '../components/sections/VenueSection';

export default function Home() {
  // Enable smooth scrolling globally
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <>
      <Head>
        <title>Austin & Jordyn - May 10, 2025</title>
        <meta
          name="description"
          content="Celebrating the wedding of Austin & Jordyn - May 10, 2025. View photos, videos, leave messages, and relive our special day!"
        />
      </Head>

      <Navigation />

      <main className="min-h-screen bg-gradient-to-br from-cream via-mint to-blush/20">
        {/* Hero Section - Welcome & Introduction */}
        <HeroSection />

        {/* Our Story Section - Love Journey Timeline */}
        <OurStorySection />

        {/* Timeline Section - Wedding Day Events */}
        <TimelineSection />

        {/* Gallery Section - Photos & Videos */}
        <GallerySection />

        {/* Venue Section - Ceremony & Reception Locations */}
        <VenueSection />

        {/* Photo Booth Section - Interactive Camera Feature */}
        <PhotoBoothSection />

        {/* Guest Book Section - Messages & Well Wishes */}
        <GuestBookSection />

        {/* Album Section - Create Print Albums */}
        <AlbumSection />

        {/* Upload Section - Share Guest Photos */}
        <UploadSection />

        {/* Map Section - Viewer Locations */}
        <MapSection />
      </main>

      <Footer />
    </>
  );
}
