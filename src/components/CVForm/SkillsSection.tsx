"use client";

import { Skill, Language, DrivingLicense, DRIVING_CATEGORIES } from "@/types/cv";
import { Theme } from "@/types/theme";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash } from "@phosphor-icons/react";

interface Props {
  skills: Skill[];
  languages: Language[];
  drivingLicenses: DrivingLicense[];
  onSkillsChange: (data: Skill[]) => void;
  onLanguagesChange: (data: Language[]) => void;
  onDrivingChange: (data: DrivingLicense[]) => void;
  theme: Theme;
}

function newSkill(): Skill { return { id: crypto.randomUUID(), name: "", level: "Mediu" }; }
function newLang(): Language { return { id: crypto.randomUUID(), name: "", level: "B2" }; }
function newLicense(): DrivingLicense { return { id: crypto.randomUUID(), category: "B", year: "" }; }

function DBInput({ value, onChange, placeholder, theme }: {
  value: string; onChange: (v: string) => void; placeholder?: string; theme: Theme;
}) {
  const isDark = theme.id === "dark";
  const outer = isDark ? "bg-white/[0.04] ring-1 ring-white/[0.08] rounded-xl p-[2px] flex-1" : "bg-black/[0.03] ring-1 ring-black/[0.07] rounded-xl p-[2px] flex-1";
  const inner = isDark
    ? "w-full bg-zinc-800 rounded-[calc(0.75rem-2px)] px-3 py-2 text-[13px] text-zinc-100 placeholder-zinc-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] focus:ring-2 focus:ring-cyan-400/30"
    : "w-full bg-white rounded-[calc(0.75rem-2px)] px-3 py-2 text-[13px] text-zinc-900 placeholder-zinc-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(255,255,255,0.9)] focus:ring-2 focus:ring-sky-500/25";
  return (
    <div className={outer}>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className={`${inner} transition-all duration-300`} style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }} />
    </div>
  );
}

