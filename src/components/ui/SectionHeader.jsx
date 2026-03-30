import { gradientText } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';
import ScrollReveal from './ScrollReveal';

export default function SectionHeader({ subtitle, title }) {
  const { theme } = useTheme();

  return (
    <ScrollReveal>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <p style={{
          fontSize: '0.85rem',
          color: theme.text.muted,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          marginBottom: 12,
        }}>
          {subtitle}
        </p>
        <h2 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          fontWeight: 800,
          ...gradientText(theme.accent.textGradient),
          marginBottom: 0,
        }}>
          {title}
        </h2>
      </div>
    </ScrollReveal>
  );
}
