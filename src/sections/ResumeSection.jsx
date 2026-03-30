import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  education,
  technicalSkills,
  experience,
  resumeProjects,
  publications,
  achievements,
} from '../data/resumeData';
import { glassCard, gradientText } from '../styles/theme';
import ScrollReveal from '../components/ui/ScrollReveal';

function SectionBlock({ title, theme, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
      style={{ ...glassCard(theme), marginBottom: 28 }}
    >
      <h3
        style={{
          fontSize: '1.3rem',
          fontWeight: 700,
          color: theme.accent.primary,
          marginBottom: 24,
          paddingBottom: 12,
          borderBottom: `1px solid rgba(102, 126, 234, 0.15)`,
        }}
      >
        {title}
      </h3>
      {children}
    </motion.div>
  );
}

export default function ResumeSection() {
  const { theme } = useTheme();

  const labelStyle = {
    fontSize: '0.85rem',
    color: theme.text.muted,
  };

  const bulletStyle = {
    color: theme.text.secondary,
    fontSize: '0.92rem',
    marginBottom: 8,
    lineHeight: 1.7,
  };

  return (
    <section
      id="resume"
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
            MY BACKGROUND
          </p>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800,
            ...gradientText(theme.accent.textGradient),
            marginBottom: 0,
          }}>
            Resume
          </h2>
        </div>
      </ScrollReveal>

      {/* Education */}
      <SectionBlock title="Education" theme={theme} delay={0}>
        {education.map((edu, i) => (
          <div key={i} style={{ marginBottom: i < education.length - 1 ? 24 : 0 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                flexWrap: 'wrap',
                gap: 8,
                marginBottom: 4,
              }}
            >
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: theme.text.heading, margin: 0 }}>
                {edu.school}
              </h4>
              <span style={labelStyle}>{edu.period}</span>
            </div>
            <p style={{ fontSize: '0.95rem', color: theme.text.primary, marginBottom: 4 }}>
              {edu.degree}
            </p>
            <p style={{ fontSize: '0.85rem', color: theme.accent.primary, fontWeight: 600, marginBottom: 4 }}>
              {edu.gpa}
            </p>
            <p style={{ fontSize: '0.85rem', color: theme.text.muted }}>
              <span style={{ fontWeight: 600 }}>Coursework: </span>
              {edu.coursework}
            </p>
          </div>
        ))}
      </SectionBlock>

      {/* Technical Skills */}
      <SectionBlock title="Technical Skills" theme={theme} delay={0.05}>
        <div style={{ display: 'grid', gap: 12 }}>
          {technicalSkills.map((skill, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: theme.accent.primary,
                  minWidth: 180,
                }}
              >
                {skill.category}:
              </span>
              <span style={{ fontSize: '0.9rem', color: theme.text.secondary }}>{skill.items}</span>
            </div>
          ))}
        </div>
      </SectionBlock>

      {/* Professional Experience */}
      <SectionBlock title="Professional Experience" theme={theme} delay={0.1}>
        {experience.map((exp, i) => (
          <div key={i} style={{ marginBottom: i < experience.length - 1 ? 28 : 0 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                flexWrap: 'wrap',
                gap: 8,
                marginBottom: 4,
              }}
            >
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: theme.text.heading, margin: 0 }}>
                {exp.role}
              </h4>
              <span style={labelStyle}>{exp.period}</span>
            </div>
            <p
              style={{
                fontSize: '0.9rem',
                color: theme.accent.primary,
                fontWeight: 500,
                marginBottom: 12,
              }}
            >
              {exp.company}
            </p>
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              {exp.bullets.map((bullet, j) => (
                <li key={j} style={bulletStyle}>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </SectionBlock>

      {/* Projects */}
      <SectionBlock title="Projects" theme={theme} delay={0.15}>
        {resumeProjects.map((proj, i) => (
          <div key={i} style={{ marginBottom: i < resumeProjects.length - 1 ? 28 : 0 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                flexWrap: 'wrap',
                gap: 8,
                marginBottom: 12,
              }}
            >
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: theme.text.heading, margin: 0 }}>
                {proj.name}
              </h4>
              <span style={labelStyle}>{proj.period}</span>
            </div>
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              {proj.bullets.map((bullet, j) => (
                <li key={j} style={bulletStyle}>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </SectionBlock>

      {/* Publications */}
      <SectionBlock title="Publications" theme={theme} delay={0.2}>
        {publications.map((pub, i) => (
          <div key={i}>
            <h4
              style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: theme.text.heading,
                marginBottom: 12,
              }}
            >
              {pub.title}
            </h4>
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              {pub.bullets.map((bullet, j) => (
                <li key={j} style={bulletStyle}>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </SectionBlock>

      {/* Achievements */}
      <SectionBlock title="Achievements" theme={theme} delay={0.25}>
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          {achievements.map((achievement, i) => (
            <li key={i} style={bulletStyle}>
              {achievement}
            </li>
          ))}
        </ul>
      </SectionBlock>
    </section>
  );
}
