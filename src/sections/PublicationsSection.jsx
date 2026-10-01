import { useTheme } from '../styles/useTheme';
import { sectionStyle } from '../styles/theme';
import { publications } from '../data/publicationsData';
import ScrollReveal from '../components/ui/ScrollReveal';
import SectionHeader from '../components/ui/SectionHeader';

export default function PublicationsSection() {
  const { theme } = useTheme();

  return (
    <section id="publications" aria-labelledby="publications-title" style={sectionStyle}>
      <div style={{ borderTop: theme.border.default, paddingTop: 'clamp(40px, 6vw, 64px)' }}>
        <SectionHeader id="publications-title" kicker="RESEARCH" title="Publications" />

        <ScrollReveal>
          <ol style={{ listStyle: 'none', borderTop: `2px solid ${theme.text.primary}` }}>
            {publications.map((pub) => (
              <li key={pub.id} style={{ borderBottom: theme.border.default }}>
                <article style={{ padding: 'clamp(20px, 3vw, 28px) 0', maxWidth: '72ch' }}>
                  <p style={{ fontSize: 15, color: theme.text.muted, marginBottom: 8 }}>
                    <span
                      style={{
                        color: pub.statusKind === 'accepted' ? theme.accent.text : theme.text.primary,
                        fontWeight: 600,
                      }}
                    >
                      {pub.statusKind === 'accepted' ? 'Accepted and presented' : 'Published'}
                    </span>
                    <span aria-hidden="true"> · </span>
                    <span style={{ fontStyle: 'italic' }}>{pub.venue}</span>
                  </p>

                  <h3 style={{ fontSize: 'clamp(19px, 2.4vw, 22px)', lineHeight: 1.35, marginBottom: 8 }}>
                    {pub.title}
                  </h3>

                  {pub.authors && (
                    <p style={{ fontSize: 15, color: theme.text.muted, marginBottom: 8 }}>{pub.authors}</p>
                  )}

                  {pub.statusKind === 'accepted' && (
                    <p style={{ fontSize: 15, color: theme.text.secondary, fontStyle: 'italic', marginBottom: 12 }}>
                      {pub.status}
                    </p>
                  )}

                  {pub.summary && (
                    <p style={{ fontSize: 16, color: theme.text.secondary, lineHeight: 1.7, marginBottom: 14 }}>
                      {pub.summary}
                    </p>
                  )}

                  {pub.links?.length > 0 && (
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                      {pub.links.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-link"
                          style={{ fontSize: 15 }}
                        >
                          {link.label}
                          <span className="sr-only"> for {pub.title} (opens in a new tab)</span>
                        </a>
                      ))}
                    </div>
                  )}
                </article>
              </li>
            ))}
          </ol>
        </ScrollReveal>
      </div>
    </section>
  );
}
