import { createContext, useContext, useState, useEffect } from 'react';
import { darkTheme, lightTheme } from '../styles/theme';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try {
      const saved = localStorage.getItem('theme-preference');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    return 'dark';
  });

  const theme = mode === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    localStorage.setItem('theme-preference', mode);
    document.documentElement.setAttribute('data-theme', mode);
    document.body.style.background = theme.bg.primary;
    document.body.style.backgroundImage = theme.bg.mesh;
    document.body.style.color = theme.text.primary;
  }, [mode, theme]);

  const toggleTheme = () => setMode(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
