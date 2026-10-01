import { theme } from './theme';

/**
 * The site has a single light theme. Components read tokens through this hook so styling
 * stays in one place; there is no theme state or toggle.
 */
export function useTheme() {
  return { theme };
}
