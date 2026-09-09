"use client";

import { useState } from "react";
import { CVData } from "@/types/cv";
import { Theme } from "@/types/theme";
import { cvToJsonResume, jsonResumeToCV } from "@/lib/jsonResume";
import { validateOrDefault } from "@/lib/validateCv";
import {
  X,
  DownloadSimple,
  UploadSimple,
  Sparkle,
  FileCode,
  CheckCircle,
} from "@phosphor-icons/react";

interface Props {
  cv: CVData;
  theme: Theme;
  isOpen: boolean;
  onClose: () => void;
  onImportCV: (data: CVData) => void;
}

export default function ImportExportModal({
  cv,
  theme,
  isOpen,
  onClose,
  onImportCV,
}: Props) {
  const isDark = theme.id === "dark";
  const [activeTab, setActiveTab] = useState<"jsonresume" | "aiparser" | "backup">("jsonresume");
  const [pasteText, setPasteText] = useState("");
  const [isAiParsing, setIsAiParsing] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportJsonResume = () => {
    const resume = cvToJsonResume(cv);
    const blob = new Blob([JSON.stringify(resume, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resume-${cv.personal.lastName || "cv"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportNativeJson = () => {
    const blob = new Blob([JSON.stringify(cv, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cv-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isJsonResume = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = JSON.parse(event.target?.result as string);
        if (isJsonResume || raw.basics) {
          const converted = jsonResumeToCV(raw);
          onImportCV(converted);
          setImportStatus("CV-ul JSON Resume a fost importat cu succes!");
        } else {
          const validated = validateOrDefault(raw);
          onImportCV(validated);
          setImportStatus("Backup-ul a fost restaurat cu succes!");
        }
        setTimeout(() => onClose(), 1500);
      } catch {
        setImportStatus("Eroare: Fișierul nu conține un JSON valid.");
      }
    };
    reader.readAsText(file);
  };

  const handleAiParseText = async () => {
    if (!pasteText.trim()) return;
    setIsAiParsing(true);
    setImportStatus(null);
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "parse_cv_text",
          payload: { text: pasteText },
        }),
      });
      const json = await res.json();
      if (json.cvData) {
        const validated = validateOrDefault(json.cvData);
        onImportCV(validated);
        setImportStatus("Informațiile din text au fost extrase și aplicate cu succes!");
        setTimeout(() => onClose(), 1500);
      } else {
        setImportStatus("Nu s-au putut extrage date din textul furnizat.");
      }
    } catch {
      setImportStatus("A apărut o eroare la parsarea AI.");
    } finally {
      setIsAiParsing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div
        className={`w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${
          isDark ? "bg-zinc-950 text-zinc-100 border-zinc-800" : "bg-white text-zinc-900 border-zinc-200"
        }`}
      >
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between ${isDark ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-100 bg-zinc-50/50"}`}>
          <div>
            <h2 className="text-base font-bold">Import & Export Date</h2>
            <p className="text-[11.5px] text-zinc-500 mt-0.5">
              Standard deschis JSON Resume, import inteligent cu AI și salvări locale
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switch */}
        <div className={`flex border-b px-5 pt-2 ${isDark ? "border-zinc-800" : "border-zinc-100"}`}>
          <button
            onClick={() => setActiveTab("jsonresume")}
            className={`pb-2.5 px-3 text-[12.5px] font-medium border-b-2 transition flex items-center gap-1.5 ${
              activeTab === "jsonresume"
                ? isDark
                  ? "border-cyan-400 text-cyan-400"
                  : "border-sky-600 text-sky-600"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <FileCode size={14} weight="bold" />
            Standard JSON Resume
          </button>
          <button
            onClick={() => setActiveTab("aiparser")}
            className={`pb-2.5 px-3 text-[12.5px] font-medium border-b-2 transition flex items-center gap-1.5 ${
              activeTab === "aiparser"
                ? isDark
                  ? "border-cyan-400 text-cyan-400"
                  : "border-sky-600 text-sky-600"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Sparkle size={14} weight="fill" className="text-amber-500" />
            Parser Inteligent AI (Text brut)
          </button>
          <button
            onClick={() => setActiveTab("backup")}
            className={`pb-2.5 px-3 text-[12.5px] font-medium border-b-2 transition flex items-center gap-1.5 ${
              activeTab === "backup"
                ? isDark
                  ? "border-cyan-400 text-cyan-400"
                  : "border-sky-600 text-sky-600"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Backup Complet
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {importStatus && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[12px] flex items-center gap-2">
              <CheckCircle size={16} weight="fill" />
              <span>{importStatus}</span>
            </div>
          )}

          {activeTab === "jsonresume" && (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border ${isDark ? "bg-zinc-900/40 border-zinc-800" : "bg-zinc-50 border-zinc-200"}`}>
                <h3 className="text-[13px] font-bold">Ce este JSON Resume?</h3>
                <p className="text-[11.5px] text-zinc-500 mt-1 leading-relaxed">
                  JSON Resume este standardul internațional open-source pentru date de carieră. Îți permite să exporți CV-ul și să îl imporți pe zeci de platforme de recrutare, generatoare de site-uri portofoliu sau sisteme ATS.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className={`p-4 rounded-xl border flex flex-col justify-between ${
                    isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200 shadow-xs"
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Exportă</h4>
                    <p className="text-[12px] font-semibold mt-1">Descarcă format JSON Resume</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Fișier `.json` portabil și conform cu schema standard.
                    </p>
                  </div>
                  <button
                    onClick={handleExportJsonResume}
                    className={`mt-4 w-full py-2 px-3 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-1.5 transition ${
                      isDark
                        ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                        : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800"
                    }`}
                  >
                    <DownloadSimple size={14} weight="bold" />
                    Descarcă resume.json
                  </button>
                </div>

                <div
                  className={`p-4 rounded-xl border flex flex-col justify-between ${
                    isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200 shadow-xs"
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Importă</h4>
                    <p className="text-[12px] font-semibold mt-1">Încarcă fișier JSON Resume</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Completează automat întregul CV dintr-un fișier existent.
                    </p>
                  </div>
                  <label
                    className={`mt-4 w-full py-2 px-3 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition ${
                      isDark
                        ? "bg-cyan-500 hover:bg-cyan-400 text-zinc-950"
                        : "bg-sky-600 hover:bg-sky-500 text-white shadow-xs"
                    }`}
                  >
                    <UploadSimple size={14} weight="bold" />
                    Alege fișier .json
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => handleFileUpload(e, true)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "aiparser" && (
            <div className="space-y-3">
              <div className={`p-4 rounded-xl border ${isDark ? "bg-zinc-900/40 border-zinc-800" : "bg-sky-50/50 border-sky-200"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkle size={16} weight="fill" className="text-amber-500" />
                  <h3 className="text-[13px] font-bold">Importă text dintr-un CV existent sau LinkedIn</h3>
                </div>
                <p className="text-[11.5px] text-zinc-500 leading-relaxed">
                  Copiază și lipește tot textul din vechiul tău document Word / PDF sau secțiunile profilului tău de LinkedIn. Inteligența Artificială va recunoaște companiile, rolurile, perioadele, educația și competențele.
                </p>
              </div>

              <div>
                <textarea
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  rows={8}
                  placeholder="Lipește textul brut aici (ex: Ion Popescu - Software Engineer... Experiență la Compania X din 2021 până în prezent...)"
                  className={`w-full p-3 rounded-xl text-[12px] border outline-none leading-relaxed ${
                    isDark ? "bg-zinc-900 border-zinc-800 text-zinc-200" : "bg-white border-zinc-300 text-zinc-800"
                  }`}
                />
                <button
                  type="button"
                  disabled={!pasteText.trim() || isAiParsing}
                  onClick={handleAiParseText}
                  className={`w-full mt-2.5 py-2.5 px-4 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition ${
                    isAiParsing
                      ? "opacity-60 cursor-not-allowed"
                      : isDark
                      ? "bg-cyan-500 hover:bg-cyan-400 text-zinc-950"
                      : "bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20"
                  }`}
                >
                  <Sparkle size={16} weight="fill" className={isAiParsing ? "animate-spin" : ""} />
                  {isAiParsing ? "Extragem informațiile din text..." : "Parsează textul și actualizează CV-ul"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "backup" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className={`p-4 rounded-xl border flex flex-col justify-between ${
                    isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200 shadow-xs"
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Salvare (Backup)</h4>
                    <p className="text-[12px] font-semibold mt-1">Descarcă backup complet al aplicației</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Include toate setările, ordinea secțiunilor și pozele salvate.
                    </p>
                  </div>
                  <button
                    onClick={handleExportNativeJson}
                    className={`mt-4 w-full py-2 px-3 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-1.5 transition ${
                      isDark
                        ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                        : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800"
                    }`}
                  >
                    <DownloadSimple size={14} weight="bold" />
                    Descarcă Backup JSON
                  </button>
                </div>

                <div
                  className={`p-4 rounded-xl border flex flex-col justify-between ${
                    isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200 shadow-xs"
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Restaurare</h4>
                    <p className="text-[12px] font-semibold mt-1">Restaurează dintr-un backup anterior</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Reîncarcă o stare anterioară salvată pe calculatorul tău.
                    </p>
                  </div>
                  <label
                    className={`mt-4 w-full py-2 px-3 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition ${
                      isDark
                        ? "bg-cyan-500 hover:bg-cyan-400 text-zinc-950"
                        : "bg-sky-600 hover:bg-sky-500 text-white shadow-xs"
                    }`}
                  >
                    <UploadSimple size={14} weight="bold" />
                    Alege fișier backup
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => handleFileUpload(e, false)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex justify-end ${isDark ? "border-zinc-800 bg-zinc-900/30" : "border-zinc-100 bg-zinc-50"}`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              isDark ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200" : "bg-zinc-200 hover:bg-zinc-300 text-zinc-800"
            }`}
          >
            Închide
          </button>
        </div>
      </div>
    </div>
  );
}
