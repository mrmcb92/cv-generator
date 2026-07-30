"use client";

import { motion } from "motion/react";
import { themes, ThemeId } from "@/types/theme";
import { useTheme } from "@/context/ThemeContext";

const THEME_LABELS: Record<ThemeId, string> = {
  clean: "Light", dark: "Dark", violet: "Violet", warm: "Warm",
};

const THEME_ACCENTS: Record<ThemeId, string> = {
  clean: "#38bdf8", dark: "#22d3ee", violet: "#8b5cf6", warm: "#f59e0b",
};

export default function ThemePicker() {
  const { themeId, setTheme } = useTheme();
  return (
    <div className="flex items-center gap-1 bg-white/8 rounded-full p-0.5">
      {(Object.keys(themes) as ThemeId[]).map((id) => (
        <button
          key={id}
          onClick={() => setTheme(id)}
          className={`relative flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-all duration-300 ${
            themeId === id ? "text-white" : "text-white/50 hover:text-white/80"
          }`}
          style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
        >
          {themeId === id && (
            <motion.span
              layoutId="theme-active"
              className="absolute inset-0 rounded-full bg-white/12 ring-1 ring-white/20"
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
            />
          )}
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: THEME_ACCENTS[id] }} />
          <span className="relative z-10">{THEME_LABELS[id]}</span>
        </button>
      ))}
    </div>
  );
}
