import { Lora, Playfair_Display } from 'next/font/google';
import Head from 'next/head';

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
  return (
    <>
      <Head>
        <title>Poradas Wedding</title>
        <meta name="description" content="Celebrate the Poradas family wedding!" />
      </Head>
      <div className={`${playfair.variable} ${lora.variable}`}>
        <Component {...pageProps} />
      </div>
    </>
  );
}
