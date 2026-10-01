import { useTheme } from '../styles/useTheme';
import { sectionStyle } from '../styles/theme';
import { infoItems, aboutParagraphs, aboutBullets, aboutClosing } from '../data/aboutData';
import ScrollReveal from '../components/ui/ScrollReveal';
import SectionHeader from '../components/ui/SectionHeader';

export default function AboutSection() {
  const { theme } = useTheme();
  const textStyle = { color: theme.text.secondary, marginBottom: 20 };

  return (
    <section id="about" aria-labelledby="about-title" style={sectionStyle}>
      <div style={{ borderTop: theme.border.default, paddingTop: 'clamp(40px, 6vw, 64px)' }}>
        <SectionHeader id="about-title" kicker="GET TO KNOW ME" title="About Me" />

        <ScrollReveal>
          <div className="about-grid">
            <div style={{ maxWidth: '68ch' }}>
              {aboutParagraphs.map((p, i) => (
                <p key={i} style={textStyle}>
                  {p}
                </p>
              ))}
              <ul style={{ paddingLeft: 22, marginBottom: 20 }}>
                {aboutBullets.map((b, i) => (
                  <li key={i} style={{ color: theme.text.secondary, marginBottom: 10, paddingLeft: 4 }}>
                    {b}
                  </li>
                ))}
              </ul>
              <p style={{ color: theme.text.secondary }}>{aboutClosing}</p>
            </div>

            <dl
              style={{
                borderTop: `2px solid ${theme.text.primary}`,
                alignSelf: 'start',
              }}
            >
              {infoItems.map((item) => (
                <div key={item.label} style={{ padding: '14px 0', borderBottom: theme.border.default }}>
                  <dt
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: theme.text.muted,
                      marginBottom: 2,
                    }}
                  >
                    {item.label}
                  </dt>
                  <dd style={{ color: theme.text.primary, fontWeight: 500, overflowWrap: 'anywhere' }}>{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
