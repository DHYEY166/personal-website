import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { infoItems, aboutParagraphs, aboutBullets, aboutClosing } from '../data/aboutData';
import { glassCard, gradientText } from '../styles/theme';
import ScrollReveal from '../components/ui/ScrollReveal';

export default function AboutSection() {
  const { theme } = useTheme();

  return (
    <section
      id="about"
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
            GET TO KNOW ME
          </p>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800,
            ...gradientText(theme.accent.textGradient),
            marginBottom: 0,
          }}>
            About Me
          </h2>
        </div>
      </ScrollReveal>

      {/* Info Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 48,
        }}
      >
        {infoItems.map((item, i) => (
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
              padding: 20,
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: '0.75rem',
                color: theme.text.muted,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: 6,
              }}
            >
              {item.label}
            </p>
            <p style={{ fontSize: '0.95rem', color: theme.text.primary, fontWeight: 500 }}>
              {item.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* About Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        style={{
          ...glassCard(theme),
          lineHeight: 1.8,
        }}
      >
        {aboutParagraphs.map((p, i) => (
          <p
            key={i}
            style={{
              color: theme.text.secondary,
              fontSize: '1rem',
              marginBottom: 20,
            }}
          >
            {p}
          </p>
        ))}

        <ul style={{ paddingLeft: 24, marginBottom: 20 }}>
          {aboutBullets.map((b, i) => (
            <li
              key={i}
              style={{
                color: theme.text.secondary,
                fontSize: '1rem',
                marginBottom: 12,
              }}
            >
              {b}
            </li>
          ))}
        </ul>

        <p style={{ color: theme.text.secondary, fontSize: '1rem' }}>{aboutClosing}</p>
      </motion.div>
    </section>
  );
}
