/**
 * StructuredData Component
 * Adds JSON-LD structured data for SEO (Past Wedding Event + Video)
 *
 * This helps search engines understand the content and can enable rich results
 * in Google Search. Includes both Event schema for the wedding and VideoObject
 * schema for the wedding film on YouTube.
 */
export default function StructuredData() {
  // Wedding Event Schema
  const eventData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Austin & Jordyn Porada Wedding',
    description:
      'The wedding celebration of Austin and Jordyn Porada on May 10, 2025. Share in our memories, photos, and videos from our special day.',
    startDate: '2025-05-10T14:00:00-05:00',
    endDate: '2025-05-10T23:00:00-05:00',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Wedding Venue',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'City',
        addressRegion: 'State',
        addressCountry: 'US',
      },
    },
    organizer: {
      '@type': 'Person',
      name: 'Austin Porada',
      email: 'austin@theporadas.com',
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
    image: ['https://wedding-website-sepia-ten.vercel.app/og-image.jpg'],
    url: 'https://wedding-website-sepia-ten.vercel.app',
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/SoldOut',
      price: '0',
      priceCurrency: 'USD',
    },
    recordedIn: {
      '@type': 'CreativeWork',
      name: 'Wedding Photos & Videos Gallery',
      url: 'https://wedding-website-sepia-ten.vercel.app/gallery',
    },
  };

  // Wedding Video Schema
  const videoData = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: 'Austin & Jordyn Wedding Film | May 10, 2025',
    description:
      'Watch the complete wedding film of Austin and Jordyn Porada featuring ceremony, reception, and special moments with interactive chapters.',
    thumbnailUrl: [
      'https://i.ytimg.com/vi/ZOIRb_ghdh0/maxresdefault.jpg',
      'https://i.ytimg.com/vi/ZOIRb_ghdh0/hqdefault.jpg',
    ],
    uploadDate: '2025-10-13T00:00:00Z',
    duration: 'PT45M53S',
    contentUrl: 'https://www.youtube.com/watch?v=ZOIRb_ghdh0',
    embedUrl: 'https://www.youtube.com/embed/ZOIRb_ghdh0',
    interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: { '@type': 'WatchAction' },
      userInteractionCount: 0,
    },
    hasPart: [
      {
        '@type': 'Clip',
        name: 'Bachelor+ette Weekend',
        startOffset: 44,
        endOffset: 300,
        url: 'https://www.youtube.com/watch?v=ZOIRb_ghdh0&t=44s',
      },
      {
        '@type': 'Clip',
        name: 'Who Is It Gameshow',
        startOffset: 300,
        endOffset: 863,
        url: 'https://www.youtube.com/watch?v=ZOIRb_ghdh0&t=300s',
      },
      {
        '@type': 'Clip',
        name: 'Words From Wedding Party',
        startOffset: 863,
        endOffset: 1211,
        url: 'https://www.youtube.com/watch?v=ZOIRb_ghdh0&t=863s',
      },
      {
        '@type': 'Clip',
        name: 'Our Vows',
        startOffset: 1211,
        endOffset: 1537,
        url: 'https://www.youtube.com/watch?v=ZOIRb_ghdh0&t=1211s',
      },
      {
        '@type': 'Clip',
        name: 'The Ceremony',
        startOffset: 1537,
        endOffset: 1688,
        url: 'https://www.youtube.com/watch?v=ZOIRb_ghdh0&t=1537s',
      },
      {
        '@type': 'Clip',
        name: 'The Reception',
        startOffset: 1688,
        endOffset: 1814,
        url: 'https://www.youtube.com/watch?v=ZOIRb_ghdh0&t=1688s',
      },
      {
        '@type': 'Clip',
        name: 'First Dance',
        startOffset: 1814,
        endOffset: 2165,
        url: 'https://www.youtube.com/watch?v=ZOIRb_ghdh0&t=1814s',
      },
      {
        '@type': 'Clip',
        name: 'Behind The Scenes & Bloopers',
        startOffset: 2165,
        endOffset: 2375,
        url: 'https://www.youtube.com/watch?v=ZOIRb_ghdh0&t=2165s',
      },
      {
        '@type': 'Clip',
        name: 'The REAL Party',
        startOffset: 2375,
        endOffset: 2643,
        url: 'https://www.youtube.com/watch?v=ZOIRb_ghdh0&t=2375s',
      },
      {
        '@type': 'Clip',
        name: 'Thank You',
        startOffset: 2643,
        endOffset: 2683,
        url: 'https://www.youtube.com/watch?v=ZOIRb_ghdh0&t=2643s',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoData) }}
      />
    </>
  );
}
