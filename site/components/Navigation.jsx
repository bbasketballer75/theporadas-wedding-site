import { useEffect, useState } from 'react';

// Navigation component with scroll-spy and smooth scrolling
export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navLinks = [
    { href: '#hero', label: 'Home', id: 'hero' },
    { href: '#our-story', label: 'Our Story', id: 'our-story' },
    { href: '#timeline', label: 'Timeline', id: 'timeline' },
    { href: '#gallery', label: 'Gallery', id: 'gallery' },
    { href: '#venue', label: 'Venue', id: 'venue' },
    { href: '#photobooth', label: 'Photo Booth', id: 'photobooth' },
    { href: '#guestbook', label: 'Guest Book', id: 'guestbook' },
    { href: '#album', label: 'Album', id: 'album' },
    { href: '#upload', label: 'Upload', id: 'upload' },
    { href: '#map', label: 'Map', id: 'map' },
  ];

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
        rootMargin: '-50% 0px -50% 0px', // Trigger when section is in middle of viewport
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
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsOpen(false); // Close mobile menu after clicking
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <button
            onClick={() => scrollToSection('hero')}
            className="font-display text-2xl font-bold text-sage hover:text-blush transition-colors cursor-pointer"
          >
            A & J
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`font-body text-lg transition-colors relative group cursor-pointer ${
                  activeSection === link.id
                    ? 'text-sage font-semibold'
                    : 'text-gray-700 hover:text-sage'
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-sage transition-all duration-300 ${
                    activeSection === link.id ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                ></span>
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-sage hover:text-blush transition-colors"
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
          <div className="md:hidden mt-4 pb-4 space-y-4 animate-fade-in">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`block w-full text-left font-body text-lg transition-colors py-2 cursor-pointer ${
                  activeSection === link.id
                    ? 'text-sage font-semibold'
                    : 'text-gray-700 hover:text-sage'
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
