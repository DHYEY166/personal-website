import { useTheme } from '../../styles/useTheme';

/** Left-aligned section heading: small uppercase label above a serif title. */
export default function SectionHeader({ id, kicker, title, intro }) {
  const { theme } = useTheme();
  return (
    <header style={{ marginBottom: 'clamp(28px, 4vw, 40px)', maxWidth: '70ch' }}>
      {kicker && (
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: theme.accent.text,
            marginBottom: 8,
          }}
        >
          {kicker}
        </p>
      )}
      <h2 id={id} style={{ fontSize: 'clamp(28px, 4vw, 38px)' }}>
        {title}
      </h2>
      {intro && (
        <p style={{ marginTop: 12, color: theme.text.secondary, fontSize: 18 }}>{intro}</p>
      )}
    </header>
  );
}
