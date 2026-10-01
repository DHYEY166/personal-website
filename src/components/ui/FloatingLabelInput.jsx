import { useId, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function FloatingLabelInput({
  label,
  name,
  type = 'text',
  multiline = false,
  value,
  onChange,
  error,
  autoComplete,
  required = false,
}) {
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);
  const id = useId();
  const errorId = `${id}-error`;
  const isActive = focused || (value && value.length > 0);

  const Tag = multiline ? 'textarea' : 'input';

  return (
    <div style={{ position: 'relative', marginBottom: 24 }}>
      <Tag
        id={id}
        name={name}
        type={multiline ? undefined : type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={multiline ? 4 : undefined}
        autoComplete={autoComplete}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
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
            ? `2px solid ${theme.text.error}`
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
        htmlFor={id}
        style={{
          position: 'absolute',
          left: 16,
          top: isActive ? 6 : 14,
          fontSize: isActive ? '0.7rem' : '0.95rem',
          color: focused ? theme.accent.text : error ? theme.text.error : theme.text.muted,
          transition: 'all 0.2s ease',
          pointerEvents: 'none',
          fontWeight: isActive ? 600 : 400,
        }}
      >
        {label}
      </label>
      {error && (
        <p id={errorId} style={{ color: theme.text.error, fontSize: '0.78rem', marginTop: 4, paddingLeft: 4 }}>
          {error}
        </p>
      )}
    </div>
  );
}
