import { AnimatePresence } from 'framer-motion';
import { Lora, Playfair_Display } from 'next/font/google';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
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
  const router = useRouter();

  // Initialize Firebase Analytics on mount (client-side only)
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <>
      <Head>
        <title>Poradas Wedding</title>
        <meta name="description" content="Celebrate the Poradas family wedding!" />
      </Head>
      <div className={`${playfair.variable} ${lora.variable}`}>
        <AnimatePresence mode="wait" initial={false}>
          <Component {...pageProps} key={router.asPath} />
        </AnimatePresence>
      </div>
    </>
  );
}
