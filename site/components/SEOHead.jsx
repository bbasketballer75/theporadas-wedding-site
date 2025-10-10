import Head from 'next/head';

/**
 * SEO Head Component - Comprehensive meta tags for social sharing and search engines
 * Implements Open Graph, Twitter Cards, and structured data (JSON-LD)
 * 
 * @param {Object} props - SEO configuration
 * @param {string} props.title - Page title (default: "Austin & Jordyn - May 10, 2025")
 * @param {string} props.description - Page description for search engines
 * @param {string} props.image - Social sharing image URL (default: /og-image.jpg)
 * @param {string} props.url - Canonical URL (default: https://theporadas.com)
 * @param {string} props.type - Open Graph type (default: "website")
 */
export default function SEOHead({
  title = 'Austin & Jordyn - May 10, 2025',
  description = 'Celebrating the wedding of Austin & Jordyn Porada - May 10, 2025. View photos, videos, leave messages, and relive our special day!',
  image = 'https://theporadas.com/og-image.jpg',
  url = 'https://theporadas.com',
  type = 'website',
}) {
  const siteName = 'The Poradas Wedding';
  const twitterHandle = '@austinporada'; // Update with actual Twitter handle if available

  // Structured data for wedding event (JSON-LD Schema.org)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Austin & Jordyn Porada Wedding',
    description: description,
    startDate: '2025-05-10T14:00:00-07:00', // Update with actual time and timezone
    endDate: '2025-05-10T23:00:00-07:00',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Wedding Venue', // Update with actual venue name
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'City', // Update with actual city
        addressRegion: 'State', // Update with actual state
        addressCountry: 'US',
      },
    },
    image: image,
    organizer: {
      '@type': 'Person',
      name: 'Austin Porada',
    },
    performer: [
      {
        '@type': 'Person',
        name: 'Austin Porada',
      },
      {
        '@type': 'Person',
        name: 'Jordyn Porada',
      },
    ],
  };

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="author" content="Austin Porada" />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content={twitterHandle} />

      {/* Favicon (multiple sizes for all devices) */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#8B9C8E" />

      {/* iOS Splash Screens */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteName} />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="format-detection" content="telephone=no" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />

      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Head>
  );
}
