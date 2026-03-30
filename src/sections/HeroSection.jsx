import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { heroText } from '../data/aboutData';
import { gradientText } from '../styles/theme';
import { useIsMobile } from '../hooks/useMediaQuery';
import TypeWriter from '../components/ui/TypeWriter';

const HeroScene = lazy(() => import('../components/three/HeroScene'));

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
  const canWebGL = !isMobile && typeof navigator !== 'undefined' && (navigator.hardwareConcurrency || 4) >= 4;

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
      {/* Background layer: 3D scene or gradient fallback */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {canWebGL ? (
          <Suspense fallback={<MeshFallback theme={theme} />}>
            <HeroScene />
          </Suspense>
        ) : (
          <MeshFallback theme={theme} />
        )}
      </div>

      {/* Foreground layer: text content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            textAlign: 'center',
            maxWidth: 800,
            padding: 'clamp(16px, 4vw, 24px)',
          }}
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: theme.text.muted,
              marginBottom: 16,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Welcome
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 800,
              ...gradientText(theme.accent.textGradient),
              marginBottom: 16,
              lineHeight: 1.1,
            }}
          >
            {heroText.greeting}
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{
              fontSize: 'clamp(1.2rem, 3vw, 2rem)',
              fontWeight: 600,
              color: theme.text.primary,
              marginBottom: 24,
            }}
          >
            <TypeWriter items={['ML Engineer', 'AI Researcher', 'Full-Stack Developer', 'Problem Solver']} />
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{
              fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)',
              color: theme.text.secondary,
              lineHeight: 1.7,
              maxWidth: 650,
              margin: '0 auto 40px',
            }}
          >
            {heroText.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <motion.a
              href="#about"
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

            <motion.a
              href="/chatbot"
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
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
