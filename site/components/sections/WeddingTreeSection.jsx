import { useState } from 'react';
import Image from 'next/image';
import SectionTransition from '../SectionTransition';

export default function WeddingTreeSection() {
  const [activeVideo, setActiveVideo] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(false);

  // Couple data
  const couple = {
    bride: {
      name: 'Jordyn Porada',
      image: '/images/tree/jordyn.jpg',
      role: 'Bride',
    },
    groom: {
      name: 'Austin Porada',
      image: '/images/tree/austin.jpg',
      role: 'Groom',
    },
  };

  // Parents data - ALL TOGETHER (not separated by side)
  const parents = [
    {
      id: 'mom-jordyn',
      name: "Jordyn's Mother",
      fullName: 'Jane Doe',
      image: '/images/tree/parent-mom-jordyn.jpg',
      videoUrl: '/videos/parents/mom-jordyn-message.mp4',
      role: "Mother of the Bride",
    },
    {
      id: 'dad-jordyn',
      name: "Jordyn's Father",
      fullName: 'John Doe',
      image: '/images/tree/parent-dad-jordyn.jpg',
      videoUrl: '/videos/parents/dad-jordyn-message.mp4',
      role: "Father of the Bride",
    },
    {
      id: 'mom-austin',
      name: "Austin's Mother",
      fullName: 'Mary Porada',
      image: '/images/tree/parent-mom-austin.jpg',
      videoUrl: '/videos/parents/mom-austin-message.mp4',
      role: "Mother of the Groom",
    },
    {
      id: 'dad-austin',
      name: "Austin's Father",
      fullName: 'Mike Porada',
      image: '/images/tree/parent-dad-austin.jpg',
      videoUrl: '/videos/parents/dad-austin-message.mp4',
      role: "Father of the Groom",
    },
  ];

  // Wedding party data
  const weddingParty = {
    bridesmaids: [
      { name: 'Sarah Johnson', image: '/images/tree/bridesmaid-1.jpg', role: 'Maid of Honor' },
      { name: 'Emily Davis', image: '/images/tree/bridesmaid-2.jpg', role: 'Bridesmaid' },
      { name: 'Rachel Smith', image: '/images/tree/bridesmaid-3.jpg', role: 'Bridesmaid' },
      { name: 'Lisa Brown', image: '/images/tree/bridesmaid-4.jpg', role: 'Bridesmaid' },
    ],
    groomsmen: [
      { name: 'James Wilson', image: '/images/tree/groomsman-1.jpg', role: 'Best Man' },
      { name: 'Michael Taylor', image: '/images/tree/groomsman-2.jpg', role: 'Groomsman' },
      { name: 'David Anderson', image: '/images/tree/groomsman-3.jpg', role: 'Groomsman' },
      { name: 'Chris Martinez', image: '/images/tree/groomsman-4.jpg', role: 'Groomsman' },
    ],
  };

  const handleParentClick = (parent) => {
    setActiveVideo(parent);
    setPlayingVideo(true);
  };

  const closeVideo = () => {
    setPlayingVideo(false);
    setTimeout(() => setActiveVideo(null), 300);
  };

  return (
    <section
      id="wedding-tree"
      className="section-elegant bg-gradient-to-br from-sage-50 via-ivory to-sage-50 relative overflow-hidden"
    >
      {/* Decorative Tree Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none">
          <path
            d="M600 700 Q600 500, 500 400 Q400 300, 350 200"
            stroke="currentColor"
            strokeWidth="4"
            className="text-sage-600"
          />
          <path
            d="M600 700 Q600 500, 700 400 Q800 300, 850 200"
            stroke="currentColor"
            strokeWidth="4"
            className="text-sage-600"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <SectionTransition>
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center items-center mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-sage-500 to-transparent"></div>
              <div className="mx-4 text-4xl">🌳</div>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-sage-500 to-transparent"></div>
            </div>
            <h2 className="font-display text-5xl md:text-7xl text-gradient-elegant mb-4">
              Our Wedding Tree
            </h2>
            <p className="text-xl text-charcoal/70 max-w-2xl mx-auto leading-relaxed">
              The beautiful people who shaped our lives and celebrate our love
            </p>
          </div>
        </SectionTransition>

        {/* 4a. The Couple */}
        <SectionTransition>
          <div className="mb-20">
            <h3 className="text-3xl font-display text-center text-gradient-sage mb-12">
              💑 Us
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              {/* Groom */}
              <div className="relative group">
                <div className="relative w-48 h-48 rounded-full overflow-hidden ring-4 ring-sage-200 shadow-2xl transform transition-all duration-500 hover:scale-110 hover:ring-sage-400">
                  <Image
                    src={couple.groom.image}
                    alt={couple.groom.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="mt-4 text-center">
                  <p className="font-display text-2xl text-charcoal">{couple.groom.name}</p>
                  <p className="text-sage-600 font-semibold">{couple.groom.role}</p>
                </div>
              </div>

              {/* Heart */}
              <div className="text-6xl animate-pulse">❤️</div>

              {/* Bride */}
              <div className="relative group">
                <div className="relative w-48 h-48 rounded-full overflow-hidden ring-4 ring-blush-200 shadow-2xl transform transition-all duration-500 hover:scale-110 hover:ring-blush-400">
                  <Image
                    src={couple.bride.image}
                    alt={couple.bride.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="mt-4 text-center">
                  <p className="font-display text-2xl text-charcoal">{couple.bride.name}</p>
                  <p className="text-blush-600 font-semibold">{couple.bride.role}</p>
                </div>
              </div>
            </div>
          </div>
        </SectionTransition>

        {/* 4b. Our Parents - ALL TOGETHER */}
        <SectionTransition>
          <div className="mb-20">
            <h3 className="text-3xl font-display text-center text-gradient-sage mb-8">
              👨‍👩‍👧‍👦 Our Parents
            </h3>
            <p className="text-center text-charcoal/70 mb-12 max-w-2xl mx-auto">
              Click on any parent to watch their special video message
            </p>
            
            {/* Unified Parents Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
              {parents.map((parent) => (
                <div
                  key={parent.id}
                  onClick={() => handleParentClick(parent)}
                  className="relative group cursor-pointer"
                >
                  {/* Photo with Video Play Icon */}
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden ring-2 ring-gold-200 shadow-xl transform transition-all duration-500 hover:scale-105 hover:ring-4 hover:ring-gold-400 hover:shadow-2xl">
                    <Image
                      src={parent.image}
                      alt={parent.fullName}
                      fill
                      className="object-cover"
                    />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <svg className="w-8 h-8 text-gold-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>

                    {/* Video Indicator Badge */}
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      VIDEO
                    </div>
                  </div>

                  {/* Name and Role */}
                  <div className="mt-4 text-center">
                    <p className="font-semibold text-charcoal text-sm md:text-base">{parent.fullName}</p>
                    <p className="text-gold-600 text-xs md:text-sm">{parent.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionTransition>

        {/* 4c. Wedding Party */}
        <SectionTransition>
          <div>
            <h3 className="text-3xl font-display text-center text-gradient-sage mb-12">
              👰🤵 Our Wedding Party
            </h3>
            
            <div className="grid md:grid-cols-2 gap-12">
              {/* Bridesmaids */}
              <div>
                <h4 className="text-2xl font-display text-blush-600 text-center mb-6">Bridesmaids</h4>
                <div className="grid grid-cols-2 gap-4">
                  {weddingParty.bridesmaids.map((person, index) => (
                    <div key={index} className="text-center group">
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden ring-2 ring-blush-200 shadow-lg transform transition-all duration-300 hover:scale-105 hover:ring-blush-400">
                        <Image
                          src={person.image}
                          alt={person.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="mt-3">
                        <p className="font-semibold text-charcoal text-sm">{person.name}</p>
                        <p className="text-blush-600 text-xs">{person.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Groomsmen */}
              <div>
                <h4 className="text-2xl font-display text-sage-600 text-center mb-6">Groomsmen</h4>
                <div className="grid grid-cols-2 gap-4">
                  {weddingParty.groomsmen.map((person, index) => (
                    <div key={index} className="text-center group">
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden ring-2 ring-sage-200 shadow-lg transform transition-all duration-300 hover:scale-105 hover:ring-sage-400">
                        <Image
                          src={person.image}
                          alt={person.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="mt-3">
                        <p className="font-semibold text-charcoal text-sm">{person.name}</p>
                        <p className="text-sage-600 text-xs">{person.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SectionTransition>
      </div>

      {/* Inline Video Player Modal */}
      {playingVideo && activeVideo && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={closeVideo}
        >
          <button
            onClick={closeVideo}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
            aria-label="Close video"
          >
            &times;
          </button>

          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* Video Title */}
            <div className="text-center mb-6">
              <h3 className="text-3xl font-display text-white mb-2">
                {activeVideo.fullName}
              </h3>
              <p className="text-gold-300 text-lg">{activeVideo.role}</p>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
              <video
                src={activeVideo.videoUrl}
                controls
                autoPlay
                className="w-full h-full"
                controlsList="nodownload"
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Message */}
            <div className="text-center mt-6 text-white/80 text-sm">
              A special message from {activeVideo.fullName}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
