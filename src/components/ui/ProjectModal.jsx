import { useEffect, useId, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../styles/useTheme';

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
          background: 'rgba(31, 27, 22, 0.45)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(12px, 4vw, 24px)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={e => e.stopPropagation()}
          style={{
            background: theme.bg.surface,
            borderRadius: theme.radius.lg,
            border: theme.border.default,
            boxShadow: '0 12px 32px rgba(31, 27, 22, 0.12)',
            maxWidth: 700,
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto',
            padding: 'clamp(24px, 5vw, 40px)',
            position: 'relative',
          }}
        >
          {/* Close button */}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="icon-btn"
            style={{ position: 'absolute', top: 12, right: 12, fontSize: 18 }}
          >
            <span aria-hidden="true">✕</span>
          </button>

          {project.badge && (
            <p style={{ color: theme.accent.text, fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
              {project.badge.text}
            </p>
          )}

          <h2 id={titleId} style={{ fontSize: 'clamp(24px, 4vw, 30px)', marginBottom: 16, paddingRight: 32 }}>
            {project.title}
          </h2>

          <p style={{ color: theme.text.secondary, lineHeight: 1.7, marginBottom: 24 }}>
            {project.description}
          </p>

          {[
            { label: 'Role', value: project.role },
            { label: 'Challenge', value: project.challenge },
            { label: 'Outcome', value: project.outcome },
          ].filter((item) => item.value).map((item, i) => (
            <p key={i} style={{ fontSize: 16, marginBottom: 8 }}>
              <span style={{ color: theme.text.primary, fontWeight: 600 }}>{item.label}: </span>
              <span style={{ color: theme.text.secondary }}>{item.value}</span>
            </p>
          ))}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '20px 0' }}>
            {project.tech.map((t, j) => (
              <span key={j} className="tag">
                {t}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn--secondary">
                GitHub<span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
            {project.website && (
              <a href={project.website} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
                {project.websiteLabel ? `Read the ${project.websiteLabel}` : 'Visit Website'}<span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
