import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';

// Navigation component with page routing and scroll-spy for homepage
export default function Navigation() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navLinks = useMemo(
    () => [
      { href: '/', label: 'Home', id: 'hero', isPage: true },
      { href: '/our-story', label: 'Our Story', id: 'our-story', isPage: true },
      { href: '/timeline', label: 'Timeline', id: 'timeline', isPage: true },
      { href: '/gallery', label: 'Gallery', id: 'gallery', isPage: true },
      { href: '/venue', label: 'Venue', id: 'venue', isPage: true },
      { href: '/photobooth', label: 'Photo Booth', id: 'photobooth', isPage: true },
      { href: '/guestbook', label: 'Guest Book', id: 'guestbook', isPage: true },
      { href: '/album', label: 'Album', id: 'album', isPage: true },
      { href: '/upload', label: 'Upload', id: 'upload', isPage: true },
      { href: '/map', label: 'Map', id: 'map', isPage: true },
    ],
    []
  );

  // Scroll-spy: Track which section is currently in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        // Balanced configuration - works for most sections
        rootMargin: '-15% 0px -15% 0px',
        threshold: 0.1,
      }
    );

    // Observe all sections
    navLinks.forEach((link) => {
      const element = document.getElementById(link.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [navLinks]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      // Use block: 'start' to position section at top of viewport (matches test expectations)
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsOpen(false); // Close mobile menu after clicking

      // Manually trigger active state after scroll animation completes
      // Use setTimeout to wait for smooth scroll (typically 500-1000ms)
      setTimeout(() => {
        setActiveSection(id);
      }, 1000);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-elegant shadow-elegant border-b border-gold-200/30">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-3">
        <div className="flex justify-between items-center">
          {/* Logo/Brand - Enhanced */}
          <button
            onClick={() => scrollToSection('hero')}
            className="group font-display text-2xl md:text-3xl font-bold cursor-pointer transition-all duration-300"
            aria-label="Return to top of page"
          >
            <span className="bg-gradient-to-r from-sage-600 to-blush-500 bg-clip-text text-transparent group-hover:from-sage-500 group-hover:to-gold-500 transition-all duration-300">
              A & J
            </span>
            <span className="block h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-sage-500 to-gold-500 transition-all duration-300 rounded-full"></span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`font-body text-base transition-all duration-300 relative group cursor-pointer ${
                  activeSection === link.id
                    ? 'text-sage-600 font-semibold'
                    : 'text-charcoal/70 hover:text-sage-600'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 rounded-full transition-all duration-300 ${
                    activeSection === link.id
                      ? 'w-full bg-gradient-to-r from-sage-500 to-gold-500'
                      : 'w-0 group-hover:w-full bg-gradient-to-r from-sage-400 to-blush-400'
                  }`}
                ></span>
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-sage-600 hover:text-gold-500 transition-colors rounded-lg hover:bg-sage-50"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 animate-fade-in bg-white/50 backdrop-blur-md rounded-2xl p-4 border border-gold-200/30">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`block w-full text-left font-body text-base transition-all duration-300 py-3 px-4 rounded-xl cursor-pointer ${
                  activeSection === link.id
                    ? 'text-sage-600 font-semibold bg-sage-50 shadow-sm'
                    : 'text-charcoal/70 hover:text-sage-600 hover:bg-sage-50/50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
