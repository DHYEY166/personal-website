import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useIsMobile, usePrefersReducedMotion } from '../../hooks/useMediaQuery';

export default function CustomCursor() {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const disabled = isMobile || reducedMotion;

  // Motion values update the DOM directly, so mouse movement does not re-render React.
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.5 });

  const [isHovering, setIsHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (disabled) return;

    const handleMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible((v) => (v ? v : true));
    };

    const handleOver = (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const interactive =
        target.closest('a, button, [role="button"]') ||
        (target instanceof HTMLElement && target.style.cursor === 'pointer');
      setIsHovering(Boolean(interactive));
    };

    const handleLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mouseover', handleOver, { passive: true });
    document.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, [disabled, x, y]);

  if (disabled) return null;

  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: -4,
          left: -4,
          x,
          y,
          opacity: visible ? 1 : 0,
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
        aria-hidden="true"
        animate={{ scale: isHovering ? 1.5 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          position: 'fixed',
          top: -20,
          left: -20,
          x: ringX,
          y: ringY,
          opacity: visible ? 1 : 0,
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
