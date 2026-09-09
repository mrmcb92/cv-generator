"use client";

import { useState } from "react";
import { CVData, CoverLetterData } from "@/types/cv";
import { Theme } from "@/types/theme";
import {
  X,
  Sparkle,
  Copy,
  Check,
  Printer,
  EnvelopeOpen,
} from "@phosphor-icons/react";

interface Props {
  cv: CVData;
  theme: Theme;
  isOpen: boolean;
  onClose: () => void;
}

export default function CoverLetterModal({ cv, theme, isOpen, onClose }: Props) {
  const isDark = theme.id === "dark";
  const fullName = [cv.personal.firstName, cv.personal.lastName].filter(Boolean).join(" ") || "Candidat";

  const [letterData, setLetterData] = useState<CoverLetterData>({
    recipientName: "Manager de Recrutare",
    recipientTitle: "Departamentul Resurse Umane",
    companyName: "",
    jobTitle: cv.personal.title || "Poziția vizată",
    city: cv.personal.location || "",
    letterBody: `Stimate Manager de Recrutare,\n\nVă scriu pentru a-mi exprima interesul puternic pentru poziția de ${cv.personal.title || "specialist"} în cadrul companiei dumneavoastră.\n\nCu o experiență solidă în domeniu și realizări concrete demonstrate de-a lungul carierei mele, sunt convins că pot aduce o contribuție valoroasă echipei. Am capacitatea de a aborda proiecte complexe cu pragmatism, viteză de execuție și atenție la detalii.\n\nSunt entuziasmat de perspectiva de a colabora și vă mulțumesc pentru timpul acordat analizării candidaturii mele. Aștept cu nerăbdare oportunitatea de a discuta mai pe larg în cadrul unui interviu.\n\nCu stimă,\n${fullName}`,
    date: new Date().toISOString().split("T")[0],
  });

  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerateAi = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_cover_letter",
          payload: {
            candidateName: fullName,
            candidateTitle: cv.personal.title,
            candidateEmail: cv.personal.email,
            candidatePhone: cv.personal.phone,
            companyName: letterData.companyName,
            jobTitle: letterData.jobTitle,
            jobDescription,
            cvSummary: cv.personal.summary,
            skills: cv.skills.map((s) => s.name),
          },
        }),
      });
      const json = await res.json();
      if (json.letter) {
        setLetterData((prev) => ({ ...prev, letterBody: json.letter }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letterData.letterBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWin = window.open("", "_blank");
    if (!printWin) return;
    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Scrisoare de Intenție - ${fullName}</title>
          <style>
            @page { size: A4; margin: 25mm 20mm; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 11pt; line-height: 1.6; color: #18181b; }
            .header { margin-bottom: 24px; border-bottom: 2px solid #e4e4e7; padding-bottom: 16px; }
            .name { font-size: 18pt; font-weight: bold; color: #09090b; }
            .title { font-size: 12pt; color: #52525b; margin-top: 2px; }
            .contacts { font-size: 9.5pt; color: #71717a; margin-top: 6px; }
            .meta { margin-bottom: 20px; font-size: 10pt; color: #3f3f46; }
            .content { white-space: pre-line; text-align: justify; font-size: 10.5pt; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="name">${fullName}</div>
            <div class="title">${cv.personal.title || ""}</div>
            <div class="contacts">${[cv.personal.email, cv.personal.phone, cv.personal.location].filter(Boolean).join(" · ")}</div>
          </div>
          <div class="meta">
            <div><strong>Data:</strong> ${letterData.date || new Date().toLocaleDateString("ro-RO")}</div>
            <div><strong>Către:</strong> ${letterData.recipientName || "Manager de Recrutare"}</div>
            <div><strong>Companie:</strong> ${letterData.companyName || ""}</div>
            <div><strong>Rol:</strong> ${letterData.jobTitle || ""}</div>
          </div>
          <div class="content">${letterData.letterBody}</div>
          <script>window.onload = function() { window.print(); window.close(); }<\/script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div
        className={`w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden ${
          isDark ? "bg-zinc-950 text-zinc-100 border-zinc-800" : "bg-white text-zinc-900 border-zinc-200"
        }`}
      >
        {/* Modal Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${isDark ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-100 bg-zinc-50/50"}`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isDark ? "bg-cyan-950 text-cyan-400" : "bg-sky-50 text-sky-600"}`}>
              <EnvelopeOpen size={20} weight="fill" />
            </div>
            <div>
              <h2 className="text-base font-bold">Generator Scrisoare de Intenție (Cover Letter)</h2>
              <p className="text-[11.5px] text-zinc-500">
                Personalizată automat cu experiența și competențele din CV-ul tău
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form & AI Inputs */}
          <div className="lg:col-span-5 space-y-4">
            <div className={`p-3.5 rounded-xl border ${isDark ? "bg-zinc-900/50 border-zinc-800" : "bg-zinc-50 border-zinc-200"}`}>
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                Destinatar & Companie
              </span>
              <div className="space-y-2.5">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                    Compania vizată
                  </label>
                  <input
                    type="text"
                    value={letterData.companyName}
                    onChange={(e) => setLetterData({ ...letterData, companyName: e.target.value })}
                    placeholder="ex: Bitdefender, UiPath, Continental"
                    className={`w-full text-[12px] px-3 py-1.5 rounded-lg border outline-none ${
                      isDark ? "bg-zinc-950 border-zinc-800 text-zinc-200" : "bg-white border-zinc-300 text-zinc-800"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                    Titlul rolului
                  </label>
                  <input
                    type="text"
                    value={letterData.jobTitle}
                    onChange={(e) => setLetterData({ ...letterData, jobTitle: e.target.value })}
                    placeholder="ex: Senior Full-Stack Developer"
                    className={`w-full text-[12px] px-3 py-1.5 rounded-lg border outline-none ${
                      isDark ? "bg-zinc-950 border-zinc-800 text-zinc-200" : "bg-white border-zinc-300 text-zinc-800"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                    Formulă de adresare / Recrutor
                  </label>
                  <input
                    type="text"
                    value={letterData.recipientName}
                    onChange={(e) => setLetterData({ ...letterData, recipientName: e.target.value })}
                    placeholder="ex: Manager de Recrutare / Echipa HR"
                    className={`w-full text-[12px] px-3 py-1.5 rounded-lg border outline-none ${
                      isDark ? "bg-zinc-950 border-zinc-800 text-zinc-200" : "bg-white border-zinc-300 text-zinc-800"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* AI Generator box */}
            <div className={`p-3.5 rounded-xl border ${isDark ? "bg-zinc-900/50 border-zinc-800" : "bg-sky-50/50 border-sky-200"}`}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkle size={15} weight="fill" className="text-amber-500" />
                <span className="text-[11.5px] font-bold">Generare inteligentă cu Gemini AI</span>
              </div>
              <p className="text-[11px] text-zinc-500 mb-2">
                Opțional, adaugă cerințele specifice din anunț pentru o scrisoare perfect pliată pe nevoile companiei:
              </p>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={3}
                placeholder="ex: Căutăm o persoană autonomă, cu abilități puternice de comunicare și experiență în optimizare performanță..."
                className={`w-full text-[11.5px] p-2.5 rounded-lg border outline-none mb-2 ${
                  isDark ? "bg-zinc-950 border-zinc-800 text-zinc-200" : "bg-white border-zinc-300 text-zinc-800"
                }`}
              />
              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGenerateAi}
                className={`w-full py-2 px-3 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-1.5 transition ${
                  isGenerating
                    ? "opacity-60 cursor-not-allowed"
                    : isDark
                    ? "bg-cyan-500 hover:bg-cyan-400 text-zinc-950"
                    : "bg-sky-600 hover:bg-sky-500 text-white shadow-xs"
                }`}
              >
                <Sparkle size={14} weight="fill" className={isGenerating ? "animate-spin" : ""} />
                {isGenerating ? "Se redactează scrisoarea..." : "Generează scrisoarea cu AI"}
              </button>
            </div>
          </div>

          {/* Right Column: Editable Live Letter */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11.5px] font-semibold text-zinc-400">
                Textul scrisorii (Complet editabil)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg border transition ${
                    copied
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                      : isDark
                      ? "border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                      : "border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  {copied ? <Check size={12} weight="bold" /> : <Copy size={12} />}
                  {copied ? "Copiat!" : "Copiază textul"}
                </button>
                <button
                  onClick={handlePrint}
                  className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg border transition ${
                    isDark
                      ? "border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                      : "border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  <Printer size={12} />
                  Tipărește / PDF
                </button>
              </div>
            </div>

            <div
              className={`p-6 rounded-xl border flex-1 min-h-[360px] flex flex-col ${
                isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"
              }`}
            >
              {/* Paper header representation */}
              <div className="border-b pb-3 mb-4 flex justify-between items-start border-zinc-200 dark:border-zinc-800">
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{fullName}</h3>
                  <p className="text-[11px] text-zinc-500">{cv.personal.title}</p>
                </div>
                <div className="text-right text-[10.5px] text-zinc-400">
                  <p>{cv.personal.email}</p>
                  <p>{cv.personal.phone}</p>
                  <p>{cv.personal.location}</p>
                </div>
              </div>

              <textarea
                value={letterData.letterBody}
                onChange={(e) => setLetterData({ ...letterData, letterBody: e.target.value })}
                rows={14}
                className={`w-full flex-1 text-[12.5px] leading-relaxed bg-transparent border-0 outline-none resize-none ${
                  isDark ? "text-zinc-200" : "text-zinc-800"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex items-center justify-between ${isDark ? "border-zinc-800 bg-zinc-900/30" : "border-zinc-100 bg-zinc-50"}`}>
          <span className="text-[11px] text-zinc-500">
            Sfat: O scrisoare de intenție de 250-350 de cuvinte are cea mai mare rată de deschidere.
          </span>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              isDark ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200" : "bg-zinc-200 hover:bg-zinc-300 text-zinc-800"
            }`}
          >
            Finalizează & Închide
          </button>
        </div>
      </div>
    </div>
  );
}
