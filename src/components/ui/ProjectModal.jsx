import { useEffect, useId, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export default function ProjectModal({ project, onClose }) {
  const { theme } = useTheme();
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!project) return undefined;
    const previouslyFocused = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      // Keep keyboard focus inside the dialog.
      const items = [...dialogRef.current.querySelectorAll(FOCUSABLE)];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [project]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={e => e.stopPropagation()}
          style={{
            background: theme.name === 'dark' ? '#121230' : '#fff',
            borderRadius: 24,
            border: theme.glass.border,
            boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
            maxWidth: 700,
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto',
            padding: 40,
            position: 'relative',
          }}
        >
          {/* Close button */}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: theme.glass.background,
              border: theme.glass.border,
              color: theme.text.secondary,
              fontSize: 18,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span aria-hidden="true">✕</span>
          </button>

          {/* Gradient bar */}
          <div style={{
            height: 4,
            background: project.gradient,
            borderRadius: 4,
            marginBottom: 24,
          }} />

          <h2 id={titleId} style={{ fontSize: '1.6rem', fontWeight: 800, color: theme.text.heading, marginBottom: 8 }}>
            {project.title}
          </h2>

          {project.badge && (
          <span style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: 6,
            background: `${project.badge.color}25`,
            border: `1px solid ${project.badge.color}50`,
            color: project.badge.color,
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: 20,
          }}>
            {project.badge.text}
          </span>
          )}

          <p style={{ color: theme.text.secondary, fontSize: '0.95rem', lineHeight: 1.8, marginBottom: 24 }}>
            {project.description}
          </p>

          {[
            { label: 'Role', value: project.role },
            { label: 'Challenge', value: project.challenge },
            { label: 'Outcome', value: project.outcome },
          ].filter((item) => item.value).map((item, i) => (
            <p key={i} style={{ fontSize: '0.9rem', marginBottom: 8 }}>
              <span style={{ color: theme.accent.text, fontWeight: 700 }}>{item.label}: </span>
              <span style={{ color: theme.text.secondary }}>{item.value}</span>
            </p>
          ))}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '20px 0' }}>
            {project.tech.map((t, j) => (
              <span key={j} style={{
                padding: '5px 12px',
                borderRadius: 8,
                background: 'rgba(102,126,234,0.12)',
                border: '1px solid rgba(102,126,234,0.25)',
                color: theme.text.muted,
                fontSize: '0.82rem',
                fontWeight: 500,
              }}>
                {t}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                style={{
                  padding: '10px 24px',
                  borderRadius: 10,
                  background: theme.glass.background,
                  border: theme.glass.border,
                  color: theme.accent.text,
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                }}>
                GitHub<span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
            {project.website && (
              <a href={project.website} target="_blank" rel="noopener noreferrer"
                style={{
                  padding: '10px 24px',
                  borderRadius: 10,
                  background: theme.accent.gradient,
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  boxShadow: theme.accent.glow,
                }}>
                {project.websiteLabel ? `Read the ${project.websiteLabel}` : 'Visit Website'}<span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
