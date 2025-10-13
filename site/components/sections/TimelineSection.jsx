import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';

import { db } from '../../lib/firebase';
import SectionTransition from '../SectionTransition';

export default function TimelineSection() {
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
      ceremony: 'from-sage-500 to-sage-600',
      photos: 'from-blush-500 to-blush-600',
      reception: 'from-sage-600 to-blush-600',
      sendoff: 'from-blush-500 via-gold-500 to-sage-500',
    };
    return colors[category] || 'from-sage-500 to-blush-500';
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="timeline"
      className="section-elegant bg-gradient-to-br from-ivory via-blush-50/30 to-ivory"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <SectionTransition>
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center items-center mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
              <div className="mx-4 text-4xl">⏰</div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
            </div>
            <h2 className="font-display text-5xl md:text-7xl text-gradient-elegant mb-4">
              Our Wedding Day
            </h2>
            <p className="text-2xl text-blush-500 font-display mb-6">May 10, 2025</p>
            <p className="text-xl text-charcoal/80 max-w-2xl mx-auto leading-relaxed">
              From the moment we said &ldquo;I do&rdquo; to our sparkler sendoff, here&rsquo;s how
              our perfect day unfolded. ✨
            </p>
          </div>
        </SectionTransition>

        {/* Timeline */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-sage border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading timeline...</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-sage-500 via-blush-500 to-gold-500 h-full opacity-30"></div>

            {/* Events */}
            <div className="space-y-12">
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className={`relative ${
                    index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2 md:text-right'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="hidden md:flex absolute left-1/2 top-8 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-sage-500 to-blush-500 shadow-glow-gold z-10 items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-white"></div>
                  </div>

                  {/* Event Card */}
                  <div className={`md:w-11/12 ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                    <SectionTransition threshold={0.3}>
                      <div className="card-elegant p-8 hover:-translate-y-1">
                        {/* Icon & Time */}
                        <div
                          className={`flex items-center gap-4 mb-4 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                        >
                          <div className={`text-5xl ${index % 2 === 0 ? 'float-elegant' : ''}`}>
                            {event.icon}
                          </div>
                          <div className={index % 2 !== 0 ? 'md:text-right' : ''}>
                            <h3 className="text-2xl font-display text-sage-600">{event.title}</h3>
                            <p className="text-lg text-blush-500 font-semibold">{event.time}</p>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-charcoal/80 leading-relaxed text-lg">
                          {event.description}
                        </p>

                        {/* Category Badge */}
                        <div className={`mt-4 ${index % 2 !== 0 ? 'md:text-right' : ''}`}>
                          <span
                            className={`inline-block px-4 py-1 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${getCategoryColor(event.category)}`}
                          >
                            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                          </span>
                        </div>
                      </div>
                    </SectionTransition>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <SectionTransition>
          <div className="mt-16 text-center bg-gradient-to-r from-sage-500 via-blush-500 to-gold-500 rounded-3xl p-12 shadow-elegant-lg">
            <h3 className="text-3xl font-display text-white mb-4">
              Were you there? Share your perspective! 📸
            </h3>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              We&rsquo;d love to see your photos and videos from any of these moments.
            </p>
            <button onClick={() => scrollToSection('upload')} className="btn-accent cursor-pointer">
              Upload Your Memories
            </button>
          </div>
        </SectionTransition>
      </div>
    </section>
  );
}
