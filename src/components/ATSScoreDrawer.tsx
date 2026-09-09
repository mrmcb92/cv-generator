"use client";

import { useState } from "react";
import { CVData } from "@/types/cv";
import { Theme } from "@/types/theme";
import { evaluateATS, ATSReport } from "@/lib/atsScore";
import {
  X,
  Sparkle,
  CheckCircle,
  Warning,
  XCircle,
  ArrowRight,
  Plus,
  Target,
  Lightning,
} from "@phosphor-icons/react";

interface Props {
  cv: CVData;
  theme: Theme;
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: "personal" | "experience" | "education" | "skills" | "other" | "projects" | "certifications") => void;
  onAddSkills: (skills: string[]) => void;
}

export default function ATSScoreDrawer({
  cv,
  theme,
  isOpen,
  onClose,
  onNavigateTab,
  onAddSkills,
}: Props) {
  const isDark = theme.id === "dark";
  const [activeTab, setActiveTab] = useState<"audit" | "scanner">("audit");
  const [jobDescription, setJobDescription] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [jobMatchResult, setJobMatchResult] = useState<{
    matchScore: number;
    summary: string;
    matchedKeywords: string[];
    missingKeywords: string[];
    recommendations: string[];
  } | null>(null);

  const report: ATSReport = evaluateATS(cv);

  if (!isOpen) return null;

  const handleScanJob = async () => {
    if (!jobDescription.trim()) return;
    setIsScanning(true);
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "match_job",
          payload: {
            jobDescription,
            cvData: cv,
          },
        }),
      });
      const json = await res.json();
      setJobMatchResult(json);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div
        className={`w-full max-w-xl h-full flex flex-col shadow-2xl border-l overflow-hidden ${
          isDark ? "bg-zinc-950 text-zinc-100 border-zinc-800" : "bg-white text-zinc-900 border-zinc-200"
        }`}
      >
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between ${isDark ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-100 bg-zinc-50/50"}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${report.color}`}>
              {report.score}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold">Scor ATS & Verificare</h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${report.color}`}>
                  {report.grade}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Optimizat pentru sistemele automate de recrutare (Workday, Taleo, Greenhouse)
              </p>
            </div>
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
            onClick={() => setActiveTab("audit")}
            className={`pb-2.5 px-3 text-[13px] font-medium border-b-2 transition ${
              activeTab === "audit"
                ? isDark
                  ? "border-cyan-400 text-cyan-400"
                  : "border-sky-600 text-sky-600"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Audit CV & Recomandări
          </button>
          <button
            onClick={() => setActiveTab("scanner")}
            className={`pb-2.5 px-3 text-[13px] font-medium border-b-2 transition flex items-center gap-1.5 ${
              activeTab === "scanner"
                ? isDark
                  ? "border-cyan-400 text-cyan-400"
                  : "border-sky-600 text-sky-600"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Target size={14} weight="bold" />
            Scanner Anunț Job (Cuvinte Cheie)
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {activeTab === "audit" ? (
            <>
              {/* Quick stats pills */}
              <div className="grid grid-cols-2 gap-3">
                <div
                  className={`p-3 rounded-xl border ${
                    isDark ? "bg-zinc-900/40 border-zinc-800" : "bg-zinc-50 border-zinc-200"
                  }`}
                >
                  <span className="text-[10px] uppercase font-semibold text-zinc-400">
                    Metrici cuantificabile
                  </span>
                  <p className="text-xl font-bold mt-0.5">{report.metricsFoundCount} găsite</p>
                  <p className="text-[10.5px] text-zinc-500 mt-0.5">
                    {report.metricsFoundCount >= 2
                      ? "Excelent, impactul e dovedit cifric"
                      : "Include cifre (ex: +30%, 150 utilizatori)"}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-xl border ${
                    isDark ? "bg-zinc-900/40 border-zinc-800" : "bg-zinc-50 border-zinc-200"
                  }`}
                >
                  <span className="text-[10px] uppercase font-semibold text-zinc-400">
                    Verbe active de acțiune
                  </span>
                  <p className="text-xl font-bold mt-0.5">{report.actionVerbsCount} utilizate</p>
                  <p className="text-[10.5px] text-zinc-500 mt-0.5">
                    {report.actionVerbsCount >= 3
                      ? "Limbaj dinamic și convingător"
                      : "Folosește verbe ca: coordonat, accelerat, livrat"}
                  </p>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Punctaj pe criterii de evaluare
                </h3>

                {report.checks.map((check) => (
                  <div
                    key={check.id}
                    className={`p-3.5 rounded-xl border transition ${
                      isDark ? "bg-zinc-900/40 border-zinc-800/80" : "bg-white border-zinc-200 shadow-xs"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        {check.status === "pass" ? (
                          <CheckCircle size={18} weight="fill" className="text-emerald-500 shrink-0 mt-0.5" />
                        ) : check.status === "warn" ? (
                          <Warning size={18} weight="fill" className="text-amber-500 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle size={18} weight="fill" className="text-rose-500 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-[13px] font-semibold">{check.label}</h4>
                            <span className="text-[10px] text-zinc-400">
                              {check.pointsEarned} / {check.maxPoints} pct
                            </span>
                          </div>
                          <p className="text-[11.5px] text-zinc-500 mt-0.5 leading-relaxed">
                            {check.message}
                          </p>
                        </div>
                      </div>

                      {check.actionTab && check.status !== "pass" && (
                        <button
                          onClick={() => {
                            onNavigateTab(check.actionTab!);
                            onClose();
                          }}
                          className={`shrink-0 inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg transition ${
                            isDark
                              ? "bg-cyan-950/50 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800"
                              : "bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200"
                          }`}
                        >
                          Rezolvă
                          <ArrowRight size={10} weight="bold" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-xl border ${
                  isDark ? "bg-zinc-900/40 border-zinc-800" : "bg-sky-50/50 border-sky-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkle size={16} weight="fill" className="text-amber-500" />
                  <h3 className="text-[13px] font-bold">Scanner de potrivire cu descrierea postului</h3>
                </div>
                <p className="text-[11.5px] text-zinc-500 leading-relaxed">
                  Lipește descrierea jobului la care dorești să aplici. Inteligența Artificială va compara CV-ul tău cu cerințele rolului și îți va indica cuvintele cheie lipsă.
                </p>
              </div>

              <div>
                <label className="block text-[11.5px] font-semibold text-zinc-400 mb-1.5">
                  Lipește textul anunțului de recrutare (Cerințe & Responsabilități)
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={6}
                  placeholder="ex: Cerințe: Căutăm Senior Developer cu 4+ ani experiență în React, TypeScript, GraphQL, AWS și metodologii Agile..."
                  className={`w-full p-3 rounded-xl text-[12px] border outline-none leading-relaxed transition ${
                    isDark
                      ? "bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-cyan-500"
                      : "bg-white border-zinc-200 text-zinc-900 focus:border-sky-500 shadow-xs"
                  }`}
                />
                <button
                  type="button"
                  disabled={!jobDescription.trim() || isScanning}
                  onClick={handleScanJob}
                  className={`w-full mt-2.5 py-2.5 px-4 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition ${
                    isScanning
                      ? "opacity-60 cursor-not-allowed"
                      : isDark
                      ? "bg-cyan-500 hover:bg-cyan-400 text-zinc-950"
                      : "bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20"
                  }`}
                >
                  <Lightning size={16} weight="fill" className={isScanning ? "animate-spin" : ""} />
                  {isScanning ? "Se scanează CV-ul..." : "Analizează potrivirea cu jobul"}
                </button>
              </div>

              {/* Match Results */}
              {jobMatchResult && (
                <div
                  className={`p-4 rounded-xl border space-y-4 ${
                    isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold uppercase text-zinc-400">
                        Rată estimată de potrivire
                      </span>
                      <p className="text-2xl font-black mt-0.5 text-emerald-500">
                        {jobMatchResult.matchScore}%
                      </p>
                    </div>
                    <span className="text-[11.5px] max-w-xs text-right text-zinc-500">
                      {jobMatchResult.summary}
                    </span>
                  </div>

                  {/* Matched keywords */}
                  <div>
                    <span className="text-[11px] font-semibold text-zinc-400 block mb-1.5">
                      Cuvinte cheie identificate în CV-ul tău:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {jobMatchResult.matchedKeywords.length > 0 ? (
                        jobMatchResult.matchedKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          >
                            <CheckCircle size={12} weight="bold" />
                            {kw}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-zinc-400">Niciun termen cheie exact identificat.</span>
                      )}
                    </div>
                  </div>

                  {/* Missing keywords */}
                  {jobMatchResult.missingKeywords.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-semibold text-rose-500 dark:text-rose-400">
                          Cuvinte cheie din anunț care lipsesc din CV:
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            onAddSkills(jobMatchResult.missingKeywords);
                            onNavigateTab("skills");
                            onClose();
                          }}
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded transition ${
                            isDark
                              ? "text-cyan-400 hover:bg-cyan-500/10"
                              : "text-sky-600 hover:bg-sky-50"
                          }`}
                        >
                          <Plus size={12} weight="bold" />
                          Adaugă toate la Competențe
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {jobMatchResult.missingKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                          >
                            <Warning size={12} weight="bold" />
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {jobMatchResult.recommendations.length > 0 && (
                    <div className="pt-2 border-t border-zinc-800/40">
                      <span className="text-[11px] font-semibold text-zinc-400 block mb-1.5">
                        Recomandări specifice pentru aplicare:
                      </span>
                      <ul className="space-y-1.5">
                        {jobMatchResult.recommendations.map((rec, i) => (
                          <li key={i} className="text-[11.5px] text-zinc-500 flex items-start gap-1.5">
                            <span className="text-amber-500 font-bold">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
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
            Închide panoul
          </button>
        </div>
      </div>
    </div>
  );
}
