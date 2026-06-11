"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Theme, ThemeId, themes } from "@/types/theme";

const LS_THEME_KEY = "cv-generator-theme";

interface ThemeContextValue {
  theme: Theme;
  themeId: ThemeId;
  setTheme: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: themes.clean,
  themeId: "clean",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>("clean");

  // Restore saved theme after mount (avoids SSR hydration mismatch)
  useEffect(() => {
    const saved = localStorage.getItem(LS_THEME_KEY) as ThemeId | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage, must run after mount
    if (saved && saved in themes) setThemeId(saved);
  }, []);

  const setTheme = (id: ThemeId) => {
    setThemeId(id);
    localStorage.setItem(LS_THEME_KEY, id);
  };

  return (
    <ThemeContext.Provider
      value={{ theme: themes[themeId], themeId, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
