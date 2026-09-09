"use client";

import { CVData } from "@/types/cv";
import { Theme } from "@/types/theme";
import { DEMO_PRESETS, DemoPreset } from "@/lib/demoPresets";
import { X, Sparkle, ArrowRight, Briefcase, GraduationCap, ChartLineUp, Cpu } from "@phosphor-icons/react";

interface Props {
  theme: Theme;
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (data: CVData) => void;
}

export default function DemoPresetsModal({ theme, isOpen, onClose, onSelectPreset }: Props) {
  const isDark = theme.id === "dark";

  if (!isOpen) return null;

  const getCategoryIcon = (cat: DemoPreset["category"]) => {
    switch (cat) {
      case "tech":
        return <Cpu size={18} weight="fill" className="text-cyan-500" />;
      case "marketing":
        return <ChartLineUp size={18} weight="fill" className="text-emerald-500" />;
      case "student":
        return <GraduationCap size={18} weight="fill" className="text-amber-500" />;
      case "executive":
        return <Briefcase size={18} weight="fill" className="text-indigo-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div
        className={`w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${
          isDark ? "bg-zinc-950 text-zinc-100 border-zinc-800" : "bg-white text-zinc-900 border-zinc-200"
        }`}
      >
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between ${isDark ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-100 bg-zinc-50/50"}`}>
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <Sparkle size={18} weight="fill" className="text-amber-500" />
              Exemple de CV-uri Reale (Preseturi pe Domenii)
            </h2>
            <p className="text-[11.5px] text-zinc-500 mt-0.5">
              Încarcă un model profesional gata completat cu realizări cuantificate și structură optimizată ATS
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Presets Grid */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEMO_PRESETS.map((preset) => (
            <div
              key={preset.id}
              className={`p-4 rounded-xl border flex flex-col justify-between transition group ${
                isDark
                  ? "bg-zinc-900/40 border-zinc-800 hover:border-cyan-500/60 hover:bg-zinc-900/70"
                  : "bg-zinc-50/70 border-zinc-200 hover:border-sky-500/60 hover:bg-white shadow-xs"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold border ${
                      isDark
                        ? "bg-zinc-800 border-zinc-700 text-zinc-300"
                        : "bg-white border-zinc-200 text-zinc-700"
                    }`}
                  >
                    {getCategoryIcon(preset.category)}
                    {preset.badge}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {preset.data.experience.length} companii · {preset.data.skills.length} skills
                  </span>
                </div>

                <h3 className="text-sm font-bold">{preset.name}</h3>
                <p className={`text-[12px] font-medium mt-0.5 ${isDark ? "text-cyan-400" : "text-sky-600"}`}>
                  {preset.role}
                </p>
                <p className="text-[11.5px] text-zinc-500 mt-2 leading-relaxed">
                  {preset.description}
                </p>

                {/* Micro preview badges */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {preset.data.skills.slice(0, 4).map((s) => (
                    <span
                      key={s.id}
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        isDark ? "bg-zinc-800 text-zinc-400" : "bg-zinc-200 text-zinc-600"
                      }`}
                    >
                      {s.name}
                    </span>
                  ))}
                  {preset.data.skills.length > 4 && (
                    <span className="text-[10px] px-1 text-zinc-400">+{preset.data.skills.length - 4}</span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between">
                <span className="text-[10.5px] text-zinc-400">Include Proiecte & Certificări</span>
                <button
                  type="button"
                  onClick={() => {
                    onSelectPreset(preset.data);
                    onClose();
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-semibold transition ${
                    isDark
                      ? "bg-cyan-500 hover:bg-cyan-400 text-zinc-950"
                      : "bg-sky-600 hover:bg-sky-500 text-white shadow-xs"
                  }`}
                >
                  Încarcă profilul
                  <ArrowRight size={12} weight="bold" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className={`p-4 border-t flex justify-between items-center ${isDark ? "border-zinc-800 bg-zinc-900/30" : "border-zinc-100 bg-zinc-50"}`}>
          <span className="text-[11px] text-zinc-500">
            Atenție: Încărcarea unui model va înlocui datele curente din formular.
          </span>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              isDark ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200" : "bg-zinc-200 hover:bg-zinc-300 text-zinc-800"
            }`}
          >
            Anulează
          </button>
        </div>
      </div>
    </div>
  );
}
