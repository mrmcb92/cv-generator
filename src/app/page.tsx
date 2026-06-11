"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CVData, defaultCV } from "@/types/cv";
import { validateCV } from "@/lib/validateCv";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import PersonalSection  from "@/components/CVForm/PersonalSection";
import ExperienceSection from "@/components/CVForm/ExperienceSection";
import EducationSection from "@/components/CVForm/EducationSection";
import SkillsSection    from "@/components/CVForm/SkillsSection";
import CVPreview        from "@/components/CVPreview";
import { cvTemplates, TemplateId } from "@/types/template";
import {
  FilePdf, FileDoc, FileHtml, FileArrowDown, UploadSimple,
  User, Briefcase, GraduationCap, Star,
  ArrowUpRight, Circle,
} from "@phosphor-icons/react";
import { themes, ThemeId } from "@/types/theme";
import { useTheme as useAppTheme } from "@/context/ThemeContext";

type Tab = "personal" | "experience" | "education" | "skills";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "personal",   label: "Personal",   icon: User },
  { id: "experience", label: "Experiență", icon: Briefcase },
  { id: "education",  label: "Educație",   icon: GraduationCap },
  { id: "skills",     label: "Competențe", icon: Star },
];

const THEME_LABELS: Record<ThemeId, string> = {
  clean: "Light", dark: "Dark", violet: "Violet", warm: "Warm",
};

const THEME_ACCENTS: Record<ThemeId, string> = {
  clean: "#38bdf8", dark: "#22d3ee", violet: "#8b5cf6", warm: "#f59e0b",
};

// Per-theme right-panel background — makes Light vs Warm visually distinct
const RIGHT_PANEL_BG: Record<ThemeId, string> = {
  clean:  "radial-gradient(ellipse at 70% 10%, rgba(56,189,248,0.09) 0%, transparent 55%), #e2e8f0",
  dark:   "radial-gradient(ellipse at 30% 20%, rgba(34,211,238,0.05) 0%, transparent 60%), #09090b",
  violet: "radial-gradient(ellipse at 70% 15%, rgba(139,92,246,0.12) 0%, transparent 55%), #ede9f8",
  warm:   "radial-gradient(ellipse at 70% 10%, rgba(251,146,60,0.12) 0%, transparent 55%), #faf5eb",
};

// Per-theme left-panel background
const LEFT_PANEL_BG: Record<ThemeId, string> = {
  clean:  "rgba(255,255,255,0.96)",
  dark:   "rgba(24,24,27,0.97)",
  violet: "rgba(250,248,255,0.97)",
  warm:   "rgba(254,252,247,0.97)",
};

// Per-theme tab bar background
const TAB_BAR_BG: Record<ThemeId, string> = {
  clean:  "rgba(241,245,249,0.95)",
  dark:   "rgba(9,9,11,0.7)",
  violet: "rgba(245,243,255,0.95)",
  warm:   "rgba(245,240,230,0.95)",
};

