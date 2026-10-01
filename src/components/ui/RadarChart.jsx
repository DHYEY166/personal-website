import { useTheme } from '../../context/ThemeContext';

const WIDTH = 440;
const HEIGHT = 330;
const RADIUS = 105;
const LEVELS = 5;

export default function RadarChart({ categories }) {
  const { theme } = useTheme();
  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;
  const count = categories.length;
  const angleSlice = (Math.PI * 2) / count;

  const getPoint = (angle, r) => ({
    x: cx + r * Math.cos(angle - Math.PI / 2),
    y: cy + r * Math.sin(angle - Math.PI / 2),
  });

  const avgProficiency = categories.map((cat) => {
    const avg = cat.skills.reduce((sum, s) => sum + s.proficiency, 0) / cat.skills.length;
    return avg / 5;
  });

  const gridLevels = Array.from({ length: LEVELS }, (_, i) => {
    const r = (RADIUS / LEVELS) * (i + 1);
    return Array.from({ length: count }, (_, j) => {
      const p = getPoint(j * angleSlice, r);
      return `${p.x},${p.y}`;
    }).join(' ');
  });

  const dataPoints = avgProficiency
    .map((val, i) => {
      const p = getPoint(i * angleSlice, RADIUS * val);
      return `${p.x},${p.y}`;
    })
    .join(' ');

  const summary = categories
    .map((cat, i) => `${cat.title}: ${Math.round(avgProficiency[i] * 5 * 10) / 10} of 5`)
    .join('; ');

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={`Average skill proficiency by category. ${summary}`}
      style={{ display: 'block', margin: '0 auto', width: '100%', maxWidth: WIDTH, height: 'auto', overflow: 'visible' }}
    >
      {gridLevels.map((points, i) => (
        <polygon key={i} points={points} fill="none" stroke={theme.text.muted} strokeWidth={0.5} opacity={0.3} />
      ))}

      {categories.map((_, i) => {
        const p = getPoint(i * angleSlice, RADIUS);
        return (
          <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={theme.text.muted} strokeWidth={0.5} opacity={0.3} />
        );
      })}

      <polygon points={dataPoints} fill="rgba(102, 126, 234, 0.2)" stroke="#667eea" strokeWidth={2} />

      {avgProficiency.map((val, i) => {
        const p = getPoint(i * angleSlice, RADIUS * val);
        return <circle key={i} cx={p.x} cy={p.y} r={4} fill="#667eea" stroke="#fff" strokeWidth={1.5} />;
      })}

      {categories.map((cat, i) => {
        const p = getPoint(i * angleSlice, RADIUS + 16);
        // Anchor side labels away from the chart so long titles are not clipped.
        const dx = p.x - cx;
        const anchor = Math.abs(dx) < 1 ? 'middle' : dx > 0 ? 'start' : 'end';
        const dy = p.y - cy;
        const baseline = Math.abs(dx) < 1 ? (dy < 0 ? 'auto' : 'hanging') : 'middle';
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor={anchor}
            dominantBaseline={baseline}
            fill={theme.text.secondary}
            fontSize={12}
            fontWeight={600}
          >
            {cat.title}
          </text>
        );
      })}
    </svg>
  );
}
