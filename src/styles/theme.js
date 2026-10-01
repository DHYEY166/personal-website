// Design tokens: one light, warm palette with a single accent. Hover/focus states that need
// to override colours live in index.css (inline styles would win over :hover rules).
//
// Contrast (WCAG) on the page background #FAF7F2: text 16.0:1, secondary 9.2:1, muted 5.7:1,
// accent 5.9:1, white on accent 6.3:1. All pass AA for normal text.
export const theme = {
  bg: {
    page: '#FAF7F2', // warm off-white
    surface: '#FFFDF9', // panels and inputs, a touch lighter than the page
    subtle: '#F3EEE6', // tags, quiet fills
  },
  text: {
    primary: '#1F1B16', // warm near-black
    heading: '#1F1B16',
    secondary: '#4A4239',
    muted: '#6B6157',
    error: '#B3261E',
    onAccent: '#FFFFFF',
  },
  accent: {
    primary: '#A3402A', // terracotta
    hover: '#7A2F1C',
    soft: '#F6E7E0',
    text: '#A3402A',
  },
  border: {
    color: '#E5DDD0',
    strongColor: '#CFC4B3',
    default: '1px solid #E5DDD0',
    strong: '1px solid #CFC4B3',
  },
  font: {
    serif: "'Source Serif 4', Georgia, 'Times New Roman', serif",
    sans: "'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  radius: { sm: 4, md: 6, lg: 8 },
};

/** Width of the main content column; text blocks inside are capped near 70 characters. */
export const CONTENT_WIDTH = 1040;
export const READING_WIDTH = '70ch';

/** Flat panel: light surface, hairline border, no shadow or blur. */
export const panel = (t = theme) => ({
  background: t.bg.surface,
  border: t.border.default,
  borderRadius: t.radius.lg,
  padding: 'clamp(20px, 3vw, 28px)',
});

/** Shared outer style for home-page sections. */
export const sectionStyle = {
  maxWidth: CONTENT_WIDTH,
  margin: '0 auto',
  padding: 'clamp(56px, 8vw, 96px) clamp(20px, 4vw, 32px)',
};
