import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../styles/useTheme';
import { panel } from '../styles/theme';

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
      <div style={{ ...panel(theme), maxWidth: 520, width: '100%', textAlign: 'center', padding: 'clamp(28px, 6vw, 48px)' }}>
        <p
          style={{
            fontFamily: theme.font.serif,
            fontSize: 'clamp(3.5rem, 12vw, 5rem)',
            fontWeight: 600,
            lineHeight: 1,
            marginBottom: 12,
            color: theme.accent.text,
          }}
          aria-hidden="true"
        >
          404
        </p>
        <h1 style={{ fontSize: 28, marginBottom: 12 }}>
          Page not found
        </h1>
        <p style={{ color: theme.text.secondary, marginBottom: 28 }}>
          The page you are looking for doesn&apos;t exist or has moved.
        </p>
        <Link to="/" className="btn btn--primary">
          Back to home
        </Link>
      </div>
    </main>
  );
}
