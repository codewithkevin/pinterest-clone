import { createContext, useContext, type PropsWithChildren } from 'react';
import { darkTheme, type Theme } from './tokens';

const ThemeContext = createContext<Theme>(darkTheme);

export function ThemeProvider({ children }: PropsWithChildren) {
  return <ThemeContext.Provider value={darkTheme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
