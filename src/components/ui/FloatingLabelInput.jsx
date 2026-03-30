import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function FloatingLabelInput({ label, type = 'text', multiline = false, value, onChange, error }) {
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);
  const isActive = focused || (value && value.length > 0);

  const Tag = multiline ? 'textarea' : 'input';

  return (
    <div style={{ position: 'relative', marginBottom: 24 }}>
      <Tag
        type={multiline ? undefined : type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={multiline ? 4 : undefined}
        style={{
          width: '100%',
          padding: '20px 16px 8px',
          fontSize: '0.95rem',
          background: theme.glass.background,
          backdropFilter: theme.glass.blur,
          WebkitBackdropFilter: theme.glass.blur,
          border: focused
            ? `2px solid ${theme.accent.primary}`
            : error
            ? '2px solid #e74c3c'
            : theme.glass.border,
          borderRadius: 12,
          outline: 'none',
          color: theme.text.primary,
          transition: 'all 0.3s ease',
          resize: multiline ? 'vertical' : 'none',
          fontFamily: 'inherit',
          boxSizing: 'border-box',
        }}
      />
      <label
        style={{
          position: 'absolute',
          left: 16,
          top: isActive ? 6 : 14,
          fontSize: isActive ? '0.7rem' : '0.95rem',
          color: focused ? theme.accent.primary : error ? '#e74c3c' : theme.text.muted,
          transition: 'all 0.2s ease',
          pointerEvents: 'none',
          fontWeight: isActive ? 600 : 400,
        }}
      >
        {label}
      </label>
      {error && (
        <p style={{ color: '#e74c3c', fontSize: '0.78rem', marginTop: 4, paddingLeft: 4 }}>
          {error}
        </p>
      )}
    </div>
  );
}
