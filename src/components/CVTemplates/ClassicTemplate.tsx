import React from 'react';
import { CVData } from '@/types/cv';
import { CV_LABELS, CvLang, fmtDate } from '@/lib/cvLabels';

interface ClassicTemplateProps {
  data: CVData;
  lang?: CvLang;
}

export const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ data, lang = "ro" }) => {
  const { personal, experience, education, skills, languages, drivingLicenses, customSections } = data;
  const L = CV_LABELS[lang];
  const fullName = [personal.firstName, personal.lastName].filter(Boolean).join(' ') || 'Nume Prenume';

  return (
    <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white p-[15mm] text-gray-900 font-serif text-sm leading-relaxed shadow-sm print:shadow-none print:p-0">
      {/* Header */}
      <header className="border-b-2 border-gray-800 pb-4 mb-6 text-center">
        <h1 className="text-3xl font-bold uppercase tracking-wider text-gray-900 mb-1">
          {fullName}
        </h1>
        {personal.title && (
          <p className="text-base font-medium text-gray-700 mb-2">
            {personal.title}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-600">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>• {personal.phone}</span>}
          {personal.location && <span>• {personal.location}</span>}
          {personal.website && <span>• {personal.website}</span>}
        </div>
      </header>

      {/* Summary */}
      {personal.summary && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2">
            {L.profileLong}
          </h2>
          <p className="text-justify text-gray-700 leading-normal">{personal.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3">
            {L.experience}
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="break-inside-avoid">
                {exp.company && (
                  <h3 className="font-bold text-gray-900 mb-1">{exp.company}</h3>
                )}
                {exp.positions.map((pos) => (
                  <div key={pos.id} className="ml-2 pl-3 border-l-2 border-gray-200 mb-2">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-semibold text-gray-800">{pos.title}</span>
                      <span className="text-xs text-gray-600 font-medium">
                        {fmtDate(pos.startDate, lang)} – {pos.current ? L.present : fmtDate(pos.endDate, lang)}
                      </span>
                    </div>
                    {pos.description && (
                      <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line text-justify">
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

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3">
            {L.education}
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="break-inside-avoid">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-gray-900">
                    {edu.degree}{edu.field ? ` ${L.inWord} ${edu.field}` : ""}
                  </h3>
                  <span className="text-xs text-gray-600 font-medium">
                    {fmtDate(edu.startDate, lang)} – {fmtDate(edu.endDate, lang)}
                  </span>
                </div>
                <div className="text-xs font-semibold text-gray-700">{edu.institution}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2">
            {L.skills}
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
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
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2">
            {L.languages}
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
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
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2">
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
        <section key={section.id} className="mb-6 break-inside-avoid">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2">
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
                    <span className="text-xs text-gray-500">{item.date}</span>
                  )}
                </div>
                {item.description && (
                  <p className="text-xs text-gray-700 leading-relaxed mt-0.5 whitespace-pre-line">
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
