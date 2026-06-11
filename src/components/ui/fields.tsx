"use client";

import { Theme } from "@/types/theme";
import { Plus } from "@phosphor-icons/react";

// Shared "double-bezel" form controls used by all CVForm sections.

const EASE = { transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" };

function shells(theme: Theme, invalid?: boolean) {
  const isDark = theme.id === "dark";
  const ring = invalid
    ? "ring-1 ring-red-400/60"
    : isDark ? "ring-1 ring-white/[0.08]" : "ring-1 ring-black/[0.07]";
  const outer = `${isDark ? "bg-white/[0.04]" : "bg-black/[0.03]"} ${ring} rounded-xl p-[2px]`;
  const inner = isDark
    ? "w-full bg-zinc-800 rounded-[calc(0.75rem-2px)] px-3 py-2.5 text-[13px] text-zinc-100 placeholder-zinc-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] focus:ring-2 focus:ring-cyan-400/30 disabled:opacity-40 transition-all duration-300"
    : "w-full bg-white rounded-[calc(0.75rem-2px)] px-3 py-2.5 text-[13px] text-zinc-900 placeholder-zinc-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(255,255,255,0.9)] focus:ring-2 focus:ring-sky-500/25 disabled:opacity-40 transition-all duration-300";
  return { outer, inner };
}

export function DBInput({ type = "text", value, onChange, placeholder, theme, rows, disabled, invalid, hint }: {
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  theme: Theme;
  rows?: number;
  disabled?: boolean;
  invalid?: boolean;
  hint?: string;
}) {
  const { outer, inner } = shells(theme, invalid);
  return (
    <div>
      <div className={outer}>
        {rows ? (
          <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows}
            placeholder={placeholder} disabled={disabled}
            className={`${inner} resize-none leading-relaxed`} style={EASE} />
        ) : (
          <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder} disabled={disabled}
            className={inner} style={EASE} />
        )}
      </div>
      {invalid && hint && (
        <p className="mt-1 text-[10px] text-red-400">{hint}</p>
      )}
    </div>
  );
}

export function DBSelect({ value, onChange, options, theme }: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  theme: Theme;
}) {
  const isDark = theme.id === "dark";
  const { outer } = shells(theme);
  const inner = isDark
    ? "bg-zinc-800 rounded-[calc(0.75rem-2px)] px-2.5 py-2 text-[12px] text-zinc-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] focus:ring-2 focus:ring-cyan-400/30 transition-all duration-300"
    : "bg-white rounded-[calc(0.75rem-2px)] px-2.5 py-2 text-[12px] text-zinc-900 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(255,255,255,0.9)] focus:ring-2 focus:ring-sky-500/25 transition-all duration-300";
  return (
    <div className={outer}>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inner} style={EASE}>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

export function AddButton({ onClick, theme, label = "Adaugă" }: {
  onClick: () => void;
  theme: Theme;
  label?: string;
}) {
  const isDark = theme.id === "dark";
  return (
    <button onClick={onClick} aria-label={label}
      className={`group flex items-center gap-1.5 text-[11px] font-semibold pl-2.5 pr-1 py-1 rounded-full transition-all duration-300 active:scale-[0.96] ${isDark ? "bg-white/6 hover:bg-white/10 text-white/70 hover:text-white" : "bg-black/5 hover:bg-black/8 text-zinc-600 hover:text-zinc-900"}`}
      style={EASE}>
      {label}
      <span className={`w-5 h-5 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform ${isDark ? "bg-white/10" : "bg-black/8"}`}>
        <Plus size={10} weight="bold" />
      </span>
    </button>
  );
}

export function SectionHeader({ eyebrow, title, subtitle, theme }: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  theme: Theme;
}) {
  const isDark = theme.id === "dark";
  return (
    <div>
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-[0.18em] mb-1.5 ${isDark ? "bg-cyan-400/10 text-cyan-400" : "bg-sky-500/10 text-sky-600"}`}>
        {eyebrow}
      </span>
      <h2 className={`text-base font-bold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>{title}</h2>
      {subtitle && <p className={`text-[11px] mt-0.5 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>{subtitle}</p>}
    </div>
  );
}

export function fieldLabelClass(theme: Theme): string {
  const isDark = theme.id === "dark";
  return `block mb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] ${isDark ? "text-zinc-500" : "text-zinc-400"}`;
}
