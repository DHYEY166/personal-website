import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { certifications } from '../data/certificationsData';
import { glassCard, gradientText } from '../styles/theme';
import ScrollReveal from '../components/ui/ScrollReveal';

export default function CertificationsSection() {
  const { theme } = useTheme();

  const yearEntries = Object.entries(certifications).reverse();

  return (
    <section
      id="certifications"
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
            CREDENTIALS
          </p>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800,
            ...gradientText(theme.accent.textGradient),
            marginBottom: 0,
          }}>
            Certifications
          </h2>
        </div>
      </ScrollReveal>

      {/* Year Sections */}
      {yearEntries.map(([year, certs]) => (
        <div key={year} style={{ marginBottom: 48 }}>
          <h3
            style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              color: theme.accent.primary,
              marginBottom: 20,
              paddingLeft: 4,
            }}
          >
            {year}
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 20,
            }}
          >
            {certs.map((cert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
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
                {/* Colored Top Bar */}
                <div
                  style={{
                    height: 4,
                    background: cert.color,
                    borderRadius: '20px 20px 0 0',
                  }}
                />

                <div style={{ padding: 24 }}>
                  <h4
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: theme.text.heading,
                      marginBottom: 8,
                      lineHeight: 1.4,
                    }}
                  >
                    {cert.title}
                  </h4>

                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: theme.text.secondary,
                      marginBottom: 4,
                    }}
                  >
                    {cert.institution}
                  </p>

                  <p
                    style={{
                      fontSize: '0.8rem',
                      color: theme.text.muted,
                      marginBottom: 12,
                    }}
                  >
                    {cert.date}
                    {cert.expires && ` | Expires: ${cert.expires}`}
                  </p>

                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    {cert.badge && (
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: 6,
                          background: `${cert.color}20`,
                          border: `1px solid ${cert.color}40`,
                          color: cert.color,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        {cert.badge}
                      </span>
                    )}

                    {cert.hasVerification && cert.verificationLink && (
                      <a
                        href={cert.verificationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: theme.accent.primary,
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                      >
                        Verify
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
