/**
 * StructuredData Component
 * Adds JSON-LD structured data for SEO (Past Wedding Event)
 *
 * This helps search engines understand the content and can enable rich results
 * in Google Search. Since the wedding already occurred (May 10, 2025), we use
 * past tense and mark the event as completed.
 */
export default function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Austin & Jordyn Porada Wedding',
    description:
      'The wedding celebration of Austin and Jordyn Porada, sharing memories, photos, and videos from our special day.',
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
      url: 'https://theporadas.com',
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
    image: ['https://theporadas.com/og-image.jpg'],
    url: 'https://theporadas.com',
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/SoldOut',
      price: '0',
      priceCurrency: 'USD',
    },
    recordedIn: {
      '@type': 'CreativeWork',
      name: 'Wedding Photos & Videos',
      url: 'https://theporadas.com/gallery',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
