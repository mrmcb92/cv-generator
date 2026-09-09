"use client";

import { CVData, CvDensity } from "@/types/cv";
import { Theme } from "@/types/theme";
import {
  X,
  ArrowUp,
  ArrowDown,
  ArrowsVertical,
} from "@phosphor-icons/react";

interface Props {
  cv: CVData;
  theme: Theme;
  isOpen: boolean;
  onClose: () => void;
  onUpdateOrder: (order: string[]) => void;
  onUpdateDensity: (density: CvDensity) => void;
}

const SECTION_NAMES: Record<string, string> = {
  experience: "Experiență profesională",
  education: "Educație & Studii",
  skills: "Competențe & Abilități",
  projects: "Proiecte & Portofoliu",
  certifications: "Certificări & Cursuri",
  languages: "Limbi străine",
  drivingLicenses: "Permis de conducere",
};

export default function SectionOrderModal({
  cv,
  theme,
  isOpen,
  onClose,
  onUpdateOrder,
  onUpdateDensity,
}: Props) {
  const isDark = theme.id === "dark";

  if (!isOpen) return null;

  const currentOrder = cv.sectionOrder && cv.sectionOrder.length > 0
    ? cv.sectionOrder
    : [
        "experience",
        "education",
        "skills",
        "projects",
        "certifications",
        "languages",
        "drivingLicenses",
      ];

  const moveSection = (idx: number, dir: -1 | 1) => {
    const next = [...currentOrder];
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= next.length) return;
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    onUpdateOrder(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div
        className={`w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden ${
          isDark ? "bg-zinc-950 text-zinc-100 border-zinc-800" : "bg-white text-zinc-900 border-zinc-200"
        }`}
      >
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between ${isDark ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-100 bg-zinc-50/50"}`}>
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <ArrowsVertical size={18} weight="bold" />
              Aranjare Secțiuni & Paginare
            </h2>
            <p className="text-[11.5px] text-zinc-500 mt-0.5">
              Schimbă ordinea de afișare pe CV și spațierea pentru încadrare perfectă
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Density Selector */}
          <div>
            <label className="text-[11.5px] font-semibold text-zinc-400 block mb-2">
              Densitate spațiere (Încadrare pe 1 sau 2 pagini)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["compact", "normal", "spacious"] as const).map((density) => {
                const isSelected = (cv.density || "normal") === density;
                const label =
                  density === "compact"
                    ? "Compact (1 Pagină)"
                    : density === "normal"
                    ? "Normal (Echilibrat)"
                    : "Spațios (Generos)";
                return (
                  <button
                    key={density}
                    type="button"
                    onClick={() => onUpdateDensity(density)}
                    className={`py-2 px-2.5 rounded-xl border text-[11.5px] font-medium transition text-center ${
                      isSelected
                        ? isDark
                          ? "bg-cyan-950/60 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500/50"
                          : "bg-sky-50 border-sky-500 text-sky-700 ring-1 ring-sky-500/50 font-semibold"
                        : isDark
                        ? "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                        : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <p className="text-[10.5px] text-zinc-500 mt-1.5">
              Modul „Compact” reduce padding-urile și înălțimea rândurilor pentru a potrivi mai mult conținut pe o singură pagină A4.
            </p>
          </div>

          {/* Section List Reorder */}
          <div>
            <label className="text-[11.5px] font-semibold text-zinc-400 block mb-2">
              Ordinea secțiunilor pe documentul tipărit
            </label>
            <div className="space-y-2">
              {currentOrder.map((sectionKey, idx) => (
                <div
                  key={sectionKey}
                  className={`p-3 rounded-xl border flex items-center justify-between transition ${
                    isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200 shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {idx + 1}
                    </span>
                    <span className="text-[12.5px] font-medium">
                      {SECTION_NAMES[sectionKey] || sectionKey}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveSection(idx, -1)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      title="Mută mai sus"
                    >
                      <ArrowUp size={14} weight="bold" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === currentOrder.length - 1}
                      onClick={() => moveSection(idx, 1)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      title="Mută mai jos"
                    >
                      <ArrowDown size={14} weight="bold" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex justify-end ${isDark ? "border-zinc-800 bg-zinc-900/30" : "border-zinc-100 bg-zinc-50"}`}>
          <button
            onClick={onClose}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition ${
              isDark ? "bg-cyan-500 hover:bg-cyan-400 text-zinc-950" : "bg-sky-600 hover:bg-sky-500 text-white shadow-xs"
            }`}
          >
            Salvează & Aplică
          </button>
        </div>
      </div>
    </div>
  );
}
