import React from 'react';
import { CVData } from '@/types/cv';
import { CvLang } from '@/lib/cvLabels';

interface MinimalTemplateProps {
  data: CVData;
  lang?: CvLang;
}

export const MinimalTemplate: React.FC<MinimalTemplateProps> = ({ data }) => {
  const { personal, experience, education, skills, customSections } = data;
  const fullName = [personal.firstName, personal.lastName].filter(Boolean).join(' ') || 'Nume Prenume';
  const jobTitle = (personal as Record<string, any>).title || (personal as Record<string, any>).jobTitle || (personal as Record<string, any>).profession || '';

  return (
    <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white p-[15mm] text-neutral-800 font-sans text-xs leading-relaxed shadow-sm print:shadow-none print:p-0">
      <header className="mb-8">
        <h1 className="text-3xl font-light text-neutral-900 tracking-tight mb-1">
          {fullName}
        </h1>
        {jobTitle && (
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-3">
            {jobTitle}
          </p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-neutral-500 border-t border-neutral-200 pt-2">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.website && <span>{personal.website}</span>}
        </div>
      </header>

      {personal.summary && (
        <section className="mb-8">
          <p className="text-neutral-700 leading-relaxed text-justify">{personal.summary}</p>
        </section>
      )}

      {experience && experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-4">
            Experienţă
          </h2>
          <div className="space-y-5">
            {experience.map((exp) => (
              <div key={exp.id || Math.random()} className="break-inside-avoid grid grid-cols-4 gap-4">
                <div className="col-span-1 text-[11px] text-neutral-400 font-medium">
                  {exp.startDate} – {exp.current ? 'Prezent' : exp.endDate}
                </div>
                <div className="col-span-3">
                  <h3 className="font-semibold text-neutral-900">{exp.position}</h3>
                  <div className="text-neutral-500 font-medium mb-1">{exp.company}</div>
                  <p className="text-neutral-600 whitespace-pre-line text-justify leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {education && education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-4">
            Educaţie
          </h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id || Math.random()} className="break-inside-avoid grid grid-cols-4 gap-4">
                <div className="col-span-1 text-[11px] text-neutral-400 font-medium">
                  {edu.startDate} – {edu.endDate}
                </div>
                <div className="col-span-3">
                  <h3 className="font-semibold text-neutral-900">{edu.degree}</h3>
                  <div className="text-neutral-500 font-medium">{edu.institution}</div>
                  {edu.description && (
                    <p className="text-neutral-600 mt-1">{edu.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {skills && skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-3">
            Competenţe
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill.id || Math.random()} className="text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-sm text-[11px]">
                {typeof skill === 'string' ? skill : skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {customSections && customSections.map((section) => (
        <section key={section.id || Math.random()} className="mb-8 break-inside-avoid">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-3">
            {section.title}
          </h2>
          <p className="text-neutral-700 whitespace-pre-line leading-relaxed">{section.content}</p>
        </section>
      ))}
    </div>
  );
};
