import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { glassCard } from '../../styles/theme';

export default function GlassCard({ children, style = {}, delay = 0, hover = true, onClick }) {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? {
        y: -8,
        boxShadow: theme.glass.shadowHover,
        borderColor: 'rgba(102,126,234,0.2)',
      } : undefined}
      onClick={onClick}
      style={{
        ...glassCard(theme),
        ...style,
        cursor: onClick ? 'pointer' : undefined,
      }}
    >
      {children}
    </motion.div>
  );
}
