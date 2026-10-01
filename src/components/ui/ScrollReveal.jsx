import { motion } from 'framer-motion';

/**
 * Gentle fade-in when a block scrolls into view: opacity plus a small upward shift.
 * Kept deliberately subtle; MotionConfig reducedMotion="user" disables the shift.
 */
export default function ScrollReveal({ children, delay = 0, duration = 0.45, distance = 12, once = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-40px' }}
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
