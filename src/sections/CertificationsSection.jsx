import { useTheme } from '../styles/useTheme';
import { sectionStyle } from '../styles/theme';
import { certifications } from '../data/certificationsData';
import ScrollReveal from '../components/ui/ScrollReveal';
import SectionHeader from '../components/ui/SectionHeader';

export default function CertificationsSection() {
  const { theme } = useTheme();

  const yearEntries = Object.entries(certifications)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, certs]) => [
      year,
      // Newest first; year-only dates ("2026") parse to Jan 1 and sort last within a year.
      [...certs].sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0)),
    ]);

  return (
    <section id="certifications" aria-labelledby="certifications-title" style={sectionStyle}>
      <div style={{ borderTop: theme.border.default, paddingTop: 'clamp(40px, 6vw, 64px)' }}>
        <SectionHeader id="certifications-title" kicker="CREDENTIALS" title="Certifications" />

        <ScrollReveal>
          <div style={{ borderTop: `2px solid ${theme.text.primary}` }}>
            {yearEntries.map(([year, certs]) => (
              <div key={year} className="cert-group">
                <h3 style={{ fontSize: 22, color: theme.text.primary, paddingTop: 18 }}>{year}</h3>

                <ul style={{ listStyle: 'none' }}>
                  {certs.map((cert) => (
                    <li key={`${cert.title}-${cert.date}`} className="cert-row">
                      <div style={{ minWidth: 0 }}>
                        <h4 style={{ fontFamily: theme.font.sans, fontSize: 17, fontWeight: 600, lineHeight: 1.4, marginBottom: 2 }}>
                          {cert.title}
                        </h4>
                        <p style={{ fontSize: 15, color: theme.text.secondary }}>
                          {cert.institution}
                        </p>
                        <p style={{ fontSize: 14, color: theme.text.muted }}>
                          {cert.date}
                          {cert.expires && ` | Expires: ${cert.expires}`}
                          {cert.badge && (
                            <>
                              <span aria-hidden="true"> · </span>
                              {cert.badge}
                            </>
                          )}
                        </p>
                      </div>

                      {cert.hasVerification && cert.verificationLink && (
                        <a
                          href={cert.verificationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-link"
                          style={{ fontSize: 15, whiteSpace: 'nowrap' }}
                        >
                          Verify<span className="sr-only"> {cert.title} (opens in a new tab)</span>
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
