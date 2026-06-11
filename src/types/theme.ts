export type ThemeId = "clean" | "dark" | "violet" | "warm";

export interface Theme {
  id: ThemeId;
  name: string;
  // navbar
  navBg: string;
  navText: string;
  navAccentDot: string;
  // page bg
  pageBg: string;
  // form panel
  formBg: string;
  formBorder: string;
  // tabs
  tabBar: string;
  tabActive: string;
  tabActiveText: string;
  tabInactiveText: string;
  tabIndicator: string;
  // section headings
  sectionHeading: string;
  sectionDivider: string;
  // labels
  labelText: string;
  helperText: string;
  // inputs — must pass WCAG AA 4.5:1
  inputBg: string;
  inputBorder: string;
  inputBorderFocus: string;
  inputText: string;
  inputPlaceholder: string;
  inputFocusRing: string;
  // select
  selectBg: string;
  // add/remove buttons
  addBtn: string;
  removeBtn: string;
  // empty state
  emptyText: string;
  // entry card
  entryCard: string;
  entryCardBg: string;
  // checkbox
  checkboxAccent: string;
  // preview panel
  previewBg: string;
  // theme selector button
  selectorActive: string;
  selectorHover: string;
}

export const themes: Record<ThemeId, Theme> = {
  clean: {
    id: "clean",
    name: "Light",
    navBg: "bg-zinc-900",
    navText: "text-zinc-100",
    navAccentDot: "bg-sky-400",
    pageBg: "bg-zinc-100",
    formBg: "bg-white",
    formBorder: "border-r border-zinc-200",
    tabBar: "bg-zinc-50 border-b border-zinc-200",
    tabActive: "bg-white",
    tabActiveText: "text-zinc-900 font-semibold",
    tabInactiveText: "text-zinc-400 hover:text-zinc-600",
    tabIndicator: "bg-sky-500",
    sectionHeading: "text-zinc-800 font-semibold text-sm tracking-wide uppercase",
    sectionDivider: "border-b border-zinc-100 pb-2 mb-5",
    labelText: "text-zinc-700 text-[13px] font-medium",
    helperText: "text-zinc-400 text-xs",
    inputBg: "bg-zinc-50",
    inputBorder: "border border-zinc-300",
    inputBorderFocus: "focus:border-sky-500",
    inputText: "text-zinc-900 placeholder-zinc-400",
    inputPlaceholder: "",
    inputFocusRing: "focus:ring-2 focus:ring-sky-500/20",
    selectBg: "bg-zinc-50",
    addBtn: "text-sky-600 hover:text-sky-800 font-medium",
    removeBtn: "text-zinc-300 hover:text-red-500 transition-colors",
    emptyText: "text-zinc-400",
    entryCard: "border border-zinc-200 rounded-xl",
    entryCardBg: "bg-zinc-50/50",
    checkboxAccent: "accent-sky-500",
    previewBg: "bg-zinc-200",
    selectorActive: "bg-white/15 ring-1 ring-white/40",
    selectorHover: "hover:bg-white/10",
  },
  dark: {
    id: "dark",
    name: "Dark",
    navBg: "bg-zinc-950",
    navText: "text-zinc-100",
    navAccentDot: "bg-cyan-400",
    pageBg: "bg-zinc-900",
    formBg: "bg-zinc-800",
    formBorder: "border-r border-zinc-700/60",
    tabBar: "bg-zinc-900 border-b border-zinc-700/60",
    tabActive: "bg-zinc-800",
    tabActiveText: "text-white font-semibold",
    tabInactiveText: "text-zinc-500 hover:text-zinc-300",
    tabIndicator: "bg-cyan-400",
    sectionHeading: "text-zinc-300 font-semibold text-sm tracking-wide uppercase",
    sectionDivider: "border-b border-zinc-700 pb-2 mb-5",
    labelText: "text-zinc-300 text-[13px] font-medium",
    helperText: "text-zinc-500 text-xs",
    inputBg: "bg-zinc-700",
    inputBorder: "border border-zinc-600",
    inputBorderFocus: "focus:border-cyan-400",
    inputText: "text-zinc-100 placeholder-zinc-500",
    inputPlaceholder: "",
    inputFocusRing: "focus:ring-2 focus:ring-cyan-400/20",
    selectBg: "bg-zinc-700",
    addBtn: "text-cyan-400 hover:text-cyan-300 font-medium",
    removeBtn: "text-zinc-600 hover:text-red-400 transition-colors",
    emptyText: "text-zinc-600",
    entryCard: "border border-zinc-700 rounded-xl",
    entryCardBg: "bg-zinc-700/30",
    checkboxAccent: "accent-cyan-400",
    previewBg: "bg-zinc-950",
    selectorActive: "bg-white/15 ring-1 ring-white/40",
    selectorHover: "hover:bg-white/10",
  },
  violet: {
    id: "violet",
    name: "Violet",
    navBg: "bg-violet-950",
    navText: "text-violet-100",
    navAccentDot: "bg-violet-400",
    pageBg: "bg-violet-50",
    formBg: "bg-white",
    formBorder: "border-r border-violet-100",
    tabBar: "bg-violet-50 border-b border-violet-100",
    tabActive: "bg-white",
    tabActiveText: "text-violet-900 font-semibold",
    tabInactiveText: "text-violet-400 hover:text-violet-700",
    tabIndicator: "bg-violet-600",
    sectionHeading: "text-violet-900 font-semibold text-sm tracking-wide uppercase",
    sectionDivider: "border-b border-violet-100 pb-2 mb-5",
    labelText: "text-violet-800 text-[13px] font-medium",
    helperText: "text-violet-400 text-xs",
    inputBg: "bg-violet-50",
    inputBorder: "border border-violet-200",
    inputBorderFocus: "focus:border-violet-500",
    inputText: "text-zinc-900 placeholder-violet-300",
    inputPlaceholder: "",
    inputFocusRing: "focus:ring-2 focus:ring-violet-400/25",
    selectBg: "bg-violet-50",
    addBtn: "text-violet-600 hover:text-violet-900 font-medium",
    removeBtn: "text-violet-200 hover:text-red-500 transition-colors",
    emptyText: "text-violet-300",
    entryCard: "border border-violet-100 rounded-xl",
    entryCardBg: "bg-violet-50/70",
    checkboxAccent: "accent-violet-600",
    previewBg: "bg-violet-100",
    selectorActive: "bg-white/15 ring-1 ring-white/40",
    selectorHover: "hover:bg-white/10",
  },
  warm: {
    id: "warm",
    name: "Warm",
    navBg: "bg-stone-900",
    navText: "text-stone-100",
    navAccentDot: "bg-amber-400",
    pageBg: "bg-stone-100",
    formBg: "bg-stone-50",
    formBorder: "border-r border-stone-200",
    tabBar: "bg-stone-100 border-b border-stone-200",
    tabActive: "bg-stone-50",
    tabActiveText: "text-stone-900 font-semibold",
    tabInactiveText: "text-stone-400 hover:text-stone-700",
    tabIndicator: "bg-amber-500",
    sectionHeading: "text-stone-700 font-semibold text-sm tracking-wide uppercase",
    sectionDivider: "border-b border-stone-200 pb-2 mb-5",
    labelText: "text-stone-700 text-[13px] font-medium",
    helperText: "text-stone-400 text-xs",
    inputBg: "bg-white",
    inputBorder: "border border-stone-300",
    inputBorderFocus: "focus:border-amber-500",
    inputText: "text-stone-900 placeholder-stone-400",
    inputPlaceholder: "",
    inputFocusRing: "focus:ring-2 focus:ring-amber-400/20",
    selectBg: "bg-white",
    addBtn: "text-amber-700 hover:text-amber-900 font-medium",
    removeBtn: "text-stone-300 hover:text-red-500 transition-colors",
    emptyText: "text-stone-400",
    entryCard: "border border-stone-200 rounded-xl",
    entryCardBg: "bg-white",
    checkboxAccent: "accent-amber-500",
    previewBg: "bg-stone-200",
    selectorActive: "bg-white/15 ring-1 ring-white/40",
    selectorHover: "hover:bg-white/10",
  },
};
