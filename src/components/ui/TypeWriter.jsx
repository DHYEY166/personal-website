import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const roles = ['ML Engineer', 'AI Researcher', 'Full-Stack Developer', 'Problem Solver'];

export default function TypeWriter({ items = roles, interval = 3000 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % items.length);
    }, interval);
    return () => clearInterval(timer);
  }, [items.length, interval]);

  return (
    <span style={{ display: 'inline-block', position: 'relative', minWidth: 260 }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={items[index]}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          style={{ display: 'inline-block' }}
        >
          {items[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
