import { AnimatePresence } from 'framer-motion';
import { Lora, Playfair_Display } from 'next/font/google';
import Head from 'next/head';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';

import ErrorBoundary from '../components/ErrorBoundary';
import StructuredData from '../components/StructuredData';
import { initAnalytics } from '../lib/analytics';
import { reportWebVitals as reportWebVitalsUtil } from '../lib/reportWebVitals';
// Validate environment variables at startup
import '../lib/env';

import '../styles/globals.css';

// Optimize font loading with next/font (2025 best practice)
// Uses Google Fonts API v2 with automatic subsetting and preloading
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-playfair',
  display: 'swap', // Show fallback immediately, swap when font loads
  preload: true, // Preload font for faster initial render
  fallback: ['Georgia', 'serif'],
});

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-lora',
  display: 'swap', // Show fallback immediately, swap when font loads
  preload: true, // Preload font for faster initial render
  fallback: ['Georgia', 'serif'],
});

export default function App({ Component, pageProps }) {
  const [routeKey, setRouteKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname + window.location.search + window.location.hash;
    }
    return Component?.name || 'app';
  });

  // Initialize Firebase Analytics on mount (client-side only)
  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    const updateRouteKey = () => {
      setRouteKey(window.location.pathname + window.location.search + window.location.hash);
    };

    updateRouteKey();
    Router.events.on('routeChangeComplete', updateRouteKey);
    Router.events.on('hashChangeComplete', updateRouteKey);

    return () => {
      Router.events.off('routeChangeComplete', updateRouteKey);
      Router.events.off('hashChangeComplete', updateRouteKey);
    };
  }, []);

  return (
    <ErrorBoundary>
      <Head>
        <title>Poradas Wedding</title>
        <meta name="description" content="Celebrate the Poradas family wedding!" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <StructuredData />
      </Head>
      <div className={`${playfair.variable} ${lora.variable}`}>
        <AnimatePresence mode="wait" initial={false}>
          <Component {...pageProps} key={routeKey} />
        </AnimatePresence>
        <Analytics />
      </div>
    </ErrorBoundary>
  );
}

// Export Web Vitals reporting for Next.js
export function reportWebVitals(metric) {
  reportWebVitalsUtil(metric);
}
