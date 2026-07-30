"use client";
import { useState } from "react";
import { Theme } from "@/types/theme";

const shellClass = (theme: Theme, invalid?: boolean) => {
  const isDark = theme.id === "dark";
  const ring = invalid ? "ring-1 ring-red-400/60" : isDark ? "ring-1 ring-white/[0.08]" : "ring-1 ring-black/[0.07]";
  const outer = `${isDark ? "bg-white/[0.04]" : "bg-black/[0.03]"} ${ring} rounded-xl p-[2px]`;
  return outer;
};

const innerClass = (theme: Theme) => {
  const isDark = theme.id === "dark";
  return isDark
    ? "w-full bg-zinc-800 rounded-[calc(0.75rem-2px)] px-3 py-2.5 text-[13px] text-zinc-100 placeholder-zinc-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] focus:ring-2 focus:ring-cyan-400/30 disabled:opacity-40 transition-all duration-300"
    : "w-full bg-white rounded-[calc(0.75rem-2px)] px-3 py-2.5 text-[13px] text-zinc-900 placeholder-zinc-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(255,255,255,0.9)] focus:ring-2 focus:ring-sky-500/25 disabled:opacity-40 transition-all duration-300";
};

interface Props {
  value: string;
  onChange: (v: string) => void;
  theme: Theme;
  disabled?: boolean;
  invalid?: boolean;
  hint?: string;
}

export default function DateInput({ value, onChange, theme, disabled, invalid, hint }: Props) {
  const [mode, setMode] = useState<"month" | "text">("month");
  const toggle = () => setMode(mode === "month" ? "text" : "month");
  const isDark = theme.id === "dark";

  return (
    <div>
      <div className="flex gap-1 items-start">
        <div className="flex-1 min-w-0">
          {mode === "month" ? (
            <div className={shellClass(theme, invalid)}>
              <input
                type="month"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={innerClass(theme)}
                style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
              />
            </div>
          ) : (
            <div className={shellClass(theme, invalid)}>
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="ex: 2021, Mar 2021, 2021-03"
                disabled={disabled}
                className={innerClass(theme)}
                style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
              />
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={toggle}
          title={mode === "month" ? "Comută la text liber" : "Comută la selector lună"}
          className={`flex-shrink-0 mt-0.5 text-[9px] font-bold uppercase px-1.5 py-1 rounded-lg transition-colors ${
            isDark ? "text-zinc-600 hover:text-cyan-400" : "text-zinc-400 hover:text-sky-600"
          }`}
        >
          {mode === "month" ? "✎" : "📅"}
        </button>
      </div>
      {invalid && hint && (
        <p className="mt-1 text-[10px] text-red-400">{hint}</p>
      )}
    </div>
  );
}