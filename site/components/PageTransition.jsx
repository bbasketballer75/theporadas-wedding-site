import { motion } from 'framer-motion';

/**
 * PageTransition component - Wraps page content with smooth animations
 * Provides fade-in and slide-up effects for better UX
 */
export default function PageTransition({ children }) {
  const variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    },
  };

  return (
    <motion.div initial="hidden" animate="enter" exit="exit" variants={variants} className="w-full">
      {children}
    </motion.div>
  );
}