function ThemePicker() {
  const { themeId, setTheme } = useAppTheme();
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

// Mini thumbnail previews for each template
const TEMPLATE_THUMBS: Record<TemplateId, React.ReactNode> = {
  classic: (
    <svg viewBox="0 0 40 52" className="w-full h-full">
      <rect width="40" height="52" fill="white"/>
      <rect width="40" height="12" fill="#1e293b"/>
      <rect x="4" y="3" width="18" height="2.5" rx="1" fill="white" opacity="0.9"/>
      <rect x="4" y="7" width="12" height="1.5" rx="0.5" fill="white" opacity="0.5"/>
      <rect x="4" y="16" width="32" height="1" rx="0.5" fill="#e2e8f0"/>
      <rect x="4" y="19" width="22" height="1.5" rx="0.5" fill="#94a3b8"/>
      <rect x="4" y="22" width="28" height="1" rx="0.5" fill="#cbd5e1"/>
      <rect x="4" y="25" width="28" height="1" rx="0.5" fill="#e2e8f0"/>
      <rect x="4" y="30" width="32" height="1" rx="0.5" fill="#e2e8f0"/>
      <rect x="4" y="33" width="20" height="1.5" rx="0.5" fill="#94a3b8"/>
      <rect x="4" y="36" width="28" height="1" rx="0.5" fill="#cbd5e1"/>
      <rect x="4" y="41" width="14" height="1" rx="0.5" fill="#e2e8f0"/>
      <rect x="22" y="41" width="14" height="1" rx="0.5" fill="#e2e8f0"/>
      <rect x="4" y="43.5" width="10" height="1" rx="0.5" fill="#cbd5e1"/>
      <rect x="22" y="43.5" width="10" height="1" rx="0.5" fill="#cbd5e1"/>
    </svg>
  ),
  modern: (
    <svg viewBox="0 0 40 52" className="w-full h-full">
      <rect width="40" height="52" fill="white"/>
      <rect width="14" height="52" fill="#0f172a"/>
      <rect x="2" y="4" width="8" height="2" rx="0.5" fill="#38bdf8" opacity="0.9"/>
      <rect x="2" y="7" width="6" height="1.2" rx="0.5" fill="white" opacity="0.6"/>
      <rect x="2" y="12" width="10" height="0.8" rx="0.3" fill="#38bdf8" opacity="0.5"/>
      <rect x="2" y="14" width="8" height="0.8" rx="0.3" fill="white" opacity="0.3"/>
      <rect x="2" y="15.5" width="8" height="0.8" rx="0.3" fill="white" opacity="0.3"/>
      <rect x="2" y="20" width="10" height="0.8" rx="0.3" fill="#38bdf8" opacity="0.5"/>
      <rect x="2" y="22" width="9" height="0.5" rx="0.2" fill="white" opacity="0.25"/>
      <rect x="2" y="23.2" width="7" height="0.5" rx="0.2" fill="white" opacity="0.25"/>
      <rect x="2" y="24.4" width="8" height="0.5" rx="0.2" fill="white" opacity="0.25"/>
      <rect x="17" y="4" width="19" height="0.8" rx="0.3" fill="#0ea5e9" opacity="0.7"/>
      <rect x="17" y="6.5" width="14" height="1.2" rx="0.4" fill="#1e293b"/>
      <rect x="17" y="8.5" width="10" height="1" rx="0.4" fill="#94a3b8"/>
      <rect x="17" y="11" width="19" height="0.5" rx="0.2" fill="#e2e8f0"/>
      <rect x="17" y="13" width="19" height="0.8" rx="0.3" fill="#0ea5e9" opacity="0.7"/>
      <rect x="17" y="15" width="14" height="1.2" rx="0.4" fill="#1e293b"/>
      <rect x="17" y="17" width="10" height="1" rx="0.4" fill="#0ea5e9" opacity="0.6"/>
      <rect x="17" y="19" width="19" height="0.5" rx="0.2" fill="#e2e8f0"/>
    </svg>
  ),
  minimal: (
    <svg viewBox="0 0 40 52" className="w-full h-full">
      <rect width="40" height="52" fill="white"/>
      <rect x="4" y="5" width="24" height="4" rx="1" fill="#18181b" opacity="0.85"/>
      <rect x="4" y="11" width="30" height="0.6" rx="0.2" fill="#e4e4e7"/>
      <rect x="4" y="14" width="32" height="0.8" rx="0.3" fill="#a1a1aa"/>
      <rect x="4" y="16" width="28" height="0.8" rx="0.3" fill="#d4d4d8"/>
      <rect x="4" y="18" width="30" height="0.8" rx="0.3" fill="#d4d4d8"/>
      <rect x="4" y="23" width="8" height="0.8" rx="0.3" fill="#a1a1aa"/>
      <rect x="4" y="26" width="18" height="1" rx="0.4" fill="#3f3f46"/>
      <rect x="4" y="28" width="12" height="0.8" rx="0.3" fill="#a1a1aa"/>
      <rect x="4" y="31" width="28" height="0.6" rx="0.2" fill="#d4d4d8"/>
      <rect x="4" y="33" width="18" height="1" rx="0.4" fill="#3f3f46"/>
      <rect x="4" y="35" width="12" height="0.8" rx="0.3" fill="#a1a1aa"/>
      <rect x="4" y="38" width="30" height="0.6" rx="0.2" fill="#d4d4d8"/>
      <rect x="4" y="41" width="8" height="0.8" rx="0.3" fill="#a1a1aa"/>
      <rect x="4" y="43.5" width="14" height="0.7" rx="0.3" fill="#d4d4d8"/>
      <rect x="20" y="43.5" width="14" height="0.7" rx="0.3" fill="#d4d4d8"/>
    </svg>
  ),
  creative: (
    <svg viewBox="0 0 40 52" className="w-full h-full">
      <rect width="40" height="52" fill="white"/>
      <rect width="40" height="1.5" fill="url(#cg)"/>
      <defs>
        <linearGradient id="cg" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#0ea5e9"/>
          <stop offset="100%" stopColor="#22d3ee"/>
        </linearGradient>
      </defs>
      <rect x="4" y="5" width="20" height="3.5" rx="0.8" fill="#0f172a" opacity="0.9"/>
      <rect x="28" y="5" width="8" height="1" rx="0.3" fill="#94a3b8" opacity="0.6"/>
      <rect x="28" y="7" width="6" height="1" rx="0.3" fill="#94a3b8" opacity="0.4"/>
      <rect x="4" y="11" width="30" height="0.5" rx="0.2" fill="#f1f5f9"/>
      <rect x="4" y="14" width="2" height="2" rx="0.3" fill="#0ea5e9"/>
      <rect x="8" y="14.2" width="8" height="0.8" rx="0.3" fill="#0ea5e9" opacity="0.8"/>
      <rect x="4" y="18" width="2" height="14" rx="0.3" fill="#bae6fd" opacity="0.6"/>
      <rect x="8" y="18" width="14" height="1.2" rx="0.4" fill="#1e293b"/>
      <rect x="8" y="20.5" width="10" height="1" rx="0.3" fill="#0ea5e9" opacity="0.7"/>
      <rect x="8" y="22.5" width="22" height="0.7" rx="0.3" fill="#d1d5db"/>
      <rect x="8" y="24.5" width="18" height="0.7" rx="0.3" fill="#d1d5db"/>
      <rect x="8" y="27.5" width="14" height="1.2" rx="0.4" fill="#1e293b"/>
      <rect x="8" y="30" width="10" height="1" rx="0.3" fill="#0ea5e9" opacity="0.7"/>
      <rect x="4" y="35" width="2" height="0.8" rx="0.3" fill="#0ea5e9"/>
      <rect x="8" y="35" width="8" height="0.8" rx="0.3" fill="#0ea5e9" opacity="0.8"/>
      <rect x="4" y="38" width="8" height="3" rx="1" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="0.4"/>
      <rect x="14" y="38" width="8" height="3" rx="1" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="0.4"/>
      <rect x="24" y="38" width="8" height="3" rx="1" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="0.4"/>
    </svg>
  ),
};

function TemplatePicker({
  selected, onChange, isDark,
}: {
  selected: TemplateId;
  onChange: (id: TemplateId) => void;
  isDark: boolean;
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 flex-shrink-0 border-b overflow-x-auto"
      style={{
        borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)",
        background: isDark ? "rgba(9,9,11,0.5)" : "rgba(248,250,252,0.9)",
      }}>
      <span className={`text-[10px] font-semibold uppercase tracking-[0.1em] flex-shrink-0 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
        Template
      </span>
      <div className="flex gap-2">
        {cvTemplates.map((tpl) => {
          const active = selected === tpl.id;
          return (
            <button
              key={tpl.id}
              onClick={() => onChange(tpl.id)}
              title={tpl.description}
              className={`group flex flex-col items-center gap-1 flex-shrink-0 transition-all duration-200 active:scale-95`}
              style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
            >
              {/* Thumbnail */}
              <div
                className={`w-10 h-[52px] rounded-md overflow-hidden transition-all duration-200 ${
                  active
                    ? "ring-2 ring-sky-500 shadow-md shadow-sky-500/20"
                    : isDark
                      ? "ring-1 ring-white/10 opacity-50 hover:opacity-80 hover:ring-white/20"
                      : "ring-1 ring-black/10 opacity-50 hover:opacity-80 hover:ring-black/15"
                }`}
              >
                {TEMPLATE_THUMBS[tpl.id]}
              </div>
              {/* Label */}
              <span className={`text-[9px] font-medium transition-colors ${
                active
                  ? isDark ? "text-sky-400" : "text-sky-600"
                  : isDark ? "text-zinc-600" : "text-zinc-400"
              }`}>
                {tpl.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const LS_KEY = "cv-generator-data";
const LS_TEMPLATE_KEY = "cv-generator-template";

type Toast = { id: number; message: string; kind: "success" | "error" };

let toastCounter = 0;

function ToastStack({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`px-4 py-2.5 rounded-full text-[12px] font-medium text-white shadow-lg ${
              t.kind === "error" ? "bg-red-500/95" : "bg-emerald-600/95"
            }`}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function loadFromStorage(): CVData | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.version === "1" ? validateCV(parsed.data) : null;
  } catch { return null; }
}

function App() {
  const { theme } = useTheme();
  const [cv, setCv]               = useState<CVData>(defaultCV);
  const [activeTab, setActiveTab] = useState<Tab>("personal");
  const [templateId, setTemplateId] = useState<TemplateId>("classic");
  const [exporting, setExporting] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const importRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, kind: Toast["kind"] = "success") => {
    const id = ++toastCounter;
    setToasts((prev) => [...prev, { id, message, kind }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  // Load from localStorage after mount (avoids SSR hydration mismatch)
  useEffect(() => {
    const stored = loadFromStorage();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage, must run after mount
    if (stored) setCv(stored);
    const tpl = localStorage.getItem(LS_TEMPLATE_KEY) as TemplateId | null;
    if (tpl && cvTemplates.some((t) => t.id === tpl)) setTemplateId(tpl);
  }, []);

  const changeTemplate = (id: TemplateId) => {
    setTemplateId(id);
    localStorage.setItem(LS_TEMPLATE_KEY, id);
  };

  // Auto-save to localStorage on every change. While cv is still the pristine
  // module-level defaultCV (same reference), nothing has been loaded or typed
  // yet — saving then could overwrite stored data with an empty CV.
  useEffect(() => {
    if (cv === defaultCV) return;
    localStorage.setItem(LS_KEY, JSON.stringify({ version: "1", data: cv }));
  }, [cv]);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      let data: CVData | null = null;
      try {
        const text = ev.target?.result as string;
        if (file.name.endsWith(".html") || file.name.endsWith(".htm")) {
          const match = text.match(/<script[^>]+id="cv-data"[^>]*>([\s\S]*?)<\/script>/);
          if (match) data = validateCV(JSON.parse(match[1])?.data);
        } else {
          const obj = JSON.parse(text);
          data = validateCV(obj?.version === "1" ? obj.data : obj);
        }
      } catch { data = null; }
      if (data) {
        setCv(data);
        showToast("CV importat cu succes");
      } else {
        showToast("Fișierul nu conține date de CV valide", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleSaveJson = () => {
    const blob = new Blob(
      [JSON.stringify({ version: "1", data: cv }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cv-${cv.personal.lastName || "export"}.cv.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("CV salvat — păstrează fișierul pentru re-import");
  };

  const handleExport = async (type: "pdf" | "docx" | "html") => {
    setExporting(type);
    try {
      if (type === "pdf") {
        const { exportToPdf } = await import("@/lib/exportPdf");
        await exportToPdf(cv.personal.lastName, cv, templateId);
      } else if (type === "docx") {
        const { exportToDocx } = await import("@/lib/exportDocx");
        await exportToDocx(cv);
      } else {
        const { exportToHtml } = await import("@/lib/exportHtml");
        exportToHtml(cv);
      }
    } catch (err) {
      console.error("Export failed:", err);
      showToast(`Exportul ${type.toUpperCase()} a eșuat — încearcă din nou`, "error");
    } finally { setExporting(null); }
  };

  const isDark = theme.id === "dark";

  return (
    <div className={`h-screen flex flex-col overflow-hidden ${theme.pageBg}`}>

      {/* ── Navbar ── */}
      <header
        className={`flex-shrink-0 ${theme.navBg} flex items-center px-5 h-[52px] gap-4`}
        style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-2 mr-1">
          <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isDark ? "bg-cyan-400/20" : "bg-white/15"}`}>
            <Circle size={8} weight="fill" className={isDark ? "text-cyan-400" : "text-white/80"} />
          </div>
          <span className={`text-[13px] font-semibold tracking-tight ${theme.navText}`}>Generator CV</span>
        </div>

        <ThemePicker />
        <div className="flex-1" />

        {/* Import hidden input */}
        <input
          ref={importRef}
          type="file"
          accept=".json,.cv.json,.html,.htm"
          className="hidden"
          onChange={handleImport}
        />

        {/* Import + Save buttons */}
        <button
          onClick={() => importRef.current?.click()}
          title="Importă CV (.cv.json sau .html)"
          className={`group flex items-center gap-1.5 text-[11px] font-semibold pl-2.5 pr-1 py-1 rounded-full transition-all duration-300 active:scale-[0.97] ${isDark ? "bg-white/8 hover:bg-white/14 text-white/60 hover:text-white" : "bg-black/8 hover:bg-black/14 text-zinc-600 hover:text-zinc-900"}`}
          style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
        >
          Importă
          <span className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${isDark ? "bg-white/10 group-hover:bg-white/20" : "bg-black/8 group-hover:bg-black/15"}`}>
            <UploadSimple size={10} weight="bold" />
          </span>
        </button>

        <button
          onClick={handleSaveJson}
          title="Salvează CV ca fișier JSON (pentru re-import ulterior)"
          className={`group flex items-center gap-1.5 text-[11px] font-semibold pl-2.5 pr-1 py-1 rounded-full transition-all duration-300 active:scale-[0.97] ${isDark ? "bg-white/8 hover:bg-white/14 text-white/60 hover:text-white" : "bg-black/8 hover:bg-black/14 text-zinc-600 hover:text-zinc-900"}`}
          style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
        >
          Salvează
          <span className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${isDark ? "bg-white/10 group-hover:bg-white/20" : "bg-black/8 group-hover:bg-black/15"}`}>
            <FileArrowDown size={10} weight="bold" />
          </span>
        </button>

        {([
          { type: "pdf",  label: "PDF",  Icon: FilePdf,  color: "bg-rose-500/90 hover:bg-rose-500" },
          { type: "docx", label: "Word", Icon: FileDoc,  color: "bg-sky-500/90 hover:bg-sky-500" },
          { type: "html", label: "HTML", Icon: FileHtml, color: "bg-emerald-500/90 hover:bg-emerald-500" },
        ] as const).map(({ type, label, Icon, color }) => (
          <button
            key={type}
            onClick={() => handleExport(type)}
            disabled={exporting !== null}
            className={`group flex items-center gap-2 text-white text-[11px] font-semibold pl-3 pr-1 py-1 rounded-full disabled:opacity-40 transition-all duration-300 active:scale-[0.97] ${color}`}
            style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
          >
            {exporting === type ? "..." : label}
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
              {exporting === type
                ? <ArrowUpRight size={10} weight="bold" className="animate-spin" />
                : <Icon size={10} weight="bold" />}
            </span>
          </button>
        ))}
      </header>

      {/* ── Main split ── */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* Left panel */}
        <div
          className="w-[46%] flex flex-col overflow-hidden"
          style={{
            background: LEFT_PANEL_BG[theme.id],
            borderRight: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.06)",
            boxShadow: isDark
              ? "inset -1px 0 0 rgba(255,255,255,0.03), 4px 0 24px rgba(0,0,0,0.25)"
              : "inset -1px 0 0 rgba(255,255,255,0.8), 4px 0 32px rgba(0,0,0,0.04)",
          }}
        >
          {/* Tab bar */}
          <div
            className="flex flex-shrink-0 px-3 pt-2.5 pb-0 gap-0.5"
            style={{
              background: TAB_BAR_BG[theme.id],
              borderBottom: isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(0,0,0,0.05)",
            }}
          >
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-medium transition-colors rounded-t-lg ${
                    active ? theme.tabActiveText : theme.tabInactiveText
                  }`}
                  style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)", transitionDuration: "200ms" }}
                >
                  {active && (
                    <motion.span
                      layoutId="tab-pill"
                      className="absolute inset-0 rounded-t-lg"
                      style={{
                        background: isDark ? "rgba(24,24,27,1)" : "rgba(255,255,255,1)",
                        boxShadow: isDark
                          ? "inset 0 1px 0 rgba(255,255,255,0.06)"
                          : "inset 0 1px 0 rgba(255,255,255,1), 0 -1px 8px rgba(0,0,0,0.04)",
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                  <Icon size={12} weight={active ? "bold" : "regular"} className="relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(2px)" }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
                className="p-5"
              >
                {activeTab === "personal"   && <PersonalSection   data={cv.personal}   onChange={(personal)   => setCv({ ...cv, personal })}   theme={theme} />}
                {activeTab === "experience" && <ExperienceSection data={cv.experience} onChange={(experience) => setCv({ ...cv, experience })} theme={theme} />}
                {activeTab === "education"  && <EducationSection  data={cv.education}  onChange={(education)  => setCv({ ...cv, education })}  theme={theme} />}
                {activeTab === "skills"     && <SkillsSection skills={cv.skills} languages={cv.languages} drivingLicenses={cv.drivingLicenses} onSkillsChange={(skills) => setCv({ ...cv, skills })} onLanguagesChange={(languages) => setCv({ ...cv, languages })} onDrivingChange={(drivingLicenses) => setCv({ ...cv, drivingLicenses })} theme={theme} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right panel */}
        <div
          className="flex-1 flex flex-col overflow-hidden"
          style={{ background: RIGHT_PANEL_BG[theme.id] }}
        >
          {/* Template picker bar */}
          <TemplatePicker selected={templateId} onChange={changeTemplate} isDark={isDark} />

          {/* CV preview */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={templateId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <CVPreview data={cv} templateId={templateId} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <ToastStack toasts={toasts} />
    </div>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
