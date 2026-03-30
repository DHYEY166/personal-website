import { motion, useScroll } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export default function ScrollProgressBar() {
  const { theme } = useTheme();
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: theme.accent.gradient,
        transformOrigin: '0%',
        scaleX: scrollYProgress,
        zIndex: 200,
      }}
    />
  );
}
