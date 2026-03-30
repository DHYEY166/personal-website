import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { sectionLinks, socialLinks } from '../../data/navigation';
import ThemeToggle from '../ui/ThemeToggle';

export default function TopNavigation() {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isChatbot = location.pathname === '/chatbot';
  const activeSection = useScrollSpy(sectionLinks.map(l => l.id));

  const handleNavClick = (id) => {
    setMenuOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    background: theme.nav.bg,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: theme.nav.border,
    padding: '0 24px',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'background 0.3s ease',
  };

  const logoStyle = {
    fontSize: 28,
    fontWeight: 800,
    background: theme.accent.textGradient,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textDecoration: 'none',
    letterSpacing: '-0.02em',
  };

  const centerLinksStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  };

  const linkBaseStyle = (isActive) => ({
    padding: '6px 14px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: isActive ? 600 : 500,
    color: isActive ? theme.accent.primary : theme.text.secondary,
    background: isActive ? `${theme.accent.primary}15` : 'transparent',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    border: 'none',
  });

  const socialIconContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  const socialIconStyle = {
    width: 35,
    height: 35,
    borderRadius: '50%',
    background: theme.name === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    border: theme.name === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
    color: theme.text.secondary,
    textDecoration: 'none',
  };

  const hamburgerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    width: 36,
    height: 36,
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 4,
    borderRadius: 8,
  };

  const hamburgerLineStyle = (index) => {
    const base = {
      width: 22,
      height: 2,
      background: theme.text.primary,
      borderRadius: 2,
      transition: 'all 0.3s ease',
    };
    if (menuOpen) {
      if (index === 0) return { ...base, transform: 'rotate(45deg) translate(5px, 5px)' };
      if (index === 1) return { ...base, opacity: 0 };
      if (index === 2) return { ...base, transform: 'rotate(-45deg) translate(5px, -5px)' };
    }
    return base;
  };

  const dropdownStyle = {
    position: 'absolute',
    top: 64,
    left: 0,
    right: 0,
    background: theme.nav.bg,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: theme.nav.border,
    padding: '12px 24px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    animation: 'fadeIn 0.2s ease-out',
  };

  const renderCenterLinks = () => {
    if (isChatbot) {
      return (
        <Link to="/" style={linkBaseStyle(false)}>
          Home
        </Link>
      );
    }

    return sectionLinks.map((link) => {
      const isActive = activeSection === link.id;
      if (location.pathname === '/') {
        return (
          <a
            key={link.id}
            href={`#${link.id}`}
            style={linkBaseStyle(isActive)}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick(link.id);
            }}
          >
            {link.label}
          </a>
        );
      }
      return (
        <Link
          key={link.id}
          to={`/#${link.id}`}
          style={linkBaseStyle(isActive)}
        >
          {link.label}
        </Link>
      );
    });
  };

  return (
    <nav style={navStyle}>
      {/* Left: Logo */}
      <Link to="/" style={logoStyle}>
        DD
      </Link>

      {/* Center: Section Links (desktop only) */}
      {!isMobile && (
        <div style={centerLinksStyle}>
          {renderCenterLinks()}
        </div>
      )}

      {/* Right: Social Icons + ThemeToggle placeholder */}
      <div style={socialIconContainerStyle}>
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            title={social.name}
            style={socialIconStyle}
            onMouseOver={(e) => {
              e.currentTarget.style.background = social.hoverBg;
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = theme.name === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';
              e.currentTarget.style.color = theme.text.secondary;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <svg
              width="18"
              height="18"
              fill="currentColor"
              viewBox="0 0 24 24"
              dangerouslySetInnerHTML={{ __html: social.svg }}
            />
          </a>
        ))}

        <ThemeToggle />

        {/* Hamburger (mobile only) */}
        {isMobile && (
          <button
            style={hamburgerStyle}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span style={hamburgerLineStyle(0)} />
            <span style={hamburgerLineStyle(1)} />
            <span style={hamburgerLineStyle(2)} />
          </button>
        )}
      </div>

      {/* Mobile dropdown */}
      {isMobile && menuOpen && (
        <div style={dropdownStyle}>
          {isChatbot ? (
            <Link
              to="/"
              style={linkBaseStyle(false)}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          ) : (
            sectionLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                style={{ ...linkBaseStyle(false), padding: '10px 14px' }}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.id);
                }}
              >
                {link.label}
              </a>
            ))
          )}
        </div>
      )}
    </nav>
  );
}
