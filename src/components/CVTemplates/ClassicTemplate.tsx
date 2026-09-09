import React from "react";
import { CVData } from "@/types/cv";
import { CV_LABELS, CvLang, fmtDate } from "@/lib/cvLabels";

interface ClassicTemplateProps {
  data: CVData;
  lang?: CvLang;
}

export const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ data, lang = "ro" }) => {
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
    sectionOrder,
    density = "normal",
  } = data;
  const L = CV_LABELS[lang];
  const fullName = [personal.firstName, personal.lastName].filter(Boolean).join(" ") || "Nume Prenume";

  const paddingClass =
    density === "compact"
      ? "p-[10mm] text-[11px] leading-snug"
      : density === "spacious"
      ? "p-[18mm] text-sm leading-loose"
      : "p-[14mm] text-sm leading-relaxed";

  const sectionMb = density === "compact" ? "mb-3" : density === "spacious" ? "mb-7" : "mb-5";

  const renderSection = (key: string) => {
    switch (key) {
      case "experience":
        if (experience.length === 0) return null;
        return (
          <section key="experience" className={sectionMb}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2.5">
              {L.experience}
            </h2>
            <div className={density === "compact" ? "space-y-2.5" : "space-y-4"}>
              {experience.map((exp) => (
                <div key={exp.id} className="break-inside-avoid">
                  {exp.company && (
                    <h3 className="font-bold text-gray-900 mb-0.5">{exp.company}</h3>
                  )}
                  {exp.positions.map((pos) => (
                    <div key={pos.id} className="ml-2 pl-3 border-l-2 border-gray-200 mb-1.5">
                      <div className="flex justify-between items-baseline mb-0.5">
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
        );

      case "projects":
        if (projects.length === 0) return null;
        return (
          <section key="projects" className={sectionMb}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2.5">
              {L.projects}
            </h2>
            <div className={density === "compact" ? "space-y-2" : "space-y-3"}>
              {projects.map((proj) => (
                <div key={proj.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-gray-900 text-xs">
                      {proj.title}
                      {proj.role ? <span className="font-normal text-gray-600"> · {proj.role}</span> : null}
                    </h3>
                    {(proj.startDate || proj.endDate) && (
                      <span className="text-[11px] text-gray-500">
                        {proj.startDate ? fmtDate(proj.startDate, lang) : ""} {proj.endDate ? `– ${fmtDate(proj.endDate, lang)}` : ""}
                      </span>
                    )}
                  </div>
                  {proj.description && (
                    <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                      {proj.description}
                    </p>
                  )}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      <strong className="text-gray-700">{L.technologies}:</strong> {proj.technologies.join(", ")}
                    </p>
                  )}
                  {(proj.link || proj.github) && (
                    <div className="text-[11px] text-blue-700 mt-0.5 space-x-2">
                      {proj.link && <span>{proj.link}</span>}
                      {proj.github && <span>GitHub: {proj.github}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case "education":
        if (education.length === 0) return null;
        return (
          <section key="education" className={sectionMb}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2.5">
              {L.education}
            </h2>
            <div className={density === "compact" ? "space-y-2" : "space-y-3"}>
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
                  <div className="text-xs font-semibold text-gray-700">
                    {edu.institution}
                    {edu.gpa && <span className="font-normal text-gray-500"> · Medie: {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case "skills":
        if (skills.length === 0) return null;
        return (
          <section key="skills" className={sectionMb}>
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
        );

      case "certifications":
        if (certifications.length === 0) return null;
        return (
          <section key="certifications" className={sectionMb}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2">
              {L.certifications}
            </h2>
            <div className={density === "compact" ? "space-y-1.5" : "space-y-2.5"}>
              {certifications.map((c) => (
                <div key={c.id} className="flex justify-between items-baseline text-xs">
                  <div>
                    <span className="font-semibold text-gray-900">{c.name}</span>
                    {c.issuer ? <span className="text-gray-600"> · {c.issuer}</span> : null}
                    {c.credentialId ? <span className="text-gray-400"> (ID: {c.credentialId})</span> : null}
                  </div>
                  {c.issueDate && (
                    <span className="text-[11px] text-gray-500 font-medium">
                      {fmtDate(c.issueDate, lang)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case "languages":
        if (languages.length === 0) return null;
        return (
          <section key="languages" className={sectionMb}>
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
        );

      case "drivingLicenses":
        if (drivingLicenses.length === 0) return null;
        return (
          <section key="drivingLicenses" className={sectionMb}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2">
              {L.driving}
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-800">
              {drivingLicenses.map((d) => (
                <span key={d.id}>{L.category} {d.category}{d.year ? ` (${d.year})` : ""}</span>
              ))}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  const defaultOrder = [
    "experience",
    "projects",
    "education",
    "skills",
    "certifications",
    "languages",
    "drivingLicenses",
  ];
  const activeOrder = sectionOrder && sectionOrder.length > 0 ? sectionOrder : defaultOrder;

  return (
    <div className={`max-w-[210mm] min-h-[297mm] mx-auto bg-white text-gray-900 font-serif shadow-sm print:shadow-none print:p-0 ${paddingClass}`}>
      {/* Header */}
      <header className="border-b-2 border-gray-800 pb-4 mb-5 flex items-center justify-between">
        <div className="flex-1 text-center">
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
            {personal.linkedin && <span>• {personal.linkedin}</span>}
          </div>
        </div>
        {personal.photo && personal.showPhoto !== false && (
          <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 ml-4 border border-gray-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={personal.photo} alt={fullName} className="w-full h-full object-cover" />
          </div>
        )}
      </header>

      {/* Summary */}
      {personal.summary && (
        <section className={sectionMb}>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2">
            {L.profileLong}
          </h2>
          <p className="text-justify text-gray-700 leading-normal">{personal.summary}</p>
        </section>
      )}

      {/* Ordered sections */}
      {activeOrder.map((key) => renderSection(key))}

      {/* Custom sections */}
      {customSections.map((section) => (
        <section key={section.id} className={`${sectionMb} break-inside-avoid`}>
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
