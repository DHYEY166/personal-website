import { Link } from 'react-router-dom';
import { useTheme } from '../styles/useTheme';
import { CONTENT_WIDTH } from '../styles/theme';
import { heroText } from '../data/aboutData';

function scrollToSection(e, id) {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ behavior: 'smooth' });
  window.history.replaceState(null, '', `#${id}`);
}

export default function HeroSection() {
  const { theme } = useTheme();

  return (
    <section id="hero" aria-labelledby="hero-title">
      <div
        style={{
          maxWidth: CONTENT_WIDTH,
          margin: '0 auto',
          padding: 'calc(64px + clamp(48px, 10vw, 120px)) clamp(20px, 4vw, 32px) clamp(24px, 4vw, 40px)',
        }}
      >
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: theme.accent.text,
            marginBottom: 16,
          }}
        >
          Welcome
        </p>

        <h1
          id="hero-title"
          style={{
            fontSize: 'clamp(2.5rem, 6.5vw, 4.25rem)',
            fontWeight: 600,
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            marginBottom: 20,
          }}
        >
          {heroText.greeting}
        </h1>

        <p
          style={{
            fontSize: 'clamp(1.1rem, 2.2vw, 1.35rem)',
            fontWeight: 500,
            color: theme.text.secondary,
            marginBottom: 24,
          }}
        >
          {heroText.roles.join(' · ')}
        </p>

        <p
          style={{
            fontSize: 'clamp(1.05rem, 1.6vw, 1.2rem)',
            color: theme.text.secondary,
            lineHeight: 1.7,
            maxWidth: '60ch',
            marginBottom: 36,
          }}
        >
          {heroText.tagline}
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="#projects" className="btn btn--primary" onClick={(e) => scrollToSection(e, 'projects')}>
            Explore My Work
          </a>
          <Link to="/chatbot" className="btn btn--secondary">
            Chat with AI
          </Link>
        </div>
      </div>
    </section>
  );
}
