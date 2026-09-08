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
import CustomSectionsForm from "@/components/CVForm/CustomSectionsForm";
import CVPreview        from "@/components/CVPreview";
import ThemePicker      from "@/components/ThemePicker";
import TemplatePicker   from "@/components/TemplatePicker";
import ToastStack       from "@/components/ToastStack";
import { useToast }     from "@/hooks/useToast";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useUndoRedo } from "@/hooks/useUndoRedo";
import { cvTemplates, TemplateId } from "@/types/template";
import { CvLang } from "@/lib/cvLabels";
import { ThemeId } from "@/types/theme";
import {
  FilePdf, FileDoc, FileHtml, FileArrowDown, UploadSimple,
  User, Briefcase, GraduationCap, Star, Stack,
  ArrowUpRight, Circle, Plus, PencilSimple, Trash, List, X,
  CaretLeft, CaretRight,
} from "@phosphor-icons/react";

const EXPORTS = [
  { type: "pdf",  label: "PDF",  Icon: FilePdf,  color: "bg-rose-500/90 hover:bg-rose-500" },
  { type: "docx", label: "Word", Icon: FileDoc,  color: "bg-sky-500/90 hover:bg-sky-500" },
  { type: "html", label: "HTML", Icon: FileHtml, color: "bg-emerald-500/90 hover:bg-emerald-500" },
] as const;

type Tab = "personal" | "experience" | "education" | "skills" | "other";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "personal",   label: "Personal",   icon: User },
  { id: "experience", label: "Experiență", icon: Briefcase },
  { id: "education",  label: "Educație",   icon: GraduationCap },
  { id: "skills",     label: "Competențe", icon: Star },
  { id: "other",      label: "Altele",     icon: Stack },
];

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

const LS_KEY = "cv-generator-data";
const LS_TEMPLATE_KEY = "cv-generator-template";

function loadFromStorage(): CVData | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.version === "1" ? validateCV(parsed.data) : null;
  } catch { return null; }
}

// ── Multiple CV profiles, stored together under one key ──
const PROFILES_KEY = "cv-generator-profiles";
const LS_LANG_KEY  = "cv-generator-lang";

interface StoredProfile { id: string; name: string; data: CVData }
interface ProfilesStore { version: "2"; activeId: string; profiles: StoredProfile[] }

function loadProfilesStore(): ProfilesStore | null {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (p?.version !== "2" || !Array.isArray(p.profiles) || p.profiles.length === 0) return null;
    return p as ProfilesStore;
  } catch { return null; }
}

function saveProfilesStore(store: ProfilesStore) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(store));
}

