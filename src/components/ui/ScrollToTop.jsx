import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export default function ScrollToTop() {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            width: 48,
            height: 48,
            borderRadius: 14,
            background: theme.accent.gradient,
            border: 'none',
            color: '#fff',
            fontSize: 20,
            cursor: 'pointer',
            zIndex: 90,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: theme.accent.glow,
          }}
          aria-label="Scroll to top"
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
}
