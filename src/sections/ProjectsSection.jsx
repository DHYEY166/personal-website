import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { projects, projectCategories } from '../data/projectsData';
import { glassCard, gradientText } from '../styles/theme';
import FilterBar from '../components/ui/FilterBar';
import ProjectModal from '../components/ui/ProjectModal';
import ScrollReveal from '../components/ui/ScrollReveal';

const easeOut = [0.22, 1, 0.36, 1];

const listVariants = {
  hidden: {
    opacity: 0,
    y: 14,
    transition: {
      duration: 0.2,
      ease: easeOut,
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: easeOut,
      staggerChildren: 0.055,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: easeOut,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.34, ease: easeOut },
  },
};

export default function ProjectsSection() {
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = ['All', ...projectCategories];
  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.categories.includes(activeFilter));

  return (
    <section
      id="projects"
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: 'clamp(60px, 10vw, 100px) clamp(16px, 4vw, 24px)',
      }}
    >
      <ScrollReveal>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <p style={{
            fontSize: '0.85rem',
            color: theme.text.muted,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginBottom: 12,
          }}>
            MY WORK
          </p>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800,
            ...gradientText(theme.accent.textGradient),
            marginBottom: 0,
          }}>
            Featured Projects
          </h2>
        </div>
      </ScrollReveal>

      <FilterBar categories={categories} active={activeFilter} onChange={setActiveFilter} />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeFilter}
          role="list"
          aria-label={`Projects filtered by ${activeFilter}`}
          variants={listVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 24,
          }}
        >
          {filtered.map((project) => (
            <motion.div
              key={project.id}
              role="listitem"
              variants={cardVariants}
              whileHover={{
                y: -8,
                boxShadow: theme.glass.shadowHover,
                borderColor: 'rgba(102,126,234,0.2)',
              }}
              onClick={() => setSelectedProject(project)}
              style={{
                ...glassCard(theme),
                overflow: 'hidden',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
              }}
            >
              <div style={{ height: 4, background: project.gradient, borderRadius: '20px 20px 0 0' }} />
              <div style={{ padding: 28, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: theme.text.heading, margin: 0 }}>
                    {project.title}
                  </h3>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    background: `${project.badge.color}25`,
                    border: `1px solid ${project.badge.color}50`,
                    color: project.badge.color,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}>
                    {project.badge.text}
                  </span>
                </div>

                <p style={{ color: theme.text.secondary, fontSize: '0.92rem', lineHeight: 1.7, marginBottom: 20 }}>
                  {project.description.length > 180
                    ? project.description.slice(0, 180) + '...'
                    : project.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20, marginTop: 'auto' }}>
                  {project.tech.slice(0, 5).map((t, j) => (
                    <span key={j} style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      background: 'rgba(102, 126, 234, 0.1)',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      color: theme.text.muted,
                      fontSize: '0.78rem',
                      fontWeight: 500,
                    }}>
                      {t}
                    </span>
                  ))}
                  {project.tech.length > 5 && (
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      background: 'rgba(102, 126, 234, 0.1)',
                      color: theme.text.muted,
                      fontSize: '0.78rem',
                      fontWeight: 500,
                    }}>
                      +{project.tech.length - 5}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{ color: theme.accent.primary, fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
                      GitHub
                    </a>
                  )}
                  {project.website && (
                    <a href={project.website} target="_blank" rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{ color: theme.accent.pink, fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
                      Website
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
}
