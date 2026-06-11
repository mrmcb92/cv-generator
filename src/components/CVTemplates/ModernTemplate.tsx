"use client";

import { CVData } from "@/types/cv";
import { EnvelopeSimple as Mail, Phone, MapPin, Globe, LinkSimple as Link2 } from "@phosphor-icons/react";

import { CV_LABELS, CvLang, fmtDate } from "@/lib/cvLabels";

function SideLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[9px] font-bold uppercase tracking-[0.16em] text-sky-300 mt-4 mb-1.5 first:mt-0">{children}</h3>
  );
}

function BodyLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-sky-700 border-b-2 border-sky-100 pb-1 mb-2.5">{children}</h2>
  );
}

export default function ModernTemplate({ data, lang = "ro" }: { data: CVData; lang?: CvLang }) {
  const { personal: p, experience, education, skills, languages, drivingLicenses, customSections } = data;
  const L = CV_LABELS[lang];
  const fmt = (d: string) => fmtDate(d, lang);

  return (
    <div
      id="cv-preview"
      className="bg-white w-full max-w-[210mm] mx-auto font-sans text-gray-800 flex"
      style={{ minHeight: "297mm", fontSize: "11px", lineHeight: "1.5" }}
    >
      {/* ── LEFT SIDEBAR ── */}
      <div className="w-[35%] bg-slate-800 text-white flex-shrink-0 px-5 py-7">
        {/* Photo */}
        {p.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.photo} alt="" className="w-20 h-20 rounded-full object-cover ring-2 ring-sky-400/40 mb-4" />
        )}

        {/* Name */}
        <div className="mb-5">
          <div className="text-[22px] font-bold leading-tight tracking-tight">
            <span className="text-sky-300">{p.firstName || "Prenume"}</span>
            <br />
            <span className="text-white">{p.lastName || "Nume"}</span>
          </div>
        </div>

        {/* Contact */}
        <SideLabel>Contact</SideLabel>
        <div className="space-y-1.5 text-[10px] text-slate-300">
          {p.email    && <div className="flex items-start gap-1.5"><Mail size={10} className="mt-0.5 flex-shrink-0 text-sky-400"/>{p.email}</div>}
          {p.phone    && <div className="flex items-start gap-1.5"><Phone size={10} className="mt-0.5 flex-shrink-0 text-sky-400"/>{p.phone}</div>}
          {p.location && <div className="flex items-start gap-1.5"><MapPin size={10} className="mt-0.5 flex-shrink-0 text-sky-400"/>{p.location}</div>}
          {p.website  && <div className="flex items-start gap-1.5"><Globe size={10} className="mt-0.5 flex-shrink-0 text-sky-400"/>{p.website}</div>}
          {p.linkedin && <div className="flex items-start gap-1.5"><Link2 size={10} className="mt-0.5 flex-shrink-0 text-sky-400"/>{p.linkedin}</div>}
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <>
            <SideLabel>{L.skills}</SideLabel>
            <div className="space-y-1.5">
              {skills.map(s => (
                <div key={s.id}>
                  <div className="flex justify-between text-[10px] text-slate-300 mb-0.5">
                    <span>{s.name}</span>
                    <span className="text-slate-400 text-[9px]">{s.level}</span>
                  </div>
                  {/* Level bar */}
                  <div className="w-full h-0.5 bg-slate-700 rounded-full">
                    <div
                      className="h-0.5 bg-sky-400 rounded-full"
                      style={{ width: s.level === "Expert" ? "100%" : s.level === "Avansat" ? "75%" : s.level === "Mediu" ? "50%" : "25%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <>
            <SideLabel>{L.languages}</SideLabel>
            <div className="space-y-1">
              {languages.map(l => (
                <div key={l.id} className="flex justify-between text-[10px] text-slate-300">
                  <span>{l.name}</span>
                  <span className="text-sky-400 font-semibold text-[9px]">{l.level}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Driving licenses */}
        {drivingLicenses.length > 0 && (
          <>
            <SideLabel>{L.driving}</SideLabel>
            <div className="space-y-1">
              {drivingLicenses.map(d => (
                <div key={d.id} className="flex justify-between text-[10px] text-slate-300">
                  <span>{L.category} {d.category}</span>
                  {d.year && <span className="text-sky-400 font-semibold text-[9px]">{d.year}</span>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── RIGHT CONTENT ── */}
      <div className="flex-1 px-6 py-7 space-y-5" style={{ backgroundColor: "#f1f5f9" }}>
        {p.summary && (
          <section>
            <BodyLabel>{L.profileLong}</BodyLabel>
            <p className="text-[11px] text-gray-600 leading-relaxed">{p.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section>
            <BodyLabel>{L.experience}</BodyLabel>
            <div className="space-y-4">
              {experience.map(e => (
                <div key={e.id}>
                  {e.company && <p className="font-bold text-[11px] text-slate-800 mb-1.5">{e.company}</p>}
                  <div className="space-y-2.5 pl-3 border-l-2 border-sky-100">
                    {e.positions.map(pos => (
                      <div key={pos.id}>
                        <div className="flex justify-between items-baseline">
                          <span className="font-semibold text-[11px] text-slate-700">{pos.title}</span>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap ml-3">
                            {fmt(pos.startDate)} – {pos.current ? L.present : fmt(pos.endDate)}
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
            <BodyLabel>{L.education}</BodyLabel>
            <div className="space-y-3">
              {education.map(e => (
                <div key={e.id} className="relative pl-3 border-l-2 border-sky-100">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-[11px] text-slate-800">
                      {e.degree}{e.field && ` · ${e.field}`}
                    </span>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap ml-3">
                      {fmt(e.startDate)} – {fmt(e.endDate)}
                    </span>
                  </div>
                  {e.institution && <p className="text-[10.5px] text-sky-600 font-medium">{e.institution}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {customSections.filter(cs => cs.title && cs.items.length > 0).map(cs => (
          <section key={cs.id}>
            <BodyLabel>{cs.title}</BodyLabel>
            <div className="space-y-2.5">
              {cs.items.map(it => (
                <div key={it.id} className="relative pl-3 border-l-2 border-sky-100">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-[11px] text-slate-800">{it.name}</span>
                    {it.date && <span className="text-[10px] text-slate-400 whitespace-nowrap ml-3">{it.date}</span>}
                  </div>
                  {it.subtitle && <p className="text-[10.5px] text-sky-600 font-medium">{it.subtitle}</p>}
                  {it.description && <p className="text-[10.5px] text-gray-600 mt-0.5 leading-relaxed">{it.description}</p>}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
