"use client";

import { Education } from "@/types/cv";
import { Theme } from "@/types/theme";
import { motion, AnimatePresence } from "motion/react";
import { Trash, GraduationCap } from "@phosphor-icons/react";
import { DBInput, AddButton, SectionHeader, fieldLabelClass } from "@/components/ui/fields";
import { isDateRangeInvalid } from "@/lib/fieldValidation";

interface Props {
  data: Education[];
  onChange: (data: Education[]) => void;
  theme: Theme;
}

function newEntry(): Education {
  return { id: crypto.randomUUID(), institution: "", degree: "", field: "", startDate: "", endDate: "", gpa: "" };
}

const ITEM = {
  hidden: { opacity: 0, y: 10, filter: "blur(3px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.2 } },
};

export default function EducationSection({ data, onChange, theme }: Props) {
  const add = () => onChange([...data, newEntry()]);
  const remove = (id: string) => onChange(data.filter((e) => e.id !== id));
  const update = (id: string, field: keyof Education, value: string) =>
    onChange(data.map((e) => (e.id === id ? { ...e, [field]: value } : e)));

  const isDark = theme.id === "dark";
  const labelClass = fieldLabelClass(theme);

  return (
    <motion.div initial={{ opacity: 0, y: 10, filter: "blur(3px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }} className="space-y-4">
      <div className="flex items-start justify-between">
        <SectionHeader eyebrow="Secțiunea 3" title="Educație"
          subtitle={`${data.length} ${data.length === 1 ? "instituție" : "instituții"}`} theme={theme} />
        <AddButton onClick={add} theme={theme} />
      </div>

      {data.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`flex flex-col items-center justify-center py-12 rounded-2xl border border-dashed ${isDark ? "border-zinc-700 text-zinc-600" : "border-zinc-200 text-zinc-400"}`}>
          <GraduationCap size={28} weight="thin" className="mb-2 opacity-40" />
          <p className="text-[12px] font-medium">Nicio instituție adăugată</p>
          <button onClick={add} className={`mt-2 text-[11px] underline underline-offset-2 ${isDark ? "text-cyan-400" : "text-sky-500"}`}>Adaugă prima intrare</button>
        </motion.div>
      )}

      <AnimatePresence>
        {data.map((entry, idx) => (
          <motion.div key={entry.id} variants={ITEM} initial="hidden" animate="visible" exit="exit"
            className={`rounded-2xl overflow-hidden ${isDark ? "bg-white/[0.03] ring-1 ring-white/[0.06]" : "bg-black/[0.02] ring-1 ring-black/[0.05]"}`}
            style={{ boxShadow: isDark ? "inset 0 1px 0 rgba(255,255,255,0.04)" : "inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 8px rgba(0,0,0,0.04)" }}>
            <div className={`flex items-center justify-between px-4 py-2.5 border-b ${isDark ? "border-white/[0.05]" : "border-black/[0.04]"}`}>
              <span className={`text-[10px] font-mono ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>#{String(idx + 1).padStart(2, "0")}</span>
              <button onClick={() => remove(entry.id)} aria-label={`Șterge ${entry.institution || `intrarea ${idx + 1}`}`}
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${isDark ? "text-zinc-600 hover:text-red-400 hover:bg-red-400/10" : "text-zinc-300 hover:text-red-500 hover:bg-red-50"}`}>
                <Trash size={12} weight="bold" />
              </button>
            </div>
            <div className="p-4 grid grid-cols-2 gap-x-3 gap-y-3">
              <div className="col-span-2">
                <label className={labelClass}>Instituție</label>
                <DBInput value={entry.institution} onChange={(v) => update(entry.id, "institution", v)} placeholder="Universitatea Politehnica București" theme={theme} />
              </div>
              <div>
                <label className={labelClass}>Titlu</label>
                <DBInput value={entry.degree} onChange={(v) => update(entry.id, "degree", v)} placeholder="Licență / Master" theme={theme} />
              </div>
              <div>
                <label className={labelClass}>Domeniu</label>
                <DBInput value={entry.field} onChange={(v) => update(entry.id, "field", v)} placeholder="Informatică" theme={theme} />
              </div>
              <div>
                <label className={labelClass}>Început</label>
                <DBInput type="month" value={entry.startDate} onChange={(v) => update(entry.id, "startDate", v)} theme={theme} />
              </div>
              <div>
                <label className={labelClass}>Sfârșit</label>
                <DBInput type="month" value={entry.endDate} onChange={(v) => update(entry.id, "endDate", v)} theme={theme}
                  invalid={isDateRangeInvalid(entry.startDate, entry.endDate)} hint="Data de sfârșit e înaintea celei de început" />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
