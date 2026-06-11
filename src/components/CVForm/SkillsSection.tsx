"use client";

import { Skill, Language, DrivingLicense, DRIVING_CATEGORIES } from "@/types/cv";
import { Theme } from "@/types/theme";
import { motion, AnimatePresence } from "motion/react";
import { Trash } from "@phosphor-icons/react";
import { DBInput, DBSelect, AddButton, SectionHeader } from "@/components/ui/fields";

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

const ROW = {
  hidden: { opacity: 0, x: -8, filter: "blur(2px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  exit: { opacity: 0, x: 8, transition: { duration: 0.15 } },
};

function DeleteButton({ onClick, theme, label }: { onClick: () => void; theme: Theme; label: string }) {
  const isDark = theme.id === "dark";
  return (
    <button onClick={onClick} aria-label={label}
      className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center transition-all ${isDark ? "text-zinc-600 hover:text-red-400 hover:bg-red-400/10" : "text-zinc-300 hover:text-red-500 hover:bg-red-50"}`}>
      <Trash size={12} weight="bold" />
    </button>
  );
}

export default function SkillsSection({ skills, languages, drivingLicenses, onSkillsChange, onLanguagesChange, onDrivingChange, theme }: Props) {
  const updateSkill = (id: string, f: keyof Skill, v: string) =>
    onSkillsChange(skills.map((s) => (s.id === id ? { ...s, [f]: v } : s)));
  const updateLang = (id: string, f: keyof Language, v: string) =>
    onLanguagesChange(languages.map((l) => (l.id === id ? { ...l, [f]: v } : l)));
  const updateLicense = (id: string, f: keyof DrivingLicense, v: string) =>
    onDrivingChange(drivingLicenses.map((d) => (d.id === id ? { ...d, [f]: v } : d)));

  const isDark = theme.id === "dark";
  const emptyClass = `text-[12px] text-center py-4 ${isDark ? "text-zinc-600" : "text-zinc-400"}`;
  const divider = <div className={`h-px ${isDark ? "bg-white/[0.05]" : "bg-black/[0.05]"}`} />;

  return (
    <motion.div initial={{ opacity: 0, y: 10, filter: "blur(3px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }} className="space-y-7">

      {/* Skills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <SectionHeader eyebrow="Secțiunea 4A" title="Competențe" theme={theme} />
          <AddButton onClick={() => onSkillsChange([...skills, newSkill()])} theme={theme} />
        </div>
        {skills.length === 0 && <p className={emptyClass}>Nicio competență adăugată</p>}
        <AnimatePresence>
          {skills.map((s) => (
            <motion.div key={s.id} variants={ROW} initial="hidden" animate="visible" exit="exit" className="flex items-start gap-2">
              <div className="flex-1"><DBInput value={s.name} onChange={(v) => updateSkill(s.id, "name", v)} placeholder="React, Python, Figma..." theme={theme} /></div>
              <DBSelect value={s.level} onChange={(v) => updateSkill(s.id, "level", v)} options={["Începător", "Mediu", "Avansat", "Expert"]} theme={theme} />
              <DeleteButton onClick={() => onSkillsChange(skills.filter((x) => x.id !== s.id))} theme={theme} label={`Șterge competența ${s.name || "fără nume"}`} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {divider}

      {/* Languages */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <SectionHeader eyebrow="Secțiunea 4B" title="Limbi străine" theme={theme} />
          <AddButton onClick={() => onLanguagesChange([...languages, newLang()])} theme={theme} />
        </div>
        {languages.length === 0 && <p className={emptyClass}>Nicio limbă adăugată</p>}
        <AnimatePresence>
          {languages.map((l) => (
            <motion.div key={l.id} variants={ROW} initial="hidden" animate="visible" exit="exit" className="flex items-start gap-2">
              <div className="flex-1"><DBInput value={l.name} onChange={(v) => updateLang(l.id, "name", v)} placeholder="Engleză, Franceză..." theme={theme} /></div>
              <DBSelect value={l.level} onChange={(v) => updateLang(l.id, "level", v)} options={["A1", "A2", "B1", "B2", "C1", "C2", "Nativ"]} theme={theme} />
              <DeleteButton onClick={() => onLanguagesChange(languages.filter((x) => x.id !== l.id))} theme={theme} label={`Șterge limba ${l.name || "fără nume"}`} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {divider}

      {/* Driving licenses */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <SectionHeader eyebrow="Secțiunea 4C" title="Permis de conducere" theme={theme} />
          <AddButton onClick={() => onDrivingChange([...drivingLicenses, newLicense()])} theme={theme} />
        </div>
        {drivingLicenses.length === 0 && <p className={emptyClass}>Nicio categorie adăugată</p>}
        <AnimatePresence>
          {drivingLicenses.map((d) => (
            <motion.div key={d.id} variants={ROW} initial="hidden" animate="visible" exit="exit" className="flex items-start gap-2">
              <DBSelect value={d.category} onChange={(v) => updateLicense(d.id, "category", v)} options={[...DRIVING_CATEGORIES]} theme={theme} />
              <div className="flex-1"><DBInput value={d.year} onChange={(v) => updateLicense(d.id, "year", v)} placeholder="Anul obținerii (ex: 2015)" theme={theme} /></div>
              <DeleteButton onClick={() => onDrivingChange(drivingLicenses.filter((x) => x.id !== d.id))} theme={theme} label={`Șterge categoria ${d.category}`} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
