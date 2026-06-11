"use client";

import { WorkExperience, WorkPosition } from "@/types/cv";
import { Theme } from "@/types/theme";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash, Briefcase } from "@phosphor-icons/react";

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

function DBInput({ value, onChange, placeholder, theme, type = "text", disabled }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
  theme: Theme; type?: string; disabled?: boolean;
}) {
  const isDark = theme.id === "dark";
  const outer = isDark ? "bg-white/[0.04] ring-1 ring-white/[0.08] rounded-xl p-[2px]" : "bg-black/[0.03] ring-1 ring-black/[0.07] rounded-xl p-[2px]";
  const inner = isDark
    ? "w-full bg-zinc-800 rounded-[calc(0.75rem-2px)] px-3 py-2.5 text-[13px] text-zinc-100 placeholder-zinc-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] focus:ring-2 focus:ring-cyan-400/30 disabled:opacity-40"
    : "w-full bg-white rounded-[calc(0.75rem-2px)] px-3 py-2.5 text-[13px] text-zinc-900 placeholder-zinc-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(255,255,255,0.9)] focus:ring-2 focus:ring-sky-500/25 disabled:opacity-40";
  return (
    <div className={outer}>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
        className={`${inner} transition-all duration-300`} style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }} />
    </div>
  );
}

function DBTextarea({ value, onChange, placeholder, theme, rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; theme: Theme; rows?: number;
}) {
  const isDark = theme.id === "dark";
  const outer = isDark ? "bg-white/[0.04] ring-1 ring-white/[0.08] rounded-xl p-[2px]" : "bg-black/[0.03] ring-1 ring-black/[0.07] rounded-xl p-[2px]";
  const inner = isDark
    ? "w-full bg-zinc-800 rounded-[calc(0.75rem-2px)] px-3 py-2.5 text-[13px] text-zinc-100 placeholder-zinc-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] focus:ring-2 focus:ring-cyan-400/30 resize-none leading-relaxed"
    : "w-full bg-white rounded-[calc(0.75rem-2px)] px-3 py-2.5 text-[13px] text-zinc-900 placeholder-zinc-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(255,255,255,0.9)] focus:ring-2 focus:ring-sky-500/25 resize-none leading-relaxed";
  return (
    <div className={outer}>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        className={`${inner} transition-all duration-300`} style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }} />
    </div>
  );
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
  const labelClass = `block mb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] ${isDark ? "text-zinc-500" : "text-zinc-400"}`;

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
        <div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-[0.18em] mb-2 ${isDark ? "bg-cyan-400/10 text-cyan-400" : "bg-sky-500/10 text-sky-600"}`}>
            Secțiunea 2
          </span>
          <h2 className={`text-base font-bold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>Experiență profesională</h2>
          <p className={`text-[11px] mt-0.5 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
            {data.length} {data.length === 1 ? "companie" : "companii"} · {totalPositions} {totalPositions === 1 ? "funcție" : "funcții"}
          </p>
        </div>
        <button
          onClick={addCompany}
          className={`group flex items-center gap-1.5 text-[11px] font-semibold pl-2.5 pr-1 py-1 rounded-full transition-all duration-300 active:scale-[0.96] ${isDark ? "bg-white/6 hover:bg-white/10 text-white/70 hover:text-white" : "bg-black/5 hover:bg-black/8 text-zinc-600 hover:text-zinc-900"}`}
          style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
        >
          Adaugă
          <span className={`w-5 h-5 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform ${isDark ? "bg-white/10" : "bg-black/8"}`}>
            <Plus size={10} weight="bold" />
          </span>
        </button>
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
              <button onClick={() => removeCompany(entry.id)}
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
                        <button onClick={() => removePosition(entry.id, pos.id)}
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
                        <DBInput type="month" value={pos.endDate} onChange={(v) => updatePosition(entry.id, pos.id, "endDate", v)} disabled={pos.current} theme={theme} />
                        <label className={`flex items-center gap-1.5 mt-1.5 text-[11px] cursor-pointer ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                          <input type="checkbox" checked={pos.current} onChange={(e) => updatePosition(entry.id, pos.id, "current", e.target.checked)} className="rounded accent-sky-500" />
                          Locul actual
                        </label>
                      </div>
                      <div className="col-span-2">
                        <label className={labelClass}>Descriere</label>
                        <DBTextarea value={pos.description} onChange={(v) => updatePosition(entry.id, pos.id, "description", v)} placeholder="Responsabilități și realizări principale..." theme={theme} />
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
