import React from 'react';
import { CVData } from '@/types/cv';
import { CvLang } from '@/lib/cvLabels';

interface ClassicTemplateProps {
  data: CVData;
  lang?: CvLang;
}

export const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ data }) => {
  const { personal, experience, education, skills, customSections } = data;
  const fullName = [personal.firstName, personal.lastName].filter(Boolean).join(' ') || 'Nume Prenume';
  const jobTitle = (personal as Record<string, any>).title || (personal as Record<string, any>).jobTitle || (personal as Record<string, any>).profession || '';

  return (
    <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white p-[15mm] text-gray-900 font-serif text-sm leading-relaxed shadow-sm print:shadow-none print:p-0">
      <header className="border-b-2 border-gray-800 pb-4 mb-6 text-center">
        <h1 className="text-3xl font-bold uppercase tracking-wider text-gray-900 mb-1">
          {fullName}
        </h1>
        {jobTitle && (
          <p className="text-base font-medium text-gray-700 mb-2">
            {jobTitle}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-600">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>• {personal.phone}</span>}
          {personal.location && <span>• {personal.location}</span>}
          {personal.website && <span>• {personal.website}</span>}
        </div>
      </header>

      {personal.summary && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2">
            Profil Profesional
          </h2>
          <p className="text-justify text-gray-700 leading-normal">{personal.summary}</p>
        </section>
      )}

      {experience && experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3">
            Experienţă Profesională
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id || Math.random()} className="break-inside-avoid">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900">{((exp as any).position || (exp as any).role || (exp as any).jobTitle || (exp as any).positions || "")}</h3>
                  <span className="text-xs text-gray-600 font-medium">
                    {exp.startDate} - {exp.current ? 'Prezent' : exp.endDate}
                  </span>
                </div>
                <div className="text-xs font-semibold text-gray-700 mb-1">{exp.company}</div>
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line text-justify">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {education && education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3">
            Educaţie şi Formare
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id || Math.random()} className="break-inside-avoid">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <span className="text-xs text-gray-600 font-medium">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <div className="text-xs font-semibold text-gray-700">{edu.institution}</div>
                {edu.description && (
                  <p className="text-xs text-gray-600 mt-0.5">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {skills && skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2">
            Competenţe
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <span key={skill.id || Math.random()} className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded border border-gray-200">
                {typeof skill === 'string' ? skill : skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {customSections && customSections.map((section) => (
        <section key={section.id || Math.random()} className="mb-6 break-inside-avoid">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2">
            {section.title}
          </h2>
          <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">{section.content}</p>
        </section>
      ))}
    </div>
  );
};
