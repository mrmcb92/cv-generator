"use client";

import { useState } from "react";
import { ProjectItem } from "@/types/cv";
import { Theme } from "@/types/theme";
import { Trash, FolderSimple, Link as LinkIcon, GithubLogo, Sparkle, Tag } from "@phosphor-icons/react";
import { DBInput, AddButton, SectionHeader, fieldLabelClass } from "@/components/ui/fields";
import DraggableList from "@/components/ui/DraggableList";
import DateInput from "@/components/ui/DateInput";

interface Props {
  data?: ProjectItem[];
  projects?: ProjectItem[];
  onChange: (data: ProjectItem[]) => void;
  theme: Theme;
  lang?: string;
}

function newProject(): ProjectItem {
  return {
    id: crypto.randomUUID(),
    title: "",
    role: "",
    link: "",
    github: "",
    startDate: "",
    endDate: "",
    description: "",
    technologies: [],
  };
}

export default function ProjectsSection({ data, projects, onChange, theme }: Props) {
  const items = projects ?? data ?? [];
  const isDark = theme.id === "dark";
  const labelClass = fieldLabelClass(theme);
  const [loadingAiId, setLoadingAiId] = useState<string | null>(null);
  const [newTagInputs, setNewTagInputs] = useState<Record<string, string>>({});

  const addProject = () => onChange([...items, newProject()]);
  const removeProject = (id: string) => onChange(items.filter((p) => p.id !== id));

  const updateProject = (id: string, field: keyof ProjectItem, value: unknown) =>
    onChange(items.map((p) => (p.id === id ? { ...p, [field]: value } : p)));

  const handleAddTag = (projId: string) => {
    const raw = (newTagInputs[projId] || "").trim();
    if (!raw) return;
    const project = items.find((p) => p.id === projId);
    if (!project) return;
    const currentTags = project.technologies || [];
    if (!currentTags.includes(raw)) {
      updateProject(projId, "technologies", [...currentTags, raw]);
    }
    setNewTagInputs((prev) => ({ ...prev, [projId]: "" }));
  };

  const handleRemoveTag = (projId: string, tagToRemove: string) => {
    const project = items.find((p) => p.id === projId);
    if (!project) return;
    updateProject(
      projId,
      "technologies",
      (project.technologies || []).filter((t) => t !== tagToRemove)
    );
  };

  const handleAiRewrite = async (proj: ProjectItem) => {
    if (!proj.description.trim()) return;
    setLoadingAiId(proj.id);
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "rewrite_bullet",
          payload: {
            text: proj.description,
            role: proj.role || proj.title,
            company: "Proiect Portofoliu",
          },
        }),
      });
      const json = await res.json();
      if (json.result) {
        updateProject(proj.id, "description", json.result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAiId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <SectionHeader
          eyebrow="Portofoliu"
          title="Proiecte & Portofoliu"
          subtitle={`${items.length} ${items.length === 1 ? "proiect adăugat" : "proiecte adăugate"}`}
          theme={theme}
        />
        <AddButton onClick={addProject} theme={theme} />
      </div>

      {items.length === 0 && (
        <div
          className={`flex flex-col items-center justify-center py-10 rounded-2xl border border-dashed ${
            isDark ? "border-zinc-700 text-zinc-600" : "border-zinc-200 text-zinc-400"
          }`}
        >
          <FolderSimple size={30} weight="thin" className="mb-2 opacity-40" />
          <p className="text-[12px] font-medium">Niciun proiect în portofoliu</p>
          <p className="text-[11px] mt-0.5 text-zinc-500">
            Proiectele practice măresc rata de angajare cu 60%.
          </p>
          <button
            onClick={addProject}
            className={`mt-2.5 text-[11px] font-medium underline underline-offset-2 ${
              isDark ? "text-cyan-400" : "text-sky-600"
            }`}
          >
            Adaugă primul proiect
          </button>
        </div>
      )}

      <DraggableList
        items={items}
        onChange={onChange}
        getId={(p) => p.id}
        theme={theme}
        scope="projects"
        renderItem={(proj) => (
          <div
            className={`p-4 rounded-xl border space-y-3.5 ${
              isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-white/80 border-zinc-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                {proj.title || "Proiect nou"}
              </span>
              <button
                onClick={() => removeProject(proj.id)}
                className={`p-1 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition`}
                title="Șterge proiectul"
              >
                <Trash size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Nume proiect</label>
                <DBInput
                  value={proj.title}
                  onChange={(v) => updateProject(proj.id, "title", v)}
                  placeholder="ex: E-Commerce Store, PulseAnalytics"
                  theme={theme}
                />
              </div>
              <div>
                <label className={labelClass}>Rolul tău în proiect</label>
                <DBInput
                  value={proj.role || ""}
                  onChange={(v) => updateProject(proj.id, "role", v)}
                  placeholder="ex: Lead Developer, UI/UX Designer"
                  theme={theme}
                />
              </div>

              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1">
                    <LinkIcon size={10} weight="bold" /> Link Proiect / Demo Live
                  </span>
                </label>
                <DBInput
                  value={proj.link || ""}
                  onChange={(v) => updateProject(proj.id, "link", v)}
                  placeholder="https://..."
                  theme={theme}
                />
              </div>
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1">
                    <GithubLogo size={10} weight="bold" /> Repozitoriu GitHub / Sursă
                  </span>
                </label>
                <DBInput
                  value={proj.github || ""}
                  onChange={(v) => updateProject(proj.id, "github", v)}
                  placeholder="https://github.com/..."
                  theme={theme}
                />
              </div>

              <div>
                <label className={labelClass}>Data început</label>
                <DateInput
                  value={proj.startDate || ""}
                  onChange={(v) => updateProject(proj.id, "startDate", v)}
                  theme={theme}
                />
              </div>
              <div>
                <label className={labelClass}>Data finalizare</label>
                <DateInput
                  value={proj.endDate || ""}
                  onChange={(v) => updateProject(proj.id, "endDate", v)}
                  theme={theme}
                />
              </div>
            </div>

            {/* Technologies tags */}
            <div>
              <label className={labelClass}>
                <span className="flex items-center gap-1">
                  <Tag size={10} weight="bold" /> Tehnologii & Instrumente
                </span>
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2 mt-1">
                {(proj.technologies || []).map((tech) => (
                  <span
                    key={tech}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${
                      isDark
                        ? "bg-zinc-800 text-zinc-300 border border-zinc-700"
                        : "bg-zinc-100 text-zinc-700 border border-zinc-200"
                    }`}
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(proj.id, tech)}
                      className="text-zinc-400 hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTagInputs[proj.id] || ""}
                  onChange={(e) =>
                    setNewTagInputs((prev) => ({ ...prev, [proj.id]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag(proj.id);
                    }
                  }}
                  placeholder="Scrie o tehnologie (ex: React) și apasă Enter"
                  className={`flex-1 text-[12px] px-3 py-1.5 rounded-lg border outline-none transition ${
                    isDark
                      ? "bg-zinc-950 border-zinc-800 text-zinc-200 focus:border-cyan-500"
                      : "bg-white border-zinc-200 text-zinc-800 focus:border-sky-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => handleAddTag(proj.id)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition ${
                    isDark
                      ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                      : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800"
                  }`}
                >
                  Adaugă
                </button>
              </div>
            </div>

            {/* Description with AI Assistant */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelClass}>Descriere & impact</label>
                <button
                  type="button"
                  disabled={!proj.description.trim() || loadingAiId === proj.id}
                  onClick={() => handleAiRewrite(proj)}
                  className={`inline-flex items-center gap-1 text-[10.5px] font-medium px-2 py-0.5 rounded transition ${
                    loadingAiId === proj.id
                      ? "opacity-60 cursor-not-allowed"
                      : isDark
                      ? "text-cyan-400 hover:bg-cyan-500/10"
                      : "text-sky-600 hover:bg-sky-50"
                  }`}
                  title="Rescrie folosind metoda STAR cu impact cuantificabil"
                >
                  <Sparkle size={12} weight="fill" className={loadingAiId === proj.id ? "animate-spin" : ""} />
                  {loadingAiId === proj.id ? "Se optimizează..." : "Îmbunătățește cu AI"}
                </button>
              </div>
              <DBInput
                value={proj.description}
                onChange={(v) => updateProject(proj.id, "description", v)}
                placeholder="Ce problemă a rezolvat proiectul, ce arhitectură ai folosit și ce rezultate ai obținut..."
                theme={theme}
                rows={3}
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}
