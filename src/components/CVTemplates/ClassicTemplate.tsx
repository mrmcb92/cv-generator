"use client";

import { CVData } from "@/types/cv";
import { EnvelopeSimple as Mail, Phone, MapPin, Globe, LinkSimple as Link2 } from "@phosphor-icons/react";

import { fmtDate as fmt } from "@/lib/format";

export default function ClassicTemplate({ data }: { data: CVData }) {
  const { personal: p, experience, education, skills, languages, drivingLicenses } = data;
  const name = `${p.firstName} ${p.lastName}`.trim() || "Nume Prenume";

  return (
    <div
      id="cv-preview"
      className="bg-white w-full max-w-[210mm] mx-auto font-sans text-gray-800"
      style={{ minHeight: "297mm", fontSize: "11px", lineHeight: "1.5" }}
    >
      {/* Header */}
      <div className="bg-slate-800 text-white px-8 py-7">
        <h1 className="text-[28px] font-bold tracking-wide leading-tight">{name}</h1>
        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-slate-300 text-[11px]">
          {p.email    && <span className="flex items-center gap-1"><Mail size={11}/>{p.email}</span>}
          {p.phone    && <span className="flex items-center gap-1"><Phone size={11}/>{p.phone}</span>}
          {p.location && <span className="flex items-center gap-1"><MapPin size={11}/>{p.location}</span>}
          {p.website  && <span className="flex items-center gap-1"><Globe size={11}/>{p.website}</span>}
          {p.linkedin && <span className="flex items-center gap-1"><Link2 size={11}/>{p.linkedin}</span>}
        </div>
      </div>

      <div className="px-8 py-6 space-y-5">
        {p.summary && (
          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 border-b border-slate-200 pb-1 mb-2">Profil</h2>
            <p className="text-[11px] text-gray-700 leading-relaxed">{p.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 border-b border-slate-200 pb-1 mb-3">Experiență profesională</h2>
            <div className="space-y-4">
              {experience.map(e => (
                <div key={e.id}>
                  {e.company && <p className="font-bold text-[11px] text-slate-800 mb-1.5">{e.company}</p>}
                  <div className="space-y-2.5 pl-3 border-l-2 border-slate-100">
                    {e.positions.map(pos => (
                      <div key={pos.id}>
                        <div className="flex justify-between items-baseline">
                          <span className="font-semibold text-[11px]">{pos.title}</span>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap ml-4">
                            {fmt(pos.startDate)} – {pos.current ? "Prezent" : fmt(pos.endDate)}
                          </span>
                        </div>
                        {pos.description && <p className="text-[10.5px] text-gray-600 mt-0.5 leading-relaxed">{pos.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 border-b border-slate-200 pb-1 mb-3">Educație</h2>
            <div className="space-y-2.5">
              {education.map(e => (
                <div key={e.id} className="flex justify-between items-baseline">
                  <div>
                    <span className="font-semibold text-[11px]">{e.degree}{e.field && ` în ${e.field}`}</span>
                    {e.institution && <span className="text-slate-500 text-[11px] ml-1.5">· {e.institution}</span>}
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap ml-4">
                    {fmt(e.startDate)} – {fmt(e.endDate)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {(skills.length > 0 || languages.length > 0) && (
          <div className="grid grid-cols-2 gap-6">
            {skills.length > 0 && (
              <section>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 border-b border-slate-200 pb-1 mb-2">Competențe</h2>
                <div className="space-y-1">
                  {skills.map(s => (
                    <div key={s.id} className="flex justify-between text-[11px]">
                      <span>{s.name}</span>
                      <span className="text-slate-400">{s.level}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {languages.length > 0 && (
              <section>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 border-b border-slate-200 pb-1 mb-2">Limbi străine</h2>
                <div className="space-y-1">
                  {languages.map(l => (
                    <div key={l.id} className="flex justify-between text-[11px]">
                      <span>{l.name}</span>
                      <span className="text-slate-400">{l.level}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {drivingLicenses.length > 0 && (
          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 border-b border-slate-200 pb-1 mb-2">Permis de conducere</h2>
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              {drivingLicenses.map(d => (
                <span key={d.id} className="text-[11px]">
                  <span className="font-semibold">Categoria {d.category}</span>
                  {d.year && <span className="text-slate-400"> · {d.year}</span>}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
