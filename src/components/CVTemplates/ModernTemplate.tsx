import React from 'react';
import { CVData } from '@/types/cv';
import { CvLang } from '@/lib/cvLabels';

interface ModernTemplateProps {
  data: CVData;
  lang?: CvLang;
}

export const ModernTemplate: React.FC<ModernTemplateProps> = ({ data }) => {
  const { personal, experience, education, skills, customSections } = data;
  const fullName = [personal.firstName, personal.lastName].filter(Boolean).join(' ') || 'Nume Prenume';
  const jobTitle = (personal as Record<string, any>).title || (personal as Record<string, any>).jobTitle || (personal as Record<string, any>).profession || '';

  return (
    <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white text-gray-800 font-sans text-xs leading-relaxed shadow-sm print:shadow-none print:p-0 flex">
      <aside className="w-[32%] bg-slate-900 text-slate-100 p-6 flex flex-col justify-between print:bg-slate-900">
        <div>
          {personal.photo && (
            <div className="mb-6 flex justify-center">
              <img
                src={personal.photo}
                alt={fullName}
                className="w-28 h-28 rounded-full object-cover border-2 border-slate-700 shadow-md"
              />
            </div>
          )}

          <div className="mb-8 space-y-2">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700 pb-1 mb-3">
              Contact
            </h2>
            {personal.phone && (
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Telefon</p>
                <p className="text-slate-200">{personal.phone}</p>
              </div>
            )}
            {personal.email && (
              <div className="break-all">
                <p className="text-[10px] text-slate-400 font-medium">Email</p>
                <p className="text-slate-200">{personal.email}</p>
              </div>
            )}
            {personal.location && (
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Locaţie</p>
                <p className="text-slate-200">{personal.location}</p>
              </div>
            )}
            {personal.website && (
              <div className="break-all">
                <p className="text-[10px] text-slate-400 font-medium">Website / Portofoliu</p>
                <p className="text-slate-200">{personal.website}</p>
              </div>
            )}
          </div>

          {skills && skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700 pb-1 mb-3">
                Competenţe
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill: any) => (
                  <span
                    key={skill.id || Math.random()}
                    className="bg-slate-800 text-slate-200 text-[10px] px-2 py-0.5 rounded border border-slate-700"
                  >
                    {typeof skill === 'string' ? skill : skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      <main className="w-[68%] p-8 flex flex-col justify-between">
        <div>
          <header className="mb-6 border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
              {fullName}
            </h1>
            {jobTitle && (
              <p className="text-sm font-semibold text-indigo-600">
                {jobTitle}
              </p>
            )}
          </header>

          {personal.summary && (
            <section className="mb-6">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b-2 border-indigo-600 pb-1 mb-2 inline-block">
                Despre Mine
              </h2>
              <p className="text-gray-600 text-justify leading-relaxed">{personal.summary}</p>
            </section>
          )}

          {experience && experience.length > 0 && (
            <section className="mb-6">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b-2 border-indigo-600 pb-1 mb-3 inline-block">
                Experienţă Profesională
              </h2>
              <div className="space-y-4">
                {experience.map((exp: any) => (
                  <div key={exp.id || Math.random()} className="break-inside-avoid">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-slate-900 text-xs">{((exp as any).position || (exp as any).role || (exp as any).jobTitle || (exp as any).positions || "")}</h3>
                      <span className="text-[10px] text-gray-500 font-medium">
                        {exp.startDate} - {exp.current ? 'Prezent' : exp.endDate}
                      </span>
                    </div>
                    <p className="text-indigo-600 text-[11px] font-semibold mb-1">{exp.company}</p>
                    <p className="text-gray-600 whitespace-pre-line text-justify leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {education && education.length > 0 && (
            <section className="mb-6">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b-2 border-indigo-600 pb-1 mb-3 inline-block">
                Educaţie
              </h2>
              <div className="space-y-3">
                {education.map((edu: any) => (
                  <div key={edu.id || Math.random()} className="break-inside-avoid">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-slate-900 text-xs">{edu.degree}</h3>
                      <span className="text-[10px] text-gray-500 font-medium">
                        {edu.startDate} - {edu.endDate}
                      </span>
                    </div>
                    <p className="text-indigo-600 text-[11px] font-semibold">{edu.institution}</p>
                    {edu.description && (
                      <p className="text-gray-600 text-[11px] mt-0.5">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {customSections && customSections.map((section: any) => (
            <section key={section.id || Math.random()} className="mb-6 break-inside-avoid">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b-2 border-indigo-600 pb-1 mb-2 inline-block">
                {section.title}
              </h2>
              <p className="text-gray-600 whitespace-pre-line leading-relaxed">{section.content}</p>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
};
