import { useId, useState } from 'react';
import { useTheme } from '../../styles/useTheme';

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
    <div style={{ position: 'relative', marginBottom: 20 }}>
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
        className="field"
        style={{ resize: multiline ? 'vertical' : 'none', display: 'block' }}
      />
      <label
        htmlFor={id}
        style={{
          position: 'absolute',
          left: 15,
          top: isActive ? 5 : 15,
          fontSize: isActive ? 12 : 16,
          color: error ? theme.text.error : focused ? theme.accent.text : theme.text.muted,
          transition: 'top 0.15s ease, font-size 0.15s ease, color 0.15s ease',
          pointerEvents: 'none',
          fontWeight: isActive ? 600 : 400,
        }}
      >
        {label}
      </label>
      {error && (
        <p id={errorId} style={{ color: theme.text.error, fontSize: 14, marginTop: 4 }}>
          {error}
        </p>
      )}
    </div>
  );
}
