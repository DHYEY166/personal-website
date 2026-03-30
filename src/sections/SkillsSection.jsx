import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { skillCategories } from '../data/skillsData';
import { glassCard, gradientText } from '../styles/theme';
import RadarChart from '../components/ui/RadarChart';
import ScrollReveal from '../components/ui/ScrollReveal';

function ProficiencyDots({ level, color }) {
  return (
    <span style={{ display: 'inline-flex', gap: 3, marginLeft: 6 }}>
      {[1, 2, 3, 4, 5].map((dot) => (
        <span
          key={dot}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: dot <= level ? color : 'rgba(255,255,255,0.15)',
            display: 'inline-block',
          }}
        />
      ))}
    </span>
  );
}

export default function SkillsSection() {
  const { theme } = useTheme();

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
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div style={{
          ...glassCard(theme),
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 48,
        }}>
          <RadarChart categories={skillCategories} />
        </div>
      </ScrollReveal>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
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
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: theme.text.heading, marginBottom: 20 }}>
                {cat.title}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {cat.skills.map((skill, j) => (
                  <span key={j} style={{
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
                    <ProficiencyDots level={skill.proficiency} color={skill.color} />
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
