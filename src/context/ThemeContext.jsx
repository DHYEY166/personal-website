import { createContext, useContext, useState, useEffect } from 'react';
import { darkTheme, lightTheme } from '../styles/theme';

const STORAGE_KEY = 'theme-preference';
const ThemeContext = createContext();

function readSavedMode() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // localStorage can be unavailable (privacy mode); fall back to the default theme.
  }
  return 'dark';
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(readSavedMode);

  const theme = mode === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Ignore storage failures; the theme still applies for this session.
    }
    document.documentElement.setAttribute('data-theme', mode);
    document.body.style.backgroundColor = theme.bg.primary;
    document.body.style.backgroundImage = theme.bg.mesh;
    document.body.style.color = theme.text.primary;
  }, [mode, theme]);

  const toggleTheme = () => setMode(prev => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);
