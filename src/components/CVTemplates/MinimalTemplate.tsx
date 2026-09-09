import React from 'react';
import { CVData } from '@/types/cv';
import { CV_LABELS, CvLang, fmtDate } from '@/lib/cvLabels';

interface MinimalTemplateProps {
  data: CVData;
  lang?: CvLang;
}

export const MinimalTemplate: React.FC<MinimalTemplateProps> = ({ data, lang = "ro" }) => {
  const {
    personal,
    experience,
    education,
    skills,
    languages,
    drivingLicenses,
    projects = [],
    certifications = [],
    customSections = [],
    density = "normal",
  } = data;
  const L = CV_LABELS[lang];
  const fullName = [personal.firstName, personal.lastName].filter(Boolean).join(' ') || 'Nume Prenume';

  const pad = density === "compact" ? "p-[10mm]" : density === "spacious" ? "p-[18mm]" : "p-[15mm]";
  const mb = density === "compact" ? "mb-4" : density === "spacious" ? "mb-9" : "mb-7";

  return (
    <div className={`max-w-[210mm] min-h-[297mm] mx-auto bg-white text-neutral-800 font-sans text-xs leading-relaxed shadow-sm print:shadow-none print:p-0 ${pad}`}>
      {/* Header */}
      <header className={mb}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-light text-neutral-900 tracking-tight mb-1">
              {fullName}
            </h1>
            {personal.title && (
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-3">
                {personal.title}
              </p>
            )}
          </div>
          {personal.photo && personal.showPhoto !== false && (
            <div className="w-16 h-16 rounded-full overflow-hidden border border-neutral-300 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={personal.photo} alt={fullName} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-neutral-500 border-t border-neutral-200 pt-2">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.website && <span>{personal.website}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
        </div>
      </header>

      {/* Summary */}
      {personal.summary && (
        <section className={mb}>
          <p className="text-neutral-700 leading-relaxed text-justify">{personal.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className={mb}>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-4">
            {L.experienceShort}
          </h2>
          <div className="space-y-5">
            {experience.map((exp) => (
              <div key={exp.id} className="break-inside-avoid">
                {exp.company && (
                  <div className="text-[11px] text-neutral-400 font-medium mb-2">{exp.company}</div>
                )}
                {exp.positions.map((pos) => (
                  <div key={pos.id} className="grid grid-cols-4 gap-4 mb-3">
                    <div className="col-span-1 text-[11px] text-neutral-400 font-medium">
                      {fmtDate(pos.startDate, lang)}{"\n"}– {pos.current ? L.present : fmtDate(pos.endDate, lang)}
                    </div>
                    <div className="col-span-3">
                      <h3 className="font-semibold text-neutral-900">{pos.title}</h3>
                      {pos.description && (
                        <p className="text-neutral-600 whitespace-pre-line text-justify leading-relaxed mt-0.5">
                          {pos.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className={mb}>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-4">
            {L.projects}
          </h2>
          <div className="space-y-3.5">
            {projects.map((proj) => (
              <div key={proj.id} className="break-inside-avoid grid grid-cols-4 gap-4">
                <div className="col-span-1 text-[11px] text-neutral-400 font-medium">
                  {proj.startDate ? fmtDate(proj.startDate, lang) : ""} {proj.endDate ? `– ${fmtDate(proj.endDate, lang)}` : ""}
                </div>
                <div className="col-span-3">
                  <h3 className="font-semibold text-neutral-900">
                    {proj.title} {proj.role ? <span className="font-normal text-neutral-500">· {proj.role}</span> : ""}
                  </h3>
                  {proj.description && (
                    <p className="text-neutral-600 whitespace-pre-line leading-relaxed mt-0.5">
                      {proj.description}
                    </p>
                  )}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <p className="text-[10.5px] text-neutral-400 mt-1">
                      {proj.technologies.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className={mb}>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-4">
            {L.education}
          </h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="break-inside-avoid grid grid-cols-4 gap-4">
                <div className="col-span-1 text-[11px] text-neutral-400 font-medium">
                  {fmtDate(edu.startDate, lang)} – {fmtDate(edu.endDate, lang)}
                </div>
                <div className="col-span-3">
                  <h3 className="font-semibold text-neutral-900">
                    {edu.degree}{edu.field ? `, ${edu.field}` : ""}
                  </h3>
                  <div className="text-neutral-500 font-medium">
                    {edu.institution}
                    {edu.gpa && <span className="font-normal text-neutral-400"> · Medie: {edu.gpa}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className={mb}>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-3">
            {L.certifications}
          </h2>
          <div className="space-y-2">
            {certifications.map((c) => (
              <div key={c.id} className="grid grid-cols-4 gap-4 text-neutral-700">
                <div className="col-span-1 text-[11px] text-neutral-400 font-medium">
                  {c.issueDate ? fmtDate(c.issueDate, lang) : ""}
                </div>
                <div className="col-span-3">
                  <span className="font-semibold text-neutral-900">{c.name}</span>
                  {c.issuer ? <span className="text-neutral-500"> · {c.issuer}</span> : ""}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Languages combo */}
      {(skills.length > 0 || languages.length > 0) && (
        <section className={mb}>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-3">
            {L.skillsAndLangs}
          </h2>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {skills.map((s) => (
              <span key={s.id} className="text-neutral-700 text-[11px]">
                {s.name} <span className="text-neutral-400">– {s.level}</span>
              </span>
            ))}
            {languages.map((l) => (
              <span key={l.id} className="text-neutral-700 text-[11px]">
                {l.name} <span className="text-neutral-400">– {l.level}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Driving licenses */}
      {drivingLicenses.length > 0 && (
        <section className={mb}>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-3">
            {L.driving}
          </h2>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-neutral-700">
            {drivingLicenses.map((d) => (
              <span key={d.id}>{L.category} {d.category}{d.year ? ` (${d.year})` : ""}</span>
            ))}
          </div>
        </section>
      )}

      {/* Custom sections */}
      {customSections.map((section) => (
        <section key={section.id} className={`${mb} break-inside-avoid`}>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-3">
            {section.title}
          </h2>
          <div className="space-y-3">
            {section.items.map((item) => (
              <div key={item.id} className="grid grid-cols-4 gap-4">
                <div className="col-span-1 text-[11px] text-neutral-400 font-medium">
                  {item.date || ""}
                </div>
                <div className="col-span-3">
                  <h3 className="font-semibold text-neutral-900">
                    {item.name}{item.subtitle ? `, ${item.subtitle}` : ""}
                  </h3>
                  {item.description && (
                    <p className="text-neutral-600 whitespace-pre-line leading-relaxed mt-0.5">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
