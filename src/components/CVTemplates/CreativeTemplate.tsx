import React from 'react';
import { CVData } from '@/types/cv';
import { CV_LABELS, CvLang, fmtDate } from '@/lib/cvLabels';

interface CreativeTemplateProps {
  data: CVData;
  lang?: CvLang;
}

export const CreativeTemplate: React.FC<CreativeTemplateProps> = ({ data, lang = "ro" }) => {
  const { personal, experience, education, skills, languages, drivingLicenses, customSections } = data;
  const L = CV_LABELS[lang];
  const fullName = [personal.firstName, personal.lastName].filter(Boolean).join(' ') || 'Nume Prenume';

  return (
    <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white text-gray-800 font-sans text-xs leading-relaxed shadow-sm print:shadow-none print:p-0">
      {/* Header */}
      <header className="bg-teal-700 text-white p-[10mm] mb-6 rounded-b-xl print:rounded-none">
        <div className="flex justify-between items-center gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold tracking-wide mb-1">
              {fullName}
            </h1>
            {personal.title && (
              <p className="text-teal-100 text-sm font-medium mb-3">
                {personal.title}
              </p>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-teal-100">
              {personal.email && <span>{personal.email}</span>}
              {personal.phone && <span>• {personal.phone}</span>}
              {personal.location && <span>• {personal.location}</span>}
              {personal.website && <span>• {personal.website}</span>}
            </div>
          </div>
          {personal.photo && (
            <img
              src={personal.photo}
              alt={fullName}
              className="w-24 h-24 rounded-lg object-cover border-2 border-teal-300 shadow"
            />
          )}
        </div>
      </header>

      <div className="px-[10mm] pb-[10mm]">
        {/* Summary */}
        {personal.summary && (
          <section className="mb-6 bg-teal-50/50 p-4 rounded-lg border-l-4 border-teal-600">
            <h2 className="text-xs font-bold uppercase text-teal-800 mb-1">{L.profile}</h2>
            <p className="text-gray-700 leading-relaxed text-justify">{personal.summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 border-b-2 border-teal-600 pb-1 mb-4">
              {L.experience}
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="break-inside-avoid">
                  {exp.company && (
                    <div className="text-teal-700 font-semibold mb-1 ml-4">{exp.company}</div>
                  )}
                  {exp.positions.map((pos) => (
                    <div key={pos.id} className="relative pl-4 border-l-2 border-teal-200 mb-3 ml-2">
                      <div className="absolute w-2 h-2 bg-teal-600 rounded-full -left-[5px] top-1" />
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h3 className="font-bold text-gray-900 text-xs">{pos.title}</h3>
                        <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-medium">
                          {fmtDate(pos.startDate, lang)} – {pos.current ? L.present : fmtDate(pos.endDate, lang)}
                        </span>
                      </div>
                      {pos.description && (
                        <p className="text-gray-600 whitespace-pre-line text-justify leading-relaxed">
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
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 border-b-2 border-teal-600 pb-1 mb-4">
              {L.education}
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="break-inside-avoid bg-teal-50/30 p-3 rounded-lg border border-teal-100">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900 text-xs">
                      {edu.degree}{edu.field ? ` · ${edu.field}` : ""}
                    </h3>
                    <span className="text-[10px] text-gray-500 font-medium">
                      {fmtDate(edu.startDate, lang)} – {fmtDate(edu.endDate, lang)}
                    </span>
                  </div>
                  <div className="text-teal-700 font-semibold text-[11px]">{edu.institution}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 border-b-2 border-teal-600 pb-1 mb-3">
              {L.skills}
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="bg-teal-50 text-teal-900 border border-teal-200 px-2.5 py-0.5 rounded-full text-[11px] font-medium"
                >
                  {skill.name} <span className="text-teal-600">– {skill.level}</span>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 border-b-2 border-teal-600 pb-1 mb-3">
              {L.languages}
            </h2>
            <div className="flex flex-wrap gap-3">
              {languages.map((l) => (
                <span key={l.id} className="text-[11px]">
                  <span className="font-semibold text-gray-800">{l.name}</span>
                  <span className="ml-1 bg-teal-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    {l.level}
                  </span>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Driving licenses */}
        {drivingLicenses.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 border-b-2 border-teal-600 pb-1 mb-3">
              {L.driving}
            </h2>
            <div className="flex flex-wrap gap-2">
              {drivingLicenses.map((d) => (
                <span
                  key={d.id}
                  className="bg-teal-50 text-teal-900 border border-teal-200 px-2.5 py-0.5 rounded-full text-[11px] font-medium"
                >
                  {L.category} {d.category}{d.year ? ` (${d.year})` : ""}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Custom sections */}
        {customSections.map((section) => (
          <section key={section.id} className="mb-6 break-inside-avoid">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 border-b-2 border-teal-600 pb-1 mb-3">
              {section.title}
            </h2>
            <div className="space-y-3">
              {section.items.map((item) => (
                <div key={item.id} className="relative pl-4 border-l-2 border-teal-200 ml-2">
                  <div className="absolute w-2 h-2 bg-teal-600 rounded-full -left-[5px] top-1" />
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900 text-xs">
                      {item.name}{item.subtitle ? ` · ${item.subtitle}` : ""}
                    </h3>
                    {item.date && (
                      <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-medium">
                        {item.date}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-gray-600 whitespace-pre-line leading-relaxed text-[11px] mt-0.5">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
