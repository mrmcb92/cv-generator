"use client";

import { CVData } from "@/types/cv";
import { EnvelopeSimple as Mail, Phone, MapPin, Globe, LinkSimple as Link2 } from "@phosphor-icons/react";

import { CV_LABELS, CvLang, fmtDate } from "@/lib/cvLabels";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-5">
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-1 h-4 bg-sky-500 rounded-full flex-shrink-0" />
        <h2 className="text-[10px] font-bold uppercase tracking-[0.16em] text-sky-600">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function CreativeTemplate({ data, lang = "ro" }: { data: CVData; lang?: CvLang }) {
  const { personal: p, experience, education, skills, languages, drivingLicenses, customSections } = data;
  const L = CV_LABELS[lang];
  const fmt = (d: string) => fmtDate(d, lang);

  return (
    <div
      id="cv-preview"
      className="bg-white w-full max-w-[210mm] mx-auto font-sans text-gray-800"
      style={{ minHeight: "297mm", fontSize: "11px", lineHeight: "1.5" }}
    >
      {/* Top accent stripe */}
      <div className="h-1.5 bg-gradient-to-r from-sky-500 via-sky-400 to-cyan-300" />

      {/* Header */}
      <div className="px-8 pt-6 pb-5 border-b border-gray-100">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[30px] font-black tracking-tight leading-none text-zinc-900">
              <span className="text-sky-500">{p.firstName || "Prenume"}</span>
              {p.lastName && <span className="text-zinc-800"> {p.lastName}</span>}
            </h1>
          </div>
          {/* Contact cluster + photo */}
          <div className="flex items-center gap-4">
          {p.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.photo} alt="" className="w-16 h-16 rounded-full object-cover ring-2 ring-sky-200 order-2 flex-shrink-0" />
          )}
          <div className="text-right text-[10px] text-zinc-500 space-y-0.5 order-1">
            {p.email    && <div className="flex items-center justify-end gap-1"><span>{p.email}</span><Mail size={10} className="text-sky-400"/></div>}
            {p.phone    && <div className="flex items-center justify-end gap-1"><span>{p.phone}</span><Phone size={10} className="text-sky-400"/></div>}
            {p.location && <div className="flex items-center justify-end gap-1"><span>{p.location}</span><MapPin size={10} className="text-sky-400"/></div>}
            {p.website  && <div className="flex items-center justify-end gap-1"><span>{p.website}</span><Globe size={10} className="text-sky-400"/></div>}
            {p.linkedin && <div className="flex items-center justify-end gap-1"><span>{p.linkedin}</span><Link2 size={10} className="text-sky-400"/></div>}
          </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-8 py-5">
        {p.summary && (
          <section className="mb-5">
            <p className="text-[11px] text-zinc-600 leading-relaxed border-l-4 border-sky-100 pl-3 italic">
              {p.summary}
            </p>
          </section>
        )}

        {experience.length > 0 && (
          <Section title={L.experience}>
            <div className="space-y-4">
              {experience.map((e) => (
                <div key={e.id} className="relative pl-4">
                  <div className="absolute left-0 top-[5px] w-1.5 h-1.5 rounded-full bg-sky-400" />
                  {e.company && <p className="font-semibold text-[11px] text-sky-500 mb-1.5">{e.company}</p>}
                  <div className="space-y-2.5 pl-3 border-l border-sky-100">
                    {e.positions.map(pos => (
                      <div key={pos.id}>
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold text-[11px] text-zinc-900">{pos.title}</span>
                          <span className="text-[9.5px] text-zinc-400 bg-zinc-50 px-1.5 py-0.5 rounded whitespace-nowrap ml-3">
                            {fmt(pos.startDate)} – {pos.current ? L.present : fmt(pos.endDate)}
                          </span>
                        </div>
                        {pos.description && <p className="text-[10.5px] text-zinc-600 mt-0.5 leading-relaxed">{pos.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {education.length > 0 && (
          <Section title={L.education}>
            <div className="space-y-2.5">
              {education.map(e => (
                <div key={e.id} className="flex justify-between items-start bg-zinc-50 rounded-lg px-3 py-2">
                  <div>
                    <p className="font-bold text-[11px] text-zinc-900">
                      {e.degree}{e.field && <span className="font-normal text-zinc-500"> · {e.field}</span>}
                    </p>
                    {e.institution && <p className="text-[10.5px] text-sky-600">{e.institution}</p>}
                  </div>
                  <p className="text-[9.5px] text-zinc-400 whitespace-nowrap ml-4 pt-0.5">
                    {fmt(e.startDate)} – {fmt(e.endDate)}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {(skills.length > 0 || languages.length > 0) && (
          <div className="grid grid-cols-2 gap-6">
            {skills.length > 0 && (
              <Section title={L.skills}>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map(s => (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-sky-50 text-sky-700 border border-sky-100"
                    >
                      {s.name}
                      <span className="text-sky-400 text-[9px]">{s.level}</span>
                    </span>
                  ))}
                </div>
              </Section>
            )}
            {languages.length > 0 && (
              <Section title={L.languages}>
                <div className="space-y-1">
                  {languages.map(l => (
                    <div key={l.id} className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-700">{l.name}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-500 text-white">{l.level}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        )}

        {customSections.filter(cs => cs.title && cs.items.length > 0).map(cs => (
          <div key={cs.id} className="mt-5">
            <Section title={cs.title}>
              <div className="space-y-2.5">
                {cs.items.map(it => (
                  <div key={it.id} className="relative pl-4">
                    <div className="absolute left-0 top-[5px] w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-[11px] text-zinc-900">{it.name}{it.subtitle && <span className="font-normal text-sky-600"> · {it.subtitle}</span>}</span>
                      {it.date && <span className="text-[9.5px] text-zinc-400 bg-zinc-50 px-1.5 py-0.5 rounded whitespace-nowrap ml-3">{it.date}</span>}
                    </div>
                    {it.description && <p className="text-[10.5px] text-zinc-600 mt-0.5 leading-relaxed">{it.description}</p>}
                  </div>
                ))}
              </div>
            </Section>
          </div>
        ))}

        {drivingLicenses.length > 0 && (
          <div className="mt-5">
            <Section title={L.driving}>
              <div className="flex flex-wrap gap-1.5">
                {drivingLicenses.map(d => (
                  <span
                    key={d.id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-sky-50 text-sky-700 border border-sky-100"
                  >
                    {L.category} {d.category}
                    {d.year && <span className="text-sky-400 text-[9px]">{d.year}</span>}
                  </span>
                ))}
              </div>
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}
