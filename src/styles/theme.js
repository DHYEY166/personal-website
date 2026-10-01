export const darkTheme = {
  name: 'dark',
  bg: {
    primary: '#0a0a1a',
    secondary: '#0f0f2a',
    card: 'rgba(255, 255, 255, 0.03)',
    cardHover: 'rgba(255, 255, 255, 0.06)',
    mesh: `
      radial-gradient(ellipse at 20% 50%, rgba(102, 126, 234, 0.15) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(240, 147, 251, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 80%, rgba(118, 75, 162, 0.06) 0%, transparent 50%)
    `,
  },
  text: {
    primary: '#e0e0e0',
    secondary: 'rgba(255, 255, 255, 0.7)',
    // 0.55 alpha keeps muted text at >= 4.5:1 on the page and card backgrounds.
    muted: 'rgba(255, 255, 255, 0.55)',
    heading: '#ffffff',
    error: '#ff6b5e',
  },
  accent: {
    primary: '#667eea',
    secondary: '#764ba2',
    pink: '#f093fb',
    // Accent colour for text and links (>= 4.5:1 contrast on this theme).
    text: '#8b9cf4',
    gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
    textGradient: 'linear-gradient(135deg, #667eea, #f093fb)',
    glow: '0 0 20px rgba(102, 126, 234, 0.3)',
    glowStrong: '0 0 40px rgba(102, 126, 234, 0.5)',
  },
  glass: {
    background: 'rgba(255, 255, 255, 0.03)',
    backgroundHover: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderHover: '1px solid rgba(102, 126, 234, 0.2)',
    blur: 'blur(20px)',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    shadowHover: '0 16px 48px rgba(102, 126, 234, 0.15)',
  },
  nav: {
    bg: 'rgba(10, 10, 26, 0.85)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
};

export const lightTheme = {
  name: 'light',
  bg: {
    primary: '#f5f7fa',
    secondary: '#eef1f5',
    card: 'rgba(255, 255, 255, 0.8)',
    cardHover: 'rgba(255, 255, 255, 0.95)',
    mesh: `
      radial-gradient(ellipse at 20% 50%, rgba(102, 126, 234, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(240, 147, 251, 0.05) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 80%, rgba(118, 75, 162, 0.04) 0%, transparent 50%)
    `,
  },
  text: {
    primary: '#1a1a2e',
    secondary: '#4a4a6a',
    muted: '#5f6b85',
    heading: '#1a1a2e',
    error: '#c0392b',
  },
  accent: {
    primary: '#667eea',
    secondary: '#764ba2',
    pink: '#f093fb',
    text: '#4c5fd1',
    gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
    textGradient: 'linear-gradient(135deg, #667eea, #764ba2)',
    glow: '0 0 20px rgba(102, 126, 234, 0.15)',
    glowStrong: '0 0 40px rgba(102, 126, 234, 0.25)',
  },
  glass: {
    background: 'rgba(255, 255, 255, 0.6)',
    backgroundHover: 'rgba(255, 255, 255, 0.8)',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    borderHover: '1px solid rgba(102, 126, 234, 0.2)',
    blur: 'blur(16px)',
    shadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
    shadowHover: '0 8px 32px rgba(102, 126, 234, 0.1)',
  },
  nav: {
    bg: 'rgba(245, 247, 250, 0.9)',
    border: '1px solid rgba(0, 0, 0, 0.06)',
  },
};

export const glassCard = (theme) => ({
  background: theme.glass.background,
  backdropFilter: theme.glass.blur,
  WebkitBackdropFilter: theme.glass.blur,
  borderRadius: 20,
  border: theme.glass.border,
  boxShadow: theme.glass.shadow,
  padding: 32,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
});

// Uses the backgroundImage longhand on purpose: when the theme changes, React updates
// only the properties whose values changed. Setting the `background` shorthand would
// reset background-clip to border-box, and React would not re-apply the unchanged
// clip value, turning gradient headings into solid blocks after a theme toggle.
export const gradientText = (gradient) => ({
  backgroundImage: gradient,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
});
