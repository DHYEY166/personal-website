import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { skillCategories } from '../data/skillsData';
import { glassCard, gradientText } from '../styles/theme';
import ScrollReveal from '../components/ui/ScrollReveal';

const totalSkills = skillCategories.reduce((sum, cat) => sum + cat.skills.length, 0);

export default function SkillsSection() {
  const { theme, mode } = useTheme();

  return (
    <section
      id="skills"
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
            WHAT I WORK WITH
          </p>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800,
            ...gradientText(theme.accent.textGradient),
            marginBottom: 0,
          }}>
            Technical Skills
          </h2>
          <p style={{ marginTop: 12, marginBottom: 0, fontSize: '0.95rem', color: theme.text.secondary }}>
            {totalSkills} skills across {skillCategories.length} categories
          </p>
        </div>
      </ScrollReveal>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: 24,
        }}
      >
        {skillCategories.map((cat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{
              y: -8,
              boxShadow: theme.glass.shadowHover,
              borderColor: 'rgba(102,126,234,0.2)',
            }}
            style={{
              ...glassCard(theme),
              overflow: 'hidden',
              padding: 0,
            }}
          >
            <div style={{ height: 4, background: cat.color, borderRadius: '20px 20px 0 0' }} />
            <div style={{ padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: theme.text.heading, margin: 0 }}>
                  {cat.title}
                </h3>
                <span
                  aria-label={`${cat.skills.length} skills`}
                  style={{
                    flexShrink: 0,
                    padding: '2px 10px',
                    borderRadius: 999,
                    background: mode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
                    color: theme.text.secondary,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  {cat.skills.length}
                </span>
              </div>
              <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 10, listStyle: 'none', margin: 0, padding: 0 }}>
                {cat.skills.map((skill) => (
                  <li key={skill.name} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '6px 12px',
                    borderRadius: 8,
                    background: `${skill.color}20`,
                    border: `1px solid ${skill.color}40`,
                    color: theme.text.primary,
                    fontSize: '0.85rem',
                    fontWeight: 500,
                  }}>
                    {skill.name}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
