import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export default function FilterBar({ categories, active, onChange }) {
  const { theme } = useTheme();

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10,
      justifyContent: 'center',
      marginBottom: 40,
    }}>
      {categories.map(cat => {
        const isActive = cat === active;
        return (
          <motion.button
            key={cat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(cat)}
            style={{
              padding: '8px 20px',
              borderRadius: 10,
              border: isActive ? 'none' : theme.glass.border,
              background: isActive ? theme.accent.gradient : theme.glass.background,
              backdropFilter: isActive ? 'none' : theme.glass.blur,
              WebkitBackdropFilter: isActive ? 'none' : theme.glass.blur,
              color: isActive ? '#fff' : theme.text.secondary,
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: isActive ? theme.accent.glow : 'none',
              transition: 'all 0.3s ease',
            }}
          >
            {cat}
          </motion.button>
        );
      })}
    </div>
  );
}
