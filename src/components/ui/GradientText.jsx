import { gradientText as gradientTextStyle } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';

export default function GradientText({ children, as: Tag = 'span', style = {}, gradient }) {
  const { theme } = useTheme();
  const grad = gradient || theme.accent.textGradient;

  return (
    <Tag style={{ ...gradientTextStyle(grad), ...style }}>
      {children}
    </Tag>
  );
}
