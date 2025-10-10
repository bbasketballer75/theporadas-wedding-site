import { AnimatePresence } from 'framer-motion';
import { Lora, Playfair_Display } from 'next/font/google';
import Head from 'next/head';
import Router from 'next/router';
import { useEffect, useState } from 'react';

import { initAnalytics } from '../lib/analytics';

import '../styles/globals.css';

// Optimize font loading with next/font (2025 best practice)
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-playfair',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-lora',
  display: 'swap',
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
    <>
      <Head>
        <title>Poradas Wedding</title>
        <meta name="description" content="Celebrate the Poradas family wedding!" />
      </Head>
      <div className={`${playfair.variable} ${lora.variable}`}>
        <AnimatePresence mode="wait" initial={false}>
          <Component {...pageProps} key={routeKey} />
        </AnimatePresence>
      </div>
    </>
  );
}
