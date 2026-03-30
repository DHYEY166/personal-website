import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export default function ProjectModal({ project, onClose }) {
  const { theme } = useTheme();

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
            onClick={onClose}
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
            ✕
          </button>

          {/* Gradient bar */}
          <div style={{
            height: 4,
            background: project.gradient,
            borderRadius: 4,
            marginBottom: 24,
          }} />

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: theme.text.heading, marginBottom: 8 }}>
            {project.title}
          </h2>

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

          <p style={{ color: theme.text.secondary, fontSize: '0.95rem', lineHeight: 1.8, marginBottom: 24 }}>
            {project.description}
          </p>

          {[
            { label: 'Role', value: project.role },
            { label: 'Challenge', value: project.challenge },
            { label: 'Outcome', value: project.outcome },
          ].map((item, i) => (
            <p key={i} style={{ fontSize: '0.9rem', marginBottom: 8 }}>
              <span style={{ color: theme.accent.primary, fontWeight: 700 }}>{item.label}: </span>
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
                  color: theme.accent.primary,
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                }}>
                GitHub
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
                Visit Website
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
