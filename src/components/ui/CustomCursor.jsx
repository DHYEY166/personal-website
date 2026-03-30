import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useIsMobile } from '../../hooks/useMediaQuery';

export default function CustomCursor() {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const ringRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    if (isMobile) return;

    const handleMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const handleOver = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'a' || tag === 'button' || e.target.style.cursor === 'pointer' || e.target.closest('a, button')) {
        setIsHovering(true);
      }
    };

    const handleOut = () => setIsHovering(false);
    const handleLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mouseover', handleOver, { passive: true });
    window.addEventListener('mouseout', handleOut, { passive: true });
    document.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleOver);
      window.removeEventListener('mouseout', handleOut);
      document.removeEventListener('mouseleave', handleLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <motion.div
        animate={{
          x: position.x - 4,
          y: position.y - 4,
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: 'tween', duration: 0 }}
        style={{
          position: 'fixed',
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: theme.accent.primary,
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'difference',
        }}
      />
      <motion.div
        animate={{
          x: position.x - 20,
          y: position.y - 20,
          opacity: visible ? 1 : 0,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.5 }}
        style={{
          position: 'fixed',
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: `2px solid ${theme.accent.primary}`,
          pointerEvents: 'none',
          zIndex: 9998,
          mixBlendMode: 'difference',
        }}
      />
    </>
  );
}
