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
    secondary: 'rgba(255, 255, 255, 0.65)',
    muted: 'rgba(255, 255, 255, 0.4)',
    heading: '#ffffff',
  },
  accent: {
    primary: '#667eea',
    secondary: '#764ba2',
    pink: '#f093fb',
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
    muted: '#8892b0',
    heading: '#1a1a2e',
  },
  accent: {
    primary: '#667eea',
    secondary: '#764ba2',
    pink: '#f093fb',
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

export const gradientText = (gradient) => ({
  background: gradient,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
});
