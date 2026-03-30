import { useTheme } from '../../context/ThemeContext';

export default function RadarChart({ categories }) {
  const { theme } = useTheme();
  const size = 280;
  const center = size / 2;
  const radius = size / 2 - 40;
  const levels = 5;
  const count = categories.length;

  const angleSlice = (Math.PI * 2) / count;

  const getPoint = (angle, r) => ({
    x: center + r * Math.cos(angle - Math.PI / 2),
    y: center + r * Math.sin(angle - Math.PI / 2),
  });

  const avgProficiency = categories.map(cat => {
    const avg = cat.skills.reduce((sum, s) => sum + s.proficiency, 0) / cat.skills.length;
    return avg / 5;
  });

  const gridLevels = Array.from({ length: levels }, (_, i) => {
    const r = (radius / levels) * (i + 1);
    const points = Array.from({ length: count }, (_, j) => {
      const p = getPoint(j * angleSlice, r);
      return `${p.x},${p.y}`;
    }).join(' ');
    return points;
  });

  const dataPoints = avgProficiency.map((val, i) => {
    const p = getPoint(i * angleSlice, radius * val);
    return `${p.x},${p.y}`;
  }).join(' ');

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', margin: '0 auto' }}>
      {gridLevels.map((points, i) => (
        <polygon
          key={i}
          points={points}
          fill="none"
          stroke={theme.text.muted}
          strokeWidth={0.5}
          opacity={0.3}
        />
      ))}

      {categories.map((_, i) => {
        const p = getPoint(i * angleSlice, radius);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={p.x}
            y2={p.y}
            stroke={theme.text.muted}
            strokeWidth={0.5}
            opacity={0.3}
          />
        );
      })}

      <polygon
        points={dataPoints}
        fill="rgba(102, 126, 234, 0.2)"
        stroke="#667eea"
        strokeWidth={2}
      />

      {avgProficiency.map((val, i) => {
        const p = getPoint(i * angleSlice, radius * val);
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={4}
            fill="#667eea"
            stroke="#fff"
            strokeWidth={1.5}
          />
        );
      })}

      {categories.map((cat, i) => {
        const p = getPoint(i * angleSlice, radius + 28);
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={theme.text.muted}
            fontSize={9}
            fontWeight={600}
          >
            {cat.title.length > 14 ? cat.title.slice(0, 12) + '…' : cat.title}
          </text>
        );
      })}
    </svg>
  );
}
