"use client";

import { CVData } from "@/types/cv";

function fmt(d: string) {
  if (!d) return "";
  const [y, m] = d.split("-");
  return `${["Ian","Feb","Mar","Apr","Mai","Iun","Iul","Aug","Sep","Oct","Nov","Dec"][+m - 1]} ${y}`;
}

export default function MinimalTemplate({ data }: { data: CVData }) {
  const { personal: p, experience, education, skills, languages, drivingLicenses } = data;
  const name = `${p.firstName} ${p.lastName}`.trim() || "Nume Prenume";

  const contactParts = [p.email, p.phone, p.location, p.website, p.linkedin].filter(Boolean);

  return (
    <div
      id="cv-preview"
      className="bg-white w-full max-w-[210mm] mx-auto font-sans text-gray-800"
      style={{ minHeight: "297mm", fontSize: "11px", lineHeight: "1.6", padding: "40px 48px" }}
    >
      {/* Name */}
      <h1 className="text-[32px] font-light tracking-[-0.02em] text-zinc-900 leading-none">{name}</h1>

      {/* Contact line */}
      {contactParts.length > 0 && (
        <p className="mt-2 text-[10.5px] text-zinc-400 tracking-wide">
          {contactParts.join("  ·  ")}
        </p>
      )}

      {/* Thin rule */}
      <div className="mt-5 mb-6 h-px bg-zinc-200" />

      {p.summary && (
        <section className="mb-6">
          <p className="text-[11px] text-zinc-600 leading-relaxed max-w-[90%]">{p.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400 mb-3">Experiență</h2>
          <div className="space-y-4">
            {experience.map(e => (
              <div key={e.id}>
                {e.company && <p className="font-semibold text-[11.5px] text-zinc-900 mb-1">{e.company}</p>}
                <div className="space-y-3 pl-3 border-l border-zinc-200">
                  {e.positions.map(pos => (
                    <div key={pos.id} className="grid grid-cols-[1fr_auto] gap-x-6">
                      <div>
                        <p className="font-medium text-[11px] text-zinc-700">{pos.title}</p>
                        {pos.description && <p className="mt-1 text-[10.5px] text-zinc-600 leading-relaxed">{pos.description}</p>}
                      </div>
                      <p className="text-[10px] text-zinc-400 whitespace-nowrap pt-0.5 text-right">
                        {fmt(pos.startDate)}<br/>{pos.current ? "Prezent" : fmt(pos.endDate)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400 mb-3">Educație</h2>
          <div className="space-y-3">
            {education.map(e => (
              <div key={e.id} className="grid grid-cols-[1fr_auto] gap-x-6">
                <div>
                  <p className="font-semibold text-[11.5px] text-zinc-900">
                    {e.degree}{e.field && `, ${e.field}`}
                  </p>
                  {e.institution && <p className="text-[10.5px] text-zinc-500">{e.institution}</p>}
                </div>
                <p className="text-[10px] text-zinc-400 whitespace-nowrap pt-0.5 text-right">
                  {fmt(e.startDate)}<br/>{fmt(e.endDate)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {(skills.length > 0 || languages.length > 0) && (
        <section>
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400 mb-3">Competențe & Limbi</h2>
          <div className="flex flex-wrap gap-x-8 gap-y-1">
            {skills.map(s => (
              <span key={s.id} className="text-[11px] text-zinc-700">
                {s.name} <span className="text-zinc-400">— {s.level}</span>
              </span>
            ))}
            {languages.map(l => (
              <span key={l.id} className="text-[11px] text-zinc-700">
                {l.name} <span className="text-zinc-400">— {l.level}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {drivingLicenses.length > 0 && (
        <section className="mt-6">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400 mb-3">Permis de conducere</h2>
          <div className="flex flex-wrap gap-x-8 gap-y-1">
            {drivingLicenses.map(d => (
              <span key={d.id} className="text-[11px] text-zinc-700">
                Categoria {d.category}{d.year && <span className="text-zinc-400"> — {d.year}</span>}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
