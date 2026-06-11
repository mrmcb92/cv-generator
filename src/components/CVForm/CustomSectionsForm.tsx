"use client";

import { CustomSection, CustomItem } from "@/types/cv";
import { Theme } from "@/types/theme";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash, Stack } from "@phosphor-icons/react";
import { DBInput, AddButton, SectionHeader, fieldLabelClass } from "@/components/ui/fields";

interface Props {
  data: CustomSection[];
  onChange: (data: CustomSection[]) => void;
  theme: Theme;
}

function newItem(): CustomItem {
  return { id: crypto.randomUUID(), name: "", subtitle: "", date: "", description: "" };
}

function newSection(): CustomSection {
  return { id: crypto.randomUUID(), title: "", items: [newItem()] };
}

const ITEM = {
  hidden: { opacity: 0, y: 10, filter: "blur(3px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.2 } },
};

export default function CustomSectionsForm({ data, onChange, theme }: Props) {
  const isDark = theme.id === "dark";
  const labelClass = fieldLabelClass(theme);

  const addSection = () => onChange([...data, newSection()]);
  const removeSection = (id: string) => onChange(data.filter((s) => s.id !== id));
  const updateTitle = (id: string, title: string) =>
    onChange(data.map((s) => s.id === id ? { ...s, title } : s));

  const addItem = (sectionId: string) =>
    onChange(data.map((s) => s.id === sectionId ? { ...s, items: [...s.items, newItem()] } : s));
  const removeItem = (sectionId: string, itemId: string) =>
    onChange(data.map((s) => s.id === sectionId ? { ...s, items: s.items.filter((i) => i.id !== itemId) } : s));
  const updateItem = (sectionId: string, itemId: string, field: keyof CustomItem, value: string) =>
    onChange(data.map((s) => s.id === sectionId
      ? { ...s, items: s.items.map((i) => i.id === itemId ? { ...i, [field]: value } : i) }
      : s));

  return (
    <motion.div initial={{ opacity: 0, y: 10, filter: "blur(3px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }} className="space-y-4">
      <div className="flex items-start justify-between">
        <SectionHeader eyebrow="Secțiunea 5" title="Secțiuni personalizate"
          subtitle="Certificări, proiecte, voluntariat, hobby-uri..." theme={theme} />
        <AddButton onClick={addSection} theme={theme} />
      </div>

      {data.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={`flex flex-col items-center justify-center py-12 rounded-2xl border border-dashed ${isDark ? "border-zinc-700 text-zinc-600" : "border-zinc-200 text-zinc-400"}`}>
          <Stack size={28} weight="thin" className="mb-2 opacity-40" />
          <p className="text-[12px] font-medium">Nicio secțiune personalizată</p>
          <button onClick={addSection} className={`mt-2 text-[11px] underline underline-offset-2 ${isDark ? "text-cyan-400" : "text-sky-500"}`}>Adaugă prima secțiune</button>
        </motion.div>
      )}

      <AnimatePresence>
        {data.map((section, idx) => (
          <motion.div key={section.id} variants={ITEM} initial="hidden" animate="visible" exit="exit"
            className={`rounded-2xl overflow-hidden ${isDark ? "bg-white/[0.03] ring-1 ring-white/[0.06]" : "bg-black/[0.02] ring-1 ring-black/[0.05]"}`}
            style={{ boxShadow: isDark ? "inset 0 1px 0 rgba(255,255,255,0.04)" : "inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 8px rgba(0,0,0,0.04)" }}>
            <div className={`flex items-center justify-between px-4 py-2.5 border-b ${isDark ? "border-white/[0.05]" : "border-black/[0.04]"}`}>
              <span className={`text-[10px] font-mono ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>#{String(idx + 1).padStart(2, "0")}</span>
              <button onClick={() => removeSection(section.id)} aria-label={`Șterge secțiunea ${section.title || idx + 1}`}
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${isDark ? "text-zinc-600 hover:text-red-400 hover:bg-red-400/10" : "text-zinc-300 hover:text-red-500 hover:bg-red-50"}`}>
                <Trash size={12} weight="bold" />
              </button>
            </div>

            <div className="px-4 pt-4 pb-3">
              <label className={labelClass}>Titlul secțiunii</label>
              <DBInput value={section.title} onChange={(v) => updateTitle(section.id, v)} placeholder="Certificări / Proiecte / Voluntariat..." theme={theme} />
            </div>

            <div className={`mx-4 mb-3 rounded-xl overflow-hidden border ${isDark ? "border-white/[0.05]" : "border-black/[0.04]"}`}>
              {section.items.map((item, iIdx) => (
                <div key={item.id} className={iIdx > 0 ? (isDark ? "border-t border-white/[0.05]" : "border-t border-black/[0.04]") : ""}>
                  <div className={`flex items-center justify-between px-3 py-1.5 ${isDark ? "bg-white/[0.02]" : "bg-black/[0.015]"}`}>
                    <span className={`text-[9px] font-semibold uppercase tracking-[0.12em] ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
                      Element {iIdx + 1}
                    </span>
                    {section.items.length > 1 && (
                      <button onClick={() => removeItem(section.id, item.id)} aria-label={`Șterge elementul ${item.name || iIdx + 1}`}
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${isDark ? "text-zinc-600 hover:text-red-400 hover:bg-red-400/10" : "text-zinc-400 hover:text-red-500 hover:bg-red-50"}`}>
                        <Trash size={10} weight="bold" />
                      </button>
                    )}
                  </div>
                  <div className="p-3 grid grid-cols-2 gap-x-3 gap-y-3">
                    <div>
                      <label className={labelClass}>Denumire</label>
                      <DBInput value={item.name} onChange={(v) => updateItem(section.id, item.id, "name", v)} placeholder="Certificat AWS / Proiect X..." theme={theme} />
                    </div>
                    <div>
                      <label className={labelClass}>Detaliu (opțional)</label>
                      <DBInput value={item.subtitle} onChange={(v) => updateItem(section.id, item.id, "subtitle", v)} placeholder="Emitent, rol, locație..." theme={theme} />
                    </div>
                    <div className="col-span-2">
                      <label className={labelClass}>Dată / Perioadă (opțional)</label>
                      <DBInput value={item.date} onChange={(v) => updateItem(section.id, item.id, "date", v)} placeholder="2023 sau Mar 2021 – Iun 2022" theme={theme} />
                    </div>
                    <div className="col-span-2">
                      <label className={labelClass}>Descriere (opțional)</label>
                      <DBInput rows={2} value={item.description} onChange={(v) => updateItem(section.id, item.id, "description", v)} placeholder="Detalii relevante..." theme={theme} />
                    </div>
                  </div>
                </div>
              ))}

              <div className={`px-3 py-2 ${isDark ? "border-t border-white/[0.05]" : "border-t border-black/[0.04]"}`}>
                <button onClick={() => addItem(section.id)}
                  className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${isDark ? "text-zinc-500 hover:text-cyan-400" : "text-zinc-400 hover:text-sky-600"}`}>
                  <Plus size={11} weight="bold" />
                  Adaugă element
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