function App() {
  const { theme } = useTheme();
  const { state: cv, setState: setCv, undo, redo, canUndo, canRedo, replaceState } = useUndoRedo<CVData>(defaultCV);
  const [activeTab, setActiveTab] = useState<Tab>("personal");
  const [templateId, setTemplateId] = useState<TemplateId>("classic");
  const [cvLang, setCvLang]       = useState<CvLang>("ro");
  const [exporting, setExporting] = useState<string | null>(null);
  const { toasts, showToast }     = useToast();

  useKeyboardShortcuts({
    "Ctrl+1": () => setActiveTab("personal"),
    "Ctrl+2": () => setActiveTab("experience"),
    "Ctrl+3": () => setActiveTab("education"),
    "Ctrl+4": () => setActiveTab("skills"),
    "Ctrl+5": () => setActiveTab("other"),
    "Ctrl+S": () => handleSaveJson(),
    "Ctrl+Z": () => undo(),
    "Ctrl+Shift+Z": () => redo(),
  });

  const [profiles, setProfiles] = useState<{ id: string; name: string }[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string>("");
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [menuOpen, setMenuOpen] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  // Load from localStorage after mount (avoids SSR hydration mismatch)
  useEffect(() => {
    let store = loadProfilesStore();
    if (!store) {
      const legacy = loadFromStorage();
      const id = crypto.randomUUID();
      store = { version: "2", activeId: id, profiles: [{ id, name: "CV principal", data: legacy ?? defaultCV }] };
      saveProfilesStore(store);
    }
    const active = store.profiles.find((p) => p.id === store.activeId) ?? store.profiles[0];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfiles(store.profiles.map(({ id, name }) => ({ id, name })));
    setActiveProfileId(active.id);
    const valid = validateCV(active.data);
    if (valid) replaceState(valid);

    const tpl = localStorage.getItem(LS_TEMPLATE_KEY) as TemplateId | null;
    if (tpl && cvTemplates.some((t) => t.id === tpl)) setTemplateId(tpl);
    const lng = localStorage.getItem(LS_LANG_KEY);
    if (lng === "ro" || lng === "en") setCvLang(lng);
  }, [replaceState]);

  const changeTemplate = (id: TemplateId) => {
    setTemplateId(id);
    localStorage.setItem(LS_TEMPLATE_KEY, id);
  };

  const changeLang = (lng: CvLang) => {
    setCvLang(lng);
    localStorage.setItem(LS_LANG_KEY, lng);
  };

  // Debounced auto-save
  useEffect(() => {
    if (cv === defaultCV || !activeProfileId) return;
    const t = setTimeout(() => {
      const store = loadProfilesStore();
      if (!store) return;
      saveProfilesStore({
        ...store,
        activeId: activeProfileId,
        profiles: store.profiles.map((p) => p.id === activeProfileId ? { ...p, data: cv } : p),
      });
    }, 400);
    return () => clearTimeout(t);
  }, [cv, activeProfileId]);

  // ── Profile actions ──
  const switchProfile = (id: string) => {
    if (id === activeProfileId) return;
    const store = loadProfilesStore();
    if (!store) return;
    const updated: ProfilesStore = {
      ...store,
      activeId: id,
      profiles: store.profiles.map((p) => p.id === activeProfileId ? { ...p, data: cv } : p),
    };
    const target = updated.profiles.find((p) => p.id === id);
    if (!target) return;
    saveProfilesStore(updated);
    setActiveProfileId(id);
    replaceState(validateCV(target.data) ?? { ...defaultCV });
  };

  const newProfile = () => {
    const name = prompt("Numele noului CV:", `CV ${profiles.length + 1}`)?.trim();
    if (!name) return;
    const id = crypto.randomUUID();
    const store = loadProfilesStore();
    if (!store) return;
    const updated: ProfilesStore = {
      ...store,
      activeId: id,
      profiles: [
        ...store.profiles.map((p) => p.id === activeProfileId ? { ...p, data: cv } : p),
        { id, name, data: defaultCV },
      ],
    };
    saveProfilesStore(updated);
    setProfiles(updated.profiles.map(({ id: i, name: n }) => ({ id: i, name: n })));
    setActiveProfileId(id);
    replaceState({ ...defaultCV });
    showToast(`Profil „${name}" creat`);
  };

  const renameProfile = () => {
    const current = profiles.find((p) => p.id === activeProfileId);
    const name = prompt("Noul nume al CV-ului:", current?.name ?? "")?.trim();
    if (!name) return;
    const store = loadProfilesStore();
    if (!store) return;
    const updated = {
      ...store,
      profiles: store.profiles.map((p) => p.id === activeProfileId ? { ...p, name } : p),
    };
    saveProfilesStore(updated);
    setProfiles(updated.profiles.map(({ id, name: n }) => ({ id, name: n })));
  };

  const deleteProfile = () => {
    if (profiles.length <= 1) {
      showToast("Nu poți șterge singurul profil", "error");
      return;
    }
    const current = profiles.find((p) => p.id === activeProfileId);
    if (!confirm(`Ștergi definitiv profilul „${current?.name}"?`)) return;
    const store = loadProfilesStore();
    if (!store) return;
    const remaining = store.profiles.filter((p) => p.id !== activeProfileId);
    const next = remaining[0];
    const updated: ProfilesStore = { ...store, activeId: next.id, profiles: remaining };
    saveProfilesStore(updated);
    setProfiles(remaining.map(({ id, name }) => ({ id, name })));
    setActiveProfileId(next.id);
    replaceState(validateCV(next.data) ?? { ...defaultCV });
    showToast("Profil șters");
  };

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
        replaceState(data);
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

  // Warn if key sections are empty before export
  const checkBeforeExport = (): boolean => {
    const fullName = `${cv.personal.firstName} ${cv.personal.lastName}`.trim();
    const hasName = fullName.length > 0;
    const hasExperience = cv.experience.some((e) => e.company || e.positions.some((p) => p.title));
    const hasEducation = cv.education.some((e) => e.institution || e.degree);
    const hasSkills = cv.skills.length > 0;

    if (!hasName) {
      showToast("Completează măcar numele înainte de export", "error");
      return false;
    }
    if (!hasExperience && !hasEducation && !hasSkills) {
      // CV-ul e aproape gol — nu blocăm, dar avertizăm
      showToast("CV-ul e aproape gol — doar numele e completat", "error");
      // return false; // nu blocăm
    }
    return true;
  };

  const handleExport = async (type: "pdf" | "docx" | "html") => {
    if (!checkBeforeExport()) return;
    setExporting(type);
    try {
      if (type === "pdf") {
        const { exportToPdf } = await import("@/lib/exportPdf");
        await exportToPdf(cv.personal.lastName, cv, templateId, cvLang);
      } else if (type === "docx") {
        const { exportToDocx } = await import("@/lib/exportDocx");
        await exportToDocx(cv, cvLang);
      } else {
        const { exportToHtml } = await import("@/lib/exportHtml");
        exportToHtml(cv, cvLang);
      }
    } catch (err) {
      console.error("Export failed:", err);
      showToast(`Exportul ${type.toUpperCase()} a eșuat — încearcă din nou`, "error");
    } finally { setExporting(null); }
  };

  const isDark = theme.id === "dark";

  return (
    <div className={`h-screen flex flex-col overflow-hidden ${theme.pageBg}`}>

      {/* Import hidden input (shared by desktop + mobile import buttons) */}
      <input
        ref={importRef}
        type="file"
        accept=".json,.cv.json,.html,.htm"
        className="hidden"
        onChange={handleImport}
      />

      {/* ── Navbar ── */}
      <header
        className={`relative z-40 flex-shrink-0 ${theme.navBg} flex items-center px-4 sm:px-5 gap-4`}
        style={{
          boxShadow: "0 1px 0 rgba(255,255,255,0.05)",
          paddingTop: "env(safe-area-inset-top, 0px)",
          height: "calc(52px + env(safe-area-inset-top, 0px))",
        }}
      >
        <div className="flex items-center gap-2 mr-auto lg:mr-1">
          <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isDark ? "bg-cyan-400/20" : "bg-white/15"}`}>
            <Circle size={8} weight="fill" className={isDark ? "text-cyan-400" : "text-white/80"} />
          </div>
          <span className={`text-[13px] font-semibold tracking-tight ${theme.navText}`}>Generator CV</span>
        </div>

        {/* ── Desktop inline controls (lg and up) ── */}
        <div className="hidden lg:flex items-center gap-4 flex-1">
          <ThemePicker />

          {/* Profile selector */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <select
              value={activeProfileId}
              onChange={(e) => switchProfile(e.target.value)}
              aria-label="Profil CV activ"
              className={`text-[11px] font-medium rounded-full px-2.5 py-1 outline-none cursor-pointer max-w-[140px] ${isDark ? "bg-white/8 text-white/80" : "bg-black/8 text-zinc-700"}`}
            >
              {profiles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <button onClick={newProfile} title="CV nou" aria-label="Creează profil CV nou"
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isDark ? "text-white/50 hover:text-white hover:bg-white/10" : "text-zinc-500 hover:text-zinc-900 hover:bg-black/8"}`}>
              <Plus size={11} weight="bold" />
            </button>
            <button onClick={renameProfile} title="Redenumește" aria-label="Redenumește profilul activ"
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isDark ? "text-white/50 hover:text-white hover:bg-white/10" : "text-zinc-500 hover:text-zinc-900 hover:bg-black/8"}`}>
              <PencilSimple size={11} weight="bold" />
            </button>
            <button onClick={deleteProfile} title="Șterge profilul" aria-label="Șterge profilul activ"
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isDark ? "text-white/50 hover:text-red-400 hover:bg-red-400/10" : "text-zinc-500 hover:text-red-500 hover:bg-red-50"}`}>
              <Trash size={11} weight="bold" />
            </button>
          </div>

          {/* CV language toggle */}
          <div className={`flex items-center rounded-full p-0.5 flex-shrink-0 ${isDark ? "bg-white/8" : "bg-black/8"}`} title="Limba CV-ului (etichetele secțiunilor)">
            {(["ro", "en"] as const).map((lng) => (
              <button key={lng} onClick={() => changeLang(lng)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all ${
                  cvLang === lng
                    ? "bg-sky-500 text-white"
                    : isDark ? "text-white/50 hover:text-white/80" : "text-zinc-500 hover:text-zinc-800"
                }`}>
                {lng}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* Undo / Redo buttons */}
          <button onClick={undo} disabled={!canUndo}
            className={`w-7 h-7 rounded-full flex items-center justify-center disabled:opacity-30 transition-colors ${isDark ? "text-zinc-500 hover:text-white hover:bg-white/10" : "text-zinc-400 hover:text-zinc-900 hover:bg-black/8"}`}
            title="Undo (Ctrl+Z)">
            <CaretLeft size={12} weight="bold" />
          </button>
          <button onClick={redo} disabled={!canRedo}
            className={`w-7 h-7 rounded-full flex items-center justify-center disabled:opacity-30 transition-colors ${isDark ? "text-zinc-500 hover:text-white hover:bg-white/10" : "text-zinc-400 hover:text-zinc-900 hover:bg-black/8"}`}
            title="Redo (Ctrl+Shift+Z)">
            <CaretRight size={12} weight="bold" />
          </button>

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

          {EXPORTS.map(({ type, label, Icon, color }) => (
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
          {/* Export RO+EN shortcut — exportă PDF în ambele limbi cu delay între ele */}
          <button
            onClick={async () => {
              setExporting("pdf");
              try {
                const { exportToPdf } = await import("@/lib/exportPdf");
                const first = cvLang === "ro" ? "ro" : "en";
                const second = first === "ro" ? "en" : "ro";
                await exportToPdf(cv.personal.lastName, cv, templateId, first);
                // Delay between downloads so the browser doesn't block the second
                await new Promise((r) => setTimeout(r, 500));
                await exportToPdf(cv.personal.lastName, cv, templateId, second);
                showToast("PDF exportat în RO și EN");
              } catch {
                showToast("Exportul bilingv a eșuat", "error");
              } finally { setExporting(null); }
            }}
            disabled={exporting !== null}
            title="Exportă PDF în ambele limbi"
            className="group flex items-center gap-2 text-white text-[11px] font-semibold pl-3 pr-1 py-1 rounded-full disabled:opacity-40 transition-all duration-300 active:scale-[0.97] bg-purple-500/90 hover:bg-purple-500"
            style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
          >
            RO/EN
          </button>
        </div>

        {/* ── Mobile menu button (below lg) ── */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Meniu"
          aria-expanded={menuOpen}
          className="lg:hidden flex items-center gap-1.5 text-[12px] font-semibold text-white/90 bg-white/12 hover:bg-white/20 rounded-full pl-2.5 pr-3.5 py-1.5 active:scale-95 transition"
        >
          {menuOpen ? <X size={15} weight="bold" /> : <List size={15} weight="bold" />}
          Meniu
        </button>
      </header>

      {/* ── Mobile menu sheet (below lg) ── */}
      {menuOpen && (
        <div className="lg:hidden">
          <div
            className="fixed inset-x-0 bottom-0 z-30 bg-black/50"
            style={{ top: "calc(52px + env(safe-area-inset-top, 0px))" }}
            onClick={() => setMenuOpen(false)}
          />
          <div
            className={`fixed inset-x-0 z-40 overflow-y-auto px-4 py-4 space-y-5 border-t border-white/10 shadow-2xl ${theme.navBg}`}
            style={{
              top: "calc(52px + env(safe-area-inset-top, 0px))",
              maxHeight: "calc(100dvh - 52px - env(safe-area-inset-top, 0px))",
            }}
          >
            {/* Export */}
            <section>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40 mb-2">Exportă CV</p>
              <div className="grid grid-cols-3 gap-2">
                {EXPORTS.map(({ type, label, Icon, color }) => (
                  <button
                    key={type}
                    onClick={() => { handleExport(type); setMenuOpen(false); }}
                    disabled={exporting !== null}
                    className={`flex flex-col items-center justify-center gap-1.5 py-3.5 rounded-2xl text-white text-[12px] font-semibold disabled:opacity-40 active:scale-95 transition ${color}`}
                  >
                    {exporting === type
                      ? <ArrowUpRight size={20} weight="bold" className="animate-spin" />
                      : <Icon size={20} weight="bold" />}
                    {label}
                  </button>
                ))}
              </div>
            </section>

            {/* File */}
            <section>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40 mb-2">Fișier</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { importRef.current?.click(); setMenuOpen(false); }}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12.5px] font-semibold text-white/85 bg-white/10 hover:bg-white/15 active:scale-95 transition"
                >
                  <UploadSimple size={15} weight="bold" /> Importă
                </button>
                <button
                  onClick={() => { handleSaveJson(); setMenuOpen(false); }}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12.5px] font-semibold text-white/85 bg-white/10 hover:bg-white/15 active:scale-95 transition"
                >
                  <FileArrowDown size={15} weight="bold" /> Salvează
                </button>
              </div>
            </section>

            {/* Profile */}
            <section>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40 mb-2">Profil CV</p>
              <div className="flex items-center gap-2">
                <select
                  value={activeProfileId}
                  onChange={(e) => { switchProfile(e.target.value); setMenuOpen(false); }}
                  aria-label="Profil CV activ"
                  className="flex-1 min-w-0 text-[13px] font-medium rounded-xl px-3 py-2.5 bg-white/10 text-white outline-none"
                >
                  {profiles.map((p) => <option key={p.id} value={p.id} className="text-zinc-900">{p.name}</option>)}
                </select>
                <button onClick={newProfile} aria-label="Creează profil CV nou"
                  className="w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center text-white/80 bg-white/10 hover:bg-white/15 active:scale-95 transition">
                  <Plus size={15} weight="bold" />
                </button>
                <button onClick={renameProfile} aria-label="Redenumește profilul activ"
                  className="w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center text-white/80 bg-white/10 hover:bg-white/15 active:scale-95 transition">
                  <PencilSimple size={15} weight="bold" />
                </button>
                <button onClick={deleteProfile} aria-label="Șterge profilul activ"
                  className="w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center text-white/80 bg-white/10 hover:bg-red-500/25 hover:text-red-300 active:scale-95 transition">
                  <Trash size={15} weight="bold" />
                </button>
              </div>
            </section>

            {/* Appearance + language */}
            <section className="flex flex-wrap items-end gap-x-6 gap-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40 mb-2">Aspect aplicație</p>
                <ThemePicker />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40 mb-2">Limba CV-ului</p>
                <div className="inline-flex items-center rounded-full p-0.5 bg-white/10">
                  {(["ro", "en"] as const).map((lng) => (
                    <button key={lng} onClick={() => changeLang(lng)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase transition-all ${
                        cvLang === lng ? "bg-sky-500 text-white" : "text-white/50 hover:text-white/80"
                      }`}>
                      {lng}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* ── Main split ── */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* Left panel */}
        <div
          className={`${mobileView === "preview" ? "hidden" : "flex"} w-full lg:flex lg:w-[46%] flex-col overflow-hidden`}
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
            className="flex flex-shrink-0 px-2 lg:px-3 pt-2 lg:pt-2.5 pb-2 lg:pb-0 gap-1 lg:gap-0.5"
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
                  className={`relative flex-1 flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-1.5 py-2.5 lg:py-2 text-[10px] lg:text-[11px] font-medium transition-colors rounded-xl lg:rounded-t-lg ${
                    active ? theme.tabActiveText : theme.tabInactiveText
                  }`}
                  style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)", transitionDuration: "200ms" }}
                >
                  {active && (
                    <motion.span
                      layoutId="tab-pill"
                      className="absolute inset-0 rounded-xl lg:rounded-t-lg"
                      style={{
                        background: isDark ? "rgba(24,24,27,1)" : "rgba(255,255,255,1)",
                        boxShadow: isDark
                          ? "inset 0 1px 0 rgba(255,255,255,0.06)"
                          : "inset 0 1px 0 rgba(255,255,255,1), 0 -1px 8px rgba(0,0,0,0.04)",
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                  <Icon weight={active ? "bold" : "regular"} className="relative z-10 lg:hidden" size={19} />
                  <Icon weight={active ? "bold" : "regular"} className="relative z-10 hidden lg:block" size={12} />
                  <span className="relative z-10 leading-none whitespace-nowrap">{tab.label}</span>
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
                {activeTab === "other"      && <CustomSectionsForm data={cv.customSections} onChange={(customSections) => setCv({ ...cv, customSections })} theme={theme} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right panel */}
        <div
          className={`${mobileView === "edit" ? "hidden" : "flex"} lg:flex flex-1 flex-col overflow-hidden`}
          style={{ background: RIGHT_PANEL_BG[theme.id] }}
        >
          <TemplatePicker selected={templateId} onChange={changeTemplate} isDark={isDark} />
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={templateId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <CVPreview data={cv} templateId={templateId} lang={cvLang} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile editor/preview toggle — safe area bottom inset on iOS */}
      <div
        className={`lg:hidden flex-shrink-0 flex border-t pb-[env(safe-area-inset-bottom,0px)] ${
          isDark ? "bg-zinc-900 border-white/10" : "bg-white border-black/10"
        }`}
      >
        {([
          { id: "edit" as const,    label: "Editor" },
          { id: "preview" as const, label: "Previzualizare" },
        ]).map((v) => (
          <button key={v.id} onClick={() => setMobileView(v.id)}
            className={`flex-1 min-h-[44px] py-3 text-[12px] font-semibold transition-colors ${
              mobileView === v.id
                ? isDark ? "text-cyan-400" : "text-sky-600"
                : isDark ? "text-zinc-500" : "text-zinc-400"
            }`}>
            {v.label}
          </button>
        ))}
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
