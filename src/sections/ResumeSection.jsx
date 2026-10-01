import { useTheme } from '../styles/useTheme';
import {
  education,
  technicalSkills,
  experience,
  resumeProjects,
  achievements,
  RESUME_PDF_PATH,
} from '../data/resumeData';
import { sectionStyle } from '../styles/theme';
import ScrollReveal from '../components/ui/ScrollReveal';
import SectionHeader from '../components/ui/SectionHeader';
import { useMediaQuery } from '../hooks/useMediaQuery';

// CV-style row: block title in a narrow left column, entries on the right.
function SectionBlock({ title, children }) {
  return (
    <div className="cv-block">
      <h3 style={{ fontSize: 22 }}>{title}</h3>
      <div style={{ minWidth: 0 }}>{children}</div>
    </div>
  );
}

export default function ResumeSection() {
  const { theme } = useTheme();
  // Below this width the skill labels stack above their values.
  const stackSkills = useMediaQuery('(max-width: 600px)');

  const labelStyle = {
    fontSize: 15,
    color: theme.text.muted,
    whiteSpace: 'nowrap',
  };

  const tagStyle = (highlight) => ({
    padding: '1px 8px',
    borderRadius: theme.radius.sm,
    fontSize: 13,
    fontWeight: 600,
    color: highlight ? theme.accent.text : theme.text.secondary,
    background: highlight ? theme.accent.soft : theme.bg.subtle,
    border: `1px solid ${highlight ? '#E9CFC4' : theme.border.color}`,
  });

  const bulletStyle = {
    color: theme.text.secondary,
    fontSize: 16,
    marginBottom: 6,
    lineHeight: 1.65,
  };

  return (
    <section id="resume" aria-labelledby="resume-title" style={sectionStyle}>
      <div style={{ borderTop: theme.border.default, paddingTop: 'clamp(40px, 6vw, 64px)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '0 24px' }}>
        <SectionHeader id="resume-title" kicker="MY BACKGROUND" title="Resume" />
        <a
          href={RESUME_PDF_PATH}
          download="Dhyey_Desai_Resume.pdf"
          className="btn btn--primary"
          style={{ marginBottom: 'clamp(28px, 4vw, 40px)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3v12m0 0l-5-5m5 5l5-5M5 21h14" />
          </svg>
          Download Resume (PDF)
        </a>
      </div>

      <ScrollReveal>
      <div style={{ borderTop: `2px solid ${theme.text.primary}` }}>
      {/* Education */}
      <SectionBlock title="Education">
        {education.map((edu, i) => (
          <div key={i}>
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
              <h4 style={{ fontFamily: theme.font.sans, fontSize: 18, fontWeight: 600, margin: 0 }}>
                {edu.school}
              </h4>
              <span style={labelStyle}>{edu.period}</span>
            </div>
            <p style={{ fontSize: 16, color: theme.text.primary, marginBottom: 4 }}>
              {edu.degree}
            </p>
            <p style={{ fontSize: 15, color: theme.text.secondary, fontWeight: 600, marginBottom: 4 }}>
              {edu.gpa}
            </p>
            <p style={{ fontSize: 15, color: theme.text.muted }}>
              <span style={{ fontWeight: 600 }}>Coursework: </span>
              {edu.coursework}
            </p>
          </div>
        ))}
      </SectionBlock>

      {/* Technical Skills */}
      <SectionBlock title="Technical Skills">
        {/* One grid for all rows: a shared label column sized to the longest label, and a value
            column that wraps within the card (minmax(0, 1fr) lets long text shrink). */}
        <dl
          style={{
            display: 'grid',
            gridTemplateColumns: stackSkills ? 'minmax(0, 1fr)' : 'max-content minmax(0, 1fr)',
            columnGap: 24,
            rowGap: stackSkills ? 0 : 14,
            margin: 0,
            fontSize: 16,
            lineHeight: 1.6,
          }}
        >
          {technicalSkills.map((skill, i) => (
            <div key={skill.category} style={{ display: 'contents' }}>
              <dt
                style={{
                  fontWeight: 600,
                  color: theme.text.primary,
                  marginTop: stackSkills && i > 0 ? 14 : 0,
                }}
              >
                {skill.category}
              </dt>
              <dd
                style={{
                  margin: stackSkills ? '2px 0 0' : 0,
                  color: theme.text.secondary,
                  overflowWrap: 'anywhere',
                }}
              >
                {skill.items}
              </dd>
            </div>
          ))}
        </dl>
      </SectionBlock>

      {/* Professional Experience */}
      <SectionBlock title="Professional Experience">
        {experience.map((exp, i) => (
          <div key={i}>
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
              <h4 style={{ fontFamily: theme.font.sans, fontSize: 18, fontWeight: 600, margin: 0 }}>
                {exp.role}
              </h4>
              <span style={labelStyle}>{exp.period}</span>
            </div>
            <p
              style={{
                fontSize: 16,
                color: theme.text.primary,
                fontWeight: 500,
                marginBottom: 6,
              }}
            >
              {exp.company}
              {exp.location && (
                <span style={{ color: theme.text.secondary, fontWeight: 500 }}> · {exp.location}</span>
              )}
            </p>
            {(exp.label || exp.current) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                {exp.current && <span style={tagStyle(true)}>Current</span>}
                {exp.label && <span style={tagStyle(false)}>{exp.label}</span>}
              </div>
            )}
            {exp.project && (
              <p style={{ fontSize: 16, color: theme.text.primary, marginBottom: 10 }}>
                <span style={{ fontWeight: 600 }}>Project: </span>
                {exp.project}
              </p>
            )}
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              {exp.bullets.map((bullet, j) => (
                <li key={j} style={bulletStyle}>
                  {bullet}
                </li>
              ))}
            </ul>
            {exp.stack && (
              <p style={{ fontSize: 15, color: theme.text.secondary, marginTop: 6 }}>
                <span style={{ fontWeight: 600, color: theme.text.primary }}>Stack: </span>
                {exp.stack}
              </p>
            )}
            {exp.link && (
              <a
                href={exp.link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
                style={{ display: 'inline-block', marginTop: 8, fontSize: 15 }}
              >
                {exp.link.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        ))}
      </SectionBlock>

      {/* Projects */}
      <SectionBlock title="Projects">
        {resumeProjects.map((proj, i) => (
          <div key={i}>
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
              <h4 style={{ fontFamily: theme.font.sans, fontSize: 18, fontWeight: 600, margin: 0 }}>
                {proj.link ? (
                  <a href={proj.link} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline', textDecorationColor: theme.border.strongColor, textUnderlineOffset: 4 }}>
                    {proj.name}
                    <span className="sr-only"> on GitHub (opens in a new tab)</span>
                  </a>
                ) : (
                  proj.name
                )}
              </h4>
              {proj.period && <span style={labelStyle}>{proj.period}</span>}
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

      {/* Achievements */}
      <SectionBlock title="Achievements">
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          {achievements.map((achievement, i) => (
            <li key={i} style={bulletStyle}>
              {achievement}
            </li>
          ))}
        </ul>
      </SectionBlock>
      </div>
      </ScrollReveal>
      </div>
    </section>
  );
}
