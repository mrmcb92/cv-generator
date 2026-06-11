"use client";

import { themes, ThemeId } from "@/types/theme";
import { useTheme } from "@/context/ThemeContext";

const SWATCHES: Record<ThemeId, string[]> = {
  clean:  ["#18181b", "#e4e4e7", "#38bdf8"],
  dark:   ["#09090b", "#3f3f46", "#22d3ee"],
  violet: ["#2e1065", "#ede9fe", "#7c3aed"],
  warm:   ["#1c1917", "#e7e5e4", "#f59e0b"],
};

export default function ThemeSelector() {
  const { themeId, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1">
      {(Object.values(themes)).map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          title={t.name}
          className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            themeId === t.id
              ? t.selectorActive
              : t.selectorHover
          } text-white/80 hover:text-white`}
        >
          <span className="flex gap-0.5">
            {SWATCHES[t.id].map((c, i) => (
              <span
                key={i}
                className="w-2.5 h-2.5 rounded-full ring-1 ring-black/10"
                style={{ background: c }}
              />
            ))}
          </span>
          <span>{t.name}</span>
        </button>
      ))}
    </div>
  );
}
