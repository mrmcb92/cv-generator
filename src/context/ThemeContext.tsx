"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Theme, ThemeId, themes } from "@/types/theme";

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

  return (
    <ThemeContext.Provider
      value={{ theme: themes[themeId], themeId, setTheme: setThemeId }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
