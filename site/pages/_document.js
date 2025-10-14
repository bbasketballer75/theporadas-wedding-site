import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
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
