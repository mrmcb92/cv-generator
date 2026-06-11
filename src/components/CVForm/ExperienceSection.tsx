"use client";

import { WorkExperience, WorkPosition } from "@/types/cv";
import { Theme } from "@/types/theme";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash, Briefcase } from "@phosphor-icons/react";
import { DBInput, AddButton, SectionHeader, fieldLabelClass } from "@/components/ui/fields";
import { isDateRangeInvalid } from "@/lib/fieldValidation";

interface Props {
  data: WorkExperience[];
  onChange: (data: WorkExperience[]) => void;
  theme: Theme;
}

function newPosition(): WorkPosition {
  return { id: crypto.randomUUID(), title: "", startDate: "", endDate: "", current: false, description: "" };
}

function newEntry(): WorkExperience {
  return { id: crypto.randomUUID(), company: "", positions: [newPosition()] };
}

const ITEM = {
  hidden: { opacity: 0, y: 10, filter: "blur(3px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -6, filter: "blur(2px)", transition: { duration: 0.2 } },
};

const POS_ITEM = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.15 } },
};

export default function ExperienceSection({ data, onChange, theme }: Props) {
  const isDark = theme.id === "dark";
  const labelClass = fieldLabelClass(theme);

  const addCompany = () => onChange([...data, newEntry()]);
  const removeCompany = (id: string) => onChange(data.filter((e) => e.id !== id));
  const updateCompany = (id: string, company: string) =>
    onChange(data.map((e) => e.id === id ? { ...e, company } : e));

  const addPosition = (companyId: string) =>
    onChange(data.map((e) => e.id === companyId
      ? { ...e, positions: [...e.positions, newPosition()] }
      : e));

  const removePosition = (companyId: string, posId: string) =>
    onChange(data.map((e) => e.id === companyId
      ? { ...e, positions: e.positions.filter((p) => p.id !== posId) }
      : e));

  const updatePosition = (companyId: string, posId: string, field: keyof WorkPosition, value: string | boolean) =>
    onChange(data.map((e) => e.id === companyId
      ? { ...e, positions: e.positions.map((p) => p.id === posId ? { ...p, [field]: value } : p) }
      : e));

  const totalPositions = data.reduce((sum, e) => sum + e.positions.length, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 10, filter: "blur(3px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }} className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <SectionHeader eyebrow="Secțiunea 2" title="Experiență profesională"
          subtitle={`${data.length} ${data.length === 1 ? "companie" : "companii"} · ${totalPositions} ${totalPositions === 1 ? "funcție" : "funcții"}`}
          theme={theme} />
        <AddButton onClick={addCompany} theme={theme} />
      </div>

      {data.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`flex flex-col items-center justify-center py-12 rounded-2xl border border-dashed ${isDark ? "border-zinc-700 text-zinc-600" : "border-zinc-200 text-zinc-400"}`}>
          <Briefcase size={28} weight="thin" className="mb-2 opacity-40" />
          <p className="text-[12px] font-medium">Nicio experiență adăugată</p>
          <button onClick={addCompany} className={`mt-2 text-[11px] underline underline-offset-2 ${isDark ? "text-cyan-400" : "text-sky-500"}`}>Adaugă prima intrare</button>
        </motion.div>
      )}

      <AnimatePresence>
        {data.map((entry, idx) => (
          <motion.div key={entry.id} variants={ITEM} initial="hidden" animate="visible" exit="exit"
            className={`rounded-2xl overflow-hidden ${isDark ? "bg-white/[0.03] ring-1 ring-white/[0.06]" : "bg-black/[0.02] ring-1 ring-black/[0.05]"}`}
            style={{ boxShadow: isDark ? "inset 0 1px 0 rgba(255,255,255,0.04)" : "inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 8px rgba(0,0,0,0.04)" }}
          >
            {/* Company header */}
            <div className={`flex items-center justify-between px-4 py-2.5 border-b ${isDark ? "border-white/[0.05]" : "border-black/[0.04]"}`}>
              <span className={`text-[10px] font-mono ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
                #{String(idx + 1).padStart(2, "0")}
              </span>
              <button onClick={() => removeCompany(entry.id)} aria-label={`Șterge compania ${entry.company || idx + 1}`}
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${isDark ? "text-zinc-600 hover:text-red-400 hover:bg-red-400/10" : "text-zinc-300 hover:text-red-500 hover:bg-red-50"}`}>
                <Trash size={12} weight="bold" />
              </button>
            </div>

            {/* Company name */}
            <div className="px-4 pt-4 pb-3">
              <label className={labelClass}>Companie</label>
              <DBInput value={entry.company} onChange={(v) => updateCompany(entry.id, v)} placeholder="Acme SRL" theme={theme} />
            </div>

            {/* Positions */}
            <div className={`mx-4 mb-3 rounded-xl overflow-hidden border ${isDark ? "border-white/[0.05]" : "border-black/[0.04]"}`}>
              <AnimatePresence initial={false}>
                {entry.positions.map((pos, pIdx) => (
                  <motion.div key={pos.id} variants={POS_ITEM} initial="hidden" animate="visible" exit="exit"
                    className={`${pIdx > 0 ? (isDark ? "border-t border-white/[0.05]" : "border-t border-black/[0.04]") : ""}`}
                  >
                    {/* Position sub-header */}
                    <div className={`flex items-center justify-between px-3 py-1.5 ${isDark ? "bg-white/[0.02]" : "bg-black/[0.015]"}`}>
                      <span className={`text-[9px] font-semibold uppercase tracking-[0.12em] ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
                        Funcție {pIdx + 1}
                      </span>
                      {entry.positions.length > 1 && (
                        <button onClick={() => removePosition(entry.id, pos.id)} aria-label={`Șterge funcția ${pos.title || pIdx + 1}`}
                          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${isDark ? "text-zinc-600 hover:text-red-400 hover:bg-red-400/10" : "text-zinc-400 hover:text-red-500 hover:bg-red-50"}`}>
                          <Trash size={10} weight="bold" />
                        </button>
                      )}
                    </div>

                    {/* Position fields */}
                    <div className="p-3 grid grid-cols-2 gap-x-3 gap-y-3">
                      <div className="col-span-2">
                        <label className={labelClass}>Funcție / Titlu</label>
                        <DBInput value={pos.title} onChange={(v) => updatePosition(entry.id, pos.id, "title", v)} placeholder="Developer Frontend" theme={theme} />
                      </div>
                      <div>
                        <label className={labelClass}>Data început</label>
                        <DBInput type="month" value={pos.startDate} onChange={(v) => updatePosition(entry.id, pos.id, "startDate", v)} theme={theme} />
                      </div>
                      <div>
                        <label className={labelClass}>Data sfârșit</label>
                        <DBInput type="month" value={pos.endDate} onChange={(v) => updatePosition(entry.id, pos.id, "endDate", v)} disabled={pos.current} theme={theme}
                          invalid={!pos.current && isDateRangeInvalid(pos.startDate, pos.endDate)} hint="Data de sfârșit e înaintea celei de început" />
                        <label className={`flex items-center gap-1.5 mt-1.5 text-[11px] cursor-pointer ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                          <input type="checkbox" checked={pos.current} onChange={(e) => updatePosition(entry.id, pos.id, "current", e.target.checked)} className="rounded accent-sky-500" />
                          Locul actual
                        </label>
                      </div>
                      <div className="col-span-2">
                        <label className={labelClass}>Descriere</label>
                        <DBInput rows={3} value={pos.description} onChange={(v) => updatePosition(entry.id, pos.id, "description", v)} placeholder="Responsabilități și realizări principale..." theme={theme} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Add position button */}
              <div className={`px-3 py-2 ${isDark ? "border-t border-white/[0.05]" : "border-t border-black/[0.04]"}`}>
                <button onClick={() => addPosition(entry.id)}
                  className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${isDark ? "text-zinc-500 hover:text-cyan-400" : "text-zinc-400 hover:text-sky-600"}`}>
                  <Plus size={11} weight="bold" />
                  Adaugă funcție
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
