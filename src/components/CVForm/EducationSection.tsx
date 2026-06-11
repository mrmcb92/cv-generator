"use client";

import { Education } from "@/types/cv";
import { Theme } from "@/types/theme";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash, GraduationCap } from "@phosphor-icons/react";

interface Props {
  data: Education[];
  onChange: (data: Education[]) => void;
  theme: Theme;
}

function newEntry(): Education {
  return { id: crypto.randomUUID(), institution: "", degree: "", field: "", startDate: "", endDate: "", gpa: "" };
}

function DBInput({ value, onChange, placeholder, theme, type = "text" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; theme: Theme; type?: string;
}) {
  const isDark = theme.id === "dark";
  const outer = isDark ? "bg-white/[0.04] ring-1 ring-white/[0.08] rounded-xl p-[2px]" : "bg-black/[0.03] ring-1 ring-black/[0.07] rounded-xl p-[2px]";
  const inner = isDark
    ? "w-full bg-zinc-800 rounded-[calc(0.75rem-2px)] px-3 py-2.5 text-[13px] text-zinc-100 placeholder-zinc-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] focus:ring-2 focus:ring-cyan-400/30"
    : "w-full bg-white rounded-[calc(0.75rem-2px)] px-3 py-2.5 text-[13px] text-zinc-900 placeholder-zinc-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(255,255,255,0.9)] focus:ring-2 focus:ring-sky-500/25";
  return (
    <div className={outer}>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className={`${inner} transition-all duration-300`} style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }} />
    </div>
  );
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
  const labelClass = `block mb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] ${isDark ? "text-zinc-500" : "text-zinc-400"}`;

  return (
    <motion.div initial={{ opacity: 0, y: 10, filter: "blur(3px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }} className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-[0.18em] mb-2 ${isDark ? "bg-cyan-400/10 text-cyan-400" : "bg-sky-500/10 text-sky-600"}`}>
            Secțiunea 3
          </span>
          <h2 className={`text-base font-bold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>Educație</h2>
          <p className={`text-[11px] mt-0.5 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>{data.length} {data.length === 1 ? "instituție" : "instituții"}</p>
        </div>
        <button onClick={add}
          className={`group flex items-center gap-1.5 text-[11px] font-semibold pl-2.5 pr-1 py-1 rounded-full transition-all duration-300 active:scale-[0.96] ${isDark ? "bg-white/6 hover:bg-white/10 text-white/70 hover:text-white" : "bg-black/5 hover:bg-black/8 text-zinc-600 hover:text-zinc-900"}`}
          style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}>
          Adaugă
          <span className={`w-5 h-5 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform ${isDark ? "bg-white/10" : "bg-black/8"}`}>
            <Plus size={10} weight="bold" />
          </span>
        </button>
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
              <button onClick={() => remove(entry.id)}
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
                <DBInput type="month" value={entry.endDate} onChange={(v) => update(entry.id, "endDate", v)} theme={theme} />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
