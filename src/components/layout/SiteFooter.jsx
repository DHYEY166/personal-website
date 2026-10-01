import { useTheme } from '../../styles/useTheme';
import { CONTENT_WIDTH } from '../../styles/theme';
import { socialLinks } from '../../data/navigation';
import { RESUME_PDF_PATH } from '../../data/resumeData';
import { contactItems } from '../../data/contactData';

/** Plain footer: name and year on the left, text links on the right. */
export default function SiteFooter() {
  const { theme } = useTheme();
  const email = contactItems.find((c) => c.link.startsWith('mailto:'));

  return (
    <footer style={{ borderTop: theme.border.default, marginTop: 'auto' }}>
      <div
        style={{
          maxWidth: CONTENT_WIDTH,
          margin: '0 auto',
          padding: '28px clamp(20px, 4vw, 32px) 36px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px 24px',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 15,
          color: theme.text.muted,
        }}
      >
        <p>© {new Date().getFullYear()} Dhyey Desai</p>
        <ul style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '8px 20px' }}>
          {email && (
            <li>
              <a className="quiet-link" href={email.link}>Email</a>
            </li>
          )}
          {socialLinks.map((s) => (
            <li key={s.name}>
              <a className="quiet-link" href={s.url} target="_blank" rel="noopener noreferrer">
                {s.name}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
          <li>
            <a className="quiet-link" href={RESUME_PDF_PATH} download="Dhyey_Desai_Resume.pdf">Resume (PDF)</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
