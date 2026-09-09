import React from "react";
import { CVData } from "@/types/cv";
import { CV_LABELS, CvLang, fmtDate } from "@/lib/cvLabels";

interface ModernTemplateProps {
  data: CVData;
  lang?: CvLang;
}

export const ModernTemplate: React.FC<ModernTemplateProps> = ({ data, lang = "ro" }) => {
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
  const fullName = [personal.firstName, personal.lastName].filter(Boolean).join(" ") || "Nume Prenume";

  const paddingMain =
    density === "compact" ? "p-5" : density === "spacious" ? "p-10" : "p-8";
  const paddingSide =
    density === "compact" ? "p-4" : density === "spacious" ? "p-8" : "p-6";
  const sectionMb =
    density === "compact" ? "mb-3.5" : density === "spacious" ? "mb-7" : "mb-5";

  return (
    <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white text-gray-800 font-sans text-xs leading-relaxed shadow-sm print:shadow-none print:p-0 flex">
      {/* Sidebar */}
      <aside className={`w-[32%] bg-slate-900 text-slate-100 ${paddingSide} flex flex-col justify-between print:bg-slate-900`}>
        <div>
          {personal.photo && personal.showPhoto !== false && (
            <div className="mb-5 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={personal.photo}
                alt={fullName}
                className="w-24 h-24 rounded-full object-cover border-2 border-slate-700 shadow-md"
              />
            </div>
          )}

          {/* Contact */}
          <div className="mb-6 space-y-2">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700 pb-1 mb-2.5">
              Contact
            </h2>
            {personal.phone && (
              <div>
                <p className="text-[9.5px] text-slate-400 font-medium">Telefon</p>
                <p className="text-slate-200 text-[11px]">{personal.phone}</p>
              </div>
            )}
            {personal.email && (
              <div className="break-all">
                <p className="text-[9.5px] text-slate-400 font-medium">Email</p>
                <p className="text-slate-200 text-[11px]">{personal.email}</p>
              </div>
            )}
            {personal.location && (
              <div>
                <p className="text-[9.5px] text-slate-400 font-medium">Locaţie</p>
                <p className="text-slate-200 text-[11px]">{personal.location}</p>
              </div>
            )}
            {personal.website && (
              <div className="break-all">
                <p className="text-[9.5px] text-slate-400 font-medium">Website</p>
                <p className="text-slate-200 text-[11px]">{personal.website}</p>
              </div>
            )}
            {personal.linkedin && (
              <div className="break-all">
                <p className="text-[9.5px] text-slate-400 font-medium">LinkedIn</p>
                <p className="text-slate-200 text-[11px]">{personal.linkedin}</p>
              </div>
            )}
          </div>

          {/* Skills in sidebar */}
          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700 pb-1 mb-2.5">
                {L.skills}
              </h2>
              <div className="space-y-1.5">
                {skills.map((skill) => (
                  <div key={skill.id} className="text-[10.5px]">
                    <span className="text-slate-200">{skill.name}</span>
                    <span className="text-slate-500 ml-1">– {skill.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications in sidebar */}
          {certifications.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700 pb-1 mb-2.5">
                {L.certifications}
              </h2>
              <div className="space-y-1.5">
                {certifications.map((c) => (
                  <div key={c.id} className="text-[10px]">
                    <p className="text-slate-200 font-medium">{c.name}</p>
                    <p className="text-slate-500">{c.issuer} {c.issueDate ? `· ${fmtDate(c.issueDate, lang)}` : ""}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages in sidebar */}
          {languages.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700 pb-1 mb-2.5">
                {L.languages}
              </h2>
              <div className="space-y-1.5">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between text-[10px]">
                    <span className="text-slate-200">{l.name}</span>
                    <span className="text-cyan-400 font-bold">{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Driving licenses in sidebar */}
          {drivingLicenses.length > 0 && (
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700 pb-1 mb-2.5">
                {L.driving}
              </h2>
              <div className="space-y-1">
                {drivingLicenses.map((d) => (
                  <div key={d.id} className="text-[10px] text-slate-200">
                    {L.category} {d.category}{d.year ? ` (${d.year})` : ""}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className={`w-[68%] ${paddingMain} flex flex-col justify-between`}>
        <div>
          <header className="mb-5 border-b border-gray-200 pb-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
              {fullName}
            </h1>
            {personal.title && (
              <p className="text-sm font-semibold text-indigo-600">
                {personal.title}
              </p>
            )}
          </header>

          {/* Summary */}
          {personal.summary && (
            <section className={sectionMb}>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b-2 border-indigo-600 pb-1 mb-2 inline-block">
                {L.profile}
              </h2>
              <p className="text-gray-600 text-justify leading-relaxed">{personal.summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section className={sectionMb}>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b-2 border-indigo-600 pb-1 mb-2.5 inline-block">
                {L.experience}
              </h2>
              <div className="space-y-3.5">
                {experience.map((exp) => (
                  <div key={exp.id} className="break-inside-avoid">
                    {exp.company && (
                      <p className="text-indigo-600 text-[11px] font-semibold mb-0.5">{exp.company}</p>
                    )}
                    {exp.positions.map((pos) => (
                      <div key={pos.id} className="ml-2 pl-3 border-l-2 border-gray-200 mb-1.5">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold text-slate-900 text-xs">{pos.title}</h3>
                          <span className="text-[10px] text-gray-500 font-medium">
                            {fmtDate(pos.startDate, lang)} – {pos.current ? L.present : fmtDate(pos.endDate, lang)}
                          </span>
                        </div>
                        {pos.description && (
                          <p className="text-gray-600 whitespace-pre-line text-justify leading-relaxed mt-0.5">
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

          {/* Projects */}
          {projects.length > 0 && (
            <section className={sectionMb}>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b-2 border-indigo-600 pb-1 mb-2.5 inline-block">
                {L.projects}
              </h2>
              <div className="space-y-2.5">
                {projects.map((proj) => (
                  <div key={proj.id} className="break-inside-avoid">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-slate-900 text-xs">
                        {proj.title} {proj.role ? <span className="font-medium text-gray-600">· {proj.role}</span> : ""}
                      </h3>
                      {(proj.startDate || proj.endDate) && (
                        <span className="text-[10px] text-gray-500 font-medium">
                          {proj.startDate ? fmtDate(proj.startDate, lang) : ""} {proj.endDate ? `– ${fmtDate(proj.endDate, lang)}` : ""}
                        </span>
                      )}
                    </div>
                    {proj.description && (
                      <p className="text-gray-600 whitespace-pre-line leading-relaxed text-[11px] mt-0.5">
                        {proj.description}
                      </p>
                    )}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        <strong className="text-slate-700">{L.technologies}:</strong> {proj.technologies.join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className={sectionMb}>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b-2 border-indigo-600 pb-1 mb-2.5 inline-block">
                {L.education}
              </h2>
              <div className="space-y-2.5">
                {education.map((edu) => (
                  <div key={edu.id} className="break-inside-avoid">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-slate-900 text-xs">
                        {edu.degree}{edu.field ? ` · ${edu.field}` : ""}
                      </h3>
                      <span className="text-[10px] text-gray-500 font-medium">
                        {fmtDate(edu.startDate, lang)} – {fmtDate(edu.endDate, lang)}
                      </span>
                    </div>
                    <p className="text-indigo-600 text-[11px] font-semibold">
                      {edu.institution}
                      {edu.gpa && <span className="font-normal text-gray-500"> · Medie: {edu.gpa}</span>}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Custom sections */}
          {customSections.map((section) => (
            <section key={section.id} className={`${sectionMb} break-inside-avoid`}>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b-2 border-indigo-600 pb-1 mb-2 inline-block">
                {section.title}
              </h2>
              <div className="space-y-2.5">
                {section.items.map((item) => (
                  <div key={item.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-slate-900 text-xs">
                        {item.name}{item.subtitle ? ` · ${item.subtitle}` : ""}
                      </h3>
                      {item.date && (
                        <span className="text-[10px] text-gray-500">{item.date}</span>
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
      </main>
    </div>
  );
};
