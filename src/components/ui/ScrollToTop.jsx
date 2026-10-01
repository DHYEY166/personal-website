import { useState, useEffect } from 'react';
import { useTheme } from '../../styles/useTheme';

export default function ScrollToTop() {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      className="icon-btn"
      onClick={() => window.scrollTo({
        top: 0,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      })}
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: 44,
        height: 44,
        background: theme.bg.surface,
        borderColor: theme.border.strongColor,
        fontSize: 18,
        zIndex: 90,
      }}
      aria-label="Scroll to top"
    >
      <span aria-hidden="true">↑</span>
    </button>
  );
}
