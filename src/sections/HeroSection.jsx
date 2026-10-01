import { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { heroText } from '../data/aboutData';
import { gradientText } from '../styles/theme';
import { useIsMobile, usePrefersReducedMotion } from '../hooks/useMediaQuery';
import TypeWriter from '../components/ui/TypeWriter';

const HeroScene = lazy(() => import('../components/three/HeroScene'));
const MotionLink = motion.create(Link);

function scrollToSection(e, id) {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ behavior: 'smooth' });
  window.history.replaceState(null, '', `#${id}`);
}

function MeshFallback({ theme }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: theme.bg.mesh,
        opacity: 0.6,
      }}
    />
  );
}

export default function HeroSection() {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const canWebGL =
    !isMobile &&
    !reducedMotion &&
    typeof navigator !== 'undefined' &&
    (navigator.hardwareConcurrency || 4) >= 4;

  // The 3D scene is a separate ~890 kB chunk. Only request it once the page has
  // loaded and the browser is idle, so it stays off the critical rendering path.
  const [loadScene, setLoadScene] = useState(false);
  useEffect(() => {
    if (!canWebGL) return undefined;
    let idleId;
    let timeoutId;
    const start = () => {
      if ('requestIdleCallback' in window) {
        idleId = window.requestIdleCallback(() => setLoadScene(true), { timeout: 3000 });
      } else {
        timeoutId = window.setTimeout(() => setLoadScene(true), 1500);
      }
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => {
      window.removeEventListener('load', start);
      if (idleId && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [canWebGL]);

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: theme.bg.primary,
      }}
    >
      {/* Background layer - negative z-index ensures it stays behind text */}
      <div style={{ position: 'absolute', inset: 0, zIndex: -1 }} aria-hidden="true">
        {canWebGL && loadScene ? (
          <Suspense fallback={<MeshFallback theme={theme} />}>
            <HeroScene />
          </Suspense>
        ) : (
          <MeshFallback theme={theme} />
        )}
      </div>

      {/* Foreground layer */}
      <div
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            maxWidth: 800,
            padding: 'clamp(16px, 4vw, 24px)',
          }}
        >
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: theme.text.muted,
              marginBottom: 16,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Welcome
          </p>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 800,
              ...gradientText(theme.accent.textGradient),
              marginBottom: 16,
              lineHeight: 1.1,
            }}
          >
            {heroText.greeting}
          </h1>

          <p
            style={{
              fontSize: 'clamp(1.2rem, 3vw, 2rem)',
              fontWeight: 600,
              color: theme.text.primary,
              marginBottom: 24,
            }}
          >
            <span className="sr-only">{heroText.roles.join(', ')}</span>
            <span aria-hidden="true">
              <TypeWriter items={heroText.roles} paused={reducedMotion} />
            </span>
          </p>

          <p
            style={{
              fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)',
              color: theme.text.secondary,
              lineHeight: 1.7,
              maxWidth: 650,
              margin: '0 auto 40px',
            }}
          >
            {heroText.tagline}
          </p>

          <div
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <motion.a
              href="#projects"
              onClick={(e) => scrollToSection(e, 'projects')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.3 }}
              style={{
                padding: '14px 32px',
                borderRadius: 12,
                background: theme.accent.gradient,
                color: '#fff',
                fontWeight: 600,
                fontSize: '1rem',
                textDecoration: 'none',
                display: 'inline-block',
                boxShadow: theme.accent.glow,
              }}
            >
              Explore My Work
            </motion.a>

            <MotionLink
              to="/chatbot"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.3 }}
              style={{
                padding: '14px 32px',
                borderRadius: 12,
                background: theme.glass.background,
                backdropFilter: theme.glass.blur,
                WebkitBackdropFilter: theme.glass.blur,
                border: theme.glass.border,
                color: theme.text.primary,
                fontWeight: 600,
                fontSize: '1rem',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Chat with AI
            </MotionLink>
          </div>
        </div>
      </div>
    </section>
  );
}
