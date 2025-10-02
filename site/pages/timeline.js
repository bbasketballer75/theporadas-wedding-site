import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import PageTransition from '../components/PageTransition';
import { db } from '../lib/firebase';

export default function TimelinePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default timeline events (fallback if Firestore is empty)
  const defaultEvents = useMemo(
    () => [
      {
        id: 'ceremony',
        time: '4:00 PM',
        title: 'Ceremony',
        description: 'We said "I do" surrounded by our loved ones in a beautiful outdoor setting.',
        icon: '💍',
        category: 'ceremony',
      },
      {
        id: 'photos',
        time: '5:00 PM',
        title: 'Wedding Party Photos',
        description: 'Captured precious moments with our closest friends and family.',
        icon: '📸',
        category: 'photos',
      },
      {
        id: 'cocktail',
        time: '5:30 PM',
        title: 'Cocktail Hour',
        description: 'Guests enjoyed drinks and appetizers while we finished photos.',
        icon: '🍸',
        category: 'reception',
      },
      {
        id: 'reception',
        time: '6:30 PM',
        title: 'Grand Entrance',
        description: 'We made our entrance as Mr. and Mrs. Porada!',
        icon: '🎉',
        category: 'reception',
      },
      {
        id: 'first-dance',
        time: '7:00 PM',
        title: 'First Dance',
        description: 'Our first dance as a married couple to our special song.',
        icon: '💃',
        category: 'reception',
      },
      {
        id: 'dinner',
        time: '7:15 PM',
        title: 'Dinner Service',
        description: 'A delicious meal shared with all our favorite people.',
        icon: '🍽️',
        category: 'reception',
      },
      {
        id: 'toasts',
        time: '8:00 PM',
        title: 'Toasts & Speeches',
        description: 'Heartfelt words from our parents, best man, and maid of honor.',
        icon: '🥂',
        category: 'reception',
      },
      {
        id: 'cake',
        time: '8:30 PM',
        title: 'Cake Cutting',
        description: 'We cut our beautiful wedding cake (and fed it to each other nicely!).',
        icon: '🎂',
        category: 'reception',
      },
      {
        id: 'dancing',
        time: '9:00 PM',
        title: 'Dance Party',
        description: 'The dance floor was packed all night long! 🕺💃',
        icon: '🎵',
        category: 'reception',
      },
      {
        id: 'bouquet',
        time: '10:00 PM',
        title: 'Bouquet & Garter Toss',
        description: 'A fun tradition with all our single friends.',
        icon: '💐',
        category: 'reception',
      },
      {
        id: 'sendoff',
        time: '11:00 PM',
        title: 'Grand Sendoff',
        description: 'We left under a tunnel of sparklers as husband and wife!',
        icon: '✨',
        category: 'sendoff',
      },
    ],
    []
  );

  useEffect(() => {
    // Try to load events from Firestore
    const eventsRef = collection(db, 'timeline_events');
    const q = query(eventsRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          // Use default events if Firestore is empty
          setEvents(defaultEvents);
        } else {
          const firestoreEvents = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setEvents(firestoreEvents);
        }
        setLoading(false);
      },
      (error) => {
        console.warn('Firestore error, using default events:', error);
        setEvents(defaultEvents);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [defaultEvents]);

  const getCategoryColor = (category) => {
    const colors = {
      ceremony: 'from-sage to-mint',
      photos: 'from-blush to-cream',
      reception: 'from-sage/80 to-blush/80',
      sendoff: 'from-blush via-sage to-mint',
    };
    return colors[category] || 'from-sage to-blush';
  };

  return (
    <PageTransition>
      <Head>
        <title>Wedding Timeline | Austin & Jordyn - May 10, 2025</title>
        <meta
          name="description"
          content="Relive every special moment from our wedding day timeline"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-cream via-mint to-blush/20">
        <Navigation />

        <main className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-display text-sage mb-4">Our Wedding Day</h1>
            <p className="text-2xl text-blush font-display mb-6">May 10, 2025</p>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              From the moment we said &ldquo;I do&rdquo; to our sparkler sendoff, here&rsquo;s how
              our perfect day unfolded. ✨
            </p>
          </div>

          {/* Timeline */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-sage border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading timeline...</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline Line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-sage via-blush to-sage h-full opacity-30"></div>

              {/* Events */}
              <div className="space-y-12">
                {events.map((event, index) => (
                  <div
                    key={event.id}
                    className={`relative animate-fade-in ${
                      index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2 md:text-right'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Timeline Dot */}
                    <div className="hidden md:flex absolute left-1/2 top-8 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-sage to-blush shadow-lg z-10 items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    </div>

                    {/* Event Card */}
                    <div className={`md:w-11/12 ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                      <div
                        className={`bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-sage/20`}
                      >
                        {/* Icon & Time */}
                        <div
                          className={`flex items-center gap-4 mb-4 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                        >
                          <div
                            className={`text-5xl bg-gradient-to-br ${getCategoryColor(event.category)} bg-clip-text`}
                          >
                            {event.icon}
                          </div>
                          <div className={index % 2 !== 0 ? 'md:text-right' : ''}>
                            <h3 className="text-2xl font-display text-sage">{event.title}</h3>
                            <p className="text-lg text-blush font-semibold">{event.time}</p>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-700 leading-relaxed text-lg">{event.description}</p>

                        {/* Category Badge */}
                        <div className={`mt-4 ${index % 2 !== 0 ? 'md:text-right' : ''}`}>
                          <span
                            className={`inline-block px-4 py-1 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${getCategoryColor(event.category)}`}
                          >
                            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-16 text-center bg-gradient-sage-blush rounded-3xl p-12 shadow-2xl">
            <h2 className="text-3xl font-display text-white mb-4">
              Were you there? Share your perspective! 📸
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              We&rsquo;d love to see your photos and videos from any of these moments.
            </p>
            <Link
              href="/upload"
              className="inline-block bg-white text-sage px-8 py-4 rounded-full font-semibold text-lg hover:bg-cream hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Upload Your Memories
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
