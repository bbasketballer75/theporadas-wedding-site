import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Primary Meta Tags */}
        <meta name="title" content="Austin & Jordyn Porada's Wedding | May 10, 2025" />
        <meta
          name="description"
          content="Celebrate Austin & Jordyn Porada's wedding on May 10, 2025. View our wedding film, browse photos, share memories, and relive our special day."
        />
        <meta name="keywords" content="Porada wedding, Austin Porada, Jordyn Porada, wedding video, wedding photos, May 2025 wedding, wedding gallery, wedding memories" />
        <meta name="author" content="Austin & Jordyn Porada" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://wedding-website-sepia-ten.vercel.app" />
        <meta property="og:title" content="Austin & Jordyn Porada's Wedding | May 10, 2025" />
        <meta
          property="og:description"
          content="Watch our wedding film, browse photos, and share memories from Austin & Jordyn's special day."
        />
        <meta property="og:image" content="https://wedding-website-sepia-ten.vercel.app/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Austin & Jordyn Porada Wedding" />
        <meta property="og:site_name" content="The Poradas Wedding" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://wedding-website-sepia-ten.vercel.app" />
        <meta name="twitter:title" content="Austin & Jordyn Porada's Wedding | May 10, 2025" />
        <meta
          name="twitter:description"
          content="Watch our wedding film, browse photos, and share memories from Austin & Jordyn's special day."
        />
        <meta name="twitter:image" content="https://wedding-website-sepia-ten.vercel.app/og-image.jpg" />
        <meta name="twitter:image:alt" content="Austin & Jordyn Porada Wedding" />

        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <link rel="canonical" href="https://wedding-website-sepia-ten.vercel.app" />

        {/* PWA Primary Tags */}
        <meta name="application-name" content="The Poradas Wedding" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Poradas Wedding" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#8B9C8E" />

        {/* Security - Content Security Policy */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.vercel-scripts.com https://*.google-analytics.com https://*.googletagmanager.com https://firebase.googleapis.com https://*.firebase.googleapis.com https://*.firebaseio.com https://www.youtube.com; style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://*.google-analytics.com https://*.googletagmanager.com https://firebase.googleapis.com https://firebaseinstallations.googleapis.com https://firestore.googleapis.com https://*.firebase.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://www.googleapis.com https://maps.googleapis.com https://*.vercel.app https://*.vercel.com https://*.ingest.sentry.io; frame-src 'self' https://*.google.com https://www.youtube.com https://www.youtube-nocookie.com https://youtube-nocookie.com; object-src 'none'; base-uri 'self'; form-action 'self';"
        />

        {/* PWA Icons */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Fonts handled via next/font in _app.js to avoid external requests */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