function DBSelect({ value, onChange, options, theme }: {
  value: string; onChange: (v: string) => void; options: string[]; theme: Theme;
}) {
  const isDark = theme.id === "dark";
  const outer = isDark ? "bg-white/[0.04] ring-1 ring-white/[0.08] rounded-xl p-[2px]" : "bg-black/[0.03] ring-1 ring-black/[0.07] rounded-xl p-[2px]";
  const inner = isDark
    ? "bg-zinc-800 rounded-[calc(0.75rem-2px)] px-2.5 py-2 text-[12px] text-zinc-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] focus:ring-2 focus:ring-cyan-400/30"
    : "bg-white rounded-[calc(0.75rem-2px)] px-2.5 py-2 text-[12px] text-zinc-900 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(255,255,255,0.9)] focus:ring-2 focus:ring-sky-500/25";
  return (
    <div className={outer}>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={`${inner} transition-all duration-300`}
        style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

const ROW = {
  hidden: { opacity: 0, x: -8, filter: "blur(2px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  exit: { opacity: 0, x: 8, transition: { duration: 0.15 } },
};

export default function SkillsSection({ skills, languages, drivingLicenses, onSkillsChange, onLanguagesChange, onDrivingChange, theme }: Props) {
  const updateSkill = (id: string, f: keyof Skill, v: string) =>
    onSkillsChange(skills.map((s) => (s.id === id ? { ...s, [f]: v } : s)));
  const updateLang = (id: string, f: keyof Language, v: string) =>
    onLanguagesChange(languages.map((l) => (l.id === id ? { ...l, [f]: v } : l)));
  const updateLicense = (id: string, f: keyof DrivingLicense, v: string) =>
    onDrivingChange(drivingLicenses.map((d) => (d.id === id ? { ...d, [f]: v } : d)));

  const isDark = theme.id === "dark";

  const AddBtn = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick}
      className={`group flex items-center gap-1.5 text-[11px] font-semibold pl-2.5 pr-1 py-1 rounded-full transition-all duration-300 active:scale-[0.96] ${isDark ? "bg-white/6 hover:bg-white/10 text-white/70 hover:text-white" : "bg-black/5 hover:bg-black/8 text-zinc-600 hover:text-zinc-900"}`}
      style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}>
      Adaugă
      <span className={`w-5 h-5 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform ${isDark ? "bg-white/10" : "bg-black/8"}`}>
        <Plus size={10} weight="bold" />
      </span>
    </button>
  );

  const SectionHead = ({ eyebrow, title }: { eyebrow: string; title: string }) => (
    <div>
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-[0.18em] mb-1.5 ${isDark ? "bg-cyan-400/10 text-cyan-400" : "bg-sky-500/10 text-sky-600"}`}>
        {eyebrow}
      </span>
      <h2 className={`text-base font-bold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>{title}</h2>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10, filter: "blur(3px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }} className="space-y-7">

      {/* Skills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <SectionHead eyebrow="Secțiunea 4A" title="Competențe" />
          <AddBtn onClick={() => onSkillsChange([...skills, newSkill()])} />
        </div>
        {skills.length === 0 && <p className={`text-[12px] text-center py-4 ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>Nicio competență adăugată</p>}
        <AnimatePresence>
          {skills.map((s) => (
            <motion.div key={s.id} variants={ROW} initial="hidden" animate="visible" exit="exit" className="flex items-center gap-2">
              <DBInput value={s.name} onChange={(v) => updateSkill(s.id, "name", v)} placeholder="React, Python, Figma..." theme={theme} />
              <DBSelect value={s.level} onChange={(v) => updateSkill(s.id, "level", v)} options={["Începător", "Mediu", "Avansat", "Expert"]} theme={theme} />
              <button onClick={() => onSkillsChange(skills.filter((x) => x.id !== s.id))}
                className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center transition-all ${isDark ? "text-zinc-600 hover:text-red-400 hover:bg-red-400/10" : "text-zinc-300 hover:text-red-500 hover:bg-red-50"}`}>
                <Trash size={12} weight="bold" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className={`h-px ${isDark ? "bg-white/[0.05]" : "bg-black/[0.05]"}`} />

      {/* Languages */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <SectionHead eyebrow="Secțiunea 4B" title="Limbi străine" />
          <AddBtn onClick={() => onLanguagesChange([...languages, newLang()])} />
        </div>
        {languages.length === 0 && <p className={`text-[12px] text-center py-4 ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>Nicio limbă adăugată</p>}
        <AnimatePresence>
          {languages.map((l) => (
            <motion.div key={l.id} variants={ROW} initial="hidden" animate="visible" exit="exit" className="flex items-center gap-2">
              <DBInput value={l.name} onChange={(v) => updateLang(l.id, "name", v)} placeholder="Engleză, Franceză..." theme={theme} />
              <DBSelect value={l.level} onChange={(v) => updateLang(l.id, "level", v)} options={["A1", "A2", "B1", "B2", "C1", "C2", "Nativ"]} theme={theme} />
              <button onClick={() => onLanguagesChange(languages.filter((x) => x.id !== l.id))}
                className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center transition-all ${isDark ? "text-zinc-600 hover:text-red-400 hover:bg-red-400/10" : "text-zinc-300 hover:text-red-500 hover:bg-red-50"}`}>
                <Trash size={12} weight="bold" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className={`h-px ${isDark ? "bg-white/[0.05]" : "bg-black/[0.05]"}`} />

      {/* Driving licenses */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <SectionHead eyebrow="Secțiunea 4C" title="Permis de conducere" />
          <AddBtn onClick={() => onDrivingChange([...drivingLicenses, newLicense()])} />
        </div>
        {drivingLicenses.length === 0 && <p className={`text-[12px] text-center py-4 ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>Nicio categorie adăugată</p>}
        <AnimatePresence>
          {drivingLicenses.map((d) => (
            <motion.div key={d.id} variants={ROW} initial="hidden" animate="visible" exit="exit" className="flex items-center gap-2">
              <DBSelect value={d.category} onChange={(v) => updateLicense(d.id, "category", v)} options={[...DRIVING_CATEGORIES]} theme={theme} />
              <DBInput value={d.year} onChange={(v) => updateLicense(d.id, "year", v)} placeholder="Anul obținerii (ex: 2015)" theme={theme} />
              <button onClick={() => onDrivingChange(drivingLicenses.filter((x) => x.id !== d.id))}
                className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center transition-all ${isDark ? "text-zinc-600 hover:text-red-400 hover:bg-red-400/10" : "text-zinc-300 hover:text-red-500 hover:bg-red-50"}`}>
                <Trash size={12} weight="bold" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
