import { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal Component
 * Implements intersection observer for scroll-triggered animations
 * 2025 Design Trend: Micro-interactions and smooth animations
 *
 * @param {React.ReactNode} children - Content to animate
 * @param {string} className - Additional CSS classes
 * @param {number} threshold - Intersection threshold (0-1)
 * @param {string} direction - Animation direction: 'up', 'down', 'left', 'right'
 */
export default function ScrollReveal({
  children,
  className = '',
  threshold = 0.1,
  direction = 'up',
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  // Direction-based translate classes
  const directionClasses = {
    up: isVisible ? 'translate-y-0' : 'translate-y-10',
    down: isVisible ? 'translate-y-0' : '-translate-y-10',
    left: isVisible ? 'translate-x-0' : 'translate-x-10',
    right: isVisible ? 'translate-x-0' : '-translate-x-10',
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${directionClasses[direction]} ${className}`}
    >
      {children}
    </div>
  );
}
