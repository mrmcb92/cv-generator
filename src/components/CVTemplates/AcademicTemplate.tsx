import React from 'react';
import { CVData } from '@/types/cv';
import { CV_LABELS, CvLang, fmtDate } from '@/lib/cvLabels';

interface AcademicTemplateProps {
  data: CVData;
  lang?: CvLang;
}

export const AcademicTemplate: React.FC<AcademicTemplateProps> = ({ data, lang = "ro" }) => {
  const { personal, experience, education, skills, languages, drivingLicenses, customSections } = data;
  const L = CV_LABELS[lang];
  const fullName = [personal.firstName, personal.lastName].filter(Boolean).join(' ') || 'Nume Prenume';
  const accent = "#6d28d9";

  return (
    <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white p-[12mm] font-serif text-sm leading-relaxed shadow-sm print:shadow-none print:p-0">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
          {fullName}
        </h1>
        {personal.title && (
          <p className="text-base font-medium text-gray-700 mt-0.5 mb-3">
            {personal.title}
          </p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 border-b pb-3 mb-0"
          style={{ borderColor: `${accent}30` }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.website && <span>{personal.website}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
        </div>
      </header>

      {/* Summary — italic blockquote with purple left border */}
      {personal.summary && (
        <section className="mb-6">
          <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2"
            style={{ color: accent }}>
            {L.profileLong}
          </h2>
          <blockquote className="italic text-gray-700 text-justify leading-relaxed pl-3 border-l-2"
            style={{ borderColor: accent }}>
            {personal.summary}
          </blockquote>
        </section>
      )}

      {/* Education — emphasized, more prominent */}
      {education.length > 0 && (
        <section className="mb-6 break-inside-avoid">
          <h2 className="text-[10px] font-bold uppercase tracking-widest mb-3"
            style={{ color: accent }}>
            {L.education}
          </h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-gray-900 text-base">
                    {edu.institution}
                  </h3>
                  <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap ml-2">
                    {fmtDate(edu.startDate, lang)} – {edu.endDate ? fmtDate(edu.endDate, lang) : L.present}
                  </span>
                </div>
                <p className="text-sm text-gray-700 font-medium mt-0.5">
                  {edu.degree}{edu.field ? ` în ${edu.field}` : ""}
                  {edu.gpa ? ` — GPA: ${edu.gpa}` : ""}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience — as 'Research' entries */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[10px] font-bold uppercase tracking-widest mb-3"
            style={{ color: accent }}>
            {L.experience}
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="break-inside-avoid">
                {exp.company && (
                  <h3 className="font-bold text-gray-800 text-sm mb-1">{exp.company}</h3>
                )}
                {exp.positions.map((pos) => (
                  <div key={pos.id} className="ml-2 pl-3 mb-2"
                    style={{ borderLeft: `1.5px solid ${accent}40` }}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-gray-800 text-sm">{pos.title}</span>
                      <span className="text-[10px] text-gray-500 font-medium">
                        {fmtDate(pos.startDate, lang)} – {pos.current ? L.present : fmtDate(pos.endDate, lang)}
                      </span>
                    </div>
                    {pos.description && (
                      <p className="text-xs text-gray-700 leading-relaxed mt-0.5 whitespace-pre-line text-justify">
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

      {/* Skills — compact list */}
      {skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2"
            style={{ color: accent }}>
            {L.skills}
          </h2>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {skills.map((skill) => (
              <span key={skill.id} className="text-xs text-gray-800">
                {skill.name} <span className="text-gray-400">– {skill.level}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2"
            style={{ color: accent }}>
            {L.languages}
          </h2>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {languages.map((l) => (
              <span key={l.id} className="text-xs text-gray-800">
                {l.name} <span className="text-gray-400">– {l.level}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Driving licenses */}
      {drivingLicenses.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2"
            style={{ color: accent }}>
            {L.driving}
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-800">
            {drivingLicenses.map((d) => (
              <span key={d.id}>{L.category} {d.category}{d.year ? ` (${d.year})` : ""}</span>
            ))}
          </div>
        </section>
      )}

      {/* Custom sections */}
      {customSections.map((section) => (
        <section key={section.id} className="mb-5 break-inside-avoid">
          <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2"
            style={{ color: accent }}>
            {section.title}
          </h2>
          <div className="space-y-3">
            {section.items.map((item) => (
              <div key={item.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-gray-900 text-xs">
                    {item.name}{item.subtitle ? ` · ${item.subtitle}` : ""}
                  </h3>
                  {item.date && (
                    <span className="text-[10px] text-gray-500">{item.date}</span>
                  )}
                </div>
                {item.description && (
                  <p className="text-xs text-gray-700 leading-relaxed mt-0.5 whitespace-pre-line text-justify">
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