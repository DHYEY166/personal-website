import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { glassCard, gradientText } from '../styles/theme';

export default function NotFoundPage() {
  const { theme } = useTheme();

  useEffect(() => {
    const previous = document.title;
    document.title = 'Page not found | Dhyey Desai';
    let robots = document.querySelector('meta[name="robots"]');
    const created = !robots;
    if (created) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'noindex');
    return () => {
      document.title = previous;
      if (created) robots.remove();
    };
  }, []);

  return (
    <main
      id="main"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '96px clamp(16px, 4vw, 24px) 48px',
      }}
    >
      <div style={{ ...glassCard(theme), maxWidth: 520, width: '100%', textAlign: 'center' }}>
        <p
          style={{
            fontSize: 'clamp(3.5rem, 12vw, 5.5rem)',
            fontWeight: 800,
            lineHeight: 1,
            marginBottom: 12,
            ...gradientText(theme.accent.textGradient),
          }}
          aria-hidden="true"
        >
          404
        </p>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: theme.text.heading, marginBottom: 12 }}>
          Page not found
        </h1>
        <p style={{ color: theme.text.secondary, marginBottom: 28 }}>
          The page you are looking for doesn&apos;t exist or has moved.
        </p>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            padding: '12px 28px',
            borderRadius: 12,
            background: theme.accent.gradient,
            color: '#fff',
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: theme.accent.glow,
          }}
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
