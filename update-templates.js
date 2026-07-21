const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'src/components/CVTemplates');

const classicContent = `import React from 'react';
import { CVData } from '@/types/cv';

interface ClassicTemplateProps {
  data: CVData;
}

export const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ data }) => {
  const { personal, experience, education, skills, customSections } = data;

  return (
    <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white p-[15mm] text-gray-900 font-serif text-sm leading-relaxed shadow-sm print:shadow-none print:p-0">
      <header className="border-b-2 border-gray-800 pb-4 mb-6 text-center">
        <h1 className="text-3xl font-bold uppercase tracking-wider text-gray-900 mb-1">
          {personal.fullName || 'Nume Prenume'}
        </h1>
        <p className="text-base font-medium text-gray-700 mb-2">
          {personal.title || 'Titlu Profesional'}
        </p>
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
            {experience.map((exp, index) => (
              <div key={index} className="break-inside-avoid">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900">{exp.position}</h3>
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
            {education.map((edu, index) => (
              <div key={index} className="break-inside-avoid">
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
            {skills.map((skill, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded border border-gray-200">
                {typeof skill === 'string' ? skill : skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {customSections && customSections.map((section, sIndex) => (
        <section key={sIndex} className="mb-6 break-inside-avoid">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2">
            {section.title}
          </h2>
          <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">{section.content}</p>
        </section>
      ))}
    </div>
  );
};
`;

const modernContent = `import React from 'react';
import { CVData } from '@/types/cv';

interface ModernTemplateProps {
  data: CVData;
}

export const ModernTemplate: React.FC<ModernTemplateProps> = ({ data }) => {
  const { personal, experience, education, skills, customSections } = data;

  return (
    <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white text-gray-800 font-sans text-xs leading-relaxed shadow-sm print:shadow-none print:p-0 flex">
      <aside className="w-[32%] bg-slate-900 text-slate-100 p-6 flex flex-col justify-between print:bg-slate-900">
        <div>
          {personal.photo && (
            <div className="mb-6 flex justify-center">
              <img
                src={personal.photo}
                alt={personal.fullName}
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
                {skills.map((skill, index) => (
                  <span
                    key={index}
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
              {personal.fullName || 'Nume Prenume'}
            </h1>
            <p className="text-sm font-semibold text-indigo-600">
              {personal.title || 'Titlu Profesional'}
            </p>
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
                {experience.map((exp, index) => (
                  <div key={index} className="break-inside-avoid">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-slate-900 text-xs">{exp.position}</h3>
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
                {education.map((edu, index) => (
                  <div key={index} className="break-inside-avoid">
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

          {customSections && customSections.map((section, sIndex) => (
            <section key={sIndex} className="mb-6 break-inside-avoid">
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
`;

const minimalContent = `import React from 'react';
import { CVData } from '@/types/cv';

interface MinimalTemplateProps {
  data: CVData;
}

export const MinimalTemplate: React.FC<MinimalTemplateProps> = ({ data }) => {
  const { personal, experience, education, skills, customSections } = data;

  return (
    <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white p-[15mm] text-neutral-800 font-sans text-xs leading-relaxed shadow-sm print:shadow-none print:p-0">
      <header className="mb-8">
        <h1 className="text-3xl font-light text-neutral-900 tracking-tight mb-1">
          {personal.fullName || 'Nume Prenume'}
        </h1>
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-3">
          {personal.title || 'Titlu Profesional'}
        </p>
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
            {experience.map((exp, index) => (
              <div key={index} className="break-inside-avoid grid grid-cols-4 gap-4">
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
            {education.map((edu, index) => (
              <div key={index} className="break-inside-avoid grid grid-cols-4 gap-4">
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
            {skills.map((skill, index) => (
              <span key={index} className="text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-sm text-[11px]">
                {typeof skill === 'string' ? skill : skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {customSections && customSections.map((section, sIndex) => (
        <section key={sIndex} className="mb-8 break-inside-avoid">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-3">
            {section.title}
          </h2>
          <p className="text-neutral-700 whitespace-pre-line leading-relaxed">{section.content}</p>
        </section>
      ))}
    </div>
  );
};
`;

const creativeContent = `import React from 'react';
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
`;

try {
  fs.writeFileSync(path.join(templatesDir, 'ClassicTemplate.tsx'), classicContent);
  console.log('✓ Am actualizat ClassicTemplate.tsx');

  fs.writeFileSync(path.join(templatesDir, 'ModernTemplate.tsx'), modernContent);
  console.log('✓ Am actualizat ModernTemplate.tsx');

  fs.writeFileSync(path.join(templatesDir, 'MinimalTemplate.tsx'), minimalContent);
  console.log('✓ Am actualizat MinimalTemplate.tsx');

  fs.writeFileSync(path.join(templatesDir, 'CreativeTemplate.tsx'), creativeContent);
  console.log('✓ Am actualizat CreativeTemplate.tsx');

  console.log('\nToate șabloanele au fost optimizate cu succes!');
} catch (err) {
  console.error('Eroare la actualizarea șabloanelor:', err);
}