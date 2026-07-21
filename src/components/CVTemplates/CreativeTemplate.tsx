import React from 'react';
import { CVData } from '@/types/cv';

interface CreativeTemplateProps {
  data: CVData;
}

export const CreativeTemplate: React.FC<CreativeTemplateProps> = ({ data }) => {
  const { personal, experience, education, skills, customSections } = data;

  return (
    <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white text-gray-800 font-sans text-xs leading-relaxed shadow-sm print:shadow-none print:p-0">
      <header className="bg-teal-700 text-white p-[10mm] mb-6 rounded-b-xl print:rounded-none">
        <div className="flex justify-between items-center gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold tracking-wide mb-1">
              {personal.fullName || 'Nume Prenume'}
            </h1>
            <p className="text-teal-100 text-sm font-medium mb-3">
              {personal.title || 'Titlu Profesional'}
            </p>
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
              alt={personal.fullName}
              className="w-24 h-24 rounded-lg object-cover border-2 border-teal-300 shadow"
            />
          )}
        </div>
      </header>

      <div className="px-[10mm] pb-[10mm]">
        {personal.summary && (
          <section className="mb-6 bg-teal-50/50 p-4 rounded-lg border-l-4 border-teal-600">
            <h2 className="text-xs font-bold uppercase text-teal-800 mb-1">Profil</h2>
            <p className="text-gray-700 leading-relaxed text-justify">{personal.summary}</p>
          </section>
        )}

        {experience && experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 border-b-2 border-teal-600 pb-1 mb-4">
              Experienţă Profesională
            </h2>
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div key={index} className="break-inside-avoid relative pl-4 border-l-2 border-teal-200">
                  <div className="absolute w-2 h-2 bg-teal-600 rounded-full -left-[5px] top-1"></div>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-gray-900 text-xs">{exp.position}</h3>
                    <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-medium">
                      {exp.startDate} - {exp.current ? 'Prezent' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-teal-700 font-semibold mb-1">{exp.company}</div>
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
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 border-b-2 border-teal-600 pb-1 mb-4">
              Educaţie
            </h2>
            <div className="space-y-3">
              {education.map((edu, index) => (
                <div key={index} className="break-inside-avoid relative pl-4 border-l-2 border-teal-200">
                  <div className="absolute w-2 h-2 bg-teal-600 rounded-full -left-[5px] top-1"></div>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900 text-xs">{edu.degree}</h3>
                    <span className="text-[10px] text-gray-500 font-medium">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  <div className="text-teal-700 font-semibold">{edu.institution}</div>
                  {edu.description && (
                    <p className="text-gray-600 mt-0.5">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {skills && skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 border-b-2 border-teal-600 pb-1 mb-3">
              Competenţe
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-teal-50 text-teal-900 border border-teal-200 px-2.5 py-0.5 rounded-full text-[11px] font-medium"
                >
                  {typeof skill === 'string' ? skill : skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {customSections && customSections.map((section, sIndex) => (
          <section key={sIndex} className="mb-6 break-inside-avoid">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 border-b-2 border-teal-600 pb-1 mb-2">
              {section.title}
            </h2>
            <p className="text-gray-600 whitespace-pre-line leading-relaxed">{section.content}</p>
          </section>
        ))}
      </div>
    </div>
  );
};
