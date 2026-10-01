import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { publications } from '../data/publicationsData';
import { glassCard, gradientText } from '../styles/theme';
import ScrollReveal from '../components/ui/ScrollReveal';

const STATUS_COLORS = {
  published: { dark: '#4cd08a', light: '#1e7e46' },
  accepted: { dark: '#f5b759', light: '#9a5b00' },
};

export default function PublicationsSection() {
  const { theme } = useTheme();

  return (
    <section
      id="publications"
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
            RESEARCH
          </p>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800,
            ...gradientText(theme.accent.textGradient),
            marginBottom: 0,
          }}>
            Publications
          </h2>
        </div>
      </ScrollReveal>

      <ol style={{ listStyle: 'none', display: 'grid', gap: 24 }}>
        {publications.map((pub, i) => {
          const statusColor = (STATUS_COLORS[pub.statusKind] || STATUS_COLORS.published)[theme.name];
          return (
            <motion.li
              key={pub.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              style={{ ...glassCard(theme), overflow: 'hidden', padding: 0 }}
            >
              <div style={{ height: 4, background: theme.accent.gradient }} />
              <article style={{ padding: 'clamp(20px, 4vw, 32px)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      background: `${statusColor}1f`,
                      border: `1px solid ${statusColor}66`,
                      color: statusColor,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {pub.statusKind === 'accepted' ? 'Accepted and presented' : 'Published'}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: theme.text.secondary, fontWeight: 600 }}>
                    {pub.venue}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: theme.text.heading, lineHeight: 1.45, marginBottom: 8 }}>
                  {pub.title}
                </h3>

                {pub.authors && (
                  <p style={{ fontSize: '0.85rem', color: theme.text.muted, marginBottom: 8 }}>{pub.authors}</p>
                )}

                {pub.statusKind === 'accepted' && (
                  <p style={{ fontSize: '0.9rem', color: theme.text.secondary, fontStyle: 'italic', marginBottom: 12 }}>
                    {pub.status}
                  </p>
                )}

                {pub.summary && (
                  <p style={{ fontSize: '0.92rem', color: theme.text.secondary, lineHeight: 1.75, marginBottom: 16 }}>
                    {pub.summary}
                  </p>
                )}

                {pub.links?.length > 0 && (
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    {pub.links.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: theme.accent.text, fontSize: '0.85rem', fontWeight: 600 }}
                      >
                        {link.label}
                        <span className="sr-only"> for {pub.title} (opens in a new tab)</span>
                      </a>
                    ))}
                  </div>
                )}
              </article>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}
