import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../styles/useTheme';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { sectionLinks, socialLinks } from '../../data/navigation';
import { RESUME_PDF_PATH } from '../../data/resumeData';

const SECTION_IDS = sectionLinks.map((l) => l.id);

export default function TopNavigation() {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = location.pathname === '/';
  const isChatbot = location.pathname === '/chatbot';
  const activeSection = useScrollSpy(SECTION_IDS, isHome);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    if (isHome) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState(null, '', `#${id}`);
      }
    } else {
      // HomePage scrolls to the hash after it mounts.
      navigate(`/#${id}`);
    }
  };

  const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    background: theme.bg.page,
    borderBottom: theme.border.default,
    padding: '0 clamp(16px, 3vw, 32px)',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const logoStyle = {
    fontFamily: theme.font.serif,
    fontSize: 24,
    fontWeight: 600,
    color: theme.text.primary,
    letterSpacing: '-0.01em',
  };

  const linkStyle = (isActive) => ({
    padding: '6px 10px',
    fontSize: 15,
    fontWeight: isActive ? 600 : 500,
    // Active state: accent colour plus a thin underline (set via aria-current in CSS colour).
    textDecoration: isActive ? 'underline' : 'none',
    textUnderlineOffset: 6,
    textDecorationThickness: 1,
  });

  const hamburgerLineStyle = (index) => {
    const base = {
      width: 20,
      height: 2,
      background: theme.text.primary,
      borderRadius: 1,
      transition: 'transform 0.2s ease, opacity 0.2s ease',
    };
    if (menuOpen) {
      if (index === 0) return { ...base, transform: 'rotate(45deg) translate(5px, 5px)' };
      if (index === 1) return { ...base, opacity: 0 };
      if (index === 2) return { ...base, transform: 'rotate(-45deg) translate(5px, -5px)' };
    }
    return base;
  };

  const renderLinks = (mobile) => {
    if (isChatbot) {
      return (
        <Link
          to="/"
          className="quiet-link"
          style={{ ...linkStyle(false), ...(mobile ? { padding: '10px 4px' } : {}) }}
          onClick={() => setMenuOpen(false)}
        >
          Home
        </Link>
      );
    }
    return sectionLinks.map((link) => {
      const isActive = !mobile && isHome && activeSection === link.id;
      return (
        <a
          key={link.id}
          href={`/#${link.id}`}
          className="quiet-link"
          style={{ ...linkStyle(isActive), ...(mobile ? { padding: '10px 4px' } : {}) }}
          aria-current={isActive ? 'location' : undefined}
          onClick={(e) => handleNavClick(e, link.id)}
        >
          {link.label}
        </a>
      );
    });
  };

  return (
    <nav style={navStyle} aria-label="Main">
      <Link to="/" style={logoStyle} aria-label="Dhyey Desai – home">
        DD
      </Link>

      {!isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {renderLinks(false)}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            title={social.name}
            aria-label={`${social.name} (opens in a new tab)`}
            className="icon-btn"
          >
            <svg
              width="18"
              height="18"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: social.svg }}
            />
          </a>
        ))}

        <a
          href={RESUME_PDF_PATH}
          download="Dhyey_Desai_Resume.pdf"
          title="Download resume (PDF)"
          aria-label="Download resume (PDF)"
          className="icon-btn"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
            <path d="M14 3v5h5" />
            <path d="M12 11v6m0 0l-2.5-2.5M12 17l2.5-2.5" />
          </svg>
        </a>

        {isMobile && (
          <button
            className="icon-btn"
            style={{ flexDirection: 'column', gap: 4 }}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-menu"
          >
            <span style={hamburgerLineStyle(0)} />
            <span style={hamburgerLineStyle(1)} />
            <span style={hamburgerLineStyle(2)} />
          </button>
        )}
      </div>

      {isMobile && menuOpen && (
        <div
          id="mobile-nav-menu"
          style={{
            position: 'absolute',
            top: 64,
            left: 0,
            right: 0,
            background: theme.bg.page,
            borderBottom: theme.border.default,
            padding: '8px 20px 16px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {renderLinks(true)}
        </div>
      )}
    </nav>
  );
}
