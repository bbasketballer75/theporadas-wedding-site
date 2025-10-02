import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/**
 * SectionTransition component - Animates sections when they scroll into view
 * Replaces route-based PageTransition with scroll-triggered animations
 * Maintains same animation timings (0.5s enter, 0.3s exit)
 */
export default function SectionTransition({ children, threshold = 0.2, className = '' }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger animation when section enters viewport
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold, // How much of the section must be visible
        rootMargin: '0px', // No offset from viewport
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  const variants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
