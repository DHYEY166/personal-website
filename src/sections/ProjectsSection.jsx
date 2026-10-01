import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../styles/useTheme';
import { projects, projectCategories } from '../data/projectsData';
import { panel, sectionStyle } from '../styles/theme';
import FilterBar from '../components/ui/FilterBar';
import ProjectModal from '../components/ui/ProjectModal';
import SectionHeader from '../components/ui/SectionHeader';

// Filtering cross-fades the grid; no movement.
const listVariants = {
  hidden: { opacity: 0, transition: { duration: 0.15 } },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
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
    <section id="projects" aria-labelledby="projects-title" style={sectionStyle}>
      <div style={{ borderTop: theme.border.default, paddingTop: 'clamp(40px, 6vw, 64px)' }}>
      <SectionHeader id="projects-title" kicker="MY WORK" title="Featured Projects" />

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
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 420px), 1fr))',
            gap: 20,
          }}
        >
          {filtered.map((project) => (
            <div
              key={project.id}
              role="listitem"
              className="card-hover"
              onClick={() => setSelectedProject(project)}
              style={{
                ...panel(theme),
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
              }}
            >
                {project.badge && (
                  <p style={{ color: theme.accent.text, fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
                    {project.badge.text}
                  </p>
                )}
                <h3 style={{ fontSize: 22, marginBottom: 12 }}>
                  {project.title}
                </h3>

                <p style={{ color: theme.text.secondary, fontSize: 16, lineHeight: 1.65, marginBottom: 20 }}>
                  {project.description.length > 180
                    ? project.description.slice(0, 180) + '...'
                    : project.description}
                </p>

                <p style={{ color: theme.text.muted, fontSize: 14, marginBottom: 20, marginTop: 'auto' }}>
                  <span className="sr-only">Technologies: </span>
                  {project.tech.slice(0, 5).join(' · ')}
                  {project.tech.length > 5 && ` · +${project.tech.length - 5}`}
                </p>

                <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(project);
                    }}
                    className="text-link"
                    style={{ fontSize: 15, padding: 0 }}
                  >
                    Details<span className="sr-only"> about {project.title}</span>
                  </button>
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="text-link" style={{ fontSize: 15 }}>
                      GitHub<span className="sr-only"> repository for {project.title} (opens in a new tab)</span>
                    </a>
                  )}
                  {project.website && (
                    <a href={project.website} target="_blank" rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="text-link" style={{ fontSize: 15 }}>
                      {project.websiteLabel || 'Website'}<span className="sr-only"> for {project.title} (opens in a new tab)</span>
                    </a>
                  )}
                </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      </div>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
}
