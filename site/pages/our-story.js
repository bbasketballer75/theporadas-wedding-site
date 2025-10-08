import Head from 'next/head';
import Link from 'next/link';

import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';

export default function OurStory() {
  const milestones = [
    {
      title: 'How We Met',
      date: 'Summer 2015',
      icon: '💫',
      story:
        'Our paths first crossed in the most unexpected way. What started as a chance encounter quickly turned into hours of conversation and endless laughter. We both felt an instant connection that neither of us could ignore.',
      side: 'left',
    },
    {
      title: 'First Date',
      date: 'Fall 2015',
      icon: '🌹',
      story:
        'Our first official date was magical. From the moment we sat down together, time seemed to stand still. We talked about everything and nothing, discovering we had so much in common. By the end of the night, we both knew this was the beginning of something special.',
      side: 'right',
    },
    {
      title: 'Falling in Love',
      date: '2016-2020',
      icon: '❤️',
      story:
        'The years flew by filled with adventures, travels, late-night conversations, and building a life together. We learned each other&rsquo;s quirks, supported each other&rsquo;s dreams, and grew stronger as a couple through every challenge and celebration.',
      side: 'left',
    },
    {
      title: 'The Proposal',
      date: 'October 31, 2022',
      icon: '💍',
      story:
        'On a beautiful autumn evening, Austin asked Jordyn the question we&rsquo;d both been dreaming of. Surrounded by fall colors and with hearts full of love, she said YES! It was the perfect moment to mark the beginning of our forever.',
      side: 'right',
    },
    {
      title: 'Planning Our Future',
      date: '2023-2024',
      icon: '📋',
      story:
        'The wedding planning journey brought us even closer together. From choosing venues to picking colors (sage and blush!), every decision was made with love and excitement for our big day.',
      side: 'left',
    },
    {
      title: 'Our Wedding Day',
      date: 'May 10, 2025',
      icon: '💒',
      story:
        'Surrounded by our loved ones, we said &ldquo;I do&rdquo; and promised to love each other for all our days. It was the most beautiful celebration of our love story, and we couldn&rsquo;t have asked for a more perfect day.',
      side: 'right',
    },
  ];

  return (
    <PageTransition>
      <Head>
        <title>Our Story | Austin & Jordyn</title>
        <meta
          name="description"
          content="The love story of Austin and Jordyn - from first meeting to forever"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-cream via-mint to-blush/20">
        <Navigation />

        <main className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-20 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-display text-sage mb-6">Our Love Story</h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Every love story is beautiful, but ours is our favorite. From our first meeting to our
              wedding day, here&rsquo;s how our journey unfolded.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-sage via-blush to-sage opacity-30"></div>

            {/* Milestones */}
            {milestones.map((milestone, index) => (
              <ScrollReveal key={index}>
                <div
                  className={`relative mb-16 lg:mb-24 ${
                    milestone.side === 'left' ? 'lg:pr-1/2' : 'lg:pl-1/2'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="hidden lg:flex absolute left-1/2 top-12 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-sage to-blush shadow-xl z-10 items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-white"></div>
                  </div>

                  {/* Content Card */}
                  <div
                    className={`lg:w-11/12 ${milestone.side === 'left' ? 'lg:mr-auto' : 'lg:ml-auto'}`}
                  >
                    <div className="bg-white/90 backdrop-blur rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                      {/* Icon & Title */}
                      <div
                        className={`flex items-center gap-4 mb-4 ${milestone.side === 'right' ? 'lg:flex-row-reverse lg:text-right' : ''}`}
                      >
                        <div className="text-6xl">{milestone.icon}</div>
                        <div>
                          <h3 className="text-3xl font-display text-sage mb-1">
                            {milestone.title}
                          </h3>
                          <p className="text-xl text-blush font-semibold">{milestone.date}</p>
                        </div>
                      </div>

                      {/* Story */}
                      <p
                        className={`text-gray-700 leading-relaxed text-lg ${milestone.side === 'right' ? 'lg:text-right' : ''}`}
                      >
                        {milestone.story}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Photo Memories Section */}
          <ScrollReveal>
            <section className="mt-20 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur rounded-3xl shadow-2xl p-8 md:p-12">
              <h2 className="text-4xl font-display text-sage text-center mb-6">
                Our Favorite Memories
              </h2>
              <p className="text-center text-gray-600 mb-10 text-lg">
                A glimpse into the moments that made our journey special
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group relative aspect-square bg-gradient-to-br from-sage/20 to-mint/30 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <span className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      📸
                    </span>
                    <p className="text-sage font-semibold text-lg">Adventures Together</p>
                  </div>
                </div>

                <div className="group relative aspect-square bg-gradient-to-br from-blush/20 to-cream/40 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <span className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      💕
                    </span>
                    <p className="text-blush font-semibold text-lg">Celebrating Love</p>
                  </div>
                </div>

                <div className="group relative aspect-square bg-gradient-to-br from-mint/30 to-sage/20 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <span className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      🎉
                    </span>
                    <p className="text-sage font-semibold text-lg">Making Memories</p>
                  </div>
                </div>
              </div>

              <div className="text-center mt-10">
                <Link
                  href="/gallery"
                  className="inline-block bg-gradient-sage-blush text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  View Our Full Gallery →
                </Link>
              </div>
            </section>
          </ScrollReveal>

          {/* CTA Section */}
          <ScrollReveal>
            <div className="mt-20 bg-gradient-sage-blush rounded-3xl p-12 text-center shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-display text-white mb-4">
                Thank you for being part of our story! 🙏
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                We&rsquo;re so grateful to have shared our special day with you. Explore more
                memories, leave us a message, or share your photos!
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/guestbook"
                  className="bg-white text-sage px-6 py-3 rounded-full font-semibold hover:bg-cream hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  ✍️ Sign Guest Book
                </Link>
                <Link
                  href="/upload"
                  className="bg-white text-sage px-6 py-3 rounded-full font-semibold hover:bg-cream hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  📤 Share Photos
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
