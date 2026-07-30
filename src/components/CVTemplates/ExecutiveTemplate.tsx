import React from 'react';
import { CVData } from '@/types/cv';
import { CV_LABELS, CvLang, fmtDate } from '@/lib/cvLabels';

interface ExecutiveTemplateProps {
  data: CVData;
  lang?: CvLang;
}

export const ExecutiveTemplate: React.FC<ExecutiveTemplateProps> = ({ data, lang = "ro" }) => {
  const { personal, experience, education, skills, languages, drivingLicenses, customSections } = data;
  const L = CV_LABELS[lang];
  const fullName = [personal.firstName, personal.lastName].filter(Boolean).join(' ') || 'Nume Prenume';
  const accent = "#b91c1c";

  return (
    <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white p-[8mm] text-[10px] text-gray-800 leading-snug shadow-sm print:shadow-none print:p-0">
      {/* Top accent stripe */}
      <div className="h-[3px] mb-3 rounded-sm" style={{ background: accent }} />

      {/* Header: Name huge, title below, contact on one line */}
      <header className="mb-3">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight leading-tight">
          {fullName}
        </h1>
        {personal.title && (
          <p className="text-sm font-medium text-gray-700 mt-0.5 mb-1.5">
            {personal.title}
          </p>
        )}
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-gray-600">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.website && <span>{personal.website}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
        </div>
      </header>

      {/* Summary — tight paragraph */}
      {personal.summary && (
        <section className="mb-3">
          <p className="text-[10px] text-gray-700 leading-snug text-justify">
            {personal.summary}
          </p>
        </section>
      )}

      {/* Experience — company + title on one line, date right-aligned */}
      {experience.length > 0 && (
        <section className="mb-3">
          <h2 className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1.5"
            style={{ color: accent }}>
            {L.experience}
          </h2>
          <div className="space-y-2">
            {experience.map((exp) => (
              <div key={exp.id} className="break-inside-avoid">
                {exp.positions.map((pos) => (
                  <div key={pos.id} className="mb-1.5">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-gray-900 text-[10px]">
                        {exp.company}{pos.title ? ` — ${pos.title}` : ""}
                      </span>
                      <span className="text-[9px] text-gray-500 whitespace-nowrap ml-2">
                        {fmtDate(pos.startDate, lang)} – {pos.current ? L.present : fmtDate(pos.endDate, lang)}
                      </span>
                    </div>
                    {pos.description && (
                      <p className="text-[10px] text-gray-700 leading-snug mt-0.5 whitespace-pre-line text-justify">
                        {pos.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education — one line per entry */}
      {education.length > 0 && (
        <section className="mb-3">
          <h2 className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1.5"
            style={{ color: accent }}>
            {L.education}
          </h2>
          <div className="space-y-1">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <span className="text-[10px] text-gray-800">
                  <span className="font-semibold">{edu.institution}</span>
                  {edu.degree ? ` — ${edu.degree}` : ""}
                  {edu.field ? `, ${edu.field}` : ""}
                </span>
                <span className="text-[9px] text-gray-500 whitespace-nowrap ml-2">
                  {fmtDate(edu.startDate, lang)} – {edu.endDate ? fmtDate(edu.endDate, lang) : L.present}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills — comma-separated inline */}
      {skills.length > 0 && (
        <section className="mb-3">
          <h2 className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1"
            style={{ color: accent }}>
            {L.skills}
          </h2>
          <p className="text-[10px] text-gray-800 leading-snug">
            {skills.map((s) => s.name).join(", ")}
          </p>
        </section>
      )}

      {/* Languages — comma-separated inline */}
      {languages.length > 0 && (
        <section className="mb-3">
          <h2 className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1"
            style={{ color: accent }}>
            {L.languages}
          </h2>
          <p className="text-[10px] text-gray-800 leading-snug">
            {languages.map((l) => `${l.name} (${l.level})`).join(", ")}
          </p>
        </section>
      )}

      {/* Driving licenses — inline */}
      {drivingLicenses.length > 0 && (
        <section className="mb-3">
          <h2 className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1"
            style={{ color: accent }}>
            {L.driving}
          </h2>
          <p className="text-[10px] text-gray-800 leading-snug">
            {drivingLicenses.map((d) => `${L.category} ${d.category}${d.year ? ` (${d.year})` : ""}`).join(", ")}
          </p>
        </section>
      )}

      {/* Custom sections — minimal */}
      {customSections.map((section) => (
        <section key={section.id} className="mb-3 break-inside-avoid">
          <h2 className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1"
            style={{ color: accent }}>
            {section.title}
          </h2>
          <div className="space-y-1.5">
            {section.items.map((item) => (
              <div key={item.id}>
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-semibold text-gray-900">
                    {item.name}{item.subtitle ? ` · ${item.subtitle}` : ""}
                  </span>
                  {item.date && (
                    <span className="text-[9px] text-gray-500">{item.date}</span>
                  )}
                </div>
                {item.description && (
                  <p className="text-[10px] text-gray-700 leading-snug mt-0.5 whitespace-pre-line text-justify">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};